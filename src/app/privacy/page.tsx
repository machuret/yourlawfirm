import Hero from "@/components/Hero";
import Prose from "@/components/Prose";
import { getSite, CONTACT_EMAIL, LEGAL_ENTITY } from "@/lib/site";
import { canonical } from "@/lib/seo";
export const metadata = { title: "Privacy policy", ...canonical("/privacy") };
export default async function Privacy() {
  const s = await getSite(); const b = s.brand_name;
  return (<><Hero title="Privacy policy" crumbs={[{ name: "Privacy policy" }]} intro="Last updated 18 September 2026" />
    <div className="wrap py-12"><Prose>
      <p>{b} is operated by {LEGAL_ENTITY} (“we”, “us”). We handle personal information in line with the Privacy Act 1988 (Cth) and the Australian Privacy Principles. This policy explains what we collect, why, and your choices.</p>
      <h2>What we collect</h2>
      <ul><li><strong>Enquiries you send to firms:</strong> your name, email, phone number and message, plus the firm, area of law and location the enquiry relates to.</li>
        <li><strong>Usage information:</strong> pages viewed, searches and clicks on phone numbers or websites, collected in aggregate to improve the directory and to report activity to listed firms.</li>
        <li><strong>Listing information:</strong> business details of law firms and practitioners, such as names, roles, business addresses, phone numbers, websites and professional profiles.</li>
        <li><strong>Account information:</strong> if you claim a listing, your name, work email, phone number and role, and records needed to verify your claim.</li></ul>
      <h2>Where listing information comes from</h2>
      <p>Listing details are compiled from publicly available business sources, including firms’ own websites, public business directories and Google Maps. We only publish professional information relating to a person’s work. Google ratings and reviews are shown with attribution and the date we retrieved them.</p>
      <h2>How we use information</h2>
      <ul><li>To send your enquiry to the firm you chose. The firm will use your details to respond, under its own privacy obligations.</li>
        <li>To operate, secure and improve the directory.</li>
        <li>To verify and manage claimed listings.</li>
        <li>To send you occasional updates, only if you ticked the box to receive them. You can unsubscribe at any time.</li></ul>
      <p>We do not sell personal information.</p>
      <h2>Disclosure and overseas storage</h2>
      <p>We use service providers for hosting, databases, email and analytics. Some of them store data outside Australia, including in the United States. We take reasonable steps to ensure they protect personal information consistently with the Australian Privacy Principles.</p>
      <h2>Cookies</h2>
      <p>We use essential cookies to run the site and may use analytics cookies to understand how it is used. You can block cookies in your browser, though some features may not work.</p>
      <h2>Law firms and practitioners</h2>
      <p>If you are listed and want your details corrected or removed, email us or use the claim link on your listing. We act on correction and removal requests promptly, and we will not contact you for marketing if you ask us not to.</p>
      <h2>Access, correction and complaints</h2>
      <p>You can ask for access to, or correction of, personal information we hold about you by emailing <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. If you have a privacy complaint, contact us first and we will respond within 30 days. If you are not satisfied, you can complain to the Office of the Australian Information Commissioner at oaic.gov.au.</p>
      <h2>Security</h2>
      <p>We use access controls and encryption in transit to protect information. No online service is completely secure, so please don’t send sensitive details about your legal matter in an enquiry form; share them directly with the firm.</p>
    </Prose></div></>);
}
