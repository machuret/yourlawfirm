import Link from "next/link";
export default function NotFound() { return <div className="wrap py-20 max-w-prose"><h1 className="text-3xl">That page isn’t here</h1><p className="mt-3">The listing may have been merged or removed. <Link href="/search" className="underline">Search again</Link>.</p></div>; }
