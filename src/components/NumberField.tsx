interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  placeholder?: string;
}

export default function NumberField({ label, value, onChange, suffix, placeholder }: Props) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">{label}</span>
      <div className="mt-1 flex items-center border border-line bg-paper focus-within:border-line-strong">
        <input
          type="number"
          min={0}
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-2 text-sm outline-none"
        />
        {suffix && (
          <span className="pr-3 font-mono text-xs text-ink-muted">{suffix}</span>
        )}
      </div>
    </label>
  );
}
