import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-sand-2 placeholder:text-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
