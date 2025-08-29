import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DriverLogoutPage = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Clear the authentication token
    localStorage.removeItem('token');

    // 2. Clear any driver-specific data from local storage
    localStorage.removeItem('driverProfile');
    localStorage.removeItem('recentRides');
    localStorage.removeItem('dashboardStats');

    // 3. Update the main application state to reflect logout
    if (setIsLoggedIn) setIsLoggedIn(false);
    if (setUser) setUser(null);

    // 4. Redirect to the main homepage after a 1.5-second delay
    const timer = setTimeout(() => {
      navigate('/'); // You can change this to '/driver/login' if you have a specific driver login page
    }, 1500);

    // 5. Clean up the timer if the component is removed before the timer finishes
    return () => clearTimeout(timer);
  }, [navigate, setIsLoggedIn, setUser]); // Dependencies for the effect

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          Logging Driver Out...
        </h2>
        <div className="border-t-4 border-emerald-500 border-solid rounded-full w-16 h-16 animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default DriverLogoutPage;