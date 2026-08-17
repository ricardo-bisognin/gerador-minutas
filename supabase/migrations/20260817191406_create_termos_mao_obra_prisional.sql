create table if not exists public.tc_solicitacoes (
  id uuid primary key default gen_random_uuid(),
  tipo_convenente text not null check (tipo_convenente in ('empresa','municipio')),
  fpe_numero text,
  fpe_ano integer,
  processo_numero text,
  processo_ano integer,
  objeto text not null default 'Utilização de mão de obra da pessoa presa',
  quantidade_pessoas integer check (quantidade_pessoas is null or quantidade_pessoas > 0),
  local_prestacao_tipo text check (local_prestacao_tipo in ('sede_empresa','sede_estabelecimento_prisional','outro')),
  local_prestacao_outro text,
  jornada_inicio time,
  jornada_fim time,
  intervalo_inicio time,
  intervalo_fim time,
  jornada_semanal_minutos integer,
  remuneracao_texto text,
  vigencia_anos numeric(4,2) not null default 5,
  vigencia_justificativa text,
  status text not null default 'rascunho',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tc_vigencia_justificativa check (vigencia_anos >= 5 or nullif(trim(vigencia_justificativa),'') is not null)
);

create table if not exists public.tc_convenentes (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('empresa','municipio')),
  nome_razao_social text not null,
  cnpj text not null unique,
  endereco text,
  bairro text,
  cidade text,
  uf text default 'RS',
  cep text,
  telefone text,
  email text,
  representante_nome text,
  representante_cpf text,
  representante_rg text,
  representante_orgao_expedidor text,
  representante_cargo text,
  representante_funcao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tc_drpp (
  id smallint primary key,
  nome text not null,
  sede text not null,
  descricao text,
  created_at timestamptz not null default now()
);

create table if not exists public.tc_estabelecimentos_penais (
  id uuid primary key default gen_random_uuid(),
  drpp_id smallint references public.tc_drpp(id),
  nome text not null,
  municipio text,
  endereco text,
  latitude numeric,
  longitude numeric,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  unique(drpp_id, nome)
);

create table if not exists public.tc_solicitacao_estabelecimentos (
  solicitacao_id uuid not null references public.tc_solicitacoes(id) on delete cascade,
  estabelecimento_id uuid not null references public.tc_estabelecimentos_penais(id),
  primary key (solicitacao_id, estabelecimento_id)
);

create table if not exists public.tc_solicitacao_atividades (
  id uuid primary key default gen_random_uuid(),
  solicitacao_id uuid not null references public.tc_solicitacoes(id) on delete cascade,
  descricao text not null,
  ordem integer not null default 1
);

create table if not exists public.tc_documentos_submetidos (
  id uuid primary key default gen_random_uuid(),
  solicitacao_id uuid not null references public.tc_solicitacoes(id) on delete cascade,
  tipo_documento text not null,
  nome_arquivo text not null,
  tamanho_bytes bigint,
  mime_type text,
  extraido_automaticamente boolean not null default false,
  conferencia_status text not null default 'pendente' check (conferencia_status in ('pendente','conferido','divergencia')),
  created_at timestamptz not null default now()
);

insert into public.tc_drpp (id,nome,sede,descricao) values
(1,'1ª DRPP','Canoas','Vale dos Sinos e Litoral'),
(2,'2ª DRPP','Santa Maria','Região Central'),
(3,'3ª DRPP','Santo Ângelo','Missões e Noroeste'),
(4,'4ª DRPP','Passo Fundo','Alto Uruguai'),
(5,'5ª DRPP','Pelotas','Sul'),
(6,'6ª DRPP','Santana do Livramento','Campanha'),
(7,'7ª DRPP','Caxias do Sul','Serra'),
(8,'8ª DRPP','Santa Cruz do Sul','Vale do Rio Pardo'),
(9,'9ª DRPP','Charqueadas','Carbonífera'),
(10,'10ª DRPP','Porto Alegre','Porto Alegre')
on conflict (id) do update set nome=excluded.nome,sede=excluded.sede,descricao=excluded.descricao;

alter table public.tc_solicitacoes enable row level security;
alter table public.tc_convenentes enable row level security;
alter table public.tc_drpp enable row level security;
alter table public.tc_estabelecimentos_penais enable row level security;
alter table public.tc_solicitacao_estabelecimentos enable row level security;
alter table public.tc_solicitacao_atividades enable row level security;
alter table public.tc_documentos_submetidos enable row level security;

create policy "authenticated tc solicitacoes" on public.tc_solicitacoes for all to authenticated using (true) with check (true);
create policy "authenticated tc convenentes" on public.tc_convenentes for all to authenticated using (true) with check (true);
create policy "authenticated tc drpp read" on public.tc_drpp for select to authenticated using (true);
create policy "authenticated tc estabelecimentos read" on public.tc_estabelecimentos_penais for select to authenticated using (true);
create policy "authenticated tc solicitacao estabelecimentos" on public.tc_solicitacao_estabelecimentos for all to authenticated using (true) with check (true);
create policy "authenticated tc atividades" on public.tc_solicitacao_atividades for all to authenticated using (true) with check (true);
create policy "authenticated tc documentos" on public.tc_documentos_submetidos for all to authenticated using (true) with check (true);
