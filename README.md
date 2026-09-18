# yourlawfirm — lawyer directory network (Next.js 16 + Supabase)

One codebase serves all 10 directory sites. Each Vercel project sets `NEXT_PUBLIC_SITE_KEY` (hub | family | wills | criminal | injury | property | business | employment | immigration | conveyancing); the app reads that site's practice-area filter from the `sites` table and scopes every query to it.

## Run
```
npm install
cp .env.example .env.local   # fill in anon key
npm run dev
```

## Routes
- `/` — search, practice areas with counts, regions with counts, complete-profile firms
- `/search?area=&q=|lat=&lng=` — text (suburb/postcode/name) or "near me" (PostGIS RPC `nearby_listings`)
- `/practice-areas`, `/practice-areas/[slug]?region=` — paginated
- `/locations`, `/locations/[region]`
- `/lawyers/[slug]` — profile, people, hours, JSON-LD, enquiry form (writes to `leads`)
- `/claim/[slug]` — claim flow placeholder (auth to come)
- `/sitemap.xml`, `/robots.txt`

## Data access
Anon key → `public_listings`, `public_practitioners`, `practice_areas`, `regions`, `sites`, RPCs `nearby_listings`, `site_area_counts`, `site_region_counts`; insert-only on `leads` and `listing_events`. Base tables are not readable with the anon key.

## Next
- Auth + claim flow (`listing_claims` → trigger grants owner edits)
- Owner dashboard (edit profile, media upload to Storage, lead inbox)
- Lead notifications (edge function on `leads` insert → Resend/Twilio via `lead_routing`)
- Per-site theming from `sites.primary_colour`, per-site copy in `listing_content`
