-- pump.social — Postgres schema (Supabase / Neon).
-- Timestamps are stored as bigint (ms epoch) to match the domain model exactly.

create extension if not exists "pgcrypto";

create table if not exists users (
  id                 uuid primary key default gen_random_uuid(),
  handle             text not null unique,
  wallet             text not null unique,
  bio                text not null default '',
  country            text not null default 'FR',
  created_at         bigint not null,
  received           double precision not null default 0,
  given              double precision not null default 0,
  hide_pump_history  boolean not null default false,
  anonymize_pumps    boolean not null default false
);
create index if not exists users_received_idx on users (received desc);
create index if not exists users_country_idx on users (country);

create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  text        text not null,
  media_url   text,
  media_type  text,
  created_at  bigint not null,
  pumped      double precision not null default 0,
  comments    integer not null default 0,
  reposts     integer not null default 0,
  likes       integer not null default 0,
  country     text not null default 'FR',
  tags        text[] not null default '{}'
);
create index if not exists posts_created_idx on posts (created_at desc);
create index if not exists posts_pumped_idx on posts (pumped desc);
create index if not exists posts_country_idx on posts (country);

create table if not exists pumps (
  id              uuid primary key default gen_random_uuid(),
  post_id         uuid not null references posts(id) on delete cascade,
  pumper_user_id  uuid not null references users(id) on delete cascade,
  amount          double precision not null,
  creator_amount  double precision not null,
  founder_amount  double precision not null,
  signature       text not null unique,
  anonymous       boolean not null default false,
  created_at      bigint not null
);
create index if not exists pumps_post_idx on pumps (post_id, created_at desc);

create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references posts(id) on delete cascade,
  user_id     uuid not null references users(id) on delete cascade,
  text        text not null,
  created_at  bigint not null
);
create index if not exists comments_post_idx on comments (post_id, created_at desc);
