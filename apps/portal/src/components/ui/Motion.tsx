import { animate, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DURATION, EASE_OUT, STAGGER } from '@/lib/motion';

/** Entrée de page : fondu et léger glissement (6 px). */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.base, ease: EASE_OUT }}>
      {children}
    </motion.div>
  );
}

/**
 * Apparition décalée des éléments d'une liste au premier affichage (30 ms par élément, plafonnée
 * au 6e) : toute la liste atteint son opacité finale en moins de 0,4 s.
 */
export function Reveal({ index = 0, children, className }: { index?: number; children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, delay: Math.min(index, 6) * STAGGER, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Nombre qui s'incrémente jusqu'à sa valeur (700 ms), une seule fois par changement de valeur. */
export function CountUp({ value, format = (n: number) => n.toLocaleString('fr-FR') }: { value: number; format?: (n: number) => string }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  const previous = useRef(reduced ? value : 0);
  useEffect(() => {
    if (reduced) {
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 0.7,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduced]);
  return <span className="tabular">{format(reduced ? value : display)}</span>;
}

/**
 * Barre de progression. Le remplissage glisse par « scaleX » (composité par le GPU)
 * plutôt que par sa largeur, qui forcerait un recalcul de mise en page à chaque image.
 */
export function ProgressBar({
  value,
  tone = 'success',
  label,
  live = false,
}: {
  value: number;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'brand';
  label: string;
  /** Rayures qui défilent : le travail est en cours. */
  live?: boolean;
}) {
  const color = { success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger', info: 'bg-info', brand: 'bg-gradient-button' }[tone];
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-hover" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <motion.div
        className={`h-full w-full origin-left rounded-full ${color} ${live ? 'progress-stripes' : ''}`}
        initial={false}
        animate={{ scaleX: Math.max(0, Math.min(100, value)) / 100 }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      />
    </div>
  );
}

/** Horloge qui avance chaque seconde (fuseau du navigateur), pour l'ambiance « poste de travail ». */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <time dateTime={now.toISOString()} className={`tabular ${className ?? ''}`} suppressHydrationWarning>
      {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </time>
  );
}
