# Frontend Implementation Master Prompt - React JavaScript MERN Stack

## Context & Scope
You are tasked with implementing the complete frontend of **Applymate** (Team Catalyst Placement Preparation Portal) using **React 18/19 with JavaScript (JSX)** based on the specifications in `client/FRONTEND_PLAN.md` (RFC-001 v2.0.0) and `IMPLEMENTATION_PLAN.md`.

**CRITICAL CONSTRAINT:** You must **ONLY** make changes to files within the `client/` directory. **DO NOT** touch, modify, or create any files in the `server/` directory or at the root level (except this documentation file).

---

## Required Reading
Before beginning implementation, thoroughly read and analyze:
1. **`client/FRONTEND_PLAN.md`** - Complete React JavaScript frontend architecture blueprint (RFC-001 v2.0.0)
2. **`IMPLEMENTATION_PLAN.md`** - Full-stack implementation phases (focus on frontend sections only)

---

## Technology Stack (Frontend Only - JavaScript MERN)
- **Framework:** React 18/19 (JavaScript JSX, **NO TypeScript**)
- **Build Tool:** Vite
- **Language:** JavaScript (ES6+) with `.jsx` file extensions
- **Routing:** React Router v6/v7
- **State Management:** React Context API (AuthContext, CompanyContext, ThemeContext)
- **Styling:** Tailwind CSS (with custom color tokens from design system)
- **HTTP Client:** Axios with interceptors
- **Charts:** Recharts
- **Animations:** Framer Motion (optional) + Tailwind transitions
- **Icons:** Lucide React (or React Icons)
- **Forms:** Native React controlled components (no complex form libraries needed)
- **Date Handling:** date-fns

---

## Project Foundation Setup

### Step 1: Initialize Vite + React (JavaScript)
```bash
# Already initialized, verify package.json has:
# - react, react-dom
# - react-router-dom
# - axios
# - recharts
# - framer-motion
# - lucide-react (or react-icons)
# - date-fns
```

### Step 2: Configure Tailwind CSS (`tailwind.config.js`)
Implement the **custom color palette** from FRONTEND_PLAN.md Section 2.1:

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // Enable dark mode via .dark class on <html>
  theme: {
    extend: {
      colors: {
        'bg-primary-light': '#D5DEEF',
        'bg-primary-dark': '#1F2E47',
        'bg-secondary-light': '#F0F3FA',
        'bg-secondary-dark': '#395886',
        'accent-primary': '#8AAEE0',
        'accent-hover-light': '#638ECB',
        'accent-hover-dark': '#B1C9EF',
        'text-primary-light': '#395886',
        'text-primary-dark': '#F0F3FA',
        'text-secondary-light': '#638ECB',
        'text-secondary-dark': '#D5DEEF',
        'border-light': '#B1C9EF',
        'border-dark': '#638ECB',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};
```

### Step 3: Configure Global CSS (`src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #D5DEEF;
  --bg-secondary: #F0F3FA;
  --accent-primary: #8AAEE0;
  --accent-hover: #638ECB;
  --text-primary: #395886;
  --text-secondary: #638ECB;
  --border-color: #B1C9EF;
}

.dark {
  --bg-primary: #1F2E47;
  --bg-secondary: #395886;
  --accent-primary: #8AAEE0;
  --accent-hover: #B1C9EF;
  --text-primary: #F0F3FA;
  --text-secondary: #D5DEEF;
  --border-color: #638ECB;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', 'Plus Jakarta Sans', system-ui, sans-serif;
}
```

### Step 4: Configure Vite (`vite.config.js`)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## Complete Folder Structure to Create

Follow this exact structure from FRONTEND_PLAN.md Section 3:

```
client/src/
├── main.jsx                  # React app entry point
├── App.jsx                   # Main App routing wrapper
├── index.css                 # Tailwind + global styles
├── api/                      # Axios instance and API services
│   ├── axiosClient.js
│   ├── authApi.js
│   ├── companyApi.js
│   ├── resourceApi.js
│   ├── journalApi.js
│   ├── timelineApi.js
│   ├── actionApi.js
│   └── insightApi.js
├── assets/                   # Images, logos, icons
│   ├── logo.svg
│   └── hero.png
├── components/               # Reusable UI components
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── Modal.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Pagination.jsx
│   │   ├── SkeletonLoader.jsx
│   │   └── EmptyState.jsx
│   ├── dashboard/
│   │   ├── KpiCard.jsx
│   │   ├── ActionCenterWidget.jsx
│   │   ├── StatusDistributionChart.jsx
│   │   └── RecentActivityList.jsx
│   └── ui/                   # Base styled primitives
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       └── Toast.jsx
├── constants/                # Enums, statuses, API routes
│   ├── apiRoutes.js
│   └── statusConstants.js
├── contexts/                 # React Context providers
│   ├── AuthContext.jsx
│   ├── CompanyContext.jsx
│   └── ThemeContext.jsx
├── hooks/                    # Custom React hooks
│   ├── useAuth.js
│   ├── useCompany.js
│   ├── useDebounce.js
│   └── useTheme.js
├── layouts/                  # Page layout wrappers
│   ├── AuthLayout.jsx
│   ├── DashboardLayout.jsx
│   └── LandingLayout.jsx
├── pages/                    # Main application pages
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── ApplicationsPage.jsx
│   ├── CompanyDetailPage.jsx
│   ├── TimelinePage.jsx
│   ├── ResourcesPage.jsx
│   ├── JournalPage.jsx
│   ├── ProgressPage.jsx
│   ├── InsightsPage.jsx
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── routes/                   # Route guards
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
└── utils/                    # Helper utilities
    ├── dateUtils.js
    └── formatters.js
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (API + Context)

#### 1.1 Axios Client Setup (`src/api/axiosClient.js`)

```javascript
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
```

#### 1.2 Auth Context (`src/contexts/AuthContext.jsx`)
```javascript
import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axiosClient.get('/auth/me')
        .then(res => setUser(res.data.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (data) => {
    localStorage.setItem('token', data.accessToken);
    setToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axiosClient.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### 1.3 Theme Context (`src/contexts/ThemeContext.jsx`)

```javascript
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### 1.4 Custom Hooks

**`src/hooks/useAuth.js`**
```javascript
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**`src/hooks/useTheme.js`**
```javascript
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export function useTheme() {
  return useContext(ThemeContext);
}
```

**`src/hooks/useDebounce.js`**
```javascript
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

---

### Phase 2: UI Primitive Components (`src/components/ui/`)

#### 2.1 Button Component (`src/components/ui/Button.jsx`)

```javascript
import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  type = 'button',
  className = ''
}) {
  const baseStyles = 'rounded-xl font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-accent-primary hover:bg-accent-hover-light text-white disabled:opacity-50',
    secondary: 'bg-bg-secondary-light dark:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark hover:bg-border-light',
    ghost: 'bg-transparent hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark text-text-primary-light dark:text-text-primary-dark',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
```

#### 2.2 Card Component (`src/components/ui/Card.jsx`)
```javascript
import React from 'react';

export default function Card({ children, className = '', hover = false }) {
  return (
    <div className={`
      bg-bg-secondary-light dark:bg-bg-secondary-dark 
      border border-border-light dark:border-border-dark 
      rounded-2xl p-6 
      ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
```

#### 2.3 Input Component (`src/components/ui/Input.jsx`)
```javascript
import React from 'react';

export default function Input({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false,
  className = ''
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          px-4 py-2 rounded-xl
          bg-bg-primary-light dark:bg-bg-primary-dark
          border border-border-light dark:border-border-dark
          text-text-primary-light dark:text-text-primary-dark
          placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark
          focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
          ${error ? 'border-red-500' : ''}
        `}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
```

#### 2.4 StatusBadge Component (`src/components/common/StatusBadge.jsx`)

```javascript
import React from 'react';

const STATUS_CONFIG = {
  Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300',
  OA: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300',
  Technical: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
  HR: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-300',
  Selected: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300',
};

export default function StatusBadge({ status }) {
  const styleClass = STATUS_CONFIG[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styleClass}`}>
      {status}
    </span>
  );
}
```

---

### Phase 3: Routing & Layouts

#### 3.1 Route Guards

**`src/routes/ProtectedRoute.jsx`**
```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}
```

**`src/routes/PublicRoute.jsx`**
```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
}
```

#### 3.2 Main Routing (`src/routes/AppRoutes.jsx`)

```javascript
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Lazy load pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ApplicationsPage = lazy(() => import('../pages/ApplicationsPage'));
const CompanyDetailPage = lazy(() => import('../pages/CompanyDetailPage'));
const TimelinePage = lazy(() => import('../pages/TimelinePage'));
const ResourcesPage = lazy(() => import('../pages/ResourcesPage'));
const JournalPage = lazy(() => import('../pages/JournalPage'));
const ProgressPage = lazy(() => import('../pages/ProgressPage'));
const InsightsPage = lazy(() => import('../pages/InsightsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/applications/:id" element={<ProtectedRoute><CompanyDetailPage /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

#### 3.3 Dashboard Layout (`src/layouts/DashboardLayout.jsx`)

```javascript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Applications', path: '/applications', icon: '💼' },
    { name: 'Timeline', path: '/timeline', icon: '⏱️' },
    { name: 'Resources', path: '/resources', icon: '📚' },
    { name: 'Journal', path: '/journal', icon: '📝' },
    { name: 'Progress', path: '/progress', icon: '📈' },
    { name: 'Insights', path: '/insights', icon: '🔍' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="flex h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-bg-secondary-light dark:bg-bg-secondary-dark border-r border-border-light dark:border-border-dark`}>
        <div className="p-4 flex items-center justify-between">
          <h1 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>Applymate</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl">☰</button>
        </div>
        <nav className="mt-8">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent-primary/10 text-text-primary-light dark:text-text-primary-dark"
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-bg-secondary-light dark:bg-bg-secondary-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Welcome, {user?.name}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="px-3 py-1 rounded-xl bg-accent-primary text-white">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={logout} className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

### Phase 4: Authentication Pages

#### 4.1 Login Page (`src/pages/LoginPage.jsx`)

```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosClient from '../api/axiosClient';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', formData);
      login(response.data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login to Applymate</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center mt-4 text-text-secondary-light dark:text-text-secondary-dark">
          Don't have an account? <Link to="/register" className="text-accent-primary hover:underline">Register</Link>
        </p>
      </Card>
    </div>
  );
}
```

---

### Phase 5: Dashboard Page with KPIs

#### 5.1 Dashboard Page (`src/pages/DashboardPage.jsx`)

```javascript
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import KpiCard from '../components/dashboard/KpiCard';
import axiosClient from '../api/axiosClient';

export default function DashboardPage() {
  const [kpis, setKpis] = useState({ total: 0, active: 0, offers: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKpis();
  }, []);

  const fetchKpis = async () => {
    try {
      const response = await axiosClient.get('/companies');
      const companies = response.data.data.companies;
      
      setKpis({
        total: companies.length,
        active: companies.filter(c => !['Selected', 'Rejected'].includes(c.status)).length,
        offers: companies.filter(c => c.status === 'Selected').length,
        rejected: companies.filter(c => c.status === 'Rejected').length,
      });
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Companies" value={kpis.total} icon="💼" color="blue" />
        <KpiCard title="Active Applications" value={kpis.active} icon="🔄" color="purple" />
        <KpiCard title="Offers" value={kpis.offers} icon="✅" color="green" />
        <KpiCard title="Rejected" value={kpis.rejected} icon="❌" color="red" />
      </div>

      {/* Placeholder for charts and widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-2xl p-6 border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold mb-4">Status Distribution</h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Chart placeholder - implement with Recharts</p>
        </div>
        
        <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-2xl p-6 border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Timeline feed placeholder</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

#### 5.2 KPI Card Component (`src/components/dashboard/KpiCard.jsx`)
```javascript
import React from 'react';
import Card from '../ui/Card';

export default function KpiCard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    green: 'text-emerald-500',
    red: 'text-red-500',
  };

  return (
    <Card hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`text-4xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </Card>
  );
}
```

---

### Phase 6: Applications Page (CRUD + Search + Filter)

#### 6.1 Applications Page (`src/pages/ApplicationsPage.jsx`)

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import axiosClient from '../api/axiosClient';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/ui/Button';
import { useDebounce } from '../hooks/useDebounce';

export default function ApplicationsPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearch, statusFilter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter.length > 0) params.status = statusFilter.join(',');

      const response = await axiosClient.get('/companies', { params });
      setCompanies(response.data.data.companies);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    
    try {
      await axiosClient.delete(`/companies/${id}`);
      setCompanies(companies.filter(c => c._id !== id));
    } catch (error) {
      alert('Failed to delete company');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Button variant="primary" onClick={() => alert('Add Company Modal - TODO')}>
          + Add Company
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search companies..." />
        {/* Status filter checkboxes - TODO */}
      </div>

      {/* Companies Table */}
      <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent-primary/10 border-b border-border-light dark:border-border-dark">
            <tr>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Applied On</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : companies.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">No companies found</td></tr>
            ) : (
              companies.map(company => (
                <tr key={company._id} className="border-b border-border-light dark:border-border-dark hover:bg-accent-primary/5">
                  <td className="px-6 py-4 font-medium">{company.name}</td>
                  <td className="px-6 py-4">{company.role}</td>
                  <td className="px-6 py-4"><StatusBadge status={company.status} /></td>
                  <td className="px-6 py-4">{new Date(company.applicationDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <Link to={`/applications/${company._id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(company._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
```

---

### Phase 7: API Service Functions

Create API service files in `src/api/` for each feature:

**`src/api/companyApi.js`**
```javascript
import axiosClient from './axiosClient';

export const companyApi = {
  getAll: (params) => axiosClient.get('/companies', { params }),
  getById: (id) => axiosClient.get(`/companies/${id}`),
  create: (data) => axiosClient.post('/companies', data),
  update: (id, data) => axiosClient.patch(`/companies/${id}`, data),
  delete: (id) => axiosClient.delete(`/companies/${id}`),
  updateStatus: (id, status) => axiosClient.patch(`/companies/${id}/status`, { status }),
  exportCsv: () => axiosClient.get('/companies/export/csv', { responseType: 'blob' }),
};
```

**`src/api/authApi.js`**
```javascript
import axiosClient from './axiosClient';

export const authApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  login: (data) => axiosClient.post('/auth/login', data),
  getMe: () => axiosClient.get('/auth/me'),
};
```

---

## Implementation Checklist

Follow the **150+ item verification checklist** from FRONTEND_PLAN.md Section 12 before considering implementation complete.

### Critical Items to Verify:


- [ ] All color tokens match specification from Section 2.1
- [ ] Dark mode toggle works correctly
- [ ] Authentication flow (register/login/logout) functional
- [ ] Protected routes redirect unauthenticated users
- [ ] Dashboard displays accurate KPI data
- [ ] Applications CRUD operations work
- [ ] Search input debounces at 300ms
- [ ] Status badges display correct colors
- [ ] Responsive at breakpoints: 375px, 768px, 1024px, 1440px
- [ ] No console errors or warnings
- [ ] `npm run build` passes successfully
- [ ] All 150+ items from checklist verified

---

## Pages to Implement

### Priority 1 (Core Functionality):
1. ✅ **LandingPage.jsx** - Hero section, features, CTA
2. ✅ **LoginPage.jsx** - Authentication
3. ✅ **RegisterPage.jsx** - User registration
4. ✅ **DashboardPage.jsx** - KPI cards, charts, action center
5. ✅ **ApplicationsPage.jsx** - Company list with CRUD
6. **CompanyDetailPage.jsx** - Tabbed detailed view

### Priority 2 (Extended Features):
7. **TimelinePage.jsx** - Chronological status feed
8. **ResourcesPage.jsx** - Preparation materials management
9. **JournalPage.jsx** - Interview reflections
10. **ProgressPage.jsx** - Category-wise progress tracking
11. **InsightsPage.jsx** - Analytics charts (Recharts)
12. **ProfilePage.jsx** - User settings, password change

### Priority 3 (Polish):
13. **NotFoundPage.jsx** - 404 error page

---

## Component Implementation Guide

### Must-Have Components:

**`src/components/common/`**
- ✅ `StatusBadge.jsx` - Color-coded status pills
- `SearchBar.jsx` - Debounced search input
- `Pagination.jsx` - Page navigation controls
- `Modal.jsx` - Reusable modal dialog
- `ConfirmDialog.jsx` - Confirmation prompts
- `SkeletonLoader.jsx` - Loading placeholders
- `EmptyState.jsx` - No data illustrations
- `Navbar.jsx` - Top navigation bar
- `Sidebar.jsx` - Side navigation menu
- `Footer.jsx` - Footer component

**`src/components/ui/`**
- ✅ `Button.jsx` - Primary UI button
- ✅ `Card.jsx` - Container card
- ✅ `Input.jsx` - Form input field
- `Select.jsx` - Dropdown select
- `Toast.jsx` - Notification toasts

**`src/components/dashboard/`**
- ✅ `KpiCard.jsx` - Metric display card
- `ActionCenterWidget.jsx` - Smart actions list
- `StatusDistributionChart.jsx` - Recharts pie chart
- `RecentActivityList.jsx` - Timeline feed

---

## Backend API Integration (DO NOT MODIFY SERVER)

The frontend should consume these backend endpoints (already implemented):

### Auth Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user

### Company Endpoints:
- `GET /api/companies` - List all companies (with query params: search, status, sort, page, limit)
- `GET /api/companies/:id` - Get company details
- `POST /api/companies` - Create new company
- `PATCH /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company
- `PATCH /api/companies/:id/status` - Update status (adds to statusHistory)
- `GET /api/companies/export/csv` - Export CSV

### Resource Endpoints:
- `GET /api/resources` - List resources
- `POST /api/resources` - Create resource
- `PATCH /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `GET /api/resources/progress` - Get progress by category

### Journal Endpoints:
- `GET /api/journal` - List journal entries
- `POST /api/journal` - Create entry
- `PATCH /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry

### Timeline Endpoints:
- `GET /api/timeline?companyId&status&startDate&endDate` - Get timeline feed

### Action & Insight Endpoints:
- `GET /api/actions` - Smart action center items
- `GET /api/insights/funnel` - Pipeline funnel data
- `GET /api/insights/weakest-round` - Round analysis
- `GET /api/insights/topic-frequency` - Topic aggregation
- `GET /api/insights/response-time` - Response metrics

---

## Code Quality Standards

### JavaScript Best Practices:
1. Use **functional components** with hooks
2. Use **const/let** (no var)
3. Use **arrow functions** for handlers
4. Use **destructuring** for props and state
5. Use **template literals** for strings
6. Use **optional chaining** (`?.`) for safe property access
7. Use **spread operator** for immutable updates

### React Patterns:
1. One component per file
2. Export default at bottom
3. Props destructured in function signature
4. useState for local state, Context for shared state
5. useEffect for side effects (API calls, subscriptions)
6. Custom hooks for reusable logic
7. Lazy loading for route components

### File Naming:
- Components: PascalCase (e.g., `StatusBadge.jsx`)
- Hooks: camelCase with "use" prefix (e.g., `useAuth.js`)
- Utils: camelCase (e.g., `dateUtils.js`)
- Constants: camelCase (e.g., `apiRoutes.js`)

### Styling:
- Prefer Tailwind utility classes
- Use design tokens from `tailwind.config.js`
- Responsive classes: `sm:`, `md:`, `lg:`, `xl:`
- Dark mode classes: `dark:`
- Avoid inline styles

---

## Development Workflow

1. **Start Development Server:**
```bash
cd client
npm run dev
```

2. **Build for Production:**
```bash
npm run build
```

3. **Preview Production Build:**
```bash
npm run preview
```

4. **Lint Code:**
```bash
npm run lint
```

---

## Success Criteria

The frontend implementation is complete when:

1. ✅ All 13 pages are implemented and navigable
2. ✅ Authentication flow works (register, login, logout, protected routes)
3. ✅ Dashboard displays accurate KPI data from API
4. ✅ Applications page supports CRUD operations
5. ✅ Search and filter functionality works with 300ms debounce
6. ✅ Status badges display correct colors per status
7. ✅ Dark mode toggle persists across page refreshes
8. ✅ Layout is fully responsive (mobile, tablet, desktop)
9. ✅ All 150+ verification items from Section 12 pass
10. ✅ `npm run build` completes without errors
11. ✅ No console errors or warnings in browser
12. ✅ Code follows project structure and naming conventions

---

## Important Reminders

🚫 **DO NOT:**
- Modify or create files in `server/` directory
- Change root-level configuration files
- Use TypeScript (.ts/.tsx files)
- Add unnecessary dependencies

✅ **DO:**
- Work exclusively in `client/` directory
- Use JavaScript (.jsx files)
- Follow the exact folder structure from Section 3
- Implement all color tokens from Section 2.1
- Verify all 150+ checklist items from Section 12
- Keep components simple and reusable
- Use React Context for state management
- Implement responsive design at all breakpoints

---

## Quick Start Implementation Order

1. ✅ Configure Tailwind with design tokens
2. ✅ Set up Axios client with interceptors
3. ✅ Create AuthContext and ThemeContext
4. ✅ Build UI primitive components (Button, Card, Input)
5. ✅ Implement routing with guards
6. ✅ Create DashboardLayout
7. ✅ Build authentication pages (Login, Register)
8. ✅ Implement Dashboard with KPIs
9. ✅ Create Applications page with CRUD
10. Build remaining pages (Timeline, Resources, Journal, Progress, Insights, Profile)
11. Add charts with Recharts
12. Polish animations and micro-interactions
13. Test responsiveness at all breakpoints
14. Verify all 150+ checklist items
15. Build and deploy

---

**BEGIN IMPLEMENTATION NOW!**

Start with Phase 1 (Core Infrastructure) and work through each phase sequentially. Refer back to `FRONTEND_PLAN.md` for detailed specifications on colors, typography, component behavior, and the complete 150+ item verification checklist.

Remember: This is a **JavaScript MERN stack** project. Keep it simple, clean, and maintainable. Focus on delivering a working, responsive, accessible frontend that integrates seamlessly with the existing backend API.
