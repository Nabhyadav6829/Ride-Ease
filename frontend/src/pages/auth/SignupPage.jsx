// import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';

// const SignupPage = ({ setIsLoggedIn, setUser, onLogin }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     let tempErrors = {};
//     if (!formData.name) {
//       tempErrors.name = 'Name is required';
//     } else if (formData.name.trim().length === 0) {
//       tempErrors.name = 'Name cannot be empty';
//     }
//     if (!formData.email) {
//       tempErrors.email = 'Email is required';
//     } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
//       tempErrors.email = 'Please fill a valid email address';
//     }
//     if (!formData.password) {
//       tempErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       tempErrors.password = 'Password must be at least 6 characters';
//     }
    
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const res = await fetch('http://localhost:5000/api/users/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
      
//       const data = await res.json();
      
//       if (res.ok) {
//         // Store token in localStorage
//         localStorage.setItem('token', data.token);
        
//         // Call onLogin to update parent component's state
//         if (onLogin) {
//           onLogin(data.user, data.token);
//         } else {
//           // Fallback to manual state updates
//           setIsLoggedIn(true);
//           setUser(data.user);
//         }
        
//         // Reset form
//         setFormData({ name: '', email: '', password: '' });
//         setErrors({});
        
//       } else {
//         setErrors({ submit: data.message || 'Registration failed. Please try again.' });
//       }
//     } catch (err) {
//       console.error('Registration error:', err);
//       setErrors({ submit: 'Registration failed. Please try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden">
//       {/* Background decorative elements */}
//       <div className="absolute top-0 left-0 w-full h-full">
//         <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-teal-300 to-transparent opacity-30 transform rotate-12"></div>
//         <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-300 to-transparent opacity-30 transform -rotate-12"></div>
//       </div>

//       <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-6xl mx-4 relative z-10">
//         <div className="flex items-center justify-between">
//           {/* Left side - Illustration */}
//           <div className="w-1/2 pr-12 hidden lg:block">
//             <div className="relative">
//               {/* Logo */}
//               <div className="mb-8">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
//                     <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
//                       <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z"/>
//                     </svg>
//                   </div>
//                   <span className="text-xl font-bold text-gray-800">Rideease</span>
//                 </div>
//               </div>

//               {/* Illustration area */}
//               <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 h-96 flex items-center justify-center">
//                 {/* Decorative elements */}
//                 <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
//                 <div className="absolute top-8 right-8 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-1000"></div>
//                 <div className="absolute bottom-6 left-6 w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-2000"></div>

//                 {/* Main illustration elements */}
//                 <div className="relative w-full h-full flex items-center justify-center">
//                   {/* Desk/Table */}
//                   <div className="absolute bottom-20 w-64 h-4 bg-blue-300 rounded-lg shadow-lg"></div>
                  
//                   {/* Person 1 - Left */}
//                   <div className="absolute bottom-24 left-8">
//                     <div className="w-12 h-20 bg-yellow-400 rounded-t-full relative">
//                       <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-amber-200 rounded-full"></div>
//                       <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-amber-800 rounded-full"></div>
//                     </div>
//                   </div>

//                   {/* Person 2 - Right */}
//                   <div className="absolute bottom-24 right-16">
//                     <div className="w-12 h-20 bg-purple-400 rounded-t-full relative">
//                       <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-200 rounded-full"></div>
//                       <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-purple-800 rounded-full"></div>
//                     </div>
//                   </div>

//                   {/* Laptop */}
//                   <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-16 h-10 bg-gray-700 rounded-t-lg">
//                     <div className="w-full h-6 bg-blue-400 rounded-t-lg"></div>
//                   </div>

//                   {/* Plant */}
//                   <div className="absolute bottom-20 right-8">
//                     <div className="w-4 h-6 bg-amber-600 rounded-b-lg"></div>
//                     <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-green-500 rounded-full"></div>
//                   </div>

//                   {/* Floating elements */}
//                   <div className="absolute top-12 left-12 w-8 h-8 bg-blue-400 rounded-lg transform rotate-12 opacity-70"></div>
//                   <div className="absolute top-20 right-20 w-6 h-6 bg-teal-400 rounded-full opacity-60"></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right side - Signup Form */}
//           <div className="w-full lg:w-1/2 lg:pl-12">
//             <div className="max-w-md mx-auto">
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
//               <p className="text-gray-600 mb-8">
//                 Join us by filling in your personal information to create your account 🔒
//               </p>

//               <div className="space-y-6">
//                 {/* Name Input */}
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Full Name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-500 ${
//                       errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'
//                     }`}
//                   />
//                   {formData.name && !errors.name && (
//                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                       <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
//                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                     </div>
//                   )}
//                   {errors.name && <span className="mt-1 text-sm text-red-500 block">{errors.name}</span>}
//                 </div>

//                 {/* Email Input */}
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                     </svg>
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email Address"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-500 ${
//                       errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
//                     }`}
//                   />
//                   {formData.email && !errors.email && (
//                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                       <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
//                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                     </div>
//                   )}
//                   {errors.email && <span className="mt-1 text-sm text-red-500 block">{errors.email}</span>}
//                 </div>

//                 {/* Password Input */}
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-500 ${
//                       errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
//                     }`}
//                   />
//                   {errors.password && <span className="mt-1 text-sm text-red-500 block">{errors.password}</span>}
//                 </div>

//                 {errors.submit && <div className="text-sm text-center text-red-500">{errors.submit}</div>}

//                 {/* Signup Button */}
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                   className={`w-full py-4 bg-blue-500 text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
//                     isLoading 
//                       ? 'opacity-50 cursor-not-allowed' 
//                       : 'hover:bg-blue-600'
//                   }`}
//                 >
//                   {isLoading ? 'Signing Up...' : 'Sign Up Now'}
//                 </button>

//                 {/* Login Link */}
//                 <div className="text-center">
//                   <a href="/login" className="text-blue-500 hover:underline font-medium">
//                     Already have an account? Login
//                   </a>
//                 </div>

//                 {/* Social Login */}
//                 <div className="text-center">
//                   <p className="text-gray-500 text-sm mb-4">Or you can join with</p>
//                   <div className="flex justify-center space-x-4">
//                     <button className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
//                       G
//                     </button>
//                     <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
//                       f
//                     </button>
//                     <button className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
//                       t
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;


















































import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = ({ setIsLoggedIn, setUser, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    licenseNumber: '',
    vehicleDetails: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('user'); // State to track the selected role
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) {
      tempErrors.name = 'Name is required';
    } else if (formData.name.trim().length === 0) {
      tempErrors.name = 'Name cannot be empty';
    }
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      tempErrors.email = 'Please fill a valid email address';
    }
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    if (role === 'driver') {
      if (!formData.licenseNumber) tempErrors.licenseNumber = 'License Number is required';
      if (!formData.vehicleDetails) tempErrors.vehicleDetails = 'Vehicle Details are required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = role === 'user' ? '/api/users/register' : '/api/drivers/register';
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);

        // Call onLogin to update parent component's state
        if (onLogin) {
          const userData = role === 'user' ? data.user : { _id: data._id, name: data.name, email: data.email };
          onLogin(userData, data.token);
        } else {
          // Fallback to manual state updates
          setIsLoggedIn(true);
          const userData = role === 'user' ? data.user : { _id: data._id, name: data.name, email: data.email };
          setUser(userData);
        }

        // Reset form
        setFormData({ name: '', email: '', password: '', licenseNumber: '', vehicleDetails: '' });
        setErrors({});

        // Navigate based on role
        navigate(role === 'user' ? '/' : '/driver/dashboard');
      } else {
        setErrors({ submit: data.message || 'Registration failed. Please try again.' });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
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

          {/* Right side - Signup Form */}
          <div className="w-full lg:w-1/2 lg:pl-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600 mb-8">
                Join us by filling in your personal information to create your account 🔒
              </p>

              {/* Role selection buttons (User/Driver) */}
              <div className="flex p-1 space-x-1 bg-blue-50 rounded-lg mb-6">
                <button
                  onClick={() => setRole('user')}
                  className={role === 'user' ? activeRoleStyle : inactiveRoleStyle}
                  disabled={isLoading}
                >
                  User Signup
                </button>
                <button
                  onClick={() => setRole('driver')}
                  className={role === 'driver' ? activeRoleStyle : inactiveRoleStyle}
                  disabled={isLoading}
                >
                  Driver Signup
                </button>
              </div>

              <div className="space-y-6">
                {/* Name Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-500 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    disabled={isLoading}
                  />
                  {formData.name && !errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {errors.name && <span className="mt-1 text-sm text-red-500 block">{errors.name}</span>}
                </div>

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
                    className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-500 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
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
                    className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-500 ${errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    disabled={isLoading}
                  />
                  {errors.password && <span className="mt-1 text-sm text-red-500 block">{errors.password}</span>}
                </div>

                {/* Driver-specific fields */}
                {role === 'driver' && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="licenseNumber"
                        placeholder="Driver's License Number"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-500 ${errors.licenseNumber ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                        disabled={isLoading}
                      />
                      {errors.licenseNumber && <span className="mt-1 text-sm text-red-500 block">{errors.licenseNumber}</span>}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10h6m-6-10h6M5 12H3m18 0h-2M7 7h10M7 17h10" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="vehicleDetails"
                        placeholder="Vehicle Details (e.g., White Toyota Camry)"
                        value={formData.vehicleDetails}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-500 ${errors.vehicleDetails ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                        disabled={isLoading}
                      />
                      {errors.vehicleDetails && <span className="mt-1 text-sm text-red-500 block">{errors.vehicleDetails}</span>}
                    </div>
                  </>
                )}

                {errors.submit && <div className="text-sm text-center text-red-500">{errors.submit}</div>}

                {/* Signup Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-4 bg-blue-500 text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                  {isLoading ? 'Signing Up...' : 'Sign Up Now'}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <button
                    onClick={() => navigate('/login')}
                    type="button"
                    className="text-blue-500 hover:underline font-medium"
                    disabled={isLoading}
                  >
                    Already have an account? Login
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;