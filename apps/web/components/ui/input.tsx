import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-sand-2 placeholder:text-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';
