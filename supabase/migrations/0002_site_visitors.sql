-- Visitors.
--
-- One row per browser that has been here. The number shown on the site is
-- COUNT(*) — again, no counter table.
--
-- token_hash is UNIQUE, so registering is a single insert that does nothing on
-- conflict. Two requests arriving at once cannot produce a duplicate, and
-- there is no read-then-write race to reason about.
--
-- Nothing else is stored: no last_seen, no page views, no IP, no user agent.
-- The hash is domain-separated from the memorial candle's, so the same browser
-- produces two unrelated values and the two tables cannot be joined.

create table if not exists site_visitors (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  token_hash text        not null unique
);

alter table site_visitors enable row level security;
