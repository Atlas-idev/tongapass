import { IconCheck, IconClose, IconMinus } from '@/components/icons';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';
import { durationBetween, formatDuration, formatTime } from '@/lib/format';
import { STEP_STATUS, SYSTEM_LABEL } from '@/lib/labels';
import type { StepStatus, WorkflowStep } from '@/lib/types';
import { SystemIcon } from './SystemIcon';

const NODE: Record<StepStatus, string> = {
  PENDING: 'border border-line-strong bg-surface text-ink-3',
  RUNNING: 'border border-info/60 bg-info-soft text-info shadow-[0_0_0_4px_var(--tp-info-soft)]',
  SUCCEEDED: 'bg-gradient-button text-on-brand shadow-[0_6px_14px_-6px_var(--tp-brand)]',
  FAILED: 'bg-danger text-white shadow-[0_6px_14px_-6px_var(--tp-danger)] dark:text-[#2a0710]',
  SKIPPED: 'border border-dashed border-line-strong bg-hover text-ink-3',
};

function NodeIcon({ step }: { step: WorkflowStep }) {
  if (step.status === 'SUCCEEDED') return <IconCheck className="size-3.5" strokeWidth={3} />;
  if (step.status === 'FAILED') return <IconClose className="size-3.5" strokeWidth={3} />;
  if (step.status === 'SKIPPED') return <IconMinus className="size-3.5" />;
  return <SystemIcon system={step.system} className="size-3.5" />;
}

/** Frise verticale d'une exécution : chaque étape se valide au signal de n8n, la liaison se remplit. */
export function RunTimeline({ steps }: { steps: WorkflowStep[] }) {
  const reduced = useReducedMotion();
  return (
    <ol className="relative" aria-label="Étapes du workflow">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        const finished = step.status !== 'PENDING' && step.status !== 'RUNNING';
        const duration = durationBetween(step.startedAt, step.finishedAt);
        return (
          <li key={step.key} className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3.5 pb-5 last:pb-0">
            {!last ? (
              <span className="absolute left-3.5 top-8 bottom-0.5 w-0.5 -translate-x-1/2 rounded-full bg-line" aria-hidden="true">
                <motion.span
                  className="block h-full w-full origin-top rounded-full bg-[linear-gradient(var(--tp-brand),var(--tp-accent))]"
                  initial={false}
                  animate={{ scaleY: finished && step.status !== 'SKIPPED' ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                />
              </span>
            ) : null}
            <motion.span
              key={step.status}
              initial={reduced ? false : { scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn('relative z-[1] mt-0.5 flex size-7 items-center justify-center rounded-[10px]', NODE[step.status])}
            >
              <NodeIcon step={step} />
              {step.status === 'RUNNING' ? (
                <span className="absolute -inset-1 rounded-xl ring-2 ring-info/40" style={{ animation: 'ring-pulse 1.6s var(--ease-out) infinite' }} aria-hidden="true" />
              ) : null}
            </motion.span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={cn('text-sm font-semibold', step.status === 'SKIPPED' ? 'text-ink-3' : 'text-ink')}>
                  {step.label}
                  {step.critical ? (
                    <span className="ml-2 rounded-md bg-hover px-1.5 py-0.5 text-[11px] font-medium text-ink-3" title="Une étape critique en échec bloque le workflow">
                      critique
                    </span>
                  ) : null}
                </p>
                <p className="text-xs tabular text-ink-3">
                  {step.finishedAt ? formatTime(step.finishedAt) : step.status === 'RUNNING' ? 'en cours…' : ''}
                  {duration !== null && duration >= 1 ? ` · ${formatDuration(duration)}` : ''}
                </p>
              </div>
              <p className="text-xs text-ink-3">
                <span translate="no">{SYSTEM_LABEL[step.system]}</span> · {STEP_STATUS[step.status].label}
              </p>
              {step.detail ? (
                <p className={cn('mt-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] leading-relaxed', step.status === 'FAILED' ? 'border-danger/25 bg-danger-soft text-danger' : 'border-line bg-hover text-ink-2')}>{step.detail}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Version compacte : un segment par étape, pour les listes. */
export function StepSegments({ total, done, failed, running }: { total: number; done: number; failed: number; running: boolean }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${done} étape(s) sur ${total} terminée(s)${failed ? `, ${failed} en échec` : ''}`}>
      {Array.from({ length: total }, (_, i) => {
        const tone = i < done - failed ? 'bg-gradient-button' : i < done ? 'bg-danger' : running && i === done ? 'bg-info progress-stripes' : 'bg-line-strong';
        return (
          <span
            key={i}
            className={cn('h-1.5 w-4 rounded-full transition-colors duration-500', tone)}
            style={running && i === done ? { animation: 'pulse-dot 1.4s ease-in-out infinite' } : undefined}
          />
        );
      })}
    </span>
  );
}
