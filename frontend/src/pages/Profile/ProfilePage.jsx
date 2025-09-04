import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Bell, Shield, KeyRound, LogOut,
  Edit, Home, Briefcase, PlusCircle, AlertTriangle,
  Save, X, UserRound
} from 'lucide-react';

export default function ProfilePage({ isLoggedIn, user, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    allowFriendRequests: true,
    showActivityStatus: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        address: user.address || '',
        profileImageUrl: user.profileImageUrl || null,
      });
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
  });

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
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
      name: user.name,
      email: user.email,
      address: user.address || '',
      profileImageUrl: user.profileImageUrl || null,
    });
    setIsEditing(false);
  };
  
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const handleSave = async () => {
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("You are not authorized. Please log in again.");
        setIsLoading(false);
        return;
      }
      const response = await fetch(`${backendUrl}/api/users/updatedetails`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      alert('Profile updated successfully!');
      
      const updatedUser = { ...user, ...data.data };
      onUserUpdate(updatedUser);

      setIsEditing(false);

    } catch (err) {
      setError(err.message);
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/users/changepassword`, {
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

  const handlePrivacyToggle = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = async (fileToUpload) => {
    setError('');
    setIsLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('avatar', fileToUpload);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/users/upload-avatar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        setImagePreview(null);
        throw new Error(data.message || 'Failed to upload image.');
      }

      localStorage.setItem('token', data.token);
      onUserUpdate({
        ...user,
        profileImageUrl: data.data.avatarUrl,
      });
      alert('Avatar updated successfully!');
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      handleImageUpload(file);
    }
  };

  if (!isLoggedIn || !user) {
    return <div>Please log in to view your profile.</div>;
  }

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto pb-16">
          <div className="text-center mb-12">
            <div className="relative w-32 h-32 rounded-full mx-auto mb-4 border-4 border-emerald-500 shadow-lg flex items-center justify-center bg-gray-200">
              {imagePreview || user.profileImageUrl ? (
                <img
                  src={imagePreview || user.profileImageUrl}
                  alt="User Avatar"
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
            
            <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-md text-gray-600">Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
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
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-emerald-500 mr-4" />
                    <input type="email" name="email" value={formData.email} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                  </div>
                  <div className="flex items-start">
                    <Home className="h-5 w-5 text-emerald-500 mr-4 mt-2 flex-shrink-0" />
                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" placeholder="Enter your full address" className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <User className="h-5 w-5 text-emerald-500 mr-4" />
                    <span>{user.name}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 text-emerald-500 mr-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <Home className="h-5 w-5 text-emerald-500 mr-4 mt-1 flex-shrink-0" />
                    <span className="whitespace-pre-wrap">{user.address || 'Not provided'}</span>
                  </div>
                </div>
              )}
            </div>
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
                <a href="/logout" className="flex items-center text-red-500 font-semibold p-2 -m-2 rounded-lg hover:bg-red-50 transition-colors duration-200" style={{ textDecoration: 'none' }}>
                  <LogOut className="h-5 w-5 mr-4" />
                  <span>Log Out</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              {passwordError && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-4">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 bg-green-100 p-2 rounded-md mb-4">{passwordSuccess}</p>}
              <div className="space-y-4">
                <input
                  type="password" name="oldPassword" placeholder="Current Password"
                  value={passwords.oldPassword} onChange={handlePasswordInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md" required
                />
                <input
                  type="password" name="newPassword" placeholder="New Password"
                  value={passwords.newPassword} onChange={handlePasswordInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md" required
                />
                <input
                  type="password" name="confirmPassword" placeholder="Confirm New Password"
                  value={passwords.confirmPassword} onChange={handlePasswordInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md" required
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} disabled={isLoading} className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 disabled:bg-emerald-300">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="showProfileInSearch" className="text-gray-700">Show my personal details to the rider</label>
                <button onClick={() => handlePrivacyToggle('showDetails')} className={`${privacySettings.showDetails ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}>
                  <span className={`${privacySettings.showDetails ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="allowFriendRequests" className="text-gray-700">Allow Auto Requests</label>
                <button onClick={() => handlePrivacyToggle('allowFriendRequests')} className={`${privacySettings.allowFriendRequests ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}>
                  <span className={`${privacySettings.allowFriendRequests ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="showActivityStatus" className="text-gray-700">Show my online activity status</label>
                <button onClick={() => handlePrivacyToggle('showActivityStatus')} className={`${privacySettings.showActivityStatus ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}>
                  <span className={`${privacySettings.showActivityStatus ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
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
    </>
  );
}