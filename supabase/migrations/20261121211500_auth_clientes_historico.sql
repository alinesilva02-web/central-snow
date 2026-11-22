alter table public.clientes
  add column if not exists auth_user_id uuid;

create unique index if not exists clientes_auth_user_id_key
  on public.clientes (auth_user_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.clientes'::regclass
      and conname = 'clientes_auth_user_id_fkey'
  ) then
    alter table public.clientes
      add constraint clientes_auth_user_id_fkey
      foreign key (auth_user_id)
      references auth.users(id)
      on delete set null;
  end if;
end
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.encomendas
  add column if not exists status_atualizado_em timestamptz;

update public.encomendas
set status_atualizado_em = coalesce(created_at, now())
where status_atualizado_em is null;

alter table public.encomendas
  alter column status_atualizado_em set default now(),
  alter column status_atualizado_em set not null;

create table if not exists public.historico_status_encomendas (
  id bigint generated always as identity primary key,
  encomenda_id uuid not null references public.encomendas(id) on delete cascade,
  status_anterior text,
  status_novo text not null,
  alterado_em timestamptz not null default now(),
  alterado_por uuid references auth.users(id) on delete set null
);

insert into public.historico_status_encomendas (
  encomenda_id,
  status_anterior,
  status_novo,
  alterado_em
)
select
  encomenda.id,
  null,
  coalesce(encomenda.status, 'recebido'),
  coalesce(encomenda.created_at, now())
from public.encomendas encomenda
where not exists (
  select 1
  from public.historico_status_encomendas historico
  where historico.encomenda_id = encomenda.id
);

create index if not exists historico_status_encomendas_encomenda_id_idx
  on public.historico_status_encomendas (encomenda_id, alterado_em desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create or replace function public.current_cliente_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id
  from public.clientes
  where auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.criar_cliente_apos_cadastro()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  nome_cliente text;
  whatsapp_cliente text;
begin
  if coalesce(new.raw_user_meta_data ->> 'tipo_conta', '') <> 'cliente' then
    return new;
  end if;

  nome_cliente := nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'nome'), '');
  whatsapp_cliente := nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'whatsapp'), '');

  if nome_cliente is null or whatsapp_cliente is null then
    raise exception 'Informe o nome e o WhatsApp para criar a conta do cliente.';
  end if;

  insert into public.clientes (
    nome,
    whatsapp,
    tiktok,
    observacoes,
    auth_user_id
  )
  values (
    nome_cliente,
    whatsapp_cliente,
    '',
    '',
    new.id
  );

  return new;
end;
$$;

drop trigger if exists auth_user_criar_cliente on auth.users;
create trigger auth_user_criar_cliente
  after insert on auth.users
  for each row
  execute function public.criar_cliente_apos_cadastro();

create or replace function public.registrar_historico_status_encomenda()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status is distinct from new.status then
    new.status_atualizado_em := now();
  end if;

  return new;
end;
$$;

create or replace function public.inserir_historico_status_encomenda()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.historico_status_encomendas (
      encomenda_id,
      status_anterior,
      status_novo,
      alterado_por
    )
    values (
      new.id,
      null,
      coalesce(new.status, 'recebido'),
      auth.uid()
    );
  elsif old.status is distinct from new.status then
    insert into public.historico_status_encomendas (
      encomenda_id,
      status_anterior,
      status_novo,
      alterado_por
    )
    values (
      new.id,
      old.status,
      new.status,
      auth.uid()
    );
  end if;

  return new;
end;
$$;

drop trigger if exists encomendas_atualizar_data_status on public.encomendas;
create trigger encomendas_atualizar_data_status
  before update of status on public.encomendas
  for each row
  execute function public.registrar_historico_status_encomenda();

drop trigger if exists encomendas_registrar_status_inicial on public.encomendas;
create trigger encomendas_registrar_status_inicial
  after insert on public.encomendas
  for each row
  execute function public.inserir_historico_status_encomenda();

drop trigger if exists encomendas_registrar_alteracao_status on public.encomendas;
create trigger encomendas_registrar_alteracao_status
  after update of status on public.encomendas
  for each row
  execute function public.inserir_historico_status_encomenda();

do $$
declare
  politica record;
begin
  for politica in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'clientes',
        'encomendas',
        'historico_status_encomendas',
        'admin_users'
      )
  loop
    execute format(
      'drop policy %I on %I.%I',
      politica.policyname,
      politica.schemaname,
      politica.tablename
    );
  end loop;
end
$$;

alter table public.clientes enable row level security;
alter table public.encomendas enable row level security;
alter table public.historico_status_encomendas enable row level security;
alter table public.admin_users enable row level security;

revoke all on public.clientes, public.encomendas,
  public.historico_status_encomendas, public.admin_users
  from anon;

grant select, insert, update, delete
  on public.clientes, public.encomendas
  to authenticated;
grant select
  on public.historico_status_encomendas
  to authenticated;

revoke all on public.admin_users from authenticated;

drop policy if exists admins_manage_clientes on public.clientes;
create policy admins_manage_clientes
  on public.clientes
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists clientes_veem_proprio_cadastro on public.clientes;
create policy clientes_veem_proprio_cadastro
  on public.clientes
  for select
  to authenticated
  using (auth_user_id = auth.uid());

drop policy if exists admins_manage_encomendas on public.encomendas;
create policy admins_manage_encomendas
  on public.encomendas
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists clientes_veem_proprias_encomendas on public.encomendas;
create policy clientes_veem_proprias_encomendas
  on public.encomendas
  for select
  to authenticated
  using (cliente_id = public.current_cliente_id());

drop policy if exists clientes_criam_proprias_encomendas on public.encomendas;
create policy clientes_criam_proprias_encomendas
  on public.encomendas
  for insert
  to authenticated
  with check (
    cliente_id = public.current_cliente_id()
    and coalesce(status, 'recebido') = 'recebido'
  );

drop policy if exists admins_veem_historico_status on public.historico_status_encomendas;
create policy admins_veem_historico_status
  on public.historico_status_encomendas
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists clientes_veem_historico_proprio on public.historico_status_encomendas;
create policy clientes_veem_historico_proprio
  on public.historico_status_encomendas
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.encomendas encomenda
      where encomenda.id = historico_status_encomendas.encomenda_id
        and encomenda.cliente_id = public.current_cliente_id()
    )
  );

revoke all on function public.is_admin() from public, anon;
revoke all on function public.current_cliente_id() from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.current_cliente_id() to authenticated;

revoke all on function public.criar_cliente_apos_cadastro() from public, anon, authenticated;
revoke all on function public.registrar_historico_status_encomenda() from public, anon, authenticated;
revoke all on function public.inserir_historico_status_encomenda() from public, anon, authenticated;

