export default function Prose({ children }: { children: React.ReactNode }) {
  return <div className="max-w-3xl [&_h2]:mt-10 [&_h2]:text-2xl [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1.5 [&_a]:underline">{children}</div>;
}
