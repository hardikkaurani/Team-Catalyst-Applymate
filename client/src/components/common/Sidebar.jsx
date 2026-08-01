import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  History,
  BookOpen,
  FileText,
  TrendingUp,
  BarChart3,
  User,
  GraduationCap,
} from 'lucide-react';

export default function Sidebar({ isOpen }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/applications', icon: Briefcase },
    { name: 'Timeline', path: '/timeline', icon: History },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Journal', path: '/journal', icon: FileText },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Insights', path: '/insights', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 bg-bg-secondary-light dark:bg-bg-secondary-dark border-r border-border-light dark:border-border-dark flex flex-col z-40 shrink-0`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-border-light dark:border-border-dark">
        <div className="p-2 rounded-xl bg-accent-primary text-white shadow-sm shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        {isOpen && (
          <div className="truncate">
            <h1 className="font-extrabold text-lg text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Applymate
            </h1>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary-light dark:text-text-secondary-dark">
              Team Catalyst
            </p>
          </div>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-accent-primary text-white shadow-sm font-semibold'
                    : 'text-text-primary-light dark:text-text-primary-dark hover:bg-accent-primary/10'
                }`
              }
              title={!isOpen ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isOpen && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Branding */}
      {isOpen && (
        <div className="p-4 border-t border-border-light dark:border-border-dark text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
          v1.0.0 • Catalyst Portal
        </div>
      )}
    </aside>
  );
}
