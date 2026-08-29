-- Memorial candles.
--
-- One row per candle lit. The total is COUNT(*) — there is no separate counter
-- to keep in sync, because at this site's scale a counter table would be two
-- sources of truth for one number and nothing else.
--
-- No personal data is stored. `token_hash` is a SHA-256 of a random token the
-- server issued to the browser, salted with a server-side pepper, so the row
-- cannot be traced back to a visitor. No IP address, no user agent, no
-- fingerprint of any kind.

create table if not exists memorial_candles (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  token_hash   text        not null,
  display_name text
);

-- The only query that is not a plain count: "has this token lit one recently?"
create index if not exists memorial_candles_token_recent_idx
  on memorial_candles (token_hash, created_at desc);

-- RLS on, and deliberately no policies: the anon key can neither read nor
-- write. Every access goes through this project's route handler using the
-- service role, which never reaches the browser.
alter table memorial_candles enable row level security;
