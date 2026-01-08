-- New Media Map Database Schema
-- Run this in your Supabase SQL Editor

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Creators table (main profile data)
create table if not exists public.creators (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete set null,
  slug text unique not null,
  name text not null,
  avatar_url text,
  country text,
  city text,
  lat float,
  lng float,
  primary_signal text,
  signals text[] default '{}',
  content_formats text[] default '{}',
  trajectory text,
  no_conference_circuit boolean default false,
  editorial_reason text,
  x_handle text,
  kaito_id text,
  website_url text,
  is_claimed boolean default false,
  is_published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Artifacts table (proof of work items)
create table if not exists public.artifacts (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.creators on delete cascade not null,
  type text not null check (type in ('youtube', 'x', 'github', 'substack', 'website', 'talk', 'podcast', 'article')),
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

-- Recommendations table (community validation)
create table if not exists public.recommendations (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.creators on delete cascade not null,
  recommender_name text not null,
  context text not null,
  created_at timestamp with time zone default now()
);

-- Submissions table (pending profile submissions)
create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  submitter_id uuid references auth.users on delete set null,
  data jsonb not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

-- Bookmarks table (saved creators, synced when logged in)
create table if not exists public.bookmarks (
  user_id uuid references auth.users on delete cascade not null,
  creator_id uuid references public.creators on delete cascade not null,
  created_at timestamp with time zone default now(),
  primary key (user_id, creator_id)
);

-- User profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  x_handle text,
  kaito_id text,
  is_admin boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_creators_slug on public.creators(slug);
create index if not exists idx_creators_country on public.creators(country);
create index if not exists idx_creators_primary_signal on public.creators(primary_signal);
create index if not exists idx_creators_is_published on public.creators(is_published);
create index if not exists idx_artifacts_creator_id on public.artifacts(creator_id);
create index if not exists idx_submissions_status on public.submissions(status);
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.creators enable row level security;
alter table public.artifacts enable row level security;
alter table public.recommendations enable row level security;
alter table public.submissions enable row level security;
alter table public.bookmarks enable row level security;
alter table public.profiles enable row level security;

-- Creators: Anyone can read published creators
create policy "Published creators are viewable by everyone"
  on public.creators for select
  using (is_published = true);

-- Creators: Owners can update their own claimed profile
create policy "Users can update their own profile"
  on public.creators for update
  using (auth.uid() = user_id);

-- Artifacts: Anyone can read artifacts for published creators
create policy "Artifacts are viewable for published creators"
  on public.artifacts for select
  using (
    exists (
      select 1 from public.creators 
      where creators.id = artifacts.creator_id 
      and creators.is_published = true
    )
  );

-- Recommendations: Anyone can read
create policy "Recommendations are viewable by everyone"
  on public.recommendations for select
  using (true);

-- Submissions: Users can create submissions
create policy "Anyone can create submissions"
  on public.submissions for insert
  with check (true);

-- Submissions: Users can view their own submissions
create policy "Users can view their own submissions"
  on public.submissions for select
  using (auth.uid() = submitter_id);

-- Bookmarks: Users can manage their own bookmarks
create policy "Users can manage their own bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id);

-- Profiles: Users can view their own profile
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Profiles: Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_creators_updated_at
  before update on public.creators
  for each row execute function public.handle_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

