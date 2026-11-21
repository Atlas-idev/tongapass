import { MotionConfig } from 'motion/react';
import { Dialog } from 'radix-ui';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { LiveContext, useLiveEventsConnection } from '@/hooks/useLiveEvents';
import { cn } from '@/lib/cn';
import { PageTransition } from '../ui/Motion';
import { AuroraBackground } from './AuroraBackground';
import { CommandPalette } from './CommandPalette';
import { ErrorBoundary } from './ErrorBoundary';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const COLLAPSE_KEY = 'tp-sidebar';

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === 'collapsed';
  } catch {
    return false;
  }
}

export function AppShell() {
  const live = useLiveEventsConnection(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const location = useLocation();

  const toggleCollapsed = () =>
    setCollapsed((value) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, value ? 'expanded' : 'collapsed');
      } catch {
        /* stockage indisponible : préférence non mémorisée */
      }
      return !value;
    });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Après une navigation (pas au premier chargement, pour que la première tabulation
  // atteigne le lien d'évitement), le focus est placé sur le contenu pour les lecteurs d'écran.
  // Comparaison au chemin précédent : robuste au double appel des effets en StrictMode.
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <LiveContext.Provider value={live}>
        <AuroraBackground />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-xl focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-canvas"
        >
          Aller au contenu
        </a>
        <div className="flex min-h-dvh">
          <aside className={cn('hidden shrink-0 transition-[width] duration-300 ease-out lg:block', collapsed ? 'w-[92px]' : 'w-[272px]')}>
            <div className="sticky top-0 h-dvh p-3">
              <div className="glass h-full overflow-hidden rounded-[22px]">
                <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
              </div>
            </div>
          </aside>

          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-[#060912]/40 backdrop-blur-[6px] data-[state=open]:animate-[fade-in_var(--duration-base)_ease-out] lg:hidden" />
              <Dialog.Content className="glass-strong fixed inset-y-3 left-3 z-50 w-[min(80vw,288px)] overflow-hidden rounded-[22px] data-[state=open]:animate-[drawer-in_var(--duration-slow)_var(--ease-out)] lg:hidden">
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">Navigation principale</Dialog.Description>
                <Sidebar onNavigate={() => setMenuOpen(false)} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar onOpenMenu={() => setMenuOpen(true)} onOpenSearch={() => setPaletteOpen(true)} />
            <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-10 pt-7 outline-none sm:px-6 lg:px-8">
              <ErrorBoundary resetKey={location.pathname}>
                <PageTransition key={location.pathname}>
                  <Outlet />
                </PageTransition>
              </ErrorBoundary>
            </main>
          </div>
        </div>
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </LiveContext.Provider>
    </MotionConfig>
  );
}
