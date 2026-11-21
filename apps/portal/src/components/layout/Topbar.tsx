import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { DropdownMenu } from 'radix-ui';
import { useAuth, useMe } from '@/auth/AuthProvider';
import { IconExit, IconExternal, IconMenu, IconMoon, IconSearch, IconSun } from '@/components/icons';
import { useLive } from '@/hooks/useLiveEvents';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';
import { IconButton } from '../ui/Button';
import { Avatar, Kbd } from '../ui/Feedback';
import { LiveClock } from '../ui/Motion';
import { Heartbeat, LiveActivity } from './LiveActivity';

const TOOL_LINKS: { key: keyof ReturnType<typeof useMe>['workspace']['links']; label: string }[] = [
  { key: 'keycloak', label: 'Console Keycloak' },
  { key: 'n8n', label: 'Workflows n8n' },
  { key: 'gitea', label: 'Gitea' },
  { key: 'mattermost', label: 'Mattermost' },
  { key: 'mailpit', label: 'Boîte de test (Mailpit)' },
  { key: 'apiDocs', label: 'Documentation de l’API' },
];

const menuItem =
  'flex h-9 cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 text-[13px] text-ink-2 outline-none transition-colors data-[highlighted]:bg-hover data-[highlighted]:text-ink';

const dayFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

/** Barre supérieure flottante en verre : recherche, pouls temps réel, activité, thème et compte. */
export function Topbar({ onOpenMenu, onOpenSearch }: { onOpenMenu: () => void; onOpenSearch: () => void }) {
  const me = useMe();
  const { logout } = useAuth();
  const { connected } = useLive();
  const { resolved, toggle } = useTheme();
  const reduced = useReducedMotion();
  const [first = '', last = ''] = (me.name ?? me.username).split(' ');
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5 lg:pl-0">
      <div className="glass flex h-14 items-center gap-2 rounded-2xl px-2.5 sm:gap-3 sm:px-3">
        <IconButton label="Ouvrir le menu" className="lg:hidden" onClick={onOpenMenu}>
          <IconMenu className="size-5" />
        </IconButton>

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Rechercher un employé, une page (Ctrl + K)"
          className="group flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-xl sm:max-w-md border border-line bg-hover px-3 text-left text-[13px] text-ink-3 transition-[border-color,background-color,box-shadow] duration-200 hover:border-brand/40 hover:bg-surface hover:shadow-[0_0_0_4px_color-mix(in_oklab,var(--tp-brand)_10%,transparent)]"
        >
          <IconSearch className="size-4 shrink-0 transition-colors group-hover:text-brand" />
          <span className="min-w-0 flex-1 truncate">Rechercher un employé, une page…</span>
          <span className="hidden items-center gap-0.5 sm:flex" aria-hidden="true">
            <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          <span className="mr-2 hidden flex-col items-end leading-tight xl:flex" aria-hidden="true">
            <LiveClock className="text-[13px] font-semibold text-ink" />
            <span className="text-[11px] capitalize text-ink-3">{dayFmt.format(new Date())}</span>
          </span>

          <span
            role="status"
            className={cn(
              'mr-1 hidden h-9 items-center gap-2 rounded-xl border border-line px-2.5 text-xs font-medium md:inline-flex',
              connected ? 'text-success' : 'text-ink-3',
            )}
            title={connected ? 'Les mises à jour arrivent en temps réel' : 'Reconnexion au flux temps réel…'}
          >
            <Heartbeat connected={connected} />
            <span className="text-ink-2">{connected ? 'Synchronisé' : 'Reconnexion…'}</span>
          </span>

          <LiveActivity />

          <IconButton label={resolved === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'} onClick={toggle} className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={resolved}
                initial={reduced ? false : { y: 14, rotate: -40, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={reduced ? undefined : { y: -14, rotate: 40, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="inline-flex"
              >
                {resolved === 'dark' ? <IconSun className="size-[19px]" /> : <IconMoon className="size-[19px]" />}
              </motion.span>
            </AnimatePresence>
          </IconButton>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="ml-1 rounded-[38%] transition-transform hover:scale-105" aria-label={`Compte de ${me.name ?? me.username}`}>
              <Avatar first={first} last={last || first.slice(1)} size="sm" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={10} className="glass-strong z-50 w-64 rounded-2xl p-1.5">
                <div className="flex items-center gap-3 px-2.5 py-2.5">
                  <Avatar first={first} last={last || first.slice(1)} />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{me.name ?? me.username}</p>
                    <p className="truncate text-xs text-ink-3" translate="no">
                      {me.email ?? me.username}
                    </p>
                  </div>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-line" />
                <DropdownMenu.Label className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">Outils de la pile</DropdownMenu.Label>
                {TOOL_LINKS.filter((tool) => me.workspace.links[tool.key]).map((tool) => (
                  <DropdownMenu.Item key={tool.key} asChild>
                    <a href={me.workspace.links[tool.key] ?? '#'} target="_blank" rel="noreferrer" className={menuItem}>
                      {tool.label}
                      <IconExternal className="size-3.5 text-ink-3" />
                    </a>
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="my-1 h-px bg-line" />
                <DropdownMenu.Item
                  onSelect={() => void logout()}
                  className={cn(menuItem, 'justify-start text-danger data-[highlighted]:bg-danger-soft data-[highlighted]:text-danger')}
                >
                  <IconExit className="size-4" />
                  Se déconnecter
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
