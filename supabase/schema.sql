create extension if not exists pgcrypto;

do $$ begin
  create type public.artwork_availability as enum ('available', 'reserved', 'sold', 'private');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.inquiry_status as enum ('new', 'contacted', 'closed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum ('pending', 'paid', 'cancelled', 'refunded');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where admins.user_id = auth.uid()
  );
$$;

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  sort_order integer not null default 0,
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references public.collections(id) on delete set null,
  slug text not null unique,
  title text not null,
  description text not null default '',
  category text not null default 'Uncategorized',
  tags text[] not null default '{}',
  price numeric(12,2),
  currency text not null default 'USD',
  dimensions text,
  availability public.artwork_availability not null default 'available',
  buy_link text,
  image_url text,
  image_public_id text,
  thumbnail_url text,
  blur_data_url text,
  featured boolean not null default false,
  homepage_featured boolean not null default true,
  published boolean not null default true,
  sort_order integer not null default 0,
  gradient_index integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artworks_collection_id_idx on public.artworks(collection_id);
create index if not exists artworks_published_sort_idx on public.artworks(published, sort_order);
create index if not exists artworks_tags_idx on public.artworks using gin(tags);

create table if not exists public.homepage_content (
  id smallint primary key default 1 check (id = 1),
  hero_title text not null,
  hero_subtitle text not null,
  hero_cta_label text not null default 'Explore collections',
  hero_cta_href text not null default '/collections',
  featured_section_title text not null default 'Featured Work',
  seo_title text not null,
  seo_description text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.about_content (
  id smallint primary key default 1 check (id = 1),
  label text not null default 'About the Gallery',
  title text not null,
  italic_title text not null,
  body text not null,
  secondary_body text not null,
  metrics jsonb not null default '[]'::jsonb,
  seo_title text not null,
  seo_description text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_info (
  id smallint primary key default 1 check (id = 1),
  heading text not null,
  italic_heading text not null,
  email text not null,
  location text not null,
  instagram text not null,
  phone text,
  seo_title text not null,
  seo_description text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null,
  logo_text text not null,
  accent_color text not null default '#4fd1c5',
  default_seo_title text not null,
  default_seo_description text not null,
  og_image_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid references public.artworks(id) on delete set null,
  name text not null,
  email text not null,
  message text not null,
  budget text,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid references public.artworks(id) on delete set null,
  buyer_email text not null,
  buyer_name text,
  amount numeric(12,2),
  currency text not null default 'USD',
  status public.order_status not null default 'pending',
  stripe_session_id text unique,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_collections_updated_at on public.collections;
create trigger set_collections_updated_at
before update on public.collections
for each row execute function public.set_updated_at();

drop trigger if exists set_artworks_updated_at on public.artworks;
create trigger set_artworks_updated_at
before update on public.artworks
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_content_updated_at on public.homepage_content;
create trigger set_homepage_content_updated_at
before update on public.homepage_content
for each row execute function public.set_updated_at();

drop trigger if exists set_about_content_updated_at on public.about_content;
create trigger set_about_content_updated_at
before update on public.about_content
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_info_updated_at on public.contact_info;
create trigger set_contact_info_updated_at
before update on public.contact_info
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_social_links_updated_at on public.social_links;
create trigger set_social_links_updated_at
before update on public.social_links
for each row execute function public.set_updated_at();

drop trigger if exists set_inquiries_updated_at on public.inquiries;
create trigger set_inquiries_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.admins enable row level security;
alter table public.collections enable row level security;
alter table public.artworks enable row level security;
alter table public.homepage_content enable row level security;
alter table public.about_content enable row level security;
alter table public.contact_info enable row level security;
alter table public.site_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.inquiries enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Admins can read admins" on public.admins;
create policy "Admins can read admins" on public.admins
for select to authenticated
using (public.is_admin());

drop policy if exists "Public can read collections" on public.collections;
create policy "Public can read collections" on public.collections
for select to anon, authenticated
using (true);

drop policy if exists "Admins manage collections" on public.collections;
create policy "Admins manage collections" on public.collections
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published artworks" on public.artworks;
create policy "Public can read published artworks" on public.artworks
for select to anon, authenticated
using (published = true);

drop policy if exists "Admins manage artworks" on public.artworks;
create policy "Admins manage artworks" on public.artworks
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read homepage content" on public.homepage_content;
create policy "Public can read homepage content" on public.homepage_content
for select to anon, authenticated
using (true);

drop policy if exists "Admins manage homepage content" on public.homepage_content;
create policy "Admins manage homepage content" on public.homepage_content
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read about content" on public.about_content;
create policy "Public can read about content" on public.about_content
for select to anon, authenticated
using (true);

drop policy if exists "Admins manage about content" on public.about_content;
create policy "Admins manage about content" on public.about_content
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read contact info" on public.contact_info;
create policy "Public can read contact info" on public.contact_info
for select to anon, authenticated
using (true);

drop policy if exists "Admins manage contact info" on public.contact_info;
create policy "Admins manage contact info" on public.contact_info
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings
for select to anon, authenticated
using (true);

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read social links" on public.social_links;
create policy "Public can read social links" on public.social_links
for select to anon, authenticated
using (true);

drop policy if exists "Admins manage social links" on public.social_links;
create policy "Admins manage social links" on public.social_links
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can create inquiries" on public.inquiries;
create policy "Anyone can create inquiries" on public.inquiries
for insert to anon, authenticated
with check (true);

drop policy if exists "Admins manage inquiries" on public.inquiries;
create policy "Admins manage inquiries" on public.inquiries
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.collections (slug, title, description, sort_order, featured, seo_title, seo_description)
values
  ('fluid-dynamics', 'Fluid Dynamics', 'Algorithmic turbulence, neural current, and deep-water motion studies.', 1, true, 'Fluid Dynamics Digital Art Collection', 'Luxury digital works exploring turbulence, water, and generative motion.'),
  ('chromatic', 'Chromatic', 'Color as conflict, signal, warning, and desire.', 2, true, 'Chromatic Digital Art Collection', 'Premium chromatic digital works and abstract color studies.'),
  ('abstract', 'Abstract', 'Entropy, frequency, atmosphere, and computational memory.', 3, true, 'Abstract Digital Art Collection', 'Cinematic abstract works for contemporary collectors.')
on conflict (slug) do nothing;

insert into public.homepage_content (
  id,
  hero_title,
  hero_subtitle,
  hero_cta_label,
  hero_cta_href,
  featured_section_title,
  seo_title,
  seo_description
)
values (
  1,
  'Where digital consciousness becomes visible',
  'A cinematic collection of generative works curated for collectors who want art that reveals more the longer it is inhabited.',
  'Explore collections',
  '/collections',
  'Featured Work',
  'VOID.GALLERY | Luxury Digital Art Gallery',
  'A cinematic luxury digital art gallery featuring collectible generative artworks, editorial collections, and private acquisition inquiries.'
)
on conflict (id) do nothing;

insert into public.about_content (
  id,
  label,
  title,
  italic_title,
  body,
  secondary_body,
  metrics,
  seo_title,
  seo_description
)
values (
  1,
  'About the Gallery',
  'Where digital consciousness',
  'becomes visible',
  'This gallery exists at the intersection of algorithmic generation and human curation. Each work represents a moment where machine intelligence and artistic intention converge into something neither could produce alone.',
  'We collect and exhibit digital art exploring themes of consciousness, data, emergence, and the aesthetics of computation. Our focus is on works that reward sustained attention: pieces that reveal more the longer you inhabit them.',
  '[{"label":"Digital Works","value":"150+"},{"label":"Artists Represented","value":"23"},{"label":"Collections","value":"8"}]'::jsonb,
  'About VOID.GALLERY',
  'Learn about the curatorial point of view behind VOID.GALLERY.'
)
on conflict (id) do nothing;

insert into public.contact_info (
  id,
  heading,
  italic_heading,
  email,
  location,
  instagram,
  phone,
  seo_title,
  seo_description
)
values (
  1,
  'Let''s talk about',
  'your vision',
  'hello@gallery.art',
  'Online and private advisory by appointment',
  '@void.gallery',
  null,
  'Contact VOID.GALLERY',
  'Contact VOID.GALLERY for acquisition inquiries, private viewings, and artist representation.'
)
on conflict (id) do nothing;

insert into public.site_settings (
  id,
  site_name,
  logo_text,
  accent_color,
  default_seo_title,
  default_seo_description,
  og_image_url
)
values (
  1,
  'VOID.GALLERY',
  'VOID.GALLERY',
  '#4fd1c5',
  'VOID.GALLERY | Luxury Digital Art Gallery',
  'Cinematic digital art collections with private acquisition inquiries and a curator-managed catalog.',
  null
)
on conflict (id) do nothing;
