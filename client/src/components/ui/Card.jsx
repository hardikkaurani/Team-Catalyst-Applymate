import React from 'react';

export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-bg-secondary-light dark:bg-bg-secondary-dark 
        border border-border-light dark:border-border-dark 
        rounded-2xl p-6 
        ${hover ? 'hover:shadow-md transition-shadow duration-200' : 'shadow-sm'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
