import React from 'react';

const Skeleton = ({ className = '', variant = 'text', ...props }) => {
  const baseClass = 'animate-pulse bg-zinc-200/80 dark:bg-zinc-800/80 rounded';
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    circle: 'h-10 w-10 rounded-full shrink-0',
    card: 'h-32 w-full rounded-xl',
    kpi: 'h-24 w-full rounded-xl',
    row: 'h-12 w-full'
  };

  return (
    <div
      className={`${baseClass} ${variants[variant] || ''} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
