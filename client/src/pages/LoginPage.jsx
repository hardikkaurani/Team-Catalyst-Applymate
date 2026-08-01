import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';

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
      const response = await authApi.login(formData);
      const data = response.data?.data || response.data;
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full shadow-lg">
        <h2 className="text-2xl font-bold text-center text-text-primary-light dark:text-text-primary-dark mb-2">
          Sign In to Applymate
        </h2>
        <p className="text-xs text-center text-text-secondary-light dark:text-text-secondary-dark mb-6">
          Enter your account details to access your dashboard
        </p>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-300 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@example.com"
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

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-accent-primary hover:underline">
            Register Here
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
