// DriverProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Car, FileText, LogOut, Edit,
  User, Mail, Home, KeyRound, Shield, Save, X, UserRound,
  Bell, Settings, CreditCard 
} from 'lucide-react';
import axios from 'axios';
// FIX: The profile page now has its own header which needs the user data.
// We are using a new DriverNavbar component for this.
import DriverNavbar from '../../components/DriverNavbar';
import DriverBottomNav from '../../components/DriverBottomNav';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// FIX: Accept 'user' prop from App.js to ensure data consistency.
export default function DriverProfilePage({ user, onUserUpdate }) { 
  // FIX: Use the 'user' prop for the initial state instead of fetching again.
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false); // Changed initial state to false
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    showDetails: true,
    allowAutoRequests: true,
    showOnlineStatus: false,
  });

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    bookingAlerts: true,
    paymentAlerts: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // FIX: Instead of fetching profile data, we now sync state from the 'user' prop.
  // This avoids redundant API calls and ensures the data is always fresh.
  useEffect(() => {
    if (user) {
      setProfile(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        vehicleDetails: user.vehicleDetails || '',
        licenseNumber: user.licenseNumber || '',
      });
    } else {
        // If no user prop, maybe fetch as a fallback or redirect
        const fetchProfileData = async () => {
            const authHeaders = getAuthHeaders();
            if (!authHeaders) {
                navigate('/driver/login');
                return;
            }
            try {
                setLoading(true);
                const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const { data } = await axios.get(`${BackendUrl}/api/drivers/profile`, authHeaders);
                setProfile(data);
                setFormData({
                    name: data.name, email: data.email, phone: data.phone || '',
                    address: data.address || '', vehicleDetails: data.vehicleDetails || '',
                    licenseNumber: data.licenseNumber || '',
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }
  }, [user, navigate]);


  const getAvatarUrl = () => {
    if (!profile?.profilePicture || profile.profilePicture === 'no-photo.jpg') {
      return null;
    }
    const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${BackendUrl}/Uploads/${profile.profilePicture}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setError('');
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || '',
      address: profile.address || '',
      vehicleDetails: profile.vehicleDetails || '',
      licenseNumber: profile.licenseNumber || '',
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setError('');
    setIsLoading(true);

    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        setError("You are not authorized. Please log in again.");
        setIsLoading(false);
        return;
      }

      const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.put(`${BackendUrl}/api/drivers/profile`, formData, authHeaders);

      const updatedProfile = { ...profile, ...data };
      setProfile(updatedProfile);
      
      // Call the callback to update the global state in App.js
      if (typeof onUserUpdate === 'function') {
        onUserUpdate(updatedProfile);
      }

      alert('Profile updated successfully!');
      setIsEditing(false);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
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
      const authHeaders = getAuthHeaders();
      const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${BackendUrl}/api/drivers/change-password`, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      }, authHeaders);

      setPasswordSuccess('Password changed successfully!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess('');
      }, 2000);

    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = async (fileToUpload) => {
    setError('');
    setIsLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('avatar', fileToUpload);

    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        throw new Error("You are not authorized. Please log in again.");
      }

      const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.put(`${BackendUrl}/api/drivers/upload-avatar`, uploadFormData, {
        headers: {
          ...authHeaders.headers,
          'Content-Type': 'multipart/form-data',
        }
      });

      const updatedProfile = { ...profile, profilePicture: data.profilePicture };
      setProfile(updatedProfile);

      // Call the callback to update the global state in App.js
      if (typeof onUserUpdate === 'function') {
        onUserUpdate(updatedProfile);
      }

      alert('Avatar updated successfully!');
      setImagePreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      handleImageUpload(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold">Loading Profile...</p>
      </div>
    );
  }

  if (!profile || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">Could not load profile.</p>
      </div>
    );
  }
  
  return (
    <>
      {/* FIX: Pass the user prop to the navbar to keep it updated */}
      <DriverNavbar user={user} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 pt-8 px-4 sm:px-6 lg:px-8 pb-20">
        
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <div className="relative w-32 h-32 rounded-full mx-auto mb-4 border-4 border-emerald-500 shadow-lg flex items-center justify-center bg-gray-200">
              {imagePreview || getAvatarUrl() ? (
                <img
                  src={imagePreview || getAvatarUrl()}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserRound className="w-16 h-16 text-gray-400" />
              )}
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center rounded-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isLoading}
                className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-2 shadow-md hover:bg-emerald-600 transition-colors disabled:bg-gray-400"
                aria-label="Change profile picture"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900">{profile.name}</h1>
            <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
              <span className="font-semibold">4.9</span>
              <span className="mx-2">|</span>
              <span className={`font-semibold ${profile.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                {profile.isVerified ? 'Verified Driver' : 'Pending Verification'}
              </span>
            </div>
            <p className="text-md text-gray-600 mt-1">
              Driver since {new Date(profile.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                {isEditing ? (
                  <div className="flex items-center gap-4">
                    <button onClick={handleSave} disabled={isLoading} className="text-emerald-600 hover:text-emerald-800 transition flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
                      <Save className="h-4 w-4" /> {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={handleCancel} disabled={isLoading} className="text-red-500 hover:text-red-700 transition flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEdit} className="text-emerald-600 hover:text-emerald-800 transition flex items-center gap-2 text-sm font-semibold">
                    <Edit className="h-4 w-4" /> Edit
                  </button>
                )}
              </div>
              
              {error && <div className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</div>}

              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-emerald-500 mr-4" />
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-emerald-500 mr-4" />
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      readOnly 
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" 
                    />
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-emerald-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="flex items-start">
                    <Home className="h-5 w-5 text-emerald-500 mr-4 mt-2 flex-shrink-0" />
                    <textarea 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      rows="3" 
                      placeholder="Enter your full address" 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <User className="h-5 w-5 text-emerald-500 mr-4" />
                    <span>{profile.name}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 text-emerald-500 mr-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 text-emerald-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{profile.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <Home className="h-5 w-5 text-emerald-500 mr-4 mt-1 flex-shrink-0" />
                    <span className="whitespace-pre-wrap">{profile.address || 'Not provided'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Information */}
             <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Car className="h-6 w-6 text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-900">Vehicle Information</h3>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Vehicle Details</span>
                    <input 
                      type="text" 
                      name="vehicleDetails" 
                      value={formData.vehicleDetails} 
                      onChange={handleInputChange} 
                      className="p-2 border border-gray-300 rounded-md" 
                      placeholder="e.g., Honda City 2020"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">License Plate</span>
                    <input 
                      type="text" 
                      name="licenseNumber" 
                      value={formData.licenseNumber} 
                      onChange={handleInputChange} 
                      className="p-2 border border-gray-300 rounded-md bg-gray-100" 
                      readOnly
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Vehicle Details</span>
                    <span className="font-semibold text-gray-800">{profile.vehicleDetails || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">License Plate</span>
                    <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">{profile.licenseNumber}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="h-6 w-6 text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-900">Documents</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Verification Status</span>
                  <span className={`font-semibold text-sm ${profile.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {profile.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                Update Documents
              </button>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-700">
                  <div className="flex items-center">
                    <KeyRound className="h-5 w-5 text-emerald-500 mr-4" />
                    <span>Change Password</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsPasswordModalOpen(true);
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    className="text-sm font-semibold text-emerald-600"
                  >
                    Change
                  </button>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-emerald-500 mr-4" />
                    <span>Privacy Settings</span>
                  </div>
                  <button onClick={() => setIsPrivacyModalOpen(true)} className="text-sm font-semibold text-emerald-600">
                    Manage
                  </button>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-emerald-500 mr-4" />
                    <span>Notifications</span>
                  </div>
                  <button onClick={() => setIsNotificationModalOpen(true)} className="text-sm font-semibold text-emerald-600">
                    Manage
                  </button>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-emerald-500 mr-4" />
                    <span>Manage Bank Account</span>
                  </div>
                  <button className="text-sm font-semibold text-emerald-600">
                    Update
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-8 ">
              <button
                onClick={handleLogout}
                className="w-full flex mb-5 items-center justify-center space-x-2 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
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
                  className="w-full p-2 border border-gray-300 rounded-md" 
                  required
                />
                <input
                  type="password" 
                  name="newPassword" 
                  placeholder="New Password"
                  value={passwords.newPassword} 
                  onChange={handlePasswordInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md" 
                  required
                />
                <input
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Confirm New Password"
                  value={passwords.confirmPassword} 
                  onChange={handlePasswordInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md" 
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
      
      {/* Privacy Settings Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Show my details to riders</label>
                <button 
                  onClick={() => handlePrivacyToggle('showDetails')} 
                  className={`${privacySettings.showDetails ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                >
                  <span className={`${privacySettings.showDetails ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Allow Auto Ride Requests</label>
                <button 
                  onClick={() => handlePrivacyToggle('allowAutoRequests')} 
                  className={`${privacySettings.allowAutoRequests ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                >
                  <span className={`${privacySettings.allowAutoRequests ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Show online status</label>
                <button 
                  onClick={() => handlePrivacyToggle('showOnlineStatus')} 
                  className={`${privacySettings.showOnlineStatus ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                >
                  <span className={`${privacySettings.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Notification Settings</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                <label className="text-gray-700">Push Notifications</label>
                <button 
                  onClick={() => handleNotificationToggle('push')} 
                  className={`${notifications.push ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                >
                  <span className={`${notifications.push ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Email Notifications</label>
                <button 
                  onClick={() => handleNotificationToggle('email')} 
                  className={`${notifications.email ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                >
                  <span className={`${notifications.email ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-700">SMS Notifications</label>
                <button 
                  onClick={() => handleNotificationToggle('sms')} 
                  className={`${notifications.sms ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                >
                  <span className={`${notifications.sms ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Booking Alerts</label>
                <button 
                  onClick={() => handleNotificationToggle('bookingAlerts')} 
                  className={`${notifications.bookingAlerts ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                >
                  <span className={`${notifications.bookingAlerts ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Payment Alerts</label>
                <button 
                  onClick={() => handleNotificationToggle('paymentAlerts')} 
                  className={`${notifications.paymentAlerts ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                >
                  <span className={`${notifications.paymentAlerts ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => setIsNotificationModalOpen(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      <DriverBottomNav />
    </>
  );
}