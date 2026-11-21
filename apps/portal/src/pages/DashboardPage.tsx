import { IconAlert, IconArrival, IconBars, IconArrowRight, IconCalendar, IconChevronRight, IconClock, IconEnter, IconExit, IconFlow, IconPeople, IconShieldAlert, IconShieldCheck, IconSwap, type IconComponent } from '@/components/icons';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useMe } from '@/auth/AuthProvider';
import { MovementsChart } from '@/components/charts/MovementsChart';
import { StepSegments } from '@/components/flow/RunTimeline';
import { Badge, EmployeeStatusBadge, RunStatusBadge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState, ErrorState, PageHeader, Panel, Skeleton } from '@/components/ui/Feedback';
import { CountUp, Reveal } from '@/components/ui/Motion';
import { useDashboard } from '@/hooks/queries';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useOriginState } from '@/hooks/useOrigin';
import { cn } from '@/lib/cn';
import { trackSpotlight } from '@/lib/spotlight';
import { formatDate, formatDateLong, formatDuration, formatRelative, formatTime } from '@/lib/format';
import { CONTRACT_LABEL, RUN_TYPE } from '@/lib/labels';
import { EASE_OUT } from '@/lib/motion';
import type { AgendaItem, DashboardSummary, EmployeeStatus } from '@/lib/types';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const KIND = {
  ARRIVAL: { label: 'Arrivée', icon: IconEnter, className: 'text-success' },
  MOBILITY: { label: 'Mobilité', icon: IconSwap, className: 'text-info' },
  DEPARTURE: { label: 'Départ', icon: IconExit, className: 'text-danger' },
} as const;

/** Salutation selon l'heure locale. */
function greeting(): string {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 4 ? 'Bonsoir' : 'Bonjour';
}

function dayLabel(date: Date): string {
  const today = new Date();
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((startOf(date) - startOf(today)) / 86_400_000);
  if (diff === 0) return 'Aujourd’hui';
  if (diff === 1) return 'Demain';
  return capitalize(formatDateLong(date));
}

/** Indicateur clé : carte de verre cliquable, pictogramme, valeur qui s'incrémente, halo au survol. */
function Kpi({ label, value, hint, icon: Icon, to, tone }: { label: string; value: ReactNode; hint: string; icon: IconComponent; to?: string; tone: string }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className={cn('flex size-10 items-center justify-center rounded-xl bg-hover transition-transform duration-300 group-hover:scale-110', tone)}>
          <Icon className="size-5" />
        </span>
        {to ? <IconArrowRight className="size-4 -translate-x-1 text-ink-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" /> : null}
      </div>
      <p className="mt-4 text-[28px] font-extrabold leading-none tracking-[-0.03em] text-ink">{value}</p>
      <p className="mt-1.5 text-[13px] font-semibold text-ink-2">{label}</p>
      <p className="mt-0.5 text-xs text-ink-3">{hint}</p>
    </>
  );
  const className = 'glass spotlight group flex h-full flex-col rounded-[var(--radius-panel)] p-4 transition-transform duration-300 hover:-translate-y-0.5';
  return (
    <li className="min-w-0">
      {to ? (
        <Link to={to} className={className} onPointerMove={trackSpotlight}>
          {body}
        </Link>
      ) : (
        <div className={className} onPointerMove={trackSpotlight}>
          {body}
        </div>
      )}
    </li>
  );
}

function Kpis({ kpis }: { kpis: DashboardSummary['kpis'] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6" aria-label="Indicateurs clés">
      <Kpi label="Employés actifs" value={<CountUp value={kpis.activeEmployees} />} hint="Accès ouverts et conformes au profil" icon={IconPeople} to="/employes?statut=active" tone="text-brand" />
      <Kpi
        label="Exécutions en cours"
        value={<CountUp value={kpis.runsInProgress} />}
        hint={kpis.runsInProgress ? 'Suivies en direct' : 'Aucun workflow actif'}
        icon={IconFlow}
        to="/executions?status=QUEUED,RUNNING"
        tone="text-info"
      />
      <Kpi label="Arrivées planifiées" value={<CountUp value={kpis.scheduledArrivals} />} hint="Comptes créés la veille" icon={IconEnter} to="/employes?statut=incoming" tone="text-success" />
      <Kpi label="Départs planifiés" value={<CountUp value={kpis.scheduledDepartures} />} hint="Révocation programmée" icon={IconExit} to="/employes?statut=leaving" tone="text-warning" />
      <Kpi label="Accès révoqués" value={<CountUp value={kpis.revokedThisMonth} />} hint="Ce mois-ci" icon={IconShieldAlert} to="/executions?type=OFFBOARDING" tone="text-danger" />
      <Kpi label="Délai de création" value={<span className="tabular">{formatDuration(kpis.avgProvisioningSeconds)}</span>} hint="Moyenne, de la demande aux accès" icon={IconClock} tone="text-accent" />
    </ul>
  );
}

/** Jauge circulaire de conformité : l'arc se remplit jusqu'au taux de comptes conformes. */
function ComplianceGauge({ compliant, total }: { compliant: number; total: number }) {
  const reduced = useReducedMotion();
  const ratio = total ? compliant / total : 0;
  const r = 30;
  const c = 2 * Math.PI * r;
  const ok = ratio === 1;
  return (
    <div className="relative size-[84px] shrink-0" aria-hidden="true">
      <svg viewBox="0 0 76 76" className="size-full -rotate-90">
        <defs>
          <linearGradient id="tp-gauge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--tp-brand)" />
            <stop offset="1" stopColor={ok ? 'var(--tp-brand)' : 'var(--tp-accent)'} />
          </linearGradient>
        </defs>
        <circle cx="38" cy="38" r={r} fill="none" stroke="var(--tp-hover)" strokeWidth="8" />
        <motion.circle
          cx="38"
          cy="38"
          r={r}
          fill="none"
          stroke="url(#tp-gauge)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={reduced ? false : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - ratio) }}
          transition={{ duration: 1, ease: EASE_OUT }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[17px] font-extrabold tabular tracking-[-0.02em]">{Math.round(ratio * 100)} %</span>
    </div>
  );
}

function Agenda({ items }: { items: AgendaItem[] }) {
  const linkState = useOriginState('Vue d’ensemble');
  if (items.length === 0) {
    return (
      <EmptyState icon={<IconCalendar className="size-5" aria-hidden="true" />} title="Aucun mouvement prévu">
        Les arrivées, mobilités et départs planifiés sur 45 jours apparaîtront ici.
      </EmptyState>
    );
  }
  const groups = new Map<string, AgendaItem[]>();
  for (const item of items) {
    const key = new Date(item.date).toDateString();
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  let index = 0;
  return (
    <div className="-mx-4 -my-4">
      {[...groups.entries()].map(([key, group]) => (
        <section key={key} aria-label={dayLabel(new Date(group[0].date))}>
          <h3 className="bg-hover px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{dayLabel(new Date(group[0].date))}</h3>
          <ul className="divide-y divide-line">
            {group.map((item) => {
              const kind = KIND[item.kind];
              return (
                <li key={`${item.kind}-${item.employeeId}-${item.runId ?? ''}`}>
                  <Reveal index={index++}>
                    <Link to={`/employes/${item.employeeId}`} state={linkState} className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-hover">
                      <kind.icon className={cn('size-4 shrink-0', kind.className)} aria-hidden="true" />
                      <span className="w-16 shrink-0 text-xs text-ink-3">
                        {kind.label}
                        {item.kind !== 'ARRIVAL' ? <span className="block tabular">{formatTime(item.date)}</span> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{item.name}</span>
                        <span className="block truncate text-xs text-ink-3">
                          {item.jobTitle} · {item.department}
                        </span>
                      </span>
                      <span className="hidden items-center gap-1.5 text-xs text-ink-3 md:flex">
                        <span className="size-2 rounded-[2px]" style={{ background: item.profile.color }} aria-hidden="true" />
                        {item.profile.name}
                      </span>
                      <span className="hidden sm:contents">
                        {item.kind === 'ARRIVAL' ? <EmployeeStatusBadge status={item.status as EmployeeStatus} /> : <RunStatusBadge status="SCHEDULED" />}
                      </span>
                      <IconChevronRight className="size-4 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const me = useMe();
  const { data, isPending, error, refetch } = useDashboard();
  useDocumentTitle('Vue d’ensemble');
  const linkState = useOriginState('Vue d’ensemble');

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={`${greeting()}, ${(me.name ?? me.username).split(' ')[0]}`}
        title="Vue d’ensemble"
        description={`${capitalize(formatDateLong(new Date()))} · mouvements de personnel et état des accès`}
        actions={
          me.permissions.manageEmployees ? (
            <ButtonLink to="/arrivees/nouvelle" variant="primary" icon={<IconArrival className="size-4" aria-hidden="true" />}>
              Déclarer une arrivée
            </ButtonLink>
          ) : null
        }
      />

      {error ? <ErrorState error={error} onRetry={() => void refetch()} /> : null}

      {isPending ? (
        <div className="space-y-5">
          <Skeleton className="h-[74px]" />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      ) : data ? (
        <>
          <Kpis kpis={data.kpis} />

          {data.kpis.needsAttention > 0 ? (
            <Link
              to="/executions?status=FAILED,PARTIAL,TIMED_OUT"
              className="flex items-center gap-3 glass rounded-[var(--radius-panel)] px-4 py-3 text-sm transition-colors hover:bg-hover"
            >
              <IconAlert className="size-4 shrink-0 text-warning" aria-hidden="true" />
              <span className="flex-1">
                <span className="font-medium">
                  {data.kpis.needsAttention} exécution{data.kpis.needsAttention > 1 ? 's' : ''} à traiter
                </span>
                <span className="text-ink-3"> : des accès n’ont pas pu être accordés ou révoqués. Vérifiez puis relancez.</span>
              </span>
              <IconChevronRight className="size-4 text-ink-3" aria-hidden="true" />
            </Link>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <Panel title="Agenda des mouvements" description="45 prochains jours" id="agenda" icon={<IconCalendar />}>
              <Agenda items={data.agenda} />
            </Panel>

            <div className="space-y-5">
              <Panel
                title="Conformité des accès"
                id="compliance"
                icon={<IconShieldCheck />}
                actions={
                  me.permissions.viewAudit ? (
                    <Link to="/conformite" className="text-[13px] font-medium text-info hover:underline">
                      Détails
                    </Link>
                  ) : null
                }
              >
                {data.compliance.total === 0 ? (
                  <p className="text-[13px] text-ink-3">
                    {data.compliance.enabled
                      ? 'Aucun contrôle effectué pour l’instant. Un contrôle automatique a lieu chaque nuit.'
                      : 'Contrôle désactivé : compte de service d’audit non configuré.'}
                  </p>
                ) : (
                  <div className="flex items-center gap-4">
                    <ComplianceGauge compliant={data.compliance.counts.COMPLIANT} total={data.compliance.total} />
                    <div className="min-w-0 space-y-2">
                      <p className="text-sm">
                        <span className="font-bold tabular">{data.compliance.counts.COMPLIANT}</span>
                        <span className="text-ink-2"> / {data.compliance.total} comptes conformes</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {data.compliance.counts.DRIFT ? (
                          <Badge tone="danger">
                            {data.compliance.counts.DRIFT} écart{data.compliance.counts.DRIFT > 1 ? 's' : ''}
                          </Badge>
                        ) : null}
                        {data.compliance.counts.NO_ACCOUNT ? (
                          <Badge tone="warning">
                            {data.compliance.counts.NO_ACCOUNT} compte{data.compliance.counts.NO_ACCOUNT > 1 ? 's' : ''} manquant
                            {data.compliance.counts.NO_ACCOUNT > 1 ? 's' : ''}
                          </Badge>
                        ) : null}
                        {!data.compliance.counts.DRIFT && !data.compliance.counts.NO_ACCOUNT ? <Badge tone="success">Aucun écart</Badge> : null}
                      </div>
                      <p className="text-xs text-ink-3">Dernier contrôle {formatRelative(data.compliance.lastCheckAt)}</p>
                    </div>
                  </div>
                )}
              </Panel>

              <Panel
                title="Exécutions récentes"
                id="recent-runs"
                icon={<IconFlow />}
                bodyClassName="p-0"
                actions={
                  <Link to="/executions" className="text-[13px] font-medium text-info hover:underline">
                    Tout voir
                  </Link>
                }
              >
                {data.recentRuns.length === 0 ? (
                  <EmptyState title="Aucune exécution">Les workflows apparaîtront après la première arrivée.</EmptyState>
                ) : (
                  <ul className="divide-y divide-line">
                    {data.recentRuns.map((run, i) => (
                      <li key={run.id}>
                        <Reveal index={i}>
                          <Link to={`/executions/${run.id}`} state={linkState} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-hover">
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {run.employee.firstName} {run.employee.lastName}
                              </span>
                              <span className="block text-xs text-ink-3">
                                {RUN_TYPE[run.type]} · {formatRelative(run.createdAt)}
                              </span>
                            </span>
                            <span className="flex flex-col items-end gap-1.5">
                              <RunStatusBadge status={run.status} />
                              <StepSegments total={run.progress.total} done={run.progress.done} failed={run.failedSteps} running={run.status === 'RUNNING'} />
                            </span>
                          </Link>
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <Panel title="Arrivées et départs" description="Par mois, sur six mois" id="chart" icon={<IconBars />}>
              <MovementsChart data={data.monthly} />
            </Panel>
            <Panel title="Fins de contrat" description="Sous 30 jours, sans révocation planifiée" id="contracts" bodyClassName="p-0" icon={<IconClock />}>
              {data.contractsEnding.length === 0 ? (
                <EmptyState title="Rien à planifier">Aucun CDD ni stage ne se termine sans départ planifié.</EmptyState>
              ) : (
                <ul className="divide-y divide-line">
                  {data.contractsEnding.map((contract) => (
                    <li key={contract.employeeId} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{contract.name}</span>
                        <span className="block text-xs text-ink-3">
                          {CONTRACT_LABEL[contract.contractType]} jusqu’au {formatDate(contract.endDate)}
                        </span>
                      </span>
                      <Link to={`/employes/${contract.employeeId}?depart=1`} state={linkState} className="text-[13px] font-medium text-info hover:underline">
                        Planifier
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </>
      ) : null}
    </div>
  );
}
