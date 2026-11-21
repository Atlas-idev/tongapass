import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/auth/AuthProvider';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { IconExit, IconOffline, IconRetry, IconShieldAlert } from '@/components/icons';
import { AuroraBackground } from '@/components/layout/AuroraBackground';
import { Button, ButtonLink } from '@/components/ui/Button';

function Centered({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">
      <AuroraBackground />
      <Logo />
      <div className="glass-strong w-full max-w-md rounded-[24px] p-7">{children}</div>
    </main>
  );
}

/** Pastille de verre colorée qui porte le pictogramme d'un écran d'état. */
function StatusIcon({ children, tone }: { children: ReactNode; tone: 'danger' | 'warning' | 'neutral' }) {
  const tones = { danger: 'bg-danger-soft text-danger', warning: 'bg-warning-soft text-warning', neutral: 'bg-hover text-ink-3' };
  return <span className={`flex size-12 items-center justify-center rounded-2xl ${tones[tone]} [&_svg]:size-6`}>{children}</span>;
}

export function LoadingScreen() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-5" aria-busy="true">
      <AuroraBackground />
      <span className="relative">
        <span className="bg-gradient-brand absolute -inset-4 rounded-full opacity-30 blur-2xl motion-safe:animate-[pulse-dot_2.4s_ease-in-out_infinite]" aria-hidden="true" />
        <LogoMark className="relative size-14" animated />
      </span>
      <p className="flex items-center gap-2.5 text-sm font-medium text-ink-2">
        <span className="live-dot size-1.5 text-brand" aria-hidden="true" />
        Connexion sécurisée…
      </p>
    </main>
  );
}

export function ForbiddenScreen({ username }: { username: string }) {
  const { logout } = useAuth();
  return (
    <Centered>
      <StatusIcon tone="danger">
        <IconShieldAlert />
      </StatusIcon>
      <h1 className="mt-4 text-xl font-bold">Accès au portail refusé</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">
        Le compte <span className="font-mono text-[13px]">{username}</span> est authentifié mais ne dispose d’aucun rôle TongaPass
        (ressources humaines, audit ou administration). Demandez l’accès à votre administrateur IAM.
      </p>
      <Button className="mt-6" onClick={() => void logout()} icon={<IconExit className="size-4" />}>
        Changer de compte
      </Button>
    </Centered>
  );
}

export function ErrorScreen({ message }: { message: string }) {
  return (
    <Centered>
      <StatusIcon tone="warning">
        <IconOffline />
      </StatusIcon>
      <h1 className="mt-4 text-xl font-bold">Service indisponible</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{message}</p>
      <Button className="mt-6" variant="primary" onClick={() => window.location.reload()} icon={<IconRetry className="size-4" />}>
        Réessayer
      </Button>
    </Centered>
  );
}

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-gradient text-[64px] font-extrabold leading-none tracking-[-0.05em]">404</p>
      <h1 className="mt-3 text-xl font-bold">Cette page n’existe pas</h1>
      <p className="mt-1.5 text-sm text-ink-3">Le lien est peut-être ancien ou mal saisi.</p>
      <ButtonLink to="/" variant="primary" className="mt-6">
        Retour à la vue d’ensemble
      </ButtonLink>
    </div>
  );
}

export function NoAccess({ what }: { what: string }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <span className="mx-auto flex w-fit">
        <StatusIcon tone="neutral">
          <IconShieldAlert />
        </StatusIcon>
      </span>
      <h1 className="mt-4 text-xl font-bold">Accès réservé</h1>
      <p className="mt-1.5 text-sm text-ink-3">{what}</p>
      <Link to="/" className="mt-4 inline-block text-sm font-semibold text-info hover:underline">
        Retour à la vue d’ensemble
      </Link>
    </div>
  );
}
