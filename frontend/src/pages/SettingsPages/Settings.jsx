import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Bell, Shield, KeyRound, LogOut,
  Globe, Smartphone, Monitor, Moon, Sun,
  Eye, EyeOff, MapPin, CreditCard,
  Download, Trash2, AlertTriangle, Settings,
  ChevronRight, Save, X, Check
} from 'lucide-react';

export default function SettingsPage({ isLoggedIn, user, onUserUpdate }) {
  // Account Settings
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    showDetails: true,
    allowAutoRequests: true,
    showActivityStatus: false,
    profileVisibility: 'public', // public, friends, private
    locationSharing: true,
    dataCollection: false,
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    marketing: false,
    bookingUpdates: true,
    promotions: false,
    securityAlerts: true,
  });

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light', // light, dark, auto
    language: 'en',
    timezone: 'Asia/Kolkata',
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: '30', // minutes
    deviceTracking: true,
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete account modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Data export
  const [isExporting, setIsExporting] = useState(false);

  // Create a ref to store scroll position
  const scrollPosition = useRef(0);

  // useLayoutEffect to restore scroll position after success/error message appears
  useLayoutEffect(() => {
    if (success || error) {
      window.scrollTo(0, scrollPosition.current);
    }
  }, [success, error]);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setPrivacySettings(prev => ({ ...prev, ...parsed.privacy }));
      setNotifications(prev => ({ ...prev, ...parsed.notifications }));
      setDisplaySettings(prev => ({ ...prev, ...parsed.display }));
      setSecuritySettings(prev => ({ ...prev, ...parsed.security }));
    }
  }, []);

  const saveSettings = async (settingsType, settings) => {
    // Store current scroll position before state update
    scrollPosition.current = window.scrollY;

    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("You are not authorized. Please log in again.");
        return;
      }

      // Save to localStorage for demo (replace with API call)
      const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      currentSettings[settingsType] = settings;
      localStorage.setItem('userSettings', JSON.stringify(currentSettings));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyToggle = (key) => {
    const newSettings = { ...privacySettings, [key]: !privacySettings[key] };
    setPrivacySettings(newSettings);
    saveSettings('privacy', newSettings);
  };

  const handleNotificationToggle = (key) => {
    const newSettings = { ...notifications, [key]: !notifications[key] };
    setNotifications(newSettings);
    saveSettings('notifications', newSettings);
  };

  const handleSecurityToggle = (key) => {
    const newSettings = { ...securitySettings, [key]: !securitySettings[key] };
    setSecuritySettings(newSettings);
    saveSettings('security', newSettings);
  };

  const handleDisplayChange = (key, value) => {
    const newSettings = { ...displaySettings, [key]: value };
    setDisplaySettings(newSettings);
    saveSettings('display', newSettings);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/changepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password.');
      }

      setPasswordSuccess(data.message);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess('');
      }, 2000);

    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataExport = async () => {
    const BackendUrl=import.meta.env.VITE_API_URL;
    setIsExporting(true);
    try {
      // Simulate fetching previous rides from API
      const response = await fetch(`${BackendUrl}/api/rides/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const rides = await response.json();

      // If no API is available, use mock ride data for demonstration
      const mockRides = rides || "No Booked Rides";

      // Prepare data for export
      const data = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          // Include other user fields as available
        },
        settings: {
          privacy: privacySettings,
          notifications: notifications,
          display: displaySettings,
          security: securitySettings,
        },
        rides: mockRides,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('Data exported successfully!');
    } catch (err) {
      setError('Failed to export data.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== 'delete my account') {
      setError('Please type "delete my account" to confirm.');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BackendUrl}/api/users/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account.');
      }

      alert('Account deleted successfully. You will be redirected to the homepage.');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn || !user) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 pt-20 px-4 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">Please log in to access your settings.</p>
        <Link to="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">
          Go to Login
        </Link>
      </div>
    </div>;
  }

  const ToggleSwitch = ({ isEnabled, onToggle, disabled = false }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`${isEnabled ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
  );

  const SettingsSection = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex items-center mb-6">
        <Icon className="h-6 w-6 text-emerald-500 mr-3" />
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Settings className="h-12 w-12 text-emerald-500 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
            </div>
            <p className="text-lg text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                {success}
              </div>
            </div>
          )}

          {/* Account Settings */}
          <SettingsSection title="Account Settings" icon={User}>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <KeyRound className="h-5 w-5 text-gray-400 mr-4" />
                  <div>
                    <span className="text-gray-900 font-medium">Password</span>
                    <p className="text-sm text-gray-500">Change your account password</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="text-emerald-600 hover:text-emerald-800 font-semibold"
                >
                  Change
                </button>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-4" />
                  <div>
                    <span className="text-gray-900 font-medium">Email</span>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="text-emerald-600 hover:text-emerald-800 font-semibold"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </SettingsSection>

          {/* Privacy Settings */}
          <SettingsSection title="Privacy Settings" icon={Shield}>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Show personal details to riders</span>
                  <p className="text-sm text-gray-500">Allow riders to see your contact information</p>
                </div>
                <ToggleSwitch
                  isEnabled={privacySettings.showDetails}
                  onToggle={() => handlePrivacyToggle('showDetails')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Allow automatic ride requests</span>
                  <p className="text-sm text-gray-500">Let the system automatically match you with rides</p>
                </div>
                <ToggleSwitch
                  isEnabled={privacySettings.allowAutoRequests}
                  onToggle={() => handlePrivacyToggle('allowAutoRequests')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Show activity status</span>
                  <p className="text-sm text-gray-500">Display when you're online to other users</p>
                </div>
                <ToggleSwitch
                  isEnabled={privacySettings.showActivityStatus}
                  onToggle={() => handlePrivacyToggle('showActivityStatus')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Location sharing</span>
                  <p className="text-sm text-gray-500">Share your location for better ride matching</p>
                </div>
                <ToggleSwitch
                  isEnabled={privacySettings.locationSharing}
                  onToggle={() => handlePrivacyToggle('locationSharing')}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Profile visibility</span>
                  <p className="text-sm text-gray-500">Who can see your profile information</p>
                </div>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => {
                    const newSettings = { ...privacySettings, profileVisibility: e.target.value };
                    setPrivacySettings(newSettings);
                    saveSettings('privacy', newSettings);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                >
                  <option value="public">Everyone</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Only Me</option>
                </select>
              </div>
            </div>
          </SettingsSection>

          {/* Notification Settings */}
          <SettingsSection title="Notification Settings" icon={Bell}>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Push notifications</span>
                  <p className="text-sm text-gray-500">Receive notifications on your device</p>
                </div>
                <ToggleSwitch
                  isEnabled={notifications.push}
                  onToggle={() => handleNotificationToggle('push')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Email notifications</span>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <ToggleSwitch
                  isEnabled={notifications.email}
                  onToggle={() => handleNotificationToggle('email')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">SMS notifications</span>
                  <p className="text-sm text-gray-500">Receive important updates via SMS</p>
                </div>
                <ToggleSwitch
                  isEnabled={notifications.sms}
                  onToggle={() => handleNotificationToggle('sms')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Booking updates</span>
                  <p className="text-sm text-gray-500">Get notified about ride confirmations and changes</p>
                </div>
                <ToggleSwitch
                  isEnabled={notifications.bookingUpdates}
                  onToggle={() => handleNotificationToggle('bookingUpdates')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Security alerts</span>
                  <p className="text-sm text-gray-500">Get notified about account security events</p>
                </div>
                <ToggleSwitch
                  isEnabled={notifications.securityAlerts}
                  onToggle={() => handleNotificationToggle('securityAlerts')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Marketing & promotions</span>
                  <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                </div>
                <ToggleSwitch
                  isEnabled={notifications.promotions}
                  onToggle={() => handleNotificationToggle('promotions')}
                />
              </div>
            </div>
          </SettingsSection>

          {/* Display Settings */}
          <SettingsSection title="Display Settings" icon={Monitor}>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Theme</span>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <select
                  value={displaySettings.theme}
                  onChange={(e) => {
                    if (e.target.value === 'dark') {
                      alert('Dark mode is coming soon!');
                    } else {
                      handleDisplayChange('theme', e.target.value);
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Language</span>
                  <p className="text-sm text-gray-500">Select your preferred language</p>
                </div>
                <select
                  value={displaySettings.language}
                  onChange={(e) => handleDisplayChange('language', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                >
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </SettingsSection>

          {/* Security Settings */}
          <SettingsSection title="Security Settings" icon={Shield}>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Two-factor authentication</span>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <ToggleSwitch
                  isEnabled={securitySettings.twoFactorAuth}
                  onToggle={() => handleSecurityToggle('twoFactorAuth')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Login notifications</span>
                  <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                </div>
                <ToggleSwitch
                  isEnabled={securitySettings.loginNotifications}
                  onToggle={() => handleSecurityToggle('loginNotifications')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Device tracking</span>
                  <p className="text-sm text-gray-500">Keep track of devices that access your account</p>
                </div>
                <ToggleSwitch
                  isEnabled={securitySettings.deviceTracking}
                  onToggle={() => handleSecurityToggle('deviceTracking')}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-900 font-medium">Session timeout</span>
                  <p className="text-sm text-gray-500">Automatically log out after period of inactivity</p>
                </div>
                <select
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => {
                    const newSettings = { ...securitySettings, sessionTimeout: e.target.value };
                    setSecuritySettings(newSettings);
                    saveSettings('security', newSettings);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          </SettingsSection>

          {/* Data Management */}
          <SettingsSection title="Data Management" icon={Download}>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <span className="text-gray-900 font-medium">Export your data</span>
                  <p className="text-sm text-gray-500">Download a copy of your data</p>
                </div>
                <button
                  onClick={handleDataExport}
                  disabled={isExporting}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:bg-emerald-300 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </button>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <div>
                  <span className="text-red-600 font-medium">Delete account</span>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </SettingsSection>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/profile"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 text-emerald-500 mr-3" />
                  <span className="text-gray-900">Edit Profile</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              
              <Link
                to="/contact"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-emerald-500 mr-3" />
                  <span className="text-gray-900">Help & Support</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              
              <a
                href="/logout"
                className="flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Log Out</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              {passwordError && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-4">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 bg-green-100 p-2 rounded-md mb-4">{passwordSuccess}</p>}
              <div className="space-y-4">
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Current Password"
                  value={passwords.oldPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 disabled:bg-emerald-300"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              <h3 className="text-2xl font-bold text-red-600">Delete Account</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                To confirm, type <span className="font-semibold">"delete my account"</span> in the box below:
              </p>
              
              {error && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-4">{error}</p>}
              
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type: delete my account"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmation('');
                  setError('');
                }}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || deleteConfirmation.toLowerCase() !== 'delete my account'}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 disabled:bg-red-300 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}