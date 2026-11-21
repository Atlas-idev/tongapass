import { Popover } from 'radix-ui';
import { useState } from 'react';
import { Link } from 'react-router';
import { IconFlow, IconPerson, IconPulse, IconShieldCheck, type IconComponent } from '@/components/icons';
import { useLive, type LiveEntry } from '@/hooks/useLiveEvents';
import { cn } from '@/lib/cn';
import { formatRelative } from '@/lib/format';
import { EMPLOYEE_STATUS, RUN_STATUS, STEP_STATUS, SYSTEM_LABEL, TONE_TEXT, type Tone } from '@/lib/labels';
import type { EmployeeStatus, RunStatus, StepStatus, StepSystem } from '@/lib/types';

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
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) markRead();
      }}
    >
      <Popover.Trigger
        className="relative inline-flex size-9 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-hover hover:text-ink"
        aria-label={unread ? `Activité en direct, ${unread} nouveauté${unread > 1 ? 's' : ''}` : 'Activité en direct'}
        title="Activité en direct"
      >
        <IconPulse className="size-[18px]" />
        {unread > 0 ? (
          <span
            className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-on-brand ring-2 ring-[var(--tp-canvas)]"
            aria-hidden="true"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={10} collisionPadding={12} className="panel-raised z-50 w-[min(92vw,380px)] overflow-hidden rounded-lg" aria-label="Activité en direct">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Activité en direct</p>
              <p className="text-xs text-ink-3">Derniers événements reçus de n8n et de l’API</p>
            </div>
            <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', connected ? 'text-success' : 'text-ink-3')}>
              <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
              {connected ? 'En direct' : 'Hors ligne'}
            </span>
          </div>
          {events.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-medium">Aucun événement pour l’instant</p>
              <p className="mt-1 text-[13px] text-ink-3">Les étapes exécutées par n8n s’afficheront ici.</p>
            </div>
          ) : (
            <ol className="max-h-[min(60vh,420px)] divide-y divide-line overflow-y-auto">
              {events.map((event) => {
                  const item = describe(event);
                  const body = (
                    <>
                      <span className={cn('mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-hover', TONE_TEXT[item.tone])}>
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
                    <li key={event.seq}>
                      {item.to ? (
                        <Popover.Close asChild>
                          <Link to={item.to} className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-hover">
                            {body}
                          </Link>
                        </Popover.Close>
                      ) : (
                        <div className="flex items-start gap-3 px-4 py-2.5">{body}</div>
                      )}
                    </li>
                  );
                })}
            </ol>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
