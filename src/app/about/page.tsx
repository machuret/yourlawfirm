import Link from "next/link";
import Hero from "@/components/Hero";
import Prose from "@/components/Prose";
import { getSite } from "@/lib/site";
import { canonical } from "@/lib/seo";
export const metadata = { title: "About", ...canonical("/about") };
export default async function About() {
  const s = await getSite();
  return (<><Hero title={`About ${s.brand_name}`} crumbs={[{ name: "About" }]} intro="An independent directory that helps people find the right lawyer, and helps good firms get found." />
    <div className="wrap py-12"><Prose>
      <p>Finding a lawyer usually starts with a search engine and a lot of guesswork. We built this directory to make that first step clearer: every firm is organised by area of law and location, with ratings, people, fees and contact details in one place.</p>
      <h2>How we check listings</h2>
      <p>Each listing is matched to a live firm website, and most are confirmed against Google by phone number. Firms that close or can’t be verified are removed. Ratings and reviews show where they came from and when we retrieved them.</p>
      <h2>For law firms</h2>
      <p>Your listing is free. <Link href="/claim">Claim it</Link> to correct details, add your team and choose the areas you appear under.</p>
    </Prose></div></>);
}
