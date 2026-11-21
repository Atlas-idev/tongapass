import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Popover } from 'radix-ui';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { IconFlow, IconPerson, IconPulse, IconShieldCheck, type IconComponent } from '@/components/icons';
import { useLive, type LiveEntry } from '@/hooks/useLiveEvents';
import { cn } from '@/lib/cn';
import { formatRelative } from '@/lib/format';
import { EMPLOYEE_STATUS, RUN_STATUS, STEP_STATUS, SYSTEM_LABEL, TONE_TEXT, type Tone } from '@/lib/labels';
import type { EmployeeStatus, RunStatus, StepStatus, StepSystem } from '@/lib/types';

/* ------------------------------------------------------------------ Pouls */

const SAMPLES = 26;
const STEP = 4;
const TICK_MS = 800;

/** Tracé type électrocardiogramme : un battement par lot d'événements reçus pendant l'intervalle. */
function pulsePath(samples: number[]): string {
  const base = 11;
  let d = `M0 ${base}`;
  samples.forEach((value, index) => {
    const x = index * STEP + STEP / 2;
    if (value > 0.3) {
      d += ` L${x - 1.6} ${base} L${x - 0.6} ${base - 9 * value} L${x + 0.6} ${base + 4 * value} L${x + 1.6} ${base}`;
    } else {
      d += ` L${x} ${base - value * 6}`;
    }
  });
  return `${d} L${SAMPLES * STEP} ${base}`;
}

/**
 * Pouls du flux temps réel : la ligne défile en continu et bat à chaque événement SSE reçu
 * (étape n8n validée, exécution terminée…). Figée si l'utilisateur réduit les animations.
 */
export function Heartbeat({ connected }: { connected: boolean }) {
  const { events } = useLive();
  const reduced = useReducedMotion();
  const latestSeq = events[0]?.seq ?? 0;
  const [samples, setSamples] = useState<number[]>(() => Array.from({ length: SAMPLES }, () => 0));
  const [tick, setTick] = useState(0);
  const seen = useRef(latestSeq);
  const latest = useRef(latestSeq);

  useEffect(() => {
    latest.current = latestSeq;
  }, [latestSeq]);

  useEffect(() => {
    if (reduced || !connected) return;
    const timer = window.setInterval(() => {
      const fresh = latest.current - seen.current;
      seen.current = latest.current;
      setSamples((previous) => [...previous.slice(1), fresh > 0 ? Math.min(1, 0.6 + fresh * 0.15) : Math.random() * 0.12]);
      setTick((value) => value + 1);
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [reduced, connected]);

  return (
    <svg viewBox={`0 0 ${(SAMPLES - 1) * STEP} 22`} className="h-5 w-[92px] overflow-hidden" aria-hidden="true">
      <defs>
        <linearGradient id="tp-heartbeat" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset=".35" stopColor="currentColor" stopOpacity=".55" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <g key={tick} style={reduced || !connected ? undefined : { animation: `hb-shift ${TICK_MS}ms linear` }}>
        <path d={pulsePath(samples)} fill="none" stroke="url(#tp-heartbeat)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ Fil d'activité */

interface Described {
  icon: IconComponent;
  title: string;
  detail: string;
  tone: Tone;
  to: string | null;
}

/** Traduit un événement SSE brut en phrase lisible. */
function describe(event: LiveEntry): Described {
  const data = event.data as {
    runId?: string;
    employeeId?: string;
    status?: string;
    step?: string;
    detail?: string | null;
    scope?: string;
  };
  const to = data.runId ? `/executions/${data.runId}` : data.employeeId ? `/employes/${data.employeeId}` : null;
  if (event.type === 'step.updated') {
    const system = (data.step?.split('.')[0] ?? 'core') as StepSystem;
    const status = STEP_STATUS[(data.status ?? 'RUNNING') as StepStatus] ?? STEP_STATUS.RUNNING;
    return {
      icon: IconFlow,
      title: `Étape ${SYSTEM_LABEL[system] ?? system} · ${status.label.toLowerCase()}`,
      detail: data.detail || `Signal reçu de n8n (${data.step ?? 'étape'})`,
      tone: status.tone,
      to,
    };
  }
  if (event.type === 'run.updated') {
    const status = RUN_STATUS[(data.status ?? 'RUNNING') as RunStatus] ?? RUN_STATUS.RUNNING;
    return { icon: IconFlow, title: `Exécution ${status.label.toLowerCase()}`, detail: 'Workflow mis à jour par n8n', tone: status.tone, to };
  }
  if (event.type === 'employee.updated' && data.scope === 'compliance') {
    return { icon: IconShieldCheck, title: 'Contrôle de conformité', detail: 'Résultats mis à jour', tone: 'brand', to: '/conformite' };
  }
  const status = data.status ? EMPLOYEE_STATUS[data.status as EmployeeStatus] : undefined;
  return {
    icon: IconPerson,
    title: status ? `Fiche : ${status.label.toLowerCase()}` : 'Fiche employé mise à jour',
    detail: 'Cycle de vie de l’employé',
    tone: status?.tone ?? 'neutral',
    to,
  };
}

/** Bouton « activité en direct » de la barre supérieure : compteur de nouveautés et fil des derniers événements. */
export function LiveActivity() {
  const { events, unread, markRead, connected } = useLive();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) markRead();
      }}
    >
      <Popover.Trigger
        className="relative inline-flex size-9 items-center justify-center rounded-xl text-ink-3 transition-colors hover:bg-hover hover:text-ink"
        aria-label={unread ? `Activité en direct, ${unread} nouveauté${unread > 1 ? 's' : ''}` : 'Activité en direct'}
        title="Activité en direct"
      >
        <IconPulse className="size-[19px]" />
        <AnimatePresence>
          {unread > 0 ? (
            <motion.span
              key={unread}
              initial={reduced ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 24 }}
              className="bg-gradient-button absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-on-brand ring-2 ring-[var(--tp-solid)]"
              aria-hidden="true"
            >
              {unread > 9 ? '9+' : unread}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={10} collisionPadding={12} className="glass-strong z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl" aria-label="Activité en direct">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Activité en direct</p>
              <p className="text-xs text-ink-3">Signaux n8n et mises à jour, sans rechargement</p>
            </div>
            <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', connected ? 'text-success' : 'text-ink-3')}>
              <span className={cn(connected ? 'live-dot size-1.5' : 'size-1.5 rounded-full bg-ink-3')} aria-hidden="true" />
              {connected ? 'En direct' : 'Hors ligne'}
            </span>
          </div>
          {events.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <IconPulse className="mx-auto size-7 text-brand" />
              <p className="mt-2 text-sm font-medium">Tout est calme</p>
              <p className="mt-1 text-[13px] text-ink-3">Chaque étape exécutée par n8n apparaîtra ici dès sa réception.</p>
            </div>
          ) : (
            <ol className="max-h-[min(60vh,420px)] divide-y divide-line overflow-y-auto">
              <AnimatePresence initial={false}>
                {events.map((event) => {
                  const item = describe(event);
                  const body = (
                    <>
                      <span className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-hover', TONE_TEXT[item.tone])}>
                        <item.icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-ink">{item.title}</span>
                        <span className="block truncate text-xs text-ink-3">{item.detail}</span>
                      </span>
                      <span className="shrink-0 pt-0.5 text-[11px] tabular text-ink-3">{formatRelative(event.at)}</span>
                    </>
                  );
                  return (
                    <motion.li
                      key={event.seq}
                      layout={!reduced}
                      initial={reduced ? false : { opacity: 0, y: -8, backgroundColor: 'var(--tp-brand-soft)' }}
                      animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      {item.to ? (
                        <Popover.Close asChild>
                          <Link to={item.to} className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-hover">
                            {body}
                          </Link>
                        </Popover.Close>
                      ) : (
                        <div className="flex items-start gap-3 px-4 py-2.5">{body}</div>
                      )}
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
