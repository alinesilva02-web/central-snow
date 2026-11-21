alter table public.encomendas
  add column if not exists observacoes text,
  add column if not exists data_solicitacao date;

update public.encomendas
set data_solicitacao = coalesce(created_at::date, current_date)
where data_solicitacao is null;

alter table public.encomendas
  alter column data_solicitacao set default current_date,
  alter column data_solicitacao set not null;
