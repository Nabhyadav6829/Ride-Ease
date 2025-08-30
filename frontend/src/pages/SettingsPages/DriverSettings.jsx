import React, { useState } from 'react';
import {
  Settings, ChevronLeft, ChevronRight,
  Bell, Shield, Car, DollarSign, Globe,
  Moon, Volume2, Navigation, Smartphone,
  User, Lock, CreditCard, MapPin, Clock,
  Wifi, Battery, Eye, EyeOff, Download,
  Trash2, RefreshCw, AlertCircle, CheckCircle,
  Camera, FileText, Star, Award
} from 'lucide-react';

export default function DriverSettingsPage() {
  const [settings, setSettings] = useState({
    // Notifications
    pushNotifications: true,
    rideRequests: true,
    paymentUpdates: true,
    promotions: false,
    safetyAlerts: true,
    weeklyReports: true,
    
    // Privacy & Safety
    shareLocation: true,
    emergencyContacts: true,
    rideRecording: false,
    dataSharing: false,
    
    // App Preferences
    darkMode: false,
    language: 'english',
    voiceNavigation: true,
    hapticFeedback: true,
    autoAcceptRides: false,
    
    // Ride Preferences
    multiLocationRides: true,
    longDistanceRides: true,
    peakHourOnly: false,
    minimumFare: 50,
    maxRadius: 15,
    
    // Vehicle & Documents
    vehicleVisible: true,
    documentsAutoReminder: true
  });

  const [activeSection, setActiveSection] = useState(null);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const languages = [
    { code: 'english', name: 'English', native: 'English' },
    { code: 'hindi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bengali', name: 'Bengali', native: 'বাংলা' },
    { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
    { code: 'telugu', name: 'Telugu', native: 'తెలుగు' },
    { code: 'marathi', name: 'Marathi', native: 'मराठी' }
  ];

  const settingSections = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive notifications on your device',
          type: 'toggle'
        },
        {
          key: 'rideRequests',
          label: 'Ride Requests',
          description: 'Get notified about new ride opportunities',
          type: 'toggle'
        },
        {
          key: 'paymentUpdates',
          label: 'Payment Updates',
          description: 'Notifications about earnings and payments',
          type: 'toggle'
        },
        {
          key: 'promotions',
          label: 'Promotions & Offers',
          description: 'Promotional offers and bonus opportunities',
          type: 'toggle'
        },
        {
          key: 'safetyAlerts',
          label: 'Safety Alerts',
          description: 'Important safety and security updates',
          type: 'toggle'
        },
        {
          key: 'weeklyReports',
          label: 'Weekly Reports',
          description: 'Weekly earnings and performance summary',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Safety',
      icon: Shield,
      items: [
        {
          key: 'shareLocation',
          label: 'Share Location',
          description: 'Allow location sharing for safety and navigation',
          type: 'toggle'
        },
        {
          key: 'emergencyContacts',
          label: 'Emergency Contacts',
          description: 'Enable emergency contact features',
          type: 'toggle'
        },
        {
          key: 'rideRecording',
          label: 'Ride Recording',
          description: 'Record audio during rides for safety (where legal)',
          type: 'toggle'
        },
        {
          key: 'dataSharing',
          label: 'Data Sharing',
          description: 'Share anonymized data to improve services',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'app',
      title: 'App Preferences',
      icon: Smartphone,
      items: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme for better night driving',
          type: 'toggle'
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          options: languages
        },
        {
          key: 'voiceNavigation',
          label: 'Voice Navigation',
          description: 'Enable voice-guided navigation',
          type: 'toggle'
        },
        {
          key: 'hapticFeedback',
          label: 'Haptic Feedback',
          description: 'Enable vibration for interactions',
          type: 'toggle'
        },
        {
          key: 'autoAcceptRides',
          label: 'Auto Accept Rides',
          description: 'Automatically accept rides matching your preferences',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'rides',
      title: 'Ride Preferences',
      icon: Car,
      items: [
        {
          key: 'multiLocationRides',
          label: 'Multi-Location Rides',
          description: 'Accept rides with multiple pickups/drops',
          type: 'toggle'
        },
        {
          key: 'longDistanceRides',
          label: 'Long Distance Rides',
          description: 'Accept rides over 50km',
          type: 'toggle'
        },
        {
          key: 'peakHourOnly',
          label: 'Peak Hours Only',
          description: 'Only receive requests during peak hours',
          type: 'toggle'
        },
        {
          key: 'minimumFare',
          label: 'Minimum Fare',
          description: 'Minimum fare amount for ride acceptance',
          type: 'number',
          min: 30,
          max: 200,
          step: 10,
          suffix: '₹'
        },
        {
          key: 'maxRadius',
          label: 'Maximum Pickup Radius',
          description: 'Maximum distance to travel for pickup',
          type: 'number',
          min: 5,
          max: 50,
          step: 5,
          suffix: 'km'
        }
      ]
    },
    {
      id: 'vehicle',
      title: 'Vehicle & Documents',
      icon: FileText,
      items: [
        {
          key: 'vehicleVisible',
          label: 'Show Vehicle Details',
          description: 'Display vehicle info to passengers',
          type: 'toggle'
        },
        {
          key: 'documentsAutoReminder',
          label: 'Document Expiry Reminders',
          description: 'Get reminders before document expiration',
          type: 'toggle'
        }
      ]
    }
  ];

  const accountActions = [
    {
      title: 'Change Password',
      description: 'Update your account password',
      icon: Lock,
      action: () => alert('Password change coming soon!')
    },
    {
      title: 'Payment Methods',
      description: 'Manage your payout methods',
      icon: CreditCard,
      action: () => alert('Payment methods coming soon!')
    },
    {
      title: 'Emergency Contacts',
      description: 'Add or update emergency contacts',
      icon: User,
      action: () => alert('Emergency contacts coming soon!')
    },
    {
      title: 'Export Data',
      description: 'Download your account data',
      icon: Download,
      action: () => alert('Data export will begin shortly!')
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b sticky top-0 z-10 ${settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            {/* === MODIFIED BUTTON === */}
            <button 
              onClick={() => window.history.back()}
              className={`p-2 rounded-lg hover:${settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              aria-label="Go back"
            >
              <ChevronLeft className={`h-6 w-6 ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
            {/* === END OF MODIFICATION === */}
            <div>
              <h1 className={`text-xl font-bold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customize your driving experience</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Quick Settings */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-bold mb-4 ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => toggleSetting('darkMode')}
              className={`p-4 rounded-xl transition-colors ${
                settings.darkMode 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Moon className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Dark Mode</p>
            </button>
            <button
              onClick={() => toggleSetting('pushNotifications')}
              className={`p-4 rounded-xl transition-colors ${
                settings.pushNotifications 
                  ? 'bg-emerald-500 text-white' 
                  : settings.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bell className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Notifications</p>
            </button>
            <button
              onClick={() => toggleSetting('shareLocation')}
              className={`p-4 rounded-xl transition-colors ${
                settings.shareLocation 
                  ? 'bg-blue-500 text-white' 
                  : settings.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Location</p>
            </button>
            <button
              onClick={() => toggleSetting('autoAcceptRides')}
              className={`p-4 rounded-xl transition-colors ${
                settings.autoAcceptRides 
                  ? 'bg-purple-500 text-white' 
                  : settings.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <RefreshCw className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Auto Accept</p>
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <div key={section.id} className={`rounded-2xl shadow-lg p-6 mb-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  settings.darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <section.icon className={`h-5 w-5 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <h3 className={`text-lg font-bold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {section.title}
                </h3>
              </div>
              <ChevronRight className={`h-5 w-5 transform transition-transform ${
                activeSection === section.id ? 'rotate-90' : ''
              } ${settings.darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            </button>

            {activeSection === section.id && (
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl ${
                    settings.darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex-1">
                      <h4 className={`font-medium ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.label}
                      </h4>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      {item.type === 'toggle' && (
                        <button
                          onClick={() => toggleSetting(item.key)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings[item.key] ? 'bg-emerald-500' : settings.darkMode ? 'bg-gray-600' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                            settings[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                          } top-0.5`} />
                        </button>
                      )}
                      {item.type === 'select' && (
                        <select
                          value={settings[item.key]}
                          onChange={(e) => updateSetting(item.key, e.target.value)}
                          className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                            settings.darkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          {item.options.map((option) => (
                            <option key={option.code} value={option.code}>
                              {option.native} ({option.name})
                            </option>
                          ))}
                        </select>
                      )}
                      {item.type === 'number' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={settings[item.key]}
                            onChange={(e) => updateSetting(item.key, parseInt(e.target.value))}
                            min={item.min}
                            max={item.max}
                            step={item.step}
                            className={`w-20 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 ${
                              settings.darkMode 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                          <span className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.suffix}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Account Management */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-bold mb-4 ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>Account Management</h3>
          <div className="space-y-3">
            {accountActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                  settings.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <action.icon className={`h-5 w-5 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <p className={`font-medium ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {action.title}
                    </p>
                    <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {action.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 ${settings.darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`rounded-2xl shadow-lg p-6 mb-20 border-2 border-red-200 ${
          settings.darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowDeleteAccount(true)}
              className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700">Permanently delete your account and data</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation */}
      {showDeleteAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => setShowDeleteAccount(false)}></div>
          <div className={`rounded-2xl shadow-2xl w-full max-w-md relative ${
            settings.darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className={`text-lg font-bold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Delete Account
                </h3>
              </div>
              <p className={`mb-6 ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                This action cannot be undone. Your account, ride history, and earnings data will be permanently deleted.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteAccount(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                    settings.darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Account deletion process initiated. You will receive an email confirmation.');
                    setShowDeleteAccount(false);
                  }}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}