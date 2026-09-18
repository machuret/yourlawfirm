import Link from "next/link";
import { getPracticeAreas, getAreaCounts } from "@/lib/queries";
export const revalidate = 3600;
export const metadata = { title: "Practice areas" };
export default async function Areas() {
  const [areas, counts] = await Promise.all([getPracticeAreas(), getAreaCounts()]);
  const groups = Object.entries(areas.reduce<Record<string, typeof areas>>((acc, a) => ((acc[a.parent_group] ??= []).push(a), acc), {}));
  return (
    <div className="wrap py-10">
      <h1 className="text-3xl">Areas of law</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {groups.map(([g, list]) => (
          <div key={g}><h2 className="text-lg">{g}</h2>
            <ul className="mt-2 grid gap-1 text-sm">{list.map((a) => <li key={a.slug} className="flex justify-between"><Link href={`/practice-areas/${a.slug}`} className="hover:underline">{a.name}</Link><span className="text-muted">{counts[a.slug] ?? 0}</span></li>)}</ul>
          </div>))}
      </div>
    </div>);
}
