import { motion } from 'motion/react';
import { useId } from 'react';
import { NavLink } from 'react-router';
import { useMe } from '@/auth/AuthProvider';
import { IconSidebar } from '@/components/icons';
import { useLive } from '@/hooks/useLiveEvents';
import { cn } from '@/lib/cn';
import { ROLE_LABEL } from '@/lib/labels';
import { Logo, LogoMark } from '../brand/Logo';
import { Avatar } from '../ui/Feedback';
import { NAV_ITEMS, SECTION_LABEL } from './navigation';

/**
 * Navigation principale : panneau de verre flottant. Une pilule en dégradé glisse vers la page
 * active ; en mode replié (bureau), seules les icônes restent, avec leur libellé en infobulle
 * et pour les lecteurs d'écran.
 */
export function Sidebar({
  onNavigate,
  collapsed = false,
  onToggleCollapsed,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const me = useMe();
  const { connected } = useLive();
  const pillId = useId();
  const items = NAV_ITEMS.filter((item) => item.visible(me));
  const sections = (['gestion', 'controle'] as const).filter((section) => items.some((item) => item.section === section));
  const [first = '', last = ''] = (me.name ?? me.username).split(' ');

  return (
    <nav aria-label="Navigation principale" className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center gap-2 px-4', collapsed && 'justify-center px-0')}>
        <NavLink to="/" onClick={onNavigate} aria-label="TongaPass, vue d’ensemble" className="rounded-xl">
          {collapsed ? <LogoMark className="size-9" /> : <Logo subtitle={me.workspace.company === 'TongaPass' ? 'Espace RH' : me.workspace.company} />}
        </NavLink>
        {onToggleCollapsed && !collapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Replier le menu"
            title="Replier le menu"
            className="ml-auto inline-flex size-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-hover hover:text-ink"
          >
            <IconSidebar className="size-[18px]" />
          </button>
        ) : null}
      </div>

      <div className={cn('flex-1 space-y-6 overflow-y-auto py-3 no-scrollbar', collapsed ? 'px-2.5' : 'px-3')}>
        {sections.map((section) => (
          <div key={section}>
            {collapsed ? (
              <div className="mx-auto mb-2 h-px w-6 bg-line" aria-hidden="true" />
            ) : (
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{SECTION_LABEL[section]}</p>
            )}
            <ul className="space-y-1">
              {items
                .filter((item) => item.section === section)
                .map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex h-10 items-center gap-3 rounded-xl text-[13.5px] font-medium outline-offset-0 transition-colors',
                          collapsed ? 'justify-center px-0' : 'px-3',
                          isActive ? 'text-on-brand' : 'text-ink-2 hover:bg-hover hover:text-ink',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive ? (
                            <motion.span
                              layoutId={pillId}
                              className="bg-gradient-button absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_10px_22px_-10px_var(--tp-brand)]"
                              transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                              aria-hidden="true"
                            />
                          ) : null}
                          <item.icon
                            className={cn(
                              'relative size-[19px] shrink-0 transition-transform duration-200 group-hover:scale-110',
                              isActive ? 'text-on-brand' : 'text-ink-3 group-hover:text-brand',
                            )}
                          />
                          <span className={cn('relative truncate', collapsed && 'sr-only')}>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={cn('space-y-2 p-3', collapsed && 'px-2.5')}>
        {collapsed ? (
          onToggleCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label="Déplier le menu"
              title="Déplier le menu"
              className="mx-auto flex size-10 items-center justify-center rounded-xl text-ink-3 transition-colors hover:bg-hover hover:text-ink"
            >
              <IconSidebar className="size-[18px] -scale-x-100" />
            </button>
          ) : null
        ) : (
          <div className="flex items-center gap-2.5 rounded-xl border border-line bg-hover px-3 py-2 text-xs">
            <span className={cn(connected ? 'live-dot text-success' : 'size-2 rounded-full bg-ink-3')} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-ink-2">{connected ? 'Flux temps réel actif' : 'Connexion au flux…'}</span>
            <span className="font-mono text-[11px] text-ink-3">SSE</span>
          </div>
        )}
        <div className={cn('flex items-center gap-2.5 rounded-xl px-1.5 py-1.5', collapsed && 'justify-center px-0')} title={collapsed ? (me.name ?? me.username) : undefined}>
          <Avatar first={first} last={last || first.slice(1)} size="sm" />
          {collapsed ? null : (
            <div className="min-w-0 text-[13px] leading-tight">
              <p className="truncate font-semibold text-ink">{me.name ?? me.username}</p>
              <p className="truncate text-xs text-ink-3">{me.roles.map((role) => ROLE_LABEL[role] ?? role).join(' · ')}</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
