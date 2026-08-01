import React, { useState } from 'react';
import { User, Lock, Moon, Sun, Download } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { authApi } from '../api/authApi';
import { companyApi } from '../api/companyApi';

export default function ProfilePage() {
  const { user, updateUserState } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile info state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const response = await authApi.updateProfile(profileData);
      const updated = response.data?.data?.user || response.data?.user || profileData;
      updateUserState(updated);
      setToastMessage({ type: 'success', text: 'Profile information updated!' });
    } catch (error) {
      setToastMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setToastMessage({ type: 'error', text: 'New passwords do not match' });
    }
    if (passwordData.newPassword.length < 6) {
      return setToastMessage({ type: 'error', text: 'Password must be at least 6 characters' });
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setToastMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error) {
      setToastMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await companyApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applymate-data-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToastMessage({ type: 'success', text: 'Account data export downloaded!' });
    } catch (error) {
      setToastMessage({ type: 'error', text: 'Export failed.' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-black text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Account & Profile Settings
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Manage your personal profile details, security credentials, and application preferences.
          </p>
        </div>

        {/* Profile Details Form */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
            <User className="w-5 h-5 text-accent-primary" />
            <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Personal Information
            </h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Saving...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Password Security Form */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-3">
            <Lock className="w-5 h-5 text-accent-primary" />
            <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Change Security Password
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isChangingPassword}>
                {isChangingPassword ? 'Updating Password...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Preferences & Export */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Theme Preference
            </h2>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Toggle between Light and Dark interface mode.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold capitalize">Current Theme: {theme} Mode</span>
              <Button variant="secondary" icon={theme === 'light' ? Moon : Sun} onClick={toggleTheme}>
                Switch Mode
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Export Account Data
            </h2>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Download all application records and progress data in CSV format.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold">CSV Format</span>
              <Button variant="secondary" icon={Download} onClick={handleExportData}>
                Export All Data
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}
    </DashboardLayout>
  );
}
