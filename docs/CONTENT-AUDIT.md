# Location and practice content audit

Reviewed 19 September 2026.

## Coverage and implementation

- All 66 current regions have individually authored focus and access notes, a dedicated AI-generated hero, a preparation checklist, cost and engagement guidance, questions to ask and the relevant state legal-aid link.
- All 101 practice areas have distinct first-meeting guidance, scope considerations, three document prompts and two subject-specific questions. These are combined with the relevant parent guide on national and regional pages.
- All 12 practice groups have a substantive overview, three engagement steps, cost and timing guidance and questions to ask. Location/practice pages also explain regional access and cross-region considerations.
- Five route templates now render the guides: region, regional group, national group, national area and regional area. The law and location index pages also have illustrated heroes and expanded introductions.
- In-page navigation links directly to results, guides, questions and official resources. Guides use an editorial reading column and a preparation/resources sidebar that stacks on mobile.
- Same-state suggestions are labelled as other regions, rather than implying they are geographically nearby. Unsupported “Leading” language has been changed to “Compare”.

Content is a versioned display layer under `src/content/`. Listings and Supabase records are unchanged. `tests/content-catalog.json` records the public directory inventory used for this release; update it and the authored content when the directory taxonomy changes. Unknown future regions have a generic image fallback, so new records require an editorial follow-up.

## Sources and correction

`src/content/sources.ts` contains the official resources displayed beside the new guidance. Sources were checked for the relevant process or service: the FCFCOA, Fair Work Commission, Home Affairs, ART, OAIC, ACCC, AFSA, state legal-aid services, Consumer Affairs Victoria, Safe Work Australia, Smartraveller and Bendigo Law Courts. State-specific resources are explicitly labelled. No local demand figures, firm expertise endorsements or unverified court addresses were invented.

A spot check found obsolete divorce copy in the existing database content. A display-layer correction removes the former short-marriage counselling-certificate requirement and clarifies that the general property-application period runs from the divorce becoming final. It also acknowledges Western Australia's separate Family Court. The correction is covered by a regression test.

- [FCFCOA form changes effective 10 June 2025](https://www.fcfcoa.gov.au/news-and-media-centre/updates-profession/june2025-fla-forms)
- [FCFCOA property applications and time limits](https://www.fcfcoa.gov.au/fl/fp/overview)
- [Family Court of Western Australia](https://www.familycourt.wa.gov.au/)

This is practical directory guidance, not a comprehensive legal review of existing database copy, FAQs, listings or every state-specific rule. Dates and requirements should be checked with the relevant authority for an individual matter. The displayed update date applies to the new guide, not to all legacy content on the page.

## Imagery and performance

- Every region has its own local WebP asset under `public/images/locations/`. These are labelled AI-generated regional illustrations, not documentary photographs of landmarks or listed firms.
- Full generation prompts, generator provenance, dimensions and byte sizes are recorded in `location-imagery.json`. Topic-image provenance is in `generated-imagery.json`.
- Each regional source asset is capped at 180,000 bytes and 1,280 pixels wide. The five original topic images were also recompressed below the same byte budget.
- Next Image provides responsive variants. Only the current page's hero is preloaded; the complete 66-image library is not downloaded on each page. Desktop requested widths are capped through the hero's responsive `sizes` declaration, and category-card images remain lazy-loaded.
- The coverage test checks real file formats, dimensions, byte limits, distinct paths and complete regional coverage.

## Verification

- `npm run test:content`: six tests pass, covering the 66/101/12 content inventories, unique local/topic copy, official-resource availability, every regional asset and the divorce correction.
- `npm run build`: production compilation, TypeScript and 16 static routes pass.
- `npm run lint`: zero errors; four pre-existing warnings remain for external listing/logo images.
- Desktop and 390px mobile review covers the Bendigo location guide and regional family/divorce routes, working in-page anchors, loaded responsive hero imagery, readable guide columns and no horizontal overflow.
- Image contact sheets were reviewed across all 66 regions. Collage-like outputs are replaced with continuous scenes before release.

Production deployment, enquiry delivery, listing identities and all ten site variants are outside this verification. No enquiry or claim was submitted.


Final merge review: checked the location page at 320px in light and dark modes, with no horizontal overflow or broken images. The sixth test validates all 71 generated assets against their provenance records and the 180 KB budget.
