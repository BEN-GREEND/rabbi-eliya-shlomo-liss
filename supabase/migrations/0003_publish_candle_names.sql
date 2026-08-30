-- Optional names on memorial candles, and explicit consent to publish them.
--
-- Two separate questions, deliberately: a visitor may give a name so the site
-- can address them after they light, and separately decide whether that name
-- appears publicly. The default is no. Consent is never implied by the
-- presence of a name.
--
-- 0001 is left untouched: an existing candle keeps its row, and the default
-- below means every candle lit before this migration stays unpublished.

alter table memorial_candles
  add column if not exists publish_name boolean not null default false;

-- A name is what makes publication possible. Without one there is nothing to
-- publish, so the pair (null name, publish) cannot exist in the table at all —
-- the route handler normalises it too, and neither layer is the only guard.
alter table memorial_candles
  drop constraint if exists memorial_candles_publish_needs_name;

alter table memorial_candles
  add constraint memorial_candles_publish_needs_name
  check (not publish_name or display_name is not null);

-- The public list: published names, newest first. A partial index, because
-- the great majority of rows are not published and never need scanning.
create index if not exists memorial_candles_published_idx
  on memorial_candles (created_at desc)
  where publish_name and display_name is not null;

-- RLS stays on with no policies, exactly as 0001 left it: the anon key can
-- neither read nor write, and the published names reach the page only through
-- this project's route handler, which selects two columns and no more.
