import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'group/button relative isolate inline-flex select-none items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl font-semibold ' +
  'transition-[background-color,border-color,color,box-shadow,transform,filter] duration-200 ease-out active:scale-[0.97] ' +
  'disabled:pointer-events-none disabled:opacity-50';

/*
 * Bouton principal : dégradé lagon → indigo (texte ≥ 4,5:1 sur toute sa longueur), reflet
 * de verre en haut et balayage lumineux au survol. Les autres variantes sont en verre.
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-button text-on-brand shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_8px_20px_-8px_color-mix(in_oklab,var(--tp-brand)_70%,transparent)] ' +
    'hover:shadow-[0_1px_0_rgb(255_255_255/0.3)_inset,0_12px_26px_-8px_color-mix(in_oklab,var(--tp-accent)_60%,transparent)] hover:brightness-[1.06] ' +
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-[linear-gradient(110deg,transparent_25%,rgb(255_255_255/0.28)_50%,transparent_75%)] before:transition-transform before:duration-700 before:content-[''] hover:before:translate-x-full",
  secondary:
    'border border-line-strong bg-surface text-ink shadow-[inset_0_1px_0_var(--tp-glass-edge),0_1px_2px_rgb(15_23_42/0.05)] backdrop-blur-md hover:border-ink-3/40 hover:bg-raised',
  ghost: 'text-ink-2 hover:bg-hover hover:text-ink',
  danger: 'bg-danger text-white shadow-[0_8px_20px_-10px_var(--tp-danger)] hover:bg-danger-strong dark:text-[#2a0710]',
  'danger-ghost': 'text-danger hover:bg-danger-soft',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', loading = false, icon, className, children, disabled, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
});

export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: LinkProps & { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode }) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
    </Link>
  );
}

export function IconButton({
  label,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-xl text-ink-3 transition-[background-color,color,transform] duration-200 hover:bg-hover hover:text-ink active:scale-95',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
