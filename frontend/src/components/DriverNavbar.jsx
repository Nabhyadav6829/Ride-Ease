import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, UserRound, LogOut, Settings } from 'lucide-react';

export default function DriverHeader({ driverProfile, onMenuClick }) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // A helper function to get the driver's avatar or a default icon
  const getValidAvatar = () => {
    return driverProfile?.profileImageUrl && driverProfile.profileImageUrl !== 'no-photo.jpg'
      ? driverProfile.profileImageUrl
      : null;
  };

  const handleLogout = () => {
    console.log('Driver logging out...');
    navigate('/logout');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
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
                    alt={driverProfile?.name || 'Driver'}
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
                    {driverProfile?.name || 'Driver Name'}
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
  );
}
 