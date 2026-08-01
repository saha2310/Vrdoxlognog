export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Загрузка"
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

type BadgeTone = "moss" | "brass" | "ink" | "danger";

const BADGE_TONES: Record<BadgeTone, string> = {
  moss: "bg-moss/15 text-moss-deep",
  brass: "bg-brass/15 text-brass-deep",
  ink: "bg-ink/10 text-ink-soft",
  danger: "bg-danger/15 text-danger",
};

export function Badge({ tone = "ink", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-line px-6 py-16 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-sm border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
      {message}
    </div>
  );
}
