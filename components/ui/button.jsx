import * as React from 'react';
import { cn } from '@/lib/utils';

// Fallback cva if class-variance-authority behaves differently or custom implementation
const buttonVariants = (variant = 'default', size = 'default', className = '') => {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none';

  const variants = {
    default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.98]',
    destructive:
      'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]',
    outline:
      'border border-broadcast-border bg-transparent shadow-sm hover:bg-slate-800 hover:text-slate-100',
    secondary:
      'bg-slate-800 text-slate-100 shadow-sm hover:bg-slate-700 active:scale-[0.98]',
    ghost: 'hover:bg-slate-800 hover:text-slate-100',
    link: 'text-primary underline-offset-4 hover:underline',
    live: 'bg-red-600 text-white font-bold shadow hover:bg-red-500 active:scale-[0.98] broadcast-glow-red animate-pulse-subtle',
    broadcast:
      'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 broadcast-glow-purple',
    score:
      'bg-slate-800 border-2 border-slate-700 hover:border-purple-500 text-white text-lg font-bold hover:bg-slate-700/80 active:scale-95 transition-all',
  };

  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-md px-8 text-base',
    icon: 'h-9 w-9 p-0',
    huge: 'h-16 px-6 text-xl font-bold',
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;

  return cn(base, variantClass, sizeClass, className);
};

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={buttonVariants(variant, size, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
