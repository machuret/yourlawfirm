import Hero from "@/components/Hero";
import Prose from "@/components/Prose";
import { getSite, CONTACT_EMAIL, LEGAL_ENTITY } from "@/lib/site";
import { canonical } from "@/lib/seo";
export const metadata = { title: "Terms of use", ...canonical("/terms") };
export default async function Terms() {
  const s = await getSite(); const b = s.brand_name;
  return (<><Hero title="Terms of use" crumbs={[{ name: "Terms of use" }]} intro="Last updated 18 September 2026" />
    <div className="wrap py-12"><Prose>
      <p>These terms apply to your use of {b}, operated by {LEGAL_ENTITY}. By using the site you agree to them.</p>
      <h2>Not legal advice</h2>
      <p>{b} is a directory. We are not a law firm and we do not provide legal advice. Information on this site, including explanations of areas of law and answers to common questions, is general information only and may not suit your circumstances. Using the site or contacting a firm through it does not create a lawyer–client relationship with us.</p>
      <h2>Listings</h2>
      <p>Listings are compiled from public sources and firms’ websites and are checked against those sources, but details can change and errors can occur. Confirm fees, availability, qualifications and any other important details directly with the firm before engaging them. Inclusion in the directory is not an endorsement, and a firm’s position in results may be affected by paid placement, which is marked as featured.</p>
      <h2>Ratings and reviews</h2>
      <p>Ratings and reviews marked as from Google are sourced from Google Maps and shown with the date retrieved. Testimonials marked as from a firm’s website were published by that firm. We do not verify the content of reviews or testimonials.</p>
      <h2>Enquiries</h2>
      <p>When you send an enquiry, we pass it to the firm you selected. The firm is responsible for how it responds and for any legal services it provides. Don’t include confidential or sensitive details in an enquiry.</p>
      <h2>Your conduct</h2>
      <ul><li>Don’t submit false, misleading or abusive enquiries or content.</li><li>Don’t copy, scrape or republish the directory in bulk without our written permission.</li><li>Don’t attempt to interfere with the site’s security or operation.</li></ul>
      <h2>For law firms</h2>
      <p>If you claim a listing, you must be authorised to act for the firm, and the information you provide must be accurate and lawful, including under professional conduct rules on advertising. We may edit or remove content that doesn’t meet these requirements.</p>
      <h2>Liability</h2>
      <p>Nothing in these terms excludes rights you have under the Australian Consumer Law that cannot be excluded. Otherwise, to the extent permitted by law, we provide the site “as is” and are not liable for any loss arising from your use of it or from services provided by listed firms.</p>
      <h2>Changes and governing law</h2>
      <p>We may update these terms by posting a new version on this page. These terms are governed by the laws of New South Wales, Australia.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </Prose></div></>);
}
