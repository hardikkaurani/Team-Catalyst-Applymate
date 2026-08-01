import React from 'react';

export default function SkeletonLoader({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-slate-300 dark:bg-slate-700/60 rounded-xl ${className}`}
        />
      ))}
    </>
  );
}
