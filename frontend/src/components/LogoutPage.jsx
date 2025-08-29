import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);

    const timer = setTimeout(() => {
      navigate('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, setIsLoggedIn, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-200 mb-6">Logging you out...</h2>
        <div className="border-8 border-emerald-400 border-t-transparent rounded-full w-16 h-16 animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default LogoutPage;
