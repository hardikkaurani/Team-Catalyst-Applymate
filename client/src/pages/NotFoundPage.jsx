import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import LandingLayout from '../layouts/LandingLayout';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <LandingLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="p-4 rounded-full bg-accent-primary/10 text-accent-primary">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-6xl font-black text-text-primary-light dark:text-text-primary-dark">
          404
        </h1>
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Page Not Found
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-md">
          The requested page route does not exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </LandingLayout>
  );
}
