interface Props {
  label: string;
  value: string;
  sublabel?: string;
}

export default function ResultDisplay({ label, value, sublabel }: Props) {
  return (
    <div className="border border-line-strong bg-paper-dark p-6">
      <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 font-display text-4xl font-semibold text-ink">{value}</p>
      {sublabel && <p className="mt-1 font-mono text-xs text-ink-soft">{sublabel}</p>}
    </div>
  );
}
