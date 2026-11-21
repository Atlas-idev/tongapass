import { cn } from '@/lib/cn';

/**
 * Marque TongaPass « le Seuil » : une porte en arche entrouverte. Au centre, une silhouette
 * qui est aussi un trou de serrure : la personne et son accès, d'un seul signe.
 * Aplat cacao, tracé ivoire ; aucun dégradé.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('size-8 shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect x="1" y="1" width="30" height="30" rx="7" fill="#77574A" />
      <path d="M9 25.5V14.5A6.5 6.5 0 0 1 15.2 8" fill="none" stroke="#F9F2E4" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17.6 8.3A6.5 6.5 0 0 1 22.5 14.5v11" fill="none" stroke="#D0AE92" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="15.8" cy="15.2" r="2.6" fill="#F9F2E4" />
      <path d="M14.3 17.4h3l1.15 5.8h-5.3z" fill="#F9F2E4" />
    </svg>
  );
}

/** Mot-symbole : « Tonga » à l'encre, « Pass » en cacao. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('text-[16px] font-bold tracking-[-0.01em] text-ink', className)} translate="no">
      Tonga<span className="text-brand">Pass</span>
    </span>
  );
}

export function Logo({ className, compact = false, subtitle }: { className?: string; compact?: boolean; subtitle?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      {compact ? null : (
        <span className="flex flex-col leading-tight">
          <Wordmark />
          {subtitle ? <span className="text-xs text-ink-3">{subtitle}</span> : null}
        </span>
      )}
    </span>
  );
}
