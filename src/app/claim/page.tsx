import Link from "next/link";
export const metadata = { title: "Claim your listing" };
export default function ClaimIndex() {
  return (<div className="wrap py-10 max-w-prose"><h1 className="text-3xl">Claim your listing</h1><p className="mt-4">Find your firm with <Link href="/search" className="underline">search</Link>, open its profile, and use the “claim the listing” link at the bottom of the page.</p></div>);
}
