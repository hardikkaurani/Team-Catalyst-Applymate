import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import Button from '../components/ui/Button';

export default function LandingLayout({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary-light dark:bg-bg-primary-dark">
      {/* Top Header Navbar */}
      <header className="h-20 border-b border-border-light dark:border-border-dark bg-bg-secondary-light/80 dark:bg-bg-secondary-dark/80 backdrop-blur-md sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent-primary text-white shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Applymate
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
              Team Catalyst
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-bg-primary-light dark:bg-bg-primary-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark hover:bg-accent-primary/10 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
          <Link to="/login">
            <Button variant="ghost" size="md">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="md">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border-light dark:border-border-dark bg-bg-secondary-light dark:bg-bg-secondary-dark text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
        <p>© {new Date().getFullYear()} Applymate Placement Preparation Portal. Built for Team Catalyst.</p>
      </footer>
    </div>
  );
}
