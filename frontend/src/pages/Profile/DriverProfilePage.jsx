// src/components/DriverProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Star, ShieldCheck, Car, FileText, Bell, LogOut, ChevronRight, Edit } from 'lucide-react';

// This mock data now simulates what you would get from your database via an API call.
const mockApiResponse = {
  name: 'Rohan Kumar', // This name would come from your database
  rating: 4.9,
  level: 'Multi-Location Expert',
  avatarUrl: 'https://via.placeholder.com/150',
  vehicle: {
    model: 'Maruti Suzuki Dzire',
    licensePlate: 'UP 14 AB 1234',
    color: 'White',
  },
  documents: {
    drivingLicense: 'Verified',
    vehicleRegistration: 'Verified',
    insurance: 'Expires in 3 months',
    permit: 'Verified',
  },
  settings: {
    email: 'rohan.k@example.com',
    phone: '+91 98******56',
  }
};


export default function ProfilePage() {
  // --- CHANGE 1: Initialize profile state to null and add a loading state ---
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- CHANGE 2: Fetch data from a simulated API when the component mounts ---
  useEffect(() => {
    // This function simulates fetching data from your database.
    const fetchProfileData = async () => {
      try {
        // In a real app, you would use fetch() or axios to call your API endpoint
        // For example: const response = await fetch('/api/driver/profile');
        // const data = await response.json();

        // We are simulating the API call with a 1-second delay
        setTimeout(() => {
          setProfile(mockApiResponse); // Set the profile with data from the "database"
          setLoading(false); // Stop loading
        }, 1000);

      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setLoading(false); // Stop loading even if there is an error
      }
    };

    fetchProfileData();
  }, []); // The empty array [] ensures this effect runs only once

  const handleLogout = () => {
    // Clear user session/token
    console.log('Logging out...');
    navigate('/driver/login');
  };
  
  // --- CHANGE 3: Show a loading indicator while fetching data ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold">Loading Profile...</p>
      </div>
    );
  }

  // If there's no profile data after loading, show an error.
  if (!profile) {
    return (
       <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">Could not load profile.</p>
      </div>
    )
  }

  // --- NO OTHER CHANGES BELOW THIS LINE ---
  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex items-center space-x-5">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-20 h-20 rounded-full border-4 border-emerald-200"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
              <span className="font-semibold">{profile.rating}</span>
              <span className="mx-2">|</span>
              <span>{profile.level}</span>
            </div>
          </div>
          <button className="ml-auto p-2 rounded-lg hover:bg-gray-100">
            <Edit className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Car className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">Vehicle Information</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Model</span>
              <span className="font-semibold text-gray-800">{profile.vehicle.model}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">License Plate</span>
              <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">{profile.vehicle.licensePlate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Color</span>
              <span className="font-semibold text-gray-800">{profile.vehicle.color}</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">Documents</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(profile.documents).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className={`font-semibold text-sm ${value === 'Verified' ? 'text-green-600' : 'text-orange-600'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Update Documents
          </button>
        </div>
        
        {/* Account Settings & Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
            <div className="divide-y divide-gray-100">
                <button className="w-full flex items-center justify-between py-4 text-left">
                    <span className="text-gray-800">Edit Personal Info</span>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                </button>
                <button className="w-full flex items-center justify-between py-4 text-left">
                    <span className="text-gray-800">Manage Bank Account</span>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                </button>
                <button className="w-full flex items-center justify-between py-4 text-left">
                    <span className="text-gray-800">Notifications</span>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                </button>
                 <button className="w-full flex items-center justify-between py-4 text-left">
                    <span className="text-gray-800">Safety Center</span>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                </button>
            </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg"
            >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
            </button>
        </div>
      </main>
    </div>
  );
}