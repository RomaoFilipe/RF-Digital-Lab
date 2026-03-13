import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-11 min-w-0 w-full max-w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-sand-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30',
      className,
    )}
    {...props}
  />
));
Select.displayName = 'Select';
