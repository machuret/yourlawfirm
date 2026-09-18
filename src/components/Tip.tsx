export default function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return <span className="tip" tabIndex={0} aria-label={label}>{children}<span role="tooltip" className="tip-bubble">{label}</span></span>;
}
