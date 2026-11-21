import { useAuth } from '@/auth/AuthProvider';
import { LogoMark, Wordmark } from '@/components/brand/Logo';
import { IconArrival, IconExit, IconKey, IconLock, IconMoon, IconSun, IconSwap } from '@/components/icons';
import { AccessPassExample } from '@/components/landing/AccessPassExample';
import { FlowDiagram } from '@/components/landing/FlowDiagram';
import { FLOW_STEPS } from '@/components/landing/flow-steps';
import { Button, IconButton } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

const MOVEMENTS = [
  { title: 'Préparer une arrivée', icon: IconArrival, text: 'Choisissez un profil et une date. Le nouvel employé reçoit son lien d’activation et retrouve ses équipes dans Gitea et Mattermost.' },
  { title: 'Changer de poste', icon: IconSwap, text: 'Comparez les droits ajoutés et retirés avant de confirmer la mobilité. Le nouveau profil prend effet à la date choisie.' },
  { title: 'Organiser un départ', icon: IconExit, text: 'Planifiez la révocation pour la fin du contrat ou déclenchez-la immédiatement. Les comptes sont désactivés et les sessions fermées.' },
];

const SAFEGUARDS = [
  { title: 'Qui peut modifier les accès ?', text: 'Les équipes RH et les administrateurs lancent les opérations depuis le portail. Le profil de poste définit les droits de départ. Toute exception doit être justifiée.' },
  { title: 'Comment retrouver une opération ?', text: 'Le journal d’audit conserve l’acteur, la date et le détail de chaque opération. Les entrées sont chaînées par empreinte SHA-256 et exportables au format CSV.' },
  { title: 'Comment repérer un droit en trop ?', text: 'Chaque nuit, un compte de service en lecture seule compare les droits Keycloak au profil attendu. Les écarts apparaissent dans la page Conformité.' },
];

export function LandingPage() {
  const { login } = useAuth();
  const { resolved, toggle } = useTheme();
  const enter = () => void login(window.location.pathname + window.location.search);

  return (
    <div id="haut" className="landing">
      <a className="landing-skip" href="#main">Aller au contenu</a>
      <header className="landing-header">
        <div className="landing-wrap flex min-h-16 items-center gap-5">
          <a href="#haut" className="flex items-center gap-2" aria-label="TongaPass, haut de page"><LogoMark /><Wordmark /></a>
          <nav aria-label="Sections de la page" className="ml-8 hidden items-center gap-7 text-sm font-medium text-ink-2 md:flex">
            <a href="#cycle">Parcours RH</a><a href="#architecture">Architecture</a><a href="#securite">Sécurité</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <IconButton label={resolved === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'} onClick={toggle}>
              {resolved === 'dark' ? <IconSun className="size-5" /> : <IconMoon className="size-5" />}
            </IconButton>
            <Button variant="secondary" onClick={enter}>Se connecter</Button>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">
        <section className="landing-wrap landing-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-kicker"><span aria-hidden="true" /> Portail des ressources humaines</p>
            <h1 id="hero-title">Les accès de vos équipes,<em>de l’arrivée au départ.</em></h1>
            <p className="hero-description">Ouvrez les comptes d’un nouvel employé, ajustez ses droits quand il change de poste et fermez ses accès à son départ.</p>
            <Button variant="primary" size="lg" onClick={enter} icon={<IconLock className="size-4" aria-hidden="true" />}>Se connecter avec Keycloak</Button>
          </div>
          <AccessPassExample />
        </section>
        <section id="cycle" className="landing-band" aria-labelledby="cycle-title">
          <div className="landing-wrap">
            <h2 className="section-title" id="cycle-title">Les parcours RH</h2>
            <div className="movement-list">
              {MOVEMENTS.map(({ title, text, icon: Icon }) => (
                <article key={title}><Icon className="movement-icon" aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>
              ))}
            </div>
          </div>
        </section>
        <section id="architecture" className="landing-wrap landing-section" aria-labelledby="architecture-title">
          <h2 className="section-title" id="architecture-title">Architecture</h2>
          <p className="section-intro">L’équipe RH déclare le mouvement. L’API l’enregistre, puis n8n applique les changements et confirme chaque étape.</p>
          <div className="panel mt-6 hidden rounded-xl p-6 lg:block"><FlowDiagram /></div>
          <ol className="mt-5 list-decimal space-y-3 pl-6 text-ink-2 lg:hidden">
            {FLOW_STEPS.map((step) => <li key={step.title}><strong className="text-ink">{step.title}.</strong> {step.text}</li>)}
          </ol>
        </section>
        <section id="securite" className="landing-wrap security-section" aria-labelledby="security-title">
          <h2 className="section-title" id="security-title">Contrôle des accès</h2>
          <div>{SAFEGUARDS.map(({ title, text }) => (
            <details className="security-item" key={title}>
              <summary>{title}<span aria-hidden="true" /></summary><p>{text}</p>
            </details>
          ))}</div>
        </section>
      </main>
      <footer className="landing-wrap flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-ink-3">
        <span className="flex items-center gap-2"><IconKey className="size-5" aria-hidden="true" /> TongaPass</span>
        <span>Projet P03 · ESTI Licence 3 · 2026</span>
      </footer>
    </div>
  );
}
