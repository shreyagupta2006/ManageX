import React from 'react';

const Badge = ({
  children,
  variant = 'secondary',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border transition-colors';
  
  const variants = {
    // Basic statuses
    primary: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent',
    secondary: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700/50',
    muted: 'bg-zinc-50 text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400 border-zinc-100 dark:border-zinc-800',
    
    // Priority / category mappings
    high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
    low: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
    
    // Action task counts states
    active: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/30',
    newTask: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/30',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
    failed: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30'
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.secondary} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
