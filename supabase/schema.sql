create table if not exists public.stores (
  id bigint generated always as identity primary key,
  code text not null unique,
  name text not null,
  city text not null,
  address text,
  owner_name text,
  owner_email text,
  manager_name text,
  manager_email text,
  planned_date date,
  appointment_status text default 'A fixer',
  appointment_contact text,
  appointment_note text,
  priority text default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'blocked', 'done')),
  health text default 'Intervention preparee',
  last_update_at timestamptz default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.store_steps (
  id bigint generated always as identity primary key,
  store_id bigint not null references public.stores(id) on delete cascade,
  actor_type text not null check (actor_type in ('installer', 'electrician', 'store_manager')),
  label text not null,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'issue', 'done')),
  note text,
  planned_at timestamptz,
  confirmed_at timestamptz,
  confirmed_by text,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (store_id, actor_type)
);

create table if not exists public.confirmations (
  id bigint generated always as identity primary key,
  store_id bigint not null references public.stores(id) on delete cascade,
  store_name text not null,
  actor_type text not null check (actor_type in ('installer', 'electrician', 'store_manager')),
  result text not null check (result in ('ok', 'issue')),
  comment text,
  confirmed_by text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.appointments (
  id bigint generated always as identity primary key,
  store_id bigint not null references public.stores(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null default 'Propose' check (status in ('Propose', 'Confirme')),
  people text,
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contacts (
  id bigint generated always as identity primary key,
  name text not null,
  role text not null,
  phone text,
  email text not null unique,
  store_code text,
  language text default 'fr' check (language in ('fr', 'nl')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.roles (
  id bigint generated always as identity primary key,
  name text not null unique,
  built_in boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.stores enable row level security;
alter table public.store_steps enable row level security;
alter table public.confirmations enable row level security;
alter table public.appointments enable row level security;
alter table public.contacts enable row level security;
alter table public.roles enable row level security;

drop policy if exists "authenticated users can read stores" on public.stores;
create policy "authenticated users can read stores"
on public.stores for select
to authenticated
using (true);

drop policy if exists "authenticated users can update stores" on public.stores;
create policy "authenticated users can update stores"
on public.stores for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can insert stores" on public.stores;
create policy "authenticated users can insert stores"
on public.stores for insert
to authenticated
with check (true);

drop policy if exists "authenticated users can read steps" on public.store_steps;
create policy "authenticated users can read steps"
on public.store_steps for select
to authenticated
using (true);

drop policy if exists "authenticated users can write steps" on public.store_steps;
create policy "authenticated users can write steps"
on public.store_steps for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can read confirmations" on public.confirmations;
create policy "authenticated users can read confirmations"
on public.confirmations for select
to authenticated
using (true);

drop policy if exists "authenticated users can write confirmations" on public.confirmations;
create policy "authenticated users can write confirmations"
on public.confirmations for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can read appointments" on public.appointments;
create policy "authenticated users can read appointments"
on public.appointments for select
to authenticated
using (true);

drop policy if exists "authenticated users can write appointments" on public.appointments;
create policy "authenticated users can write appointments"
on public.appointments for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can read contacts" on public.contacts;
create policy "authenticated users can read contacts"
on public.contacts for select
to authenticated
using (true);

drop policy if exists "authenticated users can write contacts" on public.contacts;
create policy "authenticated users can write contacts"
on public.contacts for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users can read roles" on public.roles;
create policy "authenticated users can read roles"
on public.roles for select
to authenticated
using (true);

drop policy if exists "authenticated users can write roles" on public.roles;
create policy "authenticated users can write roles"
on public.roles for all
to authenticated
using (true)
with check (true);

alter publication supabase_realtime add table public.stores;
alter publication supabase_realtime add table public.store_steps;
alter publication supabase_realtime add table public.confirmations;
alter publication supabase_realtime add table public.appointments;
alter publication supabase_realtime add table public.contacts;
alter publication supabase_realtime add table public.roles;

insert into public.roles (name, built_in)
values
  ('twem', true),
  ('magasin', true),
  ('telephonie', true),
  ('electricien', true)
on conflict (name) do nothing;

insert into public.contacts (name, role, phone, email, store_code, language)
values
  ('Emir', 'twem', '0470 00 00 01', 'emir@twem.be', null, 'fr'),
  ('Valou', 'twem', '0470 00 00 02', 'valou@twem.be', null, 'fr'),
  ('M. Dupont', 'magasin', '0470 00 00 03', 'anderlecht@brico.be', 'BRI-001', 'fr'),
  ('Mme Martin', 'magasin', '0470 00 00 04', 'wavre@brico.be', 'BRI-002', 'fr'),
  ('M. Lambert', 'magasin', '0470 00 00 05', 'liege@brico.be', 'BRI-003', 'fr'),
  ('Mme Simon', 'magasin', '0470 00 00 06', 'namur@brico.be', 'BRI-004', 'fr'),
  ('Equipe Telephonie A', 'telephonie', '0470 00 00 07', 'telephonie.a@partenaire.be', null, 'fr'),
  ('Equipe Telephonie B', 'telephonie', '0470 00 00 08', 'telephonie.b@partenaire.be', null, 'nl'),
  ('Electricien Nord', 'electricien', '0470 00 00 09', 'elec.nord@partenaire.be', null, 'fr'),
  ('Electricien Sud', 'electricien', '0470 00 00 10', 'elec.sud@partenaire.be', null, 'fr')
on conflict (email) do nothing;

insert into public.stores (code, name, city, owner_name, owner_email, manager_name, manager_email, planned_date, appointment_status, priority, status, health)
values
  ('BRI-001', 'Brico Anderlecht', 'Bruxelles', 'Nadia', 'nadia@txwem.be', 'Manager Anderlecht', 'anderlecht@brico.be', '2026-05-06', 'Confirme', 'high', 'in_progress', 'Validation magasin encore attendue'),
  ('BRI-002', 'Brico Wavre', 'Wavre', 'Julien', 'julien@txwem.be', 'Manager Wavre', 'wavre@brico.be', '2026-05-09', 'A fixer', 'normal', 'planned', 'Intervention preparee'),
  ('BRI-003', 'Brico Liege Rocourt', 'Liege', 'Nadia', 'nadia@txwem.be', 'Manager Liege', 'liege@brico.be', '2026-05-03', 'Confirme', 'critical', 'blocked', 'Un poste caisse ne prend pas les appels entrants'),
  ('BRI-004', 'Brico Namur', 'Namur', 'Sophie', 'sophie@txwem.be', 'Manager Namur', 'namur@brico.be', '2026-05-12', 'Confirme', 'normal', 'done', 'Travaux termines et valides')
on conflict (code) do nothing;

insert into public.store_steps (store_id, actor_type, label, status, note)
select s.id, step.actor_type, step.label, step.status, step.note
from public.stores s
join (
  values
    ('BRI-001', 'installer', 'Societe telephonie', 'done', 'Centrale remplacee'),
    ('BRI-001', 'electrician', 'Electricien', 'done', 'Cablage finalise'),
    ('BRI-001', 'store_manager', 'Responsable magasin', 'in_progress', 'Tests finaux a confirmer'),
    ('BRI-002', 'installer', 'Societe telephonie', 'planned', 'Intervention prevue a 09:00'),
    ('BRI-002', 'electrician', 'Electricien', 'planned', 'Presence confirmee'),
    ('BRI-002', 'store_manager', 'Responsable magasin', 'planned', 'Pas encore sollicite'),
    ('BRI-003', 'installer', 'Societe telephonie', 'done', 'Installation terminee'),
    ('BRI-003', 'electrician', 'Electricien', 'issue', 'Doute sur un raccordement local'),
    ('BRI-003', 'store_manager', 'Responsable magasin', 'issue', 'Test caisse KO'),
    ('BRI-004', 'installer', 'Societe telephonie', 'done', 'Remplacement termine'),
    ('BRI-004', 'electrician', 'Electricien', 'done', 'Cablage controle'),
    ('BRI-004', 'store_manager', 'Responsable magasin', 'done', 'Tests entrants et sortants valides')
) as step(code, actor_type, label, status, note)
  on s.code = step.code
on conflict (store_id, actor_type) do nothing;

insert into public.confirmations (store_id, store_name, actor_type, result, comment, confirmed_by)
select s.id, s.name, c.actor_type, c.result, c.comment, c.confirmed_by
from public.stores s
join (
  values
    ('BRI-003', 'store_manager', 'issue', 'Le poste caisse 2 ne recoit pas les appels', 'manager.liege@brico.be'),
    ('BRI-001', 'installer', 'ok', 'La centrale est remplacee et demarree', 'terrain@txwem.be')
) as c(code, actor_type, result, comment, confirmed_by)
  on s.code = c.code;
