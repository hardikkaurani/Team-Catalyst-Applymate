import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 px-8 border-t border-border-light dark:border-border-dark text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
      <p>© {new Date().getFullYear()} Applymate — Team Catalyst Placement Preparation Portal. Built for excellence.</p>
    </footer>
  );
}
