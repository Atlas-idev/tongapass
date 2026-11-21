import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { LogoMark, Wordmark } from '@/components/brand/Logo';
import {
  IconArrowRight,
  IconBranch,
  IconChain,
  IconChat,
  IconCheck,
  IconCode,
  IconContainers,
  IconEnter,
  IconExit,
  IconKey,
  IconLock,
  IconMail,
  IconMoon,
  IconScan,
  IconShieldCheck,
  IconSun,
  IconSwap,
  type IconComponent,
} from '@/components/icons';
import { FlowDiagram } from '@/components/landing/FlowDiagram';
import { FLOW_STEPS } from '@/components/landing/flow-steps';
import { AuroraBackground } from '@/components/layout/AuroraBackground';
import { Button } from '@/components/ui/Button';
import { CountUp } from '@/components/ui/Motion';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';
import { trackSpotlight } from '@/lib/spotlight';
import { EASE_OUT } from '@/lib/motion';

/* ------------------------------------------------------------------ Contenus */

const PREVIEW_STEPS: { icon: IconComponent; label: string; detail: string }[] = [
  { icon: IconKey, label: 'Compte Keycloak créé', detail: 'hanitra.rakoto' },
  { icon: IconShieldCheck, label: 'Rôles et groupes attribués', detail: 'employee, developer · Engineering' },
  { icon: IconMail, label: 'Lien d’activation envoyé', detail: 'valable 48 h' },
  { icon: IconBranch, label: 'Accès Gitea', detail: 'équipe developers' },
  { icon: IconChat, label: 'Invitation Mattermost', detail: '~engineering, ~bienvenue' },
  { icon: IconMail, label: 'E-mail de bienvenue', detail: 'adresse personnelle' },
];

const STATS = [
  { value: 9, label: 'services Docker Compose' },
  { value: 36, label: 'routes documentées OpenAPI' },
  { value: 4, label: 'workflows n8n versionnés' },
  { value: 0, label: 'secret dans le dépôt' },
];

const LIFECYCLE: { icon: IconComponent; title: string; when: string; tone: string; items: string[] }[] = [
  {
    icon: IconEnter,
    title: 'Arrivée',
    when: 'Immédiate ou la veille du premier jour',
    tone: 'text-success',
    items: [
      'Compte Keycloak avec les rôles et groupes du profil',
      'Lien d’activation : aucun mot de passe envoyé',
      'Compte Gitea et équipes, compte Mattermost et canaux',
      'Annonce dans ~bienvenue et e-mail de bienvenue',
    ],
  },
  {
    icon: IconSwap,
    title: 'Mobilité',
    when: 'Écart de droits visible avant validation',
    tone: 'text-info',
    items: [
      'Aperçu des droits ajoutés, retirés et conservés',
      'Rôles de l’ancien profil retirés, nouveaux ajoutés',
      'Équipes Gitea et canaux Mattermost ajustés',
      'Récapitulatif envoyé au manager',
    ],
  },
  {
    icon: IconExit,
    title: 'Départ',
    when: 'Immédiat, planifié ou en fin de contrat',
    tone: 'text-danger',
    items: [
      'Compte Keycloak désactivé, sessions et jetons révoqués',
      'Rôles et groupes retirés',
      'Gitea bloqué, Mattermost désactivé',
      'Révocation programmée à la fin d’un CDD ou d’un stage',
    ],
  },
];

const SECURITY: { icon: IconComponent; title: string; text: string }[] = [
  { icon: IconShieldCheck, title: 'Moindre privilège', text: 'Un profil d’accès par poste, composé dans un catalogue fermé. Tout droit en plus est justifié et tracé.' },
  { icon: IconKey, title: 'Comptes de service bridés', text: 'n8n gère les utilisateurs sans pouvoir administrer le royaume ; le contrôle de conformité lit en lecture seule.' },
  { icon: IconLock, title: 'Rappels signés HMAC', text: 'Chaque retour de n8n est signé HMAC-SHA256 et horodaté : fenêtre anti-rejeu de 5 minutes.' },
  { icon: IconChain, title: 'Journal infalsifiable', text: 'Chaque entrée est chaînée à la précédente par SHA-256 ; PostgreSQL interdit toute modification.' },
  { icon: IconScan, title: 'Conformité chaque nuit', text: 'Les droits réels dans Keycloak sont comparés aux droits attendus : un rôle ajouté à la main est signalé.' },
  { icon: IconContainers, title: 'Chaîne DevSecOps', text: 'CI avec Gitleaks, Trivy et npm audit, conteneurs non root, CSP stricte, aucun secret versionné.' },
];

/** Livrable minimal du projet P03 (catalogue ESTI L3) et ce qui y répond. */
const DELIVERABLES: { need: string; answer: string }[] = [
  { need: 'Déclenchement par formulaire RH', answer: 'Assistant d’arrivée en trois étapes, brouillon conservé, validation champ par champ' },
  { need: 'Création du compte Keycloak avec rôles', answer: 'Profil d’accès appliqué, groupes, matricule en attribut, lien d’activation' },
  { need: 'Invitation aux outils', answer: 'Gitea (équipes) et Mattermost (canaux) provisionnés par n8n' },
  { need: 'E-mail de bienvenue', answer: 'Envoyé sur l’adresse personnelle, gabarit commun sans émoji' },
  { need: 'Workflow de départ avec révocation', answer: 'Immédiat, planifié ou automatique en fin de contrat, confirmation par l’identifiant' },
  { need: 'Journal d’audit', answer: 'Ajout seul, chaîné SHA-256, vérification d’intégrité en un clic, export CSV' },
];

const STACK = ['n8n 2.48', 'Keycloak 26.8', 'Mattermost', 'Gitea', 'SMTP', 'PostgreSQL 17', 'NestJS 12', 'React 19', 'Docker Compose', 'OpenAPI'];

const SECTIONS = [
  { id: 'cycle', label: 'Cycle de vie' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'securite', label: 'Sécurité' },
  { id: 'projet', label: 'Projet P03' },
];

/* ------------------------------------------------------------------ Aperçu animé */

/** Aperçu animé d'une arrivée : les étapes se valident une à une, puis la séquence reprend. */
function ProvisioningPreview() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(reduced ? PREVIEW_STEPS.length : 0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(
      () => setDone((value) => (value >= PREVIEW_STEPS.length ? 0 : value + 1)),
      done >= PREVIEW_STEPS.length ? 2600 : 700,
    );
    return () => window.clearTimeout(timer);
  }, [done, reduced]);

  const finished = done >= PREVIEW_STEPS.length;
  const pct = Math.round((Math.min(done, PREVIEW_STEPS.length) / PREVIEW_STEPS.length) * 100);

  return (
    <figure className="glass-strong relative overflow-hidden rounded-[26px]" aria-label="Aperçu : provisionnement automatique d’une arrivée">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <span className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[38%] bg-[linear-gradient(145deg,color-mix(in_oklab,#3B57C2_24%,var(--tp-solid)),color-mix(in_oklab,#3B57C2_8%,var(--tp-solid)))] text-[13px] font-bold text-[color-mix(in_oklab,#3B57C2_50%,var(--tp-ink))]">
            HR
          </span>
          <span>
            <span className="block text-sm font-semibold">Arrivée de Hanitra Rakoto</span>
            <span className="block text-xs text-ink-3">Développement back-end · exécution n8n</span>
          </span>
        </span>
        <span
          className={cn(
            'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold tabular ring-1 ring-inset',
            finished ? 'bg-success-soft text-success ring-success/25' : 'bg-info-soft text-info ring-info/25',
          )}
        >
          <span className={cn(finished ? 'size-1.5 rounded-full bg-success' : 'live-dot size-1.5')} aria-hidden="true" />
          {finished ? 'Terminée' : `${done}/${PREVIEW_STEPS.length}`}
        </span>
      </figcaption>
      <div className="px-5 pt-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-hover" aria-hidden="true">
          <motion.div
            className={cn('bg-gradient-button h-full origin-left rounded-full', !finished && 'progress-stripes')}
            initial={false}
            animate={{ scaleX: pct / 100 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          />
        </div>
      </div>
      <ol className="space-y-1 p-3">
        {PREVIEW_STEPS.map((step, index) => {
          const complete = index < done;
          const active = index === done;
          return (
            <li key={step.label} className={cn('flex items-center gap-3 rounded-2xl px-2.5 py-2 transition-colors duration-300', active && 'bg-brand-soft')}>
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-[11px] transition-all duration-300',
                  complete ? 'bg-gradient-button text-on-brand shadow-[0_6px_14px_-6px_var(--tp-brand)]' : active ? 'border border-info/50 bg-info-soft text-info' : 'border border-line-strong text-ink-3',
                )}
              >
                {complete ? (
                  <motion.span initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 26 }}>
                    <IconCheck className="size-4" strokeWidth={2.6} />
                  </motion.span>
                ) : (
                  <step.icon className="size-4" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn('block text-[13.5px] font-medium', complete || active ? 'text-ink' : 'text-ink-3')}>{step.label}</span>
                <span className="block truncate font-mono text-[11.5px] text-ink-3">{step.detail}</span>
              </span>
              {complete ? <span className="text-[11px] tabular text-ink-3">{(0.4 + index * 0.3).toFixed(1)} s</span> : null}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

/* ------------------------------------------------------------------ Mise en page */

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 py-16 sm:py-20"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-3 text-[28px] font-bold leading-tight tracking-[-0.03em] sm:text-[34px]">
          {title}
        </h2>
        {intro ? <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{intro}</p> : null}
      </div>
      {children}
    </motion.section>
  );
}

function NavBar({ onLogin }: { onLogin: () => void }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { resolved, toggle } = useTheme();
  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 24));
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          'mx-auto flex h-16 max-w-6xl items-center gap-3 rounded-2xl px-3 transition-all duration-300 sm:px-4',
          scrolled ? 'glass-strong h-14' : 'border border-transparent',
        )}
      >
        <a href="#haut" className="flex items-center gap-2.5 rounded-xl" aria-label="TongaPass, haut de page">
          <LogoMark className="size-9" />
          <Wordmark className="text-[17px]" />
        </a>
        <nav aria-label="Sections de la page" className="mx-auto hidden md:block">
          <ul className="flex items-center gap-1 rounded-xl border border-line bg-hover p-1">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-medium text-ink-2 transition-colors hover:bg-surface hover:text-ink">
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <button
            type="button"
            onClick={toggle}
            aria-label={resolved === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'}
            className="inline-flex size-9 items-center justify-center rounded-xl text-ink-3 transition-colors hover:bg-hover hover:text-ink"
          >
            {resolved === 'dark' ? <IconSun className="size-[19px]" /> : <IconMoon className="size-[19px]" />}
          </button>
          <Button size="sm" variant="secondary" onClick={onLogin} icon={<IconEnter className="size-4" />}>
            Se connecter
          </Button>
        </div>
      </div>
    </header>
  );
}

export function LandingPage() {
  const { login } = useAuth();
  const reduced = useReducedMotion();
  const enter = () => void login('/');
  const rise = (delay: number) =>
    // Entrées courtes (≤ 0,6 s au total) : le texte atteint vite son contraste final
    reduced ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay, ease: EASE_OUT } };

  return (
    // overflow-x: clip (et non hidden) : les halos décoratifs ne débordent pas, la barre reste collante
    <div id="haut" className="min-h-dvh overflow-x-clip">
      <AuroraBackground />
      <NavBar onLogin={enter} />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <main id="main">
          {/* ------------------------------------------------ Accroche */}
          <div className="grid items-center gap-12 pb-12 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,27rem)] lg:gap-16">
            <div className="space-y-7">
              <motion.p {...rise(0)} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-2 backdrop-blur-md">
                <span className="live-dot size-1.5 text-success" aria-hidden="true" />
                Automatisation + IAM · Joiner, Mover, Leaver
              </motion.p>
              <motion.h1 {...rise(0.03)} className="max-w-2xl text-[40px] font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-[56px]">
                Les accès de vos équipes, <span className="text-gradient">de l’arrivée au départ.</span>
              </motion.h1>
              <motion.p {...rise(0.06)} className="max-w-xl text-[16.5px] leading-relaxed text-ink-2">
                TongaPass crée les comptes au bon moment, ajuste les droits à chaque changement de poste et les révoque le jour du départ.
                n8n orchestre, Keycloak garde les identités, et chaque geste laisse une trace vérifiable.
              </motion.p>
              <motion.div {...rise(0.09)} className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="lg" onClick={enter} icon={<IconKey className="size-[18px]" />}>
                  Se connecter avec Keycloak
                </Button>
                <a
                  href="#architecture"
                  className="group inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-ink-2 transition-colors hover:bg-hover hover:text-ink"
                >
                  Voir le fonctionnement
                  <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </motion.div>
              <motion.p {...rise(0.11)} className="text-[13px] text-ink-3">
                Authentification unique OIDC + PKCE · comptes de démonstration : rh.manager, admin.it, auditeur
              </motion.p>
              <motion.dl {...rise(0.14)} className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="glass flex flex-col-reverse rounded-2xl px-4 py-3">
                    <dt className="mt-1.5 text-xs leading-snug text-ink-3">{stat.label}</dt>
                    <dd className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-ink">
                      <CountUp value={stat.value} />
                    </dd>
                  </div>
                ))}
              </motion.dl>
            </div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT }}
              className="relative"
            >
              <div className="bg-gradient-brand absolute -inset-6 -z-10 rounded-[40px] opacity-25 blur-3xl" aria-hidden="true" />
              <ProvisioningPreview />
              <div
                className="glass-strong absolute -left-4 -top-5 hidden items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold sm:flex"
                style={reduced ? undefined : { animation: 'float-y 6s ease-in-out infinite' }}
                aria-hidden="true"
              >
                <span className="live-dot size-1.5 text-success" />
                Synchronisé en temps réel
              </div>
              <div
                className="glass-strong absolute -bottom-5 -right-3 hidden items-center gap-2 rounded-2xl px-3 py-2 font-mono text-[11.5px] text-ink-2 sm:flex"
                style={reduced ? undefined : { animation: 'float-y 7s ease-in-out 1.2s infinite' }}
                aria-hidden="true"
              >
                <IconChain className="size-4 text-brand" />
                audit #1284 · f3c9a1d2…
              </div>
            </motion.div>
          </div>

          {/* ------------------------------------------------ Bandeau technologies */}
          <div className="relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <p className="sr-only">Technologies utilisées</p>
            <ul className="flex w-max gap-3 motion-safe:animate-[marquee_38s_linear_infinite]">
              {[...STACK, ...STACK].map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  aria-hidden={index >= STACK.length ? true : undefined}
                  className="glass whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold text-ink-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------------------------ Cycle de vie */}
          <Section
            id="cycle"
            eyebrow="Cycle de vie"
            title="Arrivée, mobilité, départ : un seul parcours"
            intro="Le modèle Joiner-Mover-Leaver des outils IAM, piloté depuis un portail RH. Chaque mouvement lance un workflow n8n suivi étape par étape, en direct."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {LIFECYCLE.map((phase, index) => (
                <article key={phase.title} onPointerMove={trackSpotlight} className="glass spotlight group rounded-[22px] p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className={cn('flex size-11 items-center justify-center rounded-2xl bg-hover', phase.tone)}>
                      <phase.icon className="size-6" />
                    </span>
                    <span className="font-mono text-xs text-ink-3">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{phase.title}</h3>
                  <p className="text-[13px] text-ink-3">{phase.when}</p>
                  <ul className="mt-4 space-y-2.5">
                    {phase.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[13.5px] leading-snug text-ink-2">
                        <IconCheck className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.4} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Section>

          {/* ------------------------------------------------ Architecture */}
          <Section
            id="architecture"
            eyebrow="Architecture"
            title="L’API décide, n8n exécute, tout est tracé"
            intro="L’API est la source de vérité : employés, exécutions et journal d’audit. n8n agit sur les outils et rend compte de chaque étape par un rappel signé."
          >
            <div className="glass hidden rounded-[26px] p-6 md:block">
              <FlowDiagram />
            </div>
            <ol className="space-y-3 md:hidden">
              {FLOW_STEPS.map((step, index) => (
                <li key={step.title} className="glass flex gap-4 rounded-2xl p-4">
                  <span className="bg-gradient-button flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-on-brand">{index + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{step.title}</span>
                    <span className="block text-[13px] text-ink-2">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Section>

          {/* ------------------------------------------------ Sécurité */}
          <Section
            id="securite"
            eyebrow="Sécurité par conception"
            title="Le moindre privilège, à chaque niveau"
            intro="Les tendances couvertes par le projet : IAM, automatisation DevSecOps et moindre privilège."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SECURITY.map((item) => (
                <article key={item.title} onPointerMove={trackSpotlight} className="glass spotlight rounded-[22px] p-5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold">{item.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{item.text}</p>
                </article>
              ))}
            </div>
          </Section>

          {/* ------------------------------------------------ Projet P03 */}
          <Section
            id="projet"
            eyebrow="Projet P03 · ESTI Licence 3"
            title="Le livrable attendu, point par point"
            intro="Intégration automatisée des employés avec n8n et Keycloak : automatiser l’arrivée et le départ d’un employé, de la création des comptes à la désactivation."
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className="glass overflow-hidden rounded-[22px]">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Livrable minimal du projet et réponse apportée</caption>
                  <thead className="border-b border-line bg-hover text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">Attendu</th>
                      <th scope="col" className="hidden px-5 py-3 font-semibold sm:table-cell">Réponse de TongaPass</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {DELIVERABLES.map((row) => (
                      <tr key={row.need} className="align-top">
                        <th scope="row" className="px-5 py-3.5 font-semibold">
                          <span className="flex gap-2.5">
                            <span className="bg-gradient-button mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md text-on-brand">
                              <IconCheck className="size-3.5" strokeWidth={2.8} />
                            </span>
                            <span>
                              {row.need}
                              <span className="mt-0.5 block text-[13px] font-normal text-ink-3 sm:hidden">{row.answer}</span>
                            </span>
                          </span>
                        </th>
                        <td className="hidden px-5 py-3.5 text-[13.5px] text-ink-2 sm:table-cell">{row.answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4">
                <div className="glass rounded-[22px] p-5">
                  <p className="text-sm font-bold">Standards transverses</p>
                  <ul className="mt-3 space-y-2 text-[13.5px] text-ink-2">
                    {[
                      [IconCode, 'Code versionné, workflows n8n « as code »'],
                      [IconContainers, 'Conteneurisation Docker Compose'],
                      [IconLock, 'IAM Keycloak dès qu’il y a des comptes'],
                      [IconScan, 'API documentée en OpenAPI (Swagger)'],
                      [IconShieldCheck, 'Aucun secret en clair dans le dépôt'],
                    ].map(([Icon, text]) => {
                      const I = Icon as IconComponent;
                      return (
                        <li key={text as string} className="flex items-center gap-2.5">
                          <I className="size-4 shrink-0 text-brand" />
                          {text as string}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="glass rounded-[22px] p-5">
                  <p className="text-sm font-bold">Grille d’évaluation couverte</p>
                  <ul className="mt-3 space-y-2">
                    {[
                      ['Fonctionnement et qualité technique', 7],
                      ['Veille technologique', 3],
                      ['DevOps / DevSecOps', 3],
                      ['Publication et documentation', 3],
                      ['Branding et communication', 2],
                      ['Participation communautaire', 2],
                    ].map(([label, points]) => (
                      <li key={label as string} className="flex items-center gap-3 text-[13px]">
                        <span className="min-w-0 flex-1 text-ink-2">{label as string}</span>
                        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-hover" aria-hidden="true">
                          <span className="bg-gradient-button block h-full rounded-full" style={{ width: `${((points as number) / 7) * 100}%` }} />
                        </span>
                        <span className="w-10 text-right font-semibold tabular text-ink">{points as number} pts</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* ------------------------------------------------ Appel final */}
          <section aria-label="Accéder au portail" className="pb-16">
            <div className="glass-strong relative overflow-hidden rounded-[28px] px-6 py-10 text-center sm:px-12">
              <div className="bg-gradient-brand absolute -right-24 -top-24 size-72 rounded-full opacity-25 blur-3xl" aria-hidden="true" />
              <div className="bg-gradient-brand absolute -bottom-28 -left-20 size-72 rounded-full opacity-20 blur-3xl" aria-hidden="true" />
              <LogoMark className="mx-auto size-14" animated />
              <p className="mx-auto mt-5 max-w-xl text-[22px] font-bold leading-snug tracking-[-0.02em] sm:text-[26px]">
                <span lang="mg">Tonga soa</span> : bienvenue. Les accès suivent, sans ticket ni oubli.
              </p>
              <p className="mx-auto mt-2 max-w-lg text-[14px] text-ink-3">Connectez-vous avec un compte de démonstration pour déclarer une arrivée et la regarder se provisionner en direct.</p>
              <Button variant="primary" size="lg" className="mt-6" onClick={enter} icon={<IconEnter className="size-[18px]" />}>
                Ouvrir le portail RH
              </Button>
            </div>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-xs text-ink-3">
          <span className="flex items-center gap-2">
            <LogoMark className="size-5" />
            TongaPass, de <span lang="mg">« tonga »</span>, arriver en malgache
          </span>
          <span>Projet P03 · ESTI Licence 3 · 2026 · licence MIT</span>
        </footer>
      </div>
    </div>
  );
}
