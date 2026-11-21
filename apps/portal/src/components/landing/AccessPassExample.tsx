import { Tabs } from 'radix-ui';
import { useEffect, useRef, useState } from 'react';
import { IconBranch, IconChat, IconCheck, IconKey, IconRetry } from '@/components/icons';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SYSTEMS = [
  { name: 'Keycloak', icon: IconKey },
  { name: 'Gitea', icon: IconBranch },
  { name: 'Mattermost', icon: IconChat },
] as const;

const SCENARIOS = [
  { phase: 'Arrivée', profile: 'Développement back-end', state: 'Accès ouverts', systems: ['Compte activé', 'Équipe developers', 'Canal ~engineering'] },
  { phase: 'Mobilité', profile: 'Ingénierie DevOps', state: 'Profil modifié', systems: ['Rôles ajustés', 'Équipe devops', 'Canal ~incidents'] },
  { phase: 'Départ', profile: 'Ingénierie DevOps', state: 'Accès révoqués', systems: ['Sessions révoquées', 'Compte bloqué', 'Compte désactivé'] },
] as const;

function Sequence({ scenario }: { scenario: (typeof SCENARIOS)[number] }) {
  const reduced = usePrefersReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [completed, setCompleted] = useState(0);
  const done = reduced ? SYSTEMS.length : completed;

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduced || completed === SYSTEMS.length) return;
    const timer = window.setTimeout(() => setCompleted(completed + 1), 730);
    return () => window.clearTimeout(timer);
  }, [visible, reduced, completed]);

  return (
    <div className="demo-grid" ref={container}>
      <div className="demo-person">
        <span className="demo-avatar" aria-hidden="true">HR</span>
        <div><strong>Hanitra Rakoto</strong><p>{scenario.profile}</p></div>
      </div>
      <div className="demo-track">
        <ol className="demo-systems" aria-label="Progression de l’exemple">
          {SYSTEMS.map(({ name, icon: Icon }, i) => (
            <li key={name} data-stage={i < done ? 'done' : i === done ? 'running' : 'pending'}>
              <span className="system-icon"><Icon aria-hidden="true" /></span>
              <span className="system-copy"><strong>{name}</strong><small>{i < done ? scenario.systems[i] : i === done ? 'En cours…' : 'En attente'}</small></span>
            </li>
          ))}
        </ol>
        <div className="demo-progress">
          <span role="status">{done === SYSTEMS.length ? <><IconCheck />{scenario.state}</> : 'Mise à jour des accès'}</span>
          <span className="demo-meter" aria-hidden="true"><i style={{ transform: `scaleX(${done / SYSTEMS.length})` }} /></span>
          <span className="font-mono tabular">{done}/{SYSTEMS.length}</span>
          {!reduced && <button type="button" title="Rejouer l’exemple" aria-label="Rejouer l’exemple" onClick={() => setCompleted(0)} disabled={done !== SYSTEMS.length}><IconRetry /></button>}
        </div>
      </div>
    </div>
  );
}

export function AccessPassExample() {
  return (
    <figure className="flow-demo" id="cycle" aria-label="Exemple de fiche d’accès">
      <Tabs.Root defaultValue="Arrivée">
        <div className="demo-header">
          <div><p className="demo-label">Démonstration</p><h2>Un parcours d’accès</h2></div>
          <Tabs.List className="demo-tabs" aria-label="Mouvement à prévisualiser">
            {SCENARIOS.map(({ phase }) => <Tabs.Trigger key={phase} value={phase}>{phase}</Tabs.Trigger>)}
          </Tabs.List>
        </div>
        {SCENARIOS.map((scenario) => (
          <Tabs.Content key={scenario.phase} value={scenario.phase}><Sequence scenario={scenario} /></Tabs.Content>
        ))}
      </Tabs.Root>
    </figure>
  );
}
