export default function Skeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="wrap animate-pulse py-10" aria-busy="true" aria-label="Loading">
      <div className="h-3 w-40 rounded-full bg-hair" /><div className="mt-6 h-12 w-2/3 rounded-2xl bg-hair" /><div className="mt-4 h-5 w-1/2 rounded-full bg-hair" />
      <div className="mt-12 grid gap-4 md:grid-cols-2">{Array.from({ length: cards }).map((_, i) => <div key={i} className="surface h-52 p-5"><div className="flex gap-4"><div className="h-14 w-14 rounded-2xl bg-soft" /><div className="flex-1"><div className="h-4 w-2/3 rounded-full bg-soft" /><div className="mt-3 h-3 w-1/3 rounded-full bg-soft" /></div></div><div className="mt-6 h-3 w-full rounded-full bg-soft" /><div className="mt-2 h-3 w-4/5 rounded-full bg-soft" /></div>)}</div>
    </div>
  );
}
