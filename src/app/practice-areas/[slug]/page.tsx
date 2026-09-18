import { permanentRedirect } from "next/navigation";
import { getPracticeArea } from "@/lib/queries";
export default async function Old({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getPracticeArea((await params).slug);
  permanentRedirect(a ? `/law/${a.group_slug}/${a.slug}` : "/law");
}
