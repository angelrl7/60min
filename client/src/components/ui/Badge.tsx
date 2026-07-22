import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const badgeVariants = cva('rounded-full px-2.5 py-0.5 text-xs font-bold text-white', {
  variants: {
    variant: {
      brand: 'bg-brand-600',
      destructive: 'bg-red-500',
      neutral: 'bg-slate-400',
    },
  },
  defaultVariants: {
    variant: 'brand',
  },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
