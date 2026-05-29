import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  gradient = false,
  onClick,
  ...props
}) => {
  const baseClass = `bg-card text-card-foreground rounded-xl border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden ${
    gradient ? 'bg-gradient-to-br from-card to-zinc-50/50 dark:to-zinc-900/30' : ''
  } ${onClick ? 'cursor-pointer' : ''} ${className}`;

  if (hoverEffect || onClick) {
    return (
      <motion.div
        whileHover={{
          y: -4,
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.08)',
          borderColor: 'hsl(var(--ring) / 0.15)'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={onClick}
        className={baseClass}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClass} {...props}>
      {children}
    </div>
  );
};

export default Card;
