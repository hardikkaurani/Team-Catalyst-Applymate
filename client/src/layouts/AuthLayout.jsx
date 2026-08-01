import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export default function AuthLayout({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg-primary-light dark:bg-bg-primary-dark p-4 relative overflow-hidden">
      {/* Top right theme toggle button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark shadow-sm hover:bg-accent-primary/10 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Brand Header */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-accent-primary text-white shadow-md">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Applymate
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
              Team Catalyst Placement Portal
            </p>
          </div>
        </div>
      </div>

      {/* Card Content Container */}
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
        © {new Date().getFullYear()} Applymate Portal. All rights reserved.
      </footer>
    </div>
  );
}
