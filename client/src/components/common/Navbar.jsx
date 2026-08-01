import React from 'react';
import { Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { getInitials } from '../../utils/formatters';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-bg-secondary-light dark:bg-bg-secondary-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-text-primary-light dark:text-text-primary-dark hover:bg-accent-primary/10 transition-colors focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <span className="text-xl">☰</span>
        </button>
        <div>
          <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
            Welcome back, {user?.name || 'Student'}
          </h2>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            Applymate Placement Portal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-bg-primary-light dark:bg-bg-primary-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark hover:bg-accent-primary/10 transition-colors"
          title="Toggle Dark / Light Mode"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* User avatar & logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-border-light dark:border-border-dark">
          <div className="w-9 h-9 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {getInitials(user?.name)}
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
