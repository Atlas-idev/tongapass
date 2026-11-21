import { useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Marque TongaPass « le Seuil » : une porte en arche entrouverte. Le battant gauche est plein,
 * le droit est en verre (translucide) et s'écarte en haut : le passage s'ouvre. Au centre,
 * une silhouette qui est aussi un trou de serrure : la personne et son accès, d'un seul signe.
 * Tuile en dégradé lagon → indigo, reflet de verre en haut.
 */
export function LogoMark({ className, title, animated = false }: { className?: string; title?: string; animated?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const tile = `tp-tile-${uid}`;
  const gloss = `tp-gloss-${uid}`;
  const door = `tp-door-${uid}`;
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('size-8 shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={tile} x1="3" y1="1" x2="29" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#19c2ad" />
          <stop offset=".5" stopColor="#0e8a98" />
          <stop offset="1" stopColor="#5653d4" />
        </linearGradient>
        <linearGradient id={gloss} x1="16" y1="1" x2="16" y2="17" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".34" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={door} x1="16" y1="8" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".3" />
          <stop offset="1" stopColor="#fff" stopOpacity=".04" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9.5" fill={`url(#${tile})`} />
      <rect x="1" y="1" width="30" height="30" rx="9.5" fill={`url(#${gloss})`} />
      <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="none" stroke="#fff" strokeOpacity=".22" />
      {/* Lumière qui passe par la porte */}
      <path d="M9 25.5V14.5A6.75 6.75 0 0 1 22.5 14.5v11z" fill={`url(#${door})`} />
      <path d="M9 25.5V14.5A6.5 6.5 0 0 1 15.2 8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M17.6 8.3A6.5 6.5 0 0 1 22.5 14.5v11"
        fill="none"
        stroke="#fff"
        strokeOpacity=".62"
        strokeWidth="2.4"
        strokeLinecap="round"
        className={animated ? 'motion-safe:animate-[door-swing_2.4s_ease-in-out_infinite]' : undefined}
      />
      <circle cx="15.8" cy="15.2" r="2.6" fill="#fff" />
      <path d="M14.3 17.4h3l1.15 5.8h-5.3z" fill="#fff" />
    </svg>
  );
}

/** Mot-symbole : « Tonga » à l'encre, « Pass » en dégradé de marque. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('text-[16px] font-bold tracking-[-0.025em] text-ink', className)} translate="no">
      Tonga<span className="text-gradient">Pass</span>
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
