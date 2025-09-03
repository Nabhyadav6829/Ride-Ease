import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Car, BarChart3, Route, User } from 'lucide-react';

// Navigation items array
const navItems = [
  { path: '/driver/home', icon: Car, label: 'Home' }, 
  { path: '/driver/earnings', icon: BarChart3, label: 'Earnings' },
  { path: '/driver/rides', icon: Route, label: 'My Rides' },
  { path: '/driver/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check active route
  const getButtonClass = (path) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center py-2 transition-colors ${
      isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
    }`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex justify-around py-3 max-w-7xl mx-auto w-full">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={getButtonClass(item.path)}
          >
            <item.icon className="h-6 w-6" /> 
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
