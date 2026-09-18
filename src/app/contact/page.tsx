import Hero from "@/components/Hero";
import Prose from "@/components/Prose";
import { CONTACT_EMAIL } from "@/lib/site";
import { canonical } from "@/lib/seo";
export const metadata = { title: "Contact", ...canonical("/contact") };
export default function Contact() {
  return (<><Hero title="Contact us" crumbs={[{ name: "Contact" }]} />
    <div className="wrap py-12"><Prose>
      <p>For listing corrections, removals, partnerships or privacy requests, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      <p>We can’t give legal advice. If you need help with a legal problem, contact a firm directly from its listing, or your state’s Legal Aid commission if cost is a concern.</p>
    </Prose></div></>);
}
