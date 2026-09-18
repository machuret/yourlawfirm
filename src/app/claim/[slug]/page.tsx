import { notFound } from "next/navigation";
import { getListing } from "@/lib/queries";
export const metadata = { title: "Claim your listing" };
export default async function Claim({ params }: { params: Promise<{ slug: string }> }) {
  const l = await getListing((await params).slug);
  if (!l) notFound();
  return (
    <div className="wrap py-10 max-w-prose">
      <h1 className="text-3xl">Claim {l.business_name}</h1>
      <p className="mt-4">Claiming lets you correct details, add your logo and team, choose which practice areas you appear under, and receive enquiries directly.</p>
      <ol className="mt-6 grid gap-3 list-decimal pl-5">
        <li>Create an account with an email at your firm’s domain{l.website_url ? ` (${new URL(l.website_url).hostname.replace("www.", "")})` : ""}.</li>
        <li>We match it to the listing automatically. Other emails need a quick phone or document check.</li>
        <li>Edit your profile, and it goes live across the network.</li>
      </ol>
      <p className="mt-8 text-sm text-muted">Sign-up is coming shortly. Until then, email us the listing link and we’ll set it up for you.</p>
    </div>);
}
