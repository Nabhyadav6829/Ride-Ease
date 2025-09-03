import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn, setUser, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('user'); // State to track the selected role
  const navigate = useNavigate();
  const BackendUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const endpoint = role === 'user' ? '/api/users/login' : '/api/drivers/login';
        const res = await fetch(`${BackendUrl}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log("Login API Response:", data); // debug

        if (res.ok) {
          if (rememberMe) {
            localStorage.setItem(role === 'user' ? 'rememberMe' : 'rememberDriver', 'true');
          }

          // ✅ FIX: Use direct response values
          const userData = {
            _id: data._id,
            name: data.name,
            email: data.email,
            role,
          };

          if (onLogin) {
            onLogin(userData, data.token);
          } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser && setUser(userData);
            setIsLoggedIn(true);
          }
          navigate(role === 'user' ? '/' : '/driver/dashboard');
        } else {
          setErrors({ submit: data.message || 'Invalid credentials' });
        }
      } catch (err) {
        console.error('Login error:', err);
        setErrors({ submit: 'Login failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Styles for the active and inactive role buttons
  const activeRoleStyle = "w-1/2 py-2 text-sm font-medium leading-5 text-white bg-blue-600 rounded-md shadow-sm focus:outline-none";
  const inactiveRoleStyle = "w-1/2 py-2 text-sm font-medium leading-5 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md focus:outline-none";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-teal-300 to-transparent opacity-30 transform rotate-12"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-300 to-transparent opacity-30 transform -rotate-12"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-6xl mx-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Left side - Illustration */}
          <div className="w-1/2 pr-12 hidden lg:block">
            <div className="relative">
              {/* Logo */}
              <div className="mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                      <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z"/>
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-gray-800">Rideease</span>
                </div>
              </div>

              {/* Illustration area */}
              <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-6 left-6 w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-2000"></div>

                {/* Main illustration elements */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Desk/Table */}
                  <div className="absolute bottom-20 w-64 h-4 bg-blue-300 rounded-lg shadow-lg"></div>
                  
                  {/* Person 1 - Left */}
                  <div className="absolute bottom-24 left-8">
                    <div className="w-12 h-20 bg-yellow-400 rounded-t-full relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-amber-200 rounded-full"></div>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-amber-800 rounded-full"></div>
                    </div>
                  </div>

                  {/* Person 2 - Right */}
                  <div className="absolute bottom-24 right-16">
                    <div className="w-12 h-20 bg-purple-400 rounded-t-full relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-200 rounded-full"></div>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-purple-800 rounded-full"></div>
                    </div>
                  </div>

                  {/* Laptop */}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-16 h-10 bg-gray-700 rounded-t-lg">
                    <div className="w-full h-6 bg-blue-400 rounded-t-lg"></div>
                  </div>

                  {/* Plant */}
                  <div className="absolute bottom-20 right-8">
                    <div className="w-4 h-6 bg-amber-600 rounded-b-lg"></div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-green-500 rounded-full"></div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute top-12 left-12 w-8 h-8 bg-blue-400 rounded-lg transform rotate-12 opacity-70"></div>
                  <div className="absolute top-20 right-20 w-6 h-6 bg-teal-400 rounded-full opacity-60"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full lg:w-1/2 lg:pl-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back :)</h1>
              <p className="text-gray-600 mb-8">
                To keep connected with us please login with your personal
                information by email address and password 🔒
              </p>

              {/* Role selection buttons (User/Driver) */}
              <div className="flex p-1 space-x-1 bg-blue-50 rounded-lg mb-6">
                <button
                  onClick={() => setRole('user')}
                  className={role === 'user' ? activeRoleStyle : inactiveRoleStyle}
                  disabled={isLoading}
                >
                  User Login
                </button>
                <button
                  onClick={() => setRole('driver')}
                  className={role === 'driver' ? activeRoleStyle : inactiveRoleStyle}
                  disabled={isLoading}
                >
                  Driver Login
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {formData.email && !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {errors.email && <span className="mt-1 text-sm text-red-500 block">{errors.email}</span>}
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.password && <span className="mt-1 text-sm text-red-500 block">{errors.password}</span>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${rememberMe ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">Remember Me</span>
                  </label>
                  <button type="button" className="text-sm text-blue-500 hover:underline" disabled={isLoading}>
                    Forgot Password?
                  </button>
                </div>

                {errors.submit && <div className="text-sm text-center text-red-500 bg-red-50 p-3 rounded-lg">{errors.submit}</div>}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    'Login Now'
                  )}
                </button>

                {/* Create Account */}
                <div className="text-center">
                  <button
                    onClick={() => navigate('/signup')}
                    type="button"
                    className="text-blue-500 hover:underline font-medium"
                    disabled={isLoading}
                  >
                    Create Account
                  </button>
                </div>

                {/* Social Login */}
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-4">Or you can join with</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      G
                    </button>
                    <button
                      type="button"
                      className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      f
                    </button>
                    <button
                      type="button"
                      className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      t
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
