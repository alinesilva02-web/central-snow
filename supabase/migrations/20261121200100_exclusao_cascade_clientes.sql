do $$
declare
  constraint_nome text;
begin
  for constraint_nome in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.encomendas'::regclass
      and con.contype = 'f'
      and con.confrelid = 'public.clientes'::regclass
  loop
    execute format(
      'alter table public.encomendas drop constraint %I',
      constraint_nome
    );
  end loop;
end
$$;

alter table public.encomendas
  add constraint encomendas_cliente_id_fkey
  foreign key (cliente_id)
  references public.clientes(id)
  on delete cascade;
