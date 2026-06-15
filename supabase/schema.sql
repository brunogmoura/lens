-- ── PROFILES ──
-- Extende o auth.users do Supabase com dados do onboarding
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  sector      text,
  decision    text,
  blind_spot  text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Usuário vê só o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário atualiza só o próprio perfil"
  on public.profiles for all
  using (auth.uid() = id);

-- ── DIGESTS ──
-- Cada edição do digest (criada manualmente pelo admin por ora)
create table public.digests (
  id           uuid default gen_random_uuid() primary key,
  edition      int not null,
  title        text not null,
  published_at date not null,
  created_at   timestamptz default now()
);

alter table public.digests enable row level security;

create policy "Qualquer usuário autenticado lê digests"
  on public.digests for select
  to authenticated
  using (true);

-- ── DIGEST CARDS ──
-- Cards individuais de cada edição
create table public.digest_cards (
  id          uuid default gen_random_uuid() primary key,
  digest_id   uuid references public.digests on delete cascade not null,
  source      text not null,
  title       text not null,
  summary     text not null,
  latent      text,
  tags        text[] default '{}',
  claude_score int,
  signal      boolean default false,
  horizon     text,
  position    int default 0,
  created_at  timestamptz default now()
);

alter table public.digest_cards enable row level security;

create policy "Qualquer usuário autenticado lê cards"
  on public.digest_cards for select
  to authenticated
  using (true);

-- ── USER SCORES ──
-- Score que cada usuário dá para cada card
create table public.user_scores (
  user_id   uuid references auth.users on delete cascade,
  card_id   uuid references public.digest_cards on delete cascade,
  score     int check (score between 1 and 5),
  scored_at timestamptz default now(),
  primary key (user_id, card_id)
);

alter table public.user_scores enable row level security;

create policy "Usuário gerencia seus próprios scores"
  on public.user_scores for all
  using (auth.uid() = user_id);

-- ── USER SAVED ──
-- Cards salvos por cada usuário
create table public.user_saved (
  user_id  uuid references auth.users on delete cascade,
  card_id  uuid references public.digest_cards on delete cascade,
  saved_at timestamptz default now(),
  primary key (user_id, card_id)
);

alter table public.user_saved enable row level security;

create policy "Usuário gerencia seus próprios salvos"
  on public.user_saved for all
  using (auth.uid() = user_id);

-- ── TRIGGER: cria perfil automaticamente ao criar usuário ──
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
