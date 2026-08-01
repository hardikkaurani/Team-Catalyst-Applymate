import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'bg-accent-primary hover:bg-accent-hover-light text-white disabled:opacity-50 shadow-sm',
    secondary:
      'bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark hover:bg-border-light dark:hover:bg-border-dark border border-border-light dark:border-border-dark',
    ghost:
      'bg-transparent hover:bg-accent-primary/10 text-text-primary-light dark:text-text-primary-dark',
    danger: 'bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 shadow-sm',
    outline:
      'bg-transparent border border-accent-primary text-text-primary-light dark:text-text-primary-dark hover:bg-accent-primary/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
