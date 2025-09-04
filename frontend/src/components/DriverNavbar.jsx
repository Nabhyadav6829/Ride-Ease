import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, UserRound, LogOut, User, X, BarChart3, Route, MessageCircle, Settings, ChevronRight, Star } from 'lucide-react';
import axios from 'axios';

// Helper for API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export default function DriverNavbar({ user, onMenuClick }) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [profile, setProfile] = useState(user); // State to store fetched profile data
  const navigate = useNavigate();
  const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch user profile data to get the latest balance
  useEffect(() => {
    const fetchProfile = async () => {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        navigate('/driver/login');
        return;
      }
      try {
        const response = await axios.get(`${BackendUrl}/api/drivers/profile`, authHeaders);
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, [navigate, BackendUrl]);

  const getValidAvatar = () => {
    if (profile?.profilePicture && profile.profilePicture !== 'no-photo.jpg') {
      if (profile.profilePicture.startsWith('http')) {
        return profile.profilePicture;
      }
      return `${BackendUrl}/Uploads/${profile.profilePicture}`;
    }
    return null;
  };

  const handleLogout = () => {
    console.log('Driver logging out...');
    navigate('/driver/logout');
  };

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleMenuClick}
                className="p-2 rounded-full hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-emerald-600">RideEase Driver</h1>
                <p className="text-sm text-gray-500 -mt-1">Driver Dashboard</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Notifications Icon & Dropdown Wrapper */}
              <div
                className="relative"
                onMouseEnter={() => {
                  setShowNotificationDropdown(true);
                  setShowProfileDropdown(false);
                }}
                onMouseLeave={() => setShowNotificationDropdown(false)}
              >
                <button
                  onClick={() => {
                    setShowNotificationDropdown(!showNotificationDropdown);
                    setShowProfileDropdown(false);
                  }}
                  className="p-2 rounded-full hover:bg-emerald-50 transition-colors relative focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Bell className="h-6 w-6 text-gray-700" />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                    3
                  </span>
                </button>

                {/* Notification Dropdown Panel */}
                <div
                  className={`absolute right-0 mt-2 w-72 sm:w-80 bg-white shadow-xl rounded-lg z-50 transition-all duration-200 ${
                    showNotificationDropdown ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                  }`}
                >
                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold text-gray-800">Notifications</p>
                    <p className="text-xs text-gray-500">You have 3 unread messages</p>
                  </div>
                  <div className="py-1">
                    <a href="#/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50">
                      New ride request in your area.
                    </a>
                    <a href="#/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50">
                      Your weekly summary is ready.
                    </a>
                    <a
                      href="#/"
                      className="block px-4 py-2 text-sm font-semibold text-emerald-600 text-center hover:bg-gray-50"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              </div>

              {/* Profile Icon & Dropdown Wrapper */}
              <div
                className="relative"
                onMouseEnter={() => {
                  setShowProfileDropdown(true);
                  setShowNotificationDropdown(false);
                }}
                onMouseLeave={() => setShowProfileDropdown(false)}
              >
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotificationDropdown(false);
                  }}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-full"
                >
                  {getValidAvatar() ? (
                    <img
                      src={getValidAvatar()}
                      alt={profile?.name || 'Driver'}
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-200"
                    />
                  ) : (
                    <UserRound className="w-9 h-9 p-1.5 text-emerald-700 bg-emerald-100 rounded-full" />
                  )}
                </button>

                {/* Profile Dropdown Panel */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md z-50 transition-all duration-200 ${
                    showProfileDropdown ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                  }`}
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-medium text-gray-800 truncate">
                      {profile?.name || 'Driver Name'}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => navigate('/driver/profile')}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-gray-700"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate('/driver/settings')}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-gray-700"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => navigate('/driver/rides')}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-gray-700"
                    >
                      My Rides
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="w-4 h-4 inline-block mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white w-80 h-full shadow-2xl transform transition-transform duration-300 translate-x-0">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button onClick={() => setShowMenu(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{profile?.name || 'Driver Name'}</p>
                  <p className="text-sm text-gray-500">Balance: ₹{profile?.wallet?.balance?.toFixed(2) || '0.00'}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium ml-1">4.9</span>
                    <span className="text-xs text-gray-500 ml-2">Multi-location Expert</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/driver/earnings');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <span>Earnings Report</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    navigate('/driver/rides');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Route className="h-5 w-5 text-gray-600" />
                  <span>My Rides</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    navigate('/driver/contact');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  <span>Support</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    navigate('/driver/settings');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>Settings</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </button>
              </div>
              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            </div>
          </div>
          <div className="bg-black bg-opacity-50 flex-1" onClick={() => setShowMenu(false)}></div>
        </div>
      )}
    </>
  );
}