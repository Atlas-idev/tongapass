import { useReducedMotion } from 'motion/react';
import { useId } from 'react';
import { IconAutomation, IconBranch, IconChat, IconKey, IconLayers, IconLedger, IconMail, IconPeople, type IconComponent } from '@/components/icons';

interface Node {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  icon: IconComponent;
  accent?: boolean;
}

const NODES: Record<string, Node> = {
  rh: { x: 8, y: 150, w: 160, h: 78, title: 'Équipe RH', sub: 'Portail React', icon: IconPeople },
  api: { x: 262, y: 150, w: 186, h: 78, title: 'API TongaPass', sub: 'NestJS · OpenAPI', icon: IconLayers, accent: true },
  db: { x: 262, y: 292, w: 186, h: 66, title: 'PostgreSQL', sub: 'audit chaîné SHA-256', icon: IconLedger },
  n8n: { x: 548, y: 150, w: 160, h: 78, title: 'n8n', sub: '4 workflows', icon: IconAutomation, accent: true },
  kc: { x: 786, y: 14, w: 206, h: 62, title: 'Keycloak', sub: 'compte, rôles, sessions', icon: IconKey },
  gitea: { x: 786, y: 104, w: 206, h: 62, title: 'Gitea', sub: 'compte et équipes', icon: IconBranch },
  chat: { x: 786, y: 194, w: 206, h: 62, title: 'Mattermost', sub: 'canaux, ~bienvenue', icon: IconChat },
  smtp: { x: 786, y: 284, w: 206, h: 62, title: 'SMTP', sub: 'bienvenue, récapitulatifs', icon: IconMail },
};

/** Liaisons du schéma, dans le sens du flux ; « back » = rappel de n8n vers l'API. */
const EDGES = [
  { id: 'rh-api', d: 'M168 189 H262', label: 'OIDC + PKCE', lx: 215, ly: 178 },
  { id: 'api-n8n', d: 'M448 178 H548', label: 'webhook + jeton', lx: 498, ly: 168 },
  { id: 'n8n-api', d: 'M548 202 H448', label: 'rappels HMAC', lx: 498, ly: 220, back: true },
  { id: 'api-db', d: 'M355 228 V292' },
  { id: 'n8n-kc', d: 'M708 189 C748 189 748 45 786 45' },
  { id: 'n8n-gitea', d: 'M708 189 C748 189 748 135 786 135' },
  { id: 'n8n-chat', d: 'M708 189 C748 189 748 225 786 225' },
  { id: 'n8n-smtp', d: 'M708 189 C748 189 748 315 786 315' },
] as const;

/**
 * Schéma d'architecture animé : des paquets lumineux circulent du portail vers l'API, puis de
 * n8n vers chaque outil, et les rappels signés reviennent vers l'API. Avec les animations
 * réduites, le schéma reste fixe (seuls les tracés sont affichés).
 */
export function FlowDiagram() {
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const pathId = (id: string) => `${uid}-${id}`;
  return (
    <svg viewBox="0 0 1000 372" className="h-auto w-full" role="img" aria-labelledby={`${uid}-title`}>
      <title id={`${uid}-title`}>
        Architecture : le portail RH appelle l’API TongaPass, qui déclenche n8n ; n8n crée ou révoque les accès dans Keycloak, Gitea,
        Mattermost et par e-mail, puis renvoie à l’API des rappels signés. L’API journalise tout dans PostgreSQL.
      </title>
      <defs>
        <linearGradient id={`${uid}-accent`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--tp-brand)" />
          <stop offset="1" stopColor="var(--tp-accent)" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor="var(--tp-brand)" stopOpacity=".9" />
          <stop offset="1" stopColor="var(--tp-brand)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {EDGES.map((edge) => (
        <g key={edge.id}>
          <path id={pathId(edge.id)} d={edge.d} fill="none" stroke="var(--tp-line-strong)" strokeWidth="1.5" />
          <path
            d={edge.d}
            fill="none"
            stroke={'back' in edge ? 'var(--tp-accent)' : 'var(--tp-brand)'}
            strokeWidth="1.5"
            strokeOpacity=".75"
            className={reduced ? undefined : 'flow-dash'}
            strokeDasharray={reduced ? '4 6' : undefined}
          />
          {'label' in edge ? (
            <text x={edge.lx} y={edge.ly} textAnchor="middle" className="fill-ink-3 text-[11px] font-medium">
              {edge.label}
            </text>
          ) : null}
          {reduced ? null : (
            <circle r="4.5" fill={'back' in edge ? 'var(--tp-accent)' : 'var(--tp-brand)'}>
              <animateMotion dur={edge.id.startsWith('n8n-') && edge.id !== 'n8n-api' ? '2.2s' : '1.8s'} repeatCount="indefinite" begin={`${(EDGES.indexOf(edge) % 4) * 0.35}s`}>
                <mpath href={`#${pathId(edge.id)}`} />
              </animateMotion>
            </circle>
          )}
        </g>
      ))}

      {Object.entries(NODES).map(([key, node]) => (
        <g key={key}>
          <rect
            x={node.x}
            y={node.y}
            width={node.w}
            height={node.h}
            rx="16"
            fill="var(--tp-raised)"
            stroke={node.accent ? `url(#${uid}-accent)` : 'var(--tp-line-strong)'}
            strokeWidth={node.accent ? 1.6 : 1}
          />
          <rect x={node.x + 14} y={node.y + node.h / 2 - 17} width="34" height="34" rx="11" fill="var(--tp-brand-soft)" />
          <node.icon x={node.x + 21} y={node.y + node.h / 2 - 10} width="20" height="20" className="text-brand" />
          <text x={node.x + 60} y={node.y + node.h / 2 - 3} className="fill-ink text-[15px] font-bold">
            {node.title}
          </text>
          <text x={node.x + 60} y={node.y + node.h / 2 + 15} className="fill-ink-3 text-[11.5px]">
            {node.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
