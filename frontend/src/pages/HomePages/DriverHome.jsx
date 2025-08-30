import React, { useState, useEffect, useCallback } from 'react';

import {
  Car, MapPin, Navigation, Clock, DollarSign, Star,
  BarChart3, Settings, User, Bell, Menu, X,
  Route, Package, Zap, ShieldCheck, TrendingUp,
  Phone, MessageCircle, Calendar, Battery,
  Wifi, Signal, Eye, EyeOff, RefreshCw,
  Users, CheckCircle, AlertCircle, Filter,
  ChevronRight, Award, Fuel, CreditCard
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import OpenSourceRouteMap from '../../components/OpenSourceRouteMap';

// Helper for API calls (assumes token is stored in localStorage)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export default function DriverHomePage({ isLoggedIn }) {
  // State for data from the backend
  const [driverProfile, setDriverProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [recentRides, setRecentRides] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    today: { rides: 0, earnings: 0, rating: 4.9, hours: 9.5, tips: 180, multiRides: 6, peakHours: 4.5, acceptance: 92, cancellation: 3, fuel: 487 },
    weekly: { totalEarnings: 0, totalRides: 0, multiLocationRides: 28, avgRating: 4.8, totalHours: 52 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for ride simulation
  const [activeRide, setActiveRide] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);

  // State for UI elements
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);
  const [showEarningsDetail, setShowEarningsDetail] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState('all');

  const navigate = useNavigate();

  // MOCK DATA (for simulation, real data will be fetched)
  const generateMockRideRequest = () => {
    const types = ["single", "multi-pickup"];
    const type = types[Math.floor(Math.random() * types.length)];
    const locations = ["Sector 18, Noida", "Cyber Hub", "MG Road Metro", "DLF Phase 3", "Connaught Place, Delhi", "IGI Airport", "Karol Bagh, Delhi", "Dwarka"];
    let pickups = [];
    let drops = [];
    let totalPassengers = 0;
    if (type === "multi-pickup") {
      const numPickups = Math.floor(Math.random() * 3) + 2; // 2-4
      for (let i = 0; i < numPickups; i++) {
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const pax = Math.floor(Math.random() * 2) + 1; // 1-2
        pickups.push({ location: loc, passengers: pax });
        totalPassengers += pax;
      }
      const numDrops = Math.floor(Math.random() * 3) + 2; // 2-4
      for (let i = 0; i < numDrops; i++) {
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const pax = Math.floor(Math.random() * 2) + 1; // 1-2
        drops.push({ location: loc, passengers: pax });
      }
    } else {
      const pickupLoc = locations[Math.floor(Math.random() * locations.length)];
      const dropLoc = locations[Math.floor(Math.random() * locations.length)];
      const pax = Math.floor(Math.random() * 3) + 1;
      pickups = [{ location: pickupLoc, passengers: pax }];
      drops = [{ location: dropLoc, passengers: pax }];
      totalPassengers = pax;
    }
    const distance = (Math.random() * (50 - 10) + 10).toFixed(1);
    const duration = Math.floor(Math.random() * 60 + 30);
    // Dynamic fare based on distance
    const pricePerKm = 15 + Math.random() * 5; // 15-20 per km
    const fare = Math.round(distance * pricePerKm);
    const estimatedFare = `₹${fare}`;
    const names = ["Priya Sharma", "Arjun Mehta", "Sneha Gupta", "Rahul Singh", "Anita Verma", "Vikram Patel"];
    const passengerName = names[Math.floor(Math.random() * names.length)];
    const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
    const surge = Math.random() > 0.7 ? (Math.random() * (1.5 - 1.0) + 1.0).toFixed(1) : 1.0;
    return {
      id: `RID${Math.floor(100000 + Math.random() * 900000)}`,
      type,
      passengerName,
      rating,
      pickups,
      drops,
      totalPassengers,
      estimatedFare,
      fare,
      distance: `${distance} km`,
      duration: `${duration}min`,
      surge
    };
  };

  // Function to fetch all necessary data from the backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, ridesRes] = await Promise.all([
        axios.get('/api/drivers/profile', getAuthHeaders()),
        axios.get('/api/drivers/rides', getAuthHeaders())
      ]);

      setDriverProfile(profileRes.data);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysRides = (ridesRes.data || []).filter(ride => new Date(ride.createdAt) >= today);
      const todayEarnings = todaysRides.reduce((acc, ride) => acc + ride.fare + (ride.tip || 0), 0);
      const todayTips = todaysRides.reduce((acc, ride) => acc + (ride.tip || 0), 0);

      setDashboardStats(prev => ({
        ...prev,
        today: {
          ...prev.today,
          rides: todaysRides.length,
          earnings: todayEarnings,
          tips: todayTips,
        },
        weekly: {
          ...prev.weekly,
          totalEarnings: profileRes.data.wallet?.totalEarnings || 0,
          totalRides: (ridesRes.data || []).length
        }
      }));

    } catch (err) {
      setError('Failed to fetch data. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- THIS IS THE MODIFIED SECTION ---
  // This hook now handles all initial data loading.
  // It prioritizes localStorage to prevent earnings from being reset on reload.
  useEffect(() => {
    const savedRides = localStorage.getItem('recentRides');
    const savedStats = localStorage.getItem('dashboardStats');
    const savedProfile = localStorage.getItem('driverProfile');

    if (savedRides) {
      setRecentRides(JSON.parse(savedRides));
    }
    if (savedStats) {
      setDashboardStats(JSON.parse(savedStats));
    }
    if (savedProfile) {
      setDriverProfile(JSON.parse(savedProfile));
    }

    // Only fetch from API if no stats are saved in localStorage.
    // Otherwise, use the saved data and stop the loading indicator.
    if (!savedStats && isLoggedIn) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, fetchData]);
  // --- END OF MODIFIED SECTION ---

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Automatic ride generation logic
  useEffect(() => {
    if (isOnline && !activeRide && incomingRequests.length < 3) {
      const timer = setInterval(() => {
        setIncomingRequests(prev => [...prev, generateMockRideRequest()].slice(-3)); // Keep only last 3 requests
      }, 15000); // Generate new ride every 15 seconds
      return () => clearInterval(timer);
    }
  }, [isOnline, activeRide, incomingRequests.length]);

  const handleGoOnline = () => {
    if (!isLoggedIn) {
      navigate('/driver/login');
      return;
    }
    setIsOnline(true);
  };

  const handleLogout = () => {
    navigate('/driver/logout');
  }

  const handleGoOffline = () => {
    setIsOnline(false);
    setActiveRide(null);
    setIncomingRequests([]);
  };

  const acceptRide = (ride) => {
    const allNames = ["Priya Sharma", "Arjun Mehta", "Sneha Gupta", "Rahul Singh", "Anita Verma", "Vikram Patel", "Deepa Rao", "Karan Joshi"];
    let usedNames = [];

    function getUniqueName() {
      let name = allNames[Math.floor(Math.random() * allNames.length)];
      let attempts = 0;
      while (usedNames.includes(name) && attempts < 10) {
        name = allNames[Math.floor(Math.random() * allNames.length)];
        attempts++;
      }
      usedNames.push(name);
      return name;
    }

    const passengers = [];
    for (const pickup of ride.pickups) {
      for (let j = 0; j < pickup.passengers; j++) {
        const name = getUniqueName();
        const dropObj = ride.drops[Math.floor(Math.random() * ride.drops.length)];
        passengers.push({
          name,
          pickup: pickup.location,
          drop: dropObj.location,
          status: "waiting"
        });
      }
    }

    const allStops = passengers.flatMap(p => [
      { type: 'pickup', location: p.pickup, passenger: p.name, phone: '+91 98765 43210' },
      { type: 'drop', location: p.drop, passenger: p.name, phone: '+91 98765 43210' }
    ]);

    const totalStops = allStops.length;
    const currentStop = 0;
    const nextStop = allStops[0];
    const totalDistance = parseFloat(ride.distance);
    const completedKm = (Math.random() * (totalDistance * 0.3)).toFixed(1);
    const remainingKm = (totalDistance - completedKm).toFixed(1);
    const estimatedCompletion = `${Math.floor(parseInt(ride.duration) * (remainingKm / totalDistance))} min`;

    setActiveRide({
      id: ride.id,
      type: ride.type,
      currentStop,
      totalStops,
      passengers,
      nextStop,
      totalFare: ride.estimatedFare,
      fare: ride.fare,
      completedDistance: `${completedKm} km`,
      remainingDistance: `${remainingKm} km`,
      estimatedCompletion
    });

    setIncomingRequests(prev => prev.filter(r => r.id !== ride.id));
  };

  const rejectRide = (rideId) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== rideId));
  };

  const handleCompleteRide = async (rideId, fare, tip = 0) => {
    try {
      // Simulate successful ride completion without API call
      alert('Ride completed and earnings updated!');
      setActiveRide(null);
    } catch (err) {
      setError('Failed to complete ride. Please try again.');
      console.error(err);
    }
  };

  const completeCurrentStop = () => {
    if (!activeRide) return;

    const nextStopIndex = activeRide.currentStop;
    if (nextStopIndex >= activeRide.totalStops) {
      // Complete the ride if at the last stop
      const earnedAmount = activeRide.fare;
      setDashboardStats(prev => {
        const updated = {
          ...prev,
          today: {
            ...prev.today,
            earnings: prev.today.earnings + earnedAmount,
            rides: prev.today.rides + 1,
            multiRides: activeRide.type === 'multi-pickup' ? prev.today.multiRides + 1 : prev.today.multiRides,
            tips: prev.today.tips + 0
          },
          weekly: {
            ...prev.weekly,
            totalEarnings: prev.weekly.totalEarnings + earnedAmount,
            totalRides: prev.weekly.totalRides + 1,
            multiLocationRides: activeRide.type === 'multi-pickup' ? prev.weekly.multiLocationRides + 1 : prev.weekly.multiLocationRides
          }
        };
        localStorage.setItem('dashboardStats', JSON.stringify(updated));
        return updated;
      });

      const uniquePickups = new Set(activeRide.passengers.map(p => p.pickup)).size;
      const pickupAddress = uniquePickups > 1 ? `Multiple Pickups (${uniquePickups})` : activeRide.passengers[0].pickup;
      const uniqueDrops = new Set(activeRide.passengers.map(p => p.drop)).size;
      const dropAddress = uniqueDrops > 1 ? `Multiple Drops (${uniqueDrops})` : activeRide.passengers[0].drop;
      
      // ======================= THIS IS THE CORRECTED SECTION =======================
      // Determine rideType based on the actual number of stops, which is more robust.
      const isMultiRide = uniquePickups > 1 || uniqueDrops > 1;

      const newRide = {
        _id: Date.now(),
        rideType: isMultiRide ? "multi" : "single",
        pickups: [{ address: pickupAddress }],
        drops: [{ address: dropAddress }],
        fare: activeRide.fare,
        createdAt: new Date().toISOString(),
        passengers: activeRide.passengers.length,
        rating: 5
      };
      // ======================= END OF CORRECTED SECTION =======================

      setRecentRides(prev => {
        const updatedRides = [newRide, ...prev];
        localStorage.setItem('recentRides', JSON.stringify(updatedRides));
        return updatedRides;
      });

      setDriverProfile(prev => {
        if (!prev) return prev; // Return previous state if no profile exists

        const currentBalance = parseFloat(prev.wallet?.balance || 0);
        const currentTotalEarnings = parseFloat(prev.wallet?.totalEarnings || 0);

        const updatedWallet = {
          ...(prev.wallet || {}),
          balance: currentBalance + earnedAmount,
          totalEarnings: currentTotalEarnings + earnedAmount,
        };

        const updatedProfile = {
          ...prev,
          wallet: updatedWallet,
        };

        localStorage.setItem('driverProfile', JSON.stringify(updatedProfile));
        return updatedProfile;
      });

      alert(`You earned ₹${earnedAmount}!`);
      handleCompleteRide(activeRide.id, activeRide.fare);
      return;
    }

    // Advance to the next stop
    const allStops = activeRide.passengers.flatMap(p => [
      { type: 'pickup', location: p.pickup, passenger: p.name, phone: p.phone || '+91 98765 43210' },
      { type: 'drop', location: p.drop, passenger: p.name, phone: p.phone || '+91 98765 43210' }
    ]);

    const nextStop = allStops[nextStopIndex];
    let updatedPassengers = activeRide.passengers;
    if (nextStop.type === 'pickup') {
      updatedPassengers = activeRide.passengers.map(p => {
        if (p.name === nextStop.passenger) {
          return { ...p, status: 'picked' };
        }
        return p;
      });
    } else if (nextStop.type === 'drop') {
      updatedPassengers = activeRide.passengers.map(p => {
        if (p.name === nextStop.passenger) {
          return { ...p, status: 'dropped' };
        }
        return p;
      });
    }

    setActiveRide(prev => ({
      ...prev,
      currentStop: prev.currentStop + 1,
      passengers: updatedPassengers,
      nextStop: allStops[nextStopIndex + 1] || prev.nextStop
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading driver data...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RideEase Driver</h1>
                <p className="text-sm text-gray-500">Multi-Location Expert</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <Bell className="h-6 w-6 text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4 hidden group-hover:block z-10">
                  <p className="text-sm font-medium text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-600 mt-1">You have 3 new notifications</p>
                </div>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4 hidden group-hover:block z-10">
                  <p className="text-sm font-medium text-gray-900">{driverProfile?.name || 'Driver Name'}</p>
                  <p className="text-xs text-gray-600 mt-1">View Profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isOnline ? "You're Online" : "You're Offline"}
              </h2>
              <p className="text-gray-600 mt-1">
                {isOnline ? "Accepting all ride types" : "Tap to start earning"}
              </p>
              {isOnline && (
                <div className="flex items-center mt-2 space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-600">Single rides</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-600">Multi-location rides</span>
                  </label>
                </div>
              )}
            </div>
            <button
              onClick={isOnline ? handleGoOffline : handleGoOnline}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 ${isOnline
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
            >
              {isOnline ? (
                <div className="text-center">
                  <div className="w-8 h-8 bg-white rounded-full mx-auto mb-1"></div>
                  <span className="text-xs font-bold">STOP</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold">GO</div>
                </div>
              )}
            </button>
          </div>

          {isOnline && !activeRide && incomingRequests.length === 0 && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center justify-center space-x-2 text-emerald-700">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="font-medium">Looking for rides nearby...</span>
              </div>
            </div>
          )}
        </div>

        {isOnline && !activeRide && incomingRequests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Available Ride Requests</h3>
            {incomingRequests.map((request) => (
              <div key={request.id} className="bg-gray-50 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{request.passengerName}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{request.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">{request.estimatedFare}</p>
                    <p className="text-sm text-gray-500">Estimated fare</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {request.type === 'multi-pickup' && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        MULTI-LOCATION
                      </span>
                    )}
                    {request.surge > 1 && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {request.surge}x SURGE
                      </span>
                    )}
                  </div>
                </div>

                {request.type === 'multi-pickup' && (
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-purple-900">Multi-Location Trip</h4>
                      <span className="text-purple-700 font-medium">{request.totalPassengers} passengers</span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm font-medium text-gray-700">Pickups ({request.pickups.length}):</p>
                      {request.pickups.map((pickup, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-emerald-500" />
                          <span>{pickup.location} ({pickup.passengers} passengers)</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Drops ({request.drops.length}):</p>
                      {request.drops.map((drop, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <Navigation className="h-4 w-4 text-red-500" />
                          <span>{drop.location} ({drop.passengers} passengers)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 h-64 rounded-xl overflow-hidden">
                  <OpenSourceRouteMap
                    pickups={request.pickups.map(p => p.location)}
                    drops={request.drops.map(d => d.location)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{request.distance}</p>
                    <p className="text-xs text-gray-500">Total Distance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{request.duration}</p>
                    <p className="text-xs text-gray-500">Est. Duration</p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => acceptRide(request)}
                    className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    Accept Ride
                  </button>
                  <button
                    onClick={() => rejectRide(request.id)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeRide && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {activeRide.type === 'multi-pickup' ? 'Active Multi-Location Ride' : 'Active Ride'}
              </h3>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                STOP {activeRide.currentStop + 1}/{activeRide.totalStops}
              </span>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(activeRide.currentStop / activeRide.totalStops) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  {[...Array(activeRide.totalStops)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${idx < activeRide.currentStop
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-900">Next Stop: {activeRide.nextStop.type}</h4>
                  <button className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Phone className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{activeRide.nextStop.location}</p>
                      <p className="text-sm text-gray-600">Passenger: {activeRide.nextStop.passenger}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={completeCurrentStop}
                  className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Complete {activeRide.nextStop.type}
                </button>
              </div>

              <div className="h-64 rounded-xl overflow-hidden mb-4">
                <OpenSourceRouteMap
                  pickups={activeRide.passengers.map(p => p.pickup)}
                  drops={activeRide.passengers.map(p => p.drop)}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Passengers Status</h4>
                {activeRide.passengers.map((passenger, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${passenger.status === 'dropped' ? 'bg-blue-500' :
                          passenger.status === 'picked' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{passenger.name}</p>
                        <p className="text-xs text-gray-500">{passenger.pickup} → {passenger.drop}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold ${passenger.status === 'dropped' ? 'text-blue-600' :
                        passenger.status === 'picked' ? 'text-green-600' :
                          'text-yellow-600'
                      }`}>
                      {passenger.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xl font-bold text-emerald-600">{activeRide.totalFare}</p>
                  <p className="text-xs text-gray-500">Total Fare</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{activeRide.completedDistance}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{activeRide.estimatedCompletion}</p>
                  <p className="text-xs text-gray-500">Time Left</p>
                </div>
              </div>

              <button
                onClick={completeCurrentStop}
                className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center"
              >
                <Navigation className="mr-2 h-5 w-5" />
                {activeRide.currentStop >= activeRide.totalStops ? 'Complete Ride' : 'Navigate to Next Stop'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Today's Performance</h3>
            <button
              onClick={() => setShowEarningsDetail(!showEarningsDetail)}
              className="text-emerald-600 text-sm font-medium flex items-center"
            >
              View Details <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">+12%</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">₹{dashboardStats.today.earnings.toLocaleString()}</p>
              <p className="text-sm text-emerald-600">Earnings</p>
              {dashboardStats.today.tips > 0 && (
                <p className="text-xs text-emerald-500 mt-1">+₹{dashboardStats.today.tips} tips</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Route className="h-5 w-5 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">{dashboardStats.today.multiRides} multi</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{dashboardStats.today.rides}</p>
              <p className="text-sm text-blue-600">Total Rides</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-700">{dashboardStats.today.rating}</p>
              <p className="text-sm text-yellow-600">Rating</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">{dashboardStats.today.peakHours}h peak</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{dashboardStats.today.hours}h</p>
              <p className="text-sm text-purple-600">Online Time</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{dashboardStats.today.acceptance}%</p>
              <p className="text-xs text-gray-600">Acceptance Rate</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{dashboardStats.today.cancellation}</p>
              <p className="text-xs text-gray-600">Cancellations</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">₹{dashboardStats.today.fuel}</p>
              <p className="text-xs text-gray-600">Fuel Cost</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 mb-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">This Week's Summary</h3>
            <Award className="h-8 w-8 text-emerald-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-2xl font-bold">₹{dashboardStats.weekly.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-emerald-100">Total Earnings</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardStats.weekly.totalRides}</p>
              <p className="text-sm text-emerald-100">Rides</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardStats.weekly.multiLocationRides}</p>
              <p className="text-sm text-emerald-100">Multi-Location</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardStats.weekly.avgRating}★</p>
              <p className="text-sm text-emerald-100">Avg Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardStats.weekly.totalHours}h</p>
              <p className="text-sm text-emerald-100">Online Hours</p>
            </div>
          </div>
        </div>

        {recentRides.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Rides</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedRideType('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedRideType === 'all'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedRideType('single')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedRideType === 'single'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  Single
                </button>
                <button
                  onClick={() => setSelectedRideType('multi')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedRideType === 'multi'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  Multi
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {recentRides
                .filter(ride => selectedRideType === 'all' || ride.rideType === selectedRideType)
                .slice(0, 3)
                .map((ride) => (
                  <div key={ride._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">{ride.pickups[0].address} → {ride.drops[0].address}</p>
                        {ride.rideType === 'multi' && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            MULTI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{new Date(ride.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {ride.passengers} passengers
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                          {ride.rating}
                        </span>
                      </div>
                    </div>
                    <p className="font-bold text-emerald-600 text-lg">₹{ride.fare}</p>
                  </div>
                ))
              }
            </div>

            <button
              onClick={() => navigate('/driver/rides')}
              className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              View All Rides
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center">
              <Fuel className="h-8 w-8 text-gray-700 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Fuel Tracker</p>
            </button>
            <button className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center">
              <CreditCard className="h-8 w-8 text-gray-700 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Instant Pay</p>
            </button>
            <button className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center">
              <ShieldCheck className="h-8 w-8 text-gray-700 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Safety Center</p>
            </button>
            <button className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center">
              <MessageCircle className="h-8 w-8 text-gray-700 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Support</p>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          <button className="flex flex-col items-center py-2 text-emerald-600">
            <Car className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => navigate('/driver/earnings')}
            className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600"
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs mt-1">Earnings</span>
          </button>
          <button
            onClick={() => navigate('/driver/rides')}
            className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600"
          >
            <Route className="h-6 w-6" />
            <span className="text-xs mt-1">My Rides</span>
          </button>
          <button
            onClick={() => navigate('/driver/schedule')}
            className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600"
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Schedule</span>
          </button>
          <button
            onClick={() => navigate('/driver/profile')}
            className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600"
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white w-80 h-full shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={() => setShowMenu(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{driverProfile?.name || 'Driver Name'}</p>
                  <p className="text-sm text-gray-500">Balance: ₹{driverProfile?.wallet?.balance?.toFixed(2) || '0.00'}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium ml-1">4.9</span>
                    <span className="text-xs text-gray-500 ml-2">Multi-location Expert</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button onClick={() => navigate('/driver/earnings')} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <span>Earnings Report</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    navigate('/driver/rides');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <Route className="h-5 w-5 text-gray-600" />
                  <span>My Rides</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </button>
                <button onClick={() => navigate('/driver/contact')} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  <span>Support</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </button>
                <button onClick={() => navigate('/driver/settings')} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>Settings</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </button>
              </div>

              <div className="pt-4 border-t">
                <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                  <X className="h-5 w-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            </div>
          </div>
          <div className="bg-black bg-opacity-50 flex-1" onClick={() => setShowMenu(false)}></div>
        </div>
      )}

      {isOnline && (
        <div className="fixed top-20 right-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in">
          <div className="flex items-start space-x-3">
            <Route className="h-6 w-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Multi-Location Rides Active!</p>
              <p className="text-sm text-purple-100 mt-1">You're now accepting multi-pickup and drop rides for higher earnings.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}