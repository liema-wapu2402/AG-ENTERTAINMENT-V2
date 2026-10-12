import { Link, type LinkProps } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/format';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:brightness-110 shadow-lg shadow-accent/20',
  outline: 'border border-line text-fg hover:border-accent hover:text-accent',
  ghost: 'text-fg/80 hover:bg-elevated hover:text-fg',
};
const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

interface Common { variant?: Variant; size?: Size; icon?: ReactNode; className?: string; children?: ReactNode }

/** Builds the shared button classes. */
const classes = ({ variant = 'primary', size = 'md', className }: Common) =>
  cx('inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none', VARIANTS[variant], SIZES[size], className);

/** Regular <button>. */
export function Button({ variant, size, icon, className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={classes({ variant, size, className })} {...rest}>{icon}{children}</button>;
}

/** Same look, but renders a router <Link>. */
export function LinkButton({ variant, size, icon, className, children, ...rest }: Common & LinkProps) {
  return <Link className={classes({ variant, size, className })} {...rest}>{icon}{children}</Link>;
}
