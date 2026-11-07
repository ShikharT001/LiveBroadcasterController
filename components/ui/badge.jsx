import * as React from 'react';
import { cn } from '@/lib/utils';

function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-primary/20 text-primary-foreground border-primary/30',
    secondary: 'bg-slate-800 text-slate-300 border-slate-700',
    destructive: 'bg-red-500/20 text-red-400 border-red-500/40',
    outline: 'text-slate-300 border-slate-700',
    live: 'bg-red-950/80 text-red-400 border-red-500/50 font-bold broadcast-glow-red animate-pulse',
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50 font-medium',
    warning: 'bg-amber-950/80 text-amber-400 border-amber-500/50 font-medium',
    info: 'bg-blue-950/80 text-blue-400 border-blue-500/50 font-medium',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
