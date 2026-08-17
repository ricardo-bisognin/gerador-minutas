alter table public.tc_estabelecimentos_penais add column if not exists codigo_interno text;
alter table public.tc_estabelecimentos_penais add column if not exists cep text;
alter table public.tc_estabelecimentos_penais add column if not exists fonte_url text;
alter table public.tc_estabelecimentos_penais add column if not exists latitude numeric(9,6);
alter table public.tc_estabelecimentos_penais add column if not exists longitude numeric(9,6);

-- UUID é o identificador técnico da unidade. codigo_interno poderá ser usado no futuro para um código humano/sequencial.
-- Fonte cadastral: Polícia Penal do RS.

-- A migration de produção correspondente foi aplicada separadamente; este arquivo mantém o histórico do schema no Git.
