-- ── SOURCES ──
-- Fontes monitoradas pelo digest (newsletters, LinkedIn, web)
create table public.sources (
  id                    uuid default gen_random_uuid() primary key,
  name                  text not null,
  type                  text not null check (type in ('newsletter', 'linkedin', 'web')),
  category              text,
  url                   text,
  active                boolean default true,
  last_featured_edition int,
  created_at            timestamptz default now()
);

alter table public.sources enable row level security;

create policy "Qualquer usuário autenticado lê sources"
  on public.sources for select
  to authenticated
  using (true);

-- Adiciona FK em digest_cards
alter table public.digest_cards
  add column source_id uuid references public.sources on delete set null;

-- ── SEED: fontes ──
insert into public.sources (name, type, category, url) values
  ('TLDR Tech',              'newsletter', 'tecnologia · IA',          'https://tldr.tech'),
  ('AI Breakfast',           'newsletter', 'IA · produto',             'https://aibreakfast.beehiiv.com'),
  ('Exponential View',       'newsletter', 'estratégia · tecnologia',  'https://www.exponentialview.co'),
  ('There''s an AI for That','newsletter', 'IA · ferramentas',         'https://theresanaiforthat.com'),
  ('Lenny''s Newsletter',    'newsletter', 'produto · liderança',      'https://www.lennysnewsletter.com'),
  ('Mobile Time',            'newsletter', 'mobile · Brasil',          'https://mobiletime.com.br'),
  ('The Pragmatic Engineer', 'newsletter', 'engenharia · cultura',     'https://newsletter.pragmaticengineer.com'),
  ('The Convivial Society',  'newsletter', 'tecnologia · reflexão',    'https://theconvivialsociety.substack.com'),
  ('Daniela Klaiman',        'linkedin',   'futurismo · comportamento','https://www.linkedin.com/in/daniela-klaiman/'),
  ('Monica Magalhães',       'linkedin',   'futurismo · inovação',     'https://www.linkedin.com/in/momagalhaes/'),
  ('Luis Pacete',            'linkedin',   'tendências · negócios',    'https://www.linkedin.com/in/lpacete/');

-- ── MIGRAÇÃO: linka cards existentes às sources ──
update public.digest_cards dc
set source_id = s.id
from public.sources s
where s.name = dc.source
   or dc.source like '%' || s.name || '%';

-- Atualiza last_featured_edition para cada source
update public.sources s
set last_featured_edition = sub.edition
from (
  select dc.source_id, max(d.edition) as edition
  from public.digest_cards dc
  join public.digests d on d.id = dc.digest_id
  where dc.source_id is not null
  group by dc.source_id
) sub
where s.id = sub.source_id;
