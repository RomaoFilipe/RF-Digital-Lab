import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em]',
  {
    variants: {
      variant: {
        default: 'border-accent/30 bg-accent/12 text-accent',
        outline: 'border-white/12 bg-white/[0.03] text-sand-2',
        soft: 'border-white/8 bg-white/[0.05] text-slate',
      },
    },
    defaultVariants: {
      variant: 'soft',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
