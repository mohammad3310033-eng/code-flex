type ProductMediaPlaceholderProps = { label: string; name: string };

export function ProductMediaPlaceholder({ label, name }: ProductMediaPlaceholderProps) {
  return <div className="relative flex aspect-[1.08] items-center justify-center overflow-hidden rounded-[1.5rem] border border-black/8 bg-[var(--media-surface)] p-6 sm:aspect-[1.2]" role="img" aria-label={`${label}: ${name}`}><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.9),rgba(245,246,248,0.9)_45%,rgba(229,231,235,0.75))]" /><div className="relative rounded-full border border-black/10 bg-white/80 px-5 py-3 text-center text-sm font-semibold text-muted-foreground shadow-sm backdrop-blur-sm" dir="auto">{label}</div></div>;
}
