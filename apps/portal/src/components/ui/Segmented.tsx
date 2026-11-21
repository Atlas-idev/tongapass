import { motion } from 'motion/react';
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Option<T extends string> {
  value: T;
  label: ReactNode;
  count?: number;
}

/** Contrôle segmenté : l'indicateur glisse d'une option à l'autre (layout animation). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  const layoutId = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex max-w-full overflow-x-auto rounded-xl border border-line bg-surface p-1 shadow-[inset_0_1px_0_var(--tp-glass-edge)] backdrop-blur-md no-scrollbar', className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold transition-colors',
              active ? 'text-brand' : 'text-ink-3 hover:text-ink',
            )}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-brand-soft shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--tp-brand)_35%,transparent)]"
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                aria-hidden="true"
              />
            ) : null}
            <span className="relative">{option.label}</span>
            {option.count !== undefined ? <span className={cn('relative tabular text-xs', active ? 'text-brand' : 'text-ink-3')}>{option.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
