import { Tabs } from 'radix-ui';
import { LogoMark } from '@/components/brand/Logo';
import { IconBranch, IconChat, IconKey } from '@/components/icons';

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

export function AccessPassExample() {
  return (
    <figure className="pass-example" aria-labelledby="pass-caption">
      <figcaption id="pass-caption">Exemple de fiche d’accès</figcaption>
      <div className="pass-arches" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <Tabs.Root defaultValue="Arrivée" className="pass-demo">
        {SCENARIOS.map(({ phase, profile, state, systems }) => (
          <Tabs.Content key={phase} value={phase} className="pass-card">
            <div className="pass-card-head">
              <span className="flex items-center gap-2 font-semibold"><LogoMark className="size-6" /> TongaPass</span>
              <span className="pass-slot" aria-hidden="true" />
            </div>
            <div className="pass-holder">
              <span className="pass-name">Hanitra Rakoto</span>
              <p>{profile}</p>
            </div>
            <dl className="pass-systems">
              {SYSTEMS.map(({ name, icon: Icon }, index) => (
                <div key={name}>
                  <dt><Icon aria-hidden="true" />{name}</dt>
                  <dd>{systems[index]}</dd>
                </div>
              ))}
            </dl>
            <div className="pass-stub">
              <span>{state}</span>
              <span className="pass-bars" aria-hidden="true" />
            </div>
          </Tabs.Content>
        ))}
        <Tabs.List className="pass-switch" aria-label="Mouvement à prévisualiser">
          {SCENARIOS.map(({ phase }) => <Tabs.Trigger key={phase} value={phase}>{phase}</Tabs.Trigger>)}
        </Tabs.List>
      </Tabs.Root>
    </figure>
  );
}
