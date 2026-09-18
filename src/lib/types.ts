export type Listing = {
  listing_id: string; slug: string; business_name: string; office_name: string | null;
  listing_type: string; is_law_practice: boolean; suburb: string | null; state: string | null; postcode: string | null;
  region_slug: string | null; region_name: string | null; address_line_1: string | null; level_floor: string | null;
  latitude: number | null; longitude: number | null; phone_e164: string | null; phone_primary: string | null;
  website_url: string | null; booking_url: string | null; email_general: string | null;
  primary_practice_area: string; practice_areas: string[] | null; languages_spoken: string[] | null;
  fee_structures: string[] | null; free_first_consultation: string | null; no_win_no_fee: boolean | null;
  legal_aid_accepted: boolean | null; after_hours: boolean | null; opening_hours: Record<string, string[][]> | null;
  timezone: string; tagline: string | null; short_description: string | null; badges: string[] | null;
  claim_status: string; is_verified: boolean; plan_tier: string; is_featured: boolean; featured_until: string | null;
  logo_url: string | null; hero_image_url: string | null; google_rating: number | null; google_review_count: number | null;
  year_established: number | null; number_of_lawyers: number | null; social_links: Record<string, string> | null;
};
export type PracticeArea = { slug: string; name: string; parent_group: string; candidate_site: string; is_lawyer_area: boolean };
export type Region = { region_slug: string; region_name: string; state: string; region_type: string; major_centres: string[] };
export type Site = { site_key: string; domain: string | null; brand_name: string | null; site_type: string; practice_area_filter: string[]; tagline: string | null; primary_colour: string | null };
export type Practitioner = { practitioner_id: string; slug: string; full_name_display: string; role_title: string | null; practitioner_type: string; is_principal: boolean; practice_areas: string[] | null; admission_year: number | null };
