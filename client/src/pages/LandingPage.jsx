import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, BookOpen, FileText, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import LandingLayout from '../layouts/LandingLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LandingPage() {
  const features = [
    {
      icon: Briefcase,
      title: 'Application Management',
      description: 'Track all your company applications, interview rounds, dates, and statuses in one place.',
    },
    {
      icon: BookOpen,
      title: 'Preparation Matrix',
      description: 'Organize study materials across DSA, Aptitude, Core Subjects, and link them to active companies.',
    },
    {
      icon: FileText,
      title: 'Interview Reflections',
      description: 'Log detailed question bank reflections, difficulty ratings, and topic tags per round.',
    },
    {
      icon: TrendingUp,
      title: 'Placement Analytics',
      description: 'Gain data-backed insights on pipeline conversion funnels and round performance.',
    },
  ];

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4" /> Team Catalyst Placement Hub
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight leading-tight">
          Supercharge Your Placement Journey with <span className="text-accent-primary">Applymate</span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
          Consolidate application tracking, preparation resources, interview reflections, and analytics into a single high-performance platform.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/register">
            <Button variant="primary" size="lg" className="shadow-lg">
              Start Preparation Free <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Sign In to Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="px-6 py-16 bg-bg-secondary-light/40 dark:bg-bg-secondary-dark/40 border-y border-border-light dark:border-border-dark">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
              Everything You Need for Campus & Off-Campus Placements
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Designed specifically for software engineering candidates seeking placement success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card key={idx} hover className="flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-accent-primary/10 text-accent-primary w-fit">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
