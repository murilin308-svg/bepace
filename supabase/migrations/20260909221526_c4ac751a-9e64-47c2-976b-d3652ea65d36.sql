-- BEPACE modules
create table public.prayers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null default '',
  category text not null default 'Gratidão',
  body text default '',
  favorite boolean not null default false,
  minutes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null default '',
  person text default '',
  status text not null default 'Em oração',
  answer text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null default '',
  meal_type text not null default 'Almoço',
  goal text not null default 'Manutenção',
  weekday text not null default 'Segunda',
  calories integer not null default 0,
  protein integer not null default 0,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.body_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  log_date date not null default current_date,
  weight_kg numeric not null default 0,
  water_ml integer not null default 0,
  waist_cm numeric not null default 0,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null default '',
  modality text not null default 'Academia',
  weekday text not null default 'Segunda',
  duration_min integer not null default 60,
  load_kg integer not null default 0,
  performance text default '',
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null default '',
  category text not null default 'Cursos',
  goal text default '',
  hours_target integer not null default 10,
  hours_done integer not null default 0,
  progress integer not null default 0,
  status text not null default 'Em andamento',
  material text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.news_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  topic text not null default '',
  sector text not null default 'Tecnologia',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_news (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null default '',
  source text default '',
  url text default '',
  summary text default '',
  favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vision_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null default '',
  category text not null default 'Carreira',
  description text default '',
  image_url text default '',
  deadline text default '',
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null default '',
  category text not null default 'Mercado',
  quantity text default '1',
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null default '',
  category text not null default 'Viagens',
  status text not null default 'Sonho',
  deadline text default '',
  notes text default '',
  image_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null default '',
  category text not null default 'Renda Fixa',
  amount numeric not null default 0,
  return_pct numeric not null default 0,
  broker text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  bank text not null default 'Nubank',
  nickname text default '',
  limit_amount numeric not null default 0,
  current_invoice numeric not null default 0,
  due_day integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.card_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  card_id uuid references public.cards on delete cascade,
  description text not null default '',
  category text not null default 'Outros',
  amount numeric not null default 0,
  expense_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.update_updated_at_column()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$
language plpgsql set search_path = public;

do $$
declare t text;
begin
  foreach t in array array['prayers','prayer_requests','meals','body_logs','workouts','study_plans','news_topics','saved_news','vision_items','shopping_items','experiences','investments','cards','card_expenses']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own rows" on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create index %I on public.%I (user_id, created_at desc)', 'idx_' || t || '_user', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.update_updated_at_column()', t);
  end loop;
end $$;