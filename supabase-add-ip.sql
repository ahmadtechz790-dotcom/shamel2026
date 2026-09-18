alter table public.visitor_stats
add column if not exists ip text;
