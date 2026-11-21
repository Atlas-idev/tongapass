import { motion } from 'motion/react';
import { Tabs as RadixTabs } from 'radix-ui';
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  value: string;
  label: ReactNode;
  count?: number;
}

/** Onglets accessibles (Radix) en pilule de verre : le fond en dégradé glisse vers l'onglet actif. */
export function Tabs({
  items,
  value,
  onValueChange,
  children,
  label,
}: {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  label: string;
}) {
  const layoutId = useId();
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange}>
      <RadixTabs.List aria-label={label} className="glass inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl p-1 no-scrollbar">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition-colors',
              value === item.value ? 'text-on-brand' : 'text-ink-3 hover:text-ink',
            )}
          >
            {value === item.value ? (
              <motion.span
                layoutId={layoutId}
                className="bg-gradient-button absolute inset-0 rounded-xl shadow-[0_6px_16px_-8px_var(--tp-brand)]"
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                aria-hidden="true"
              />
            ) : null}
            <span className="relative">{item.label}</span>
            {item.count !== undefined ? (
              <span className={cn('relative rounded-md px-1.5 text-xs tabular', value === item.value ? 'bg-white/20' : 'bg-hover text-ink-3')}>{item.count}</span>
            ) : null}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {children}
    </RadixTabs.Root>
  );
}

export const TabPanel = RadixTabs.Content;
