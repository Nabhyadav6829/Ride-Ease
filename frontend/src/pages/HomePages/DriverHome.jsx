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
import DriverBottomNav from '../../components/DriverBottomNav'; // 1. IMPORT THE REUSABLE NAVIGATION COMPONENT
import DriverNavbar from '../../components/DriverNavbar'; // 2. IMPORT THE REUSABLE NAVIGATION COMPONENT

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper for API calls (assumes token is stored in localStorage)
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// FIX: The component now accepts the 'user' prop from App.jsx.
export default function DriverHomePage({ user, isLoggedIn }) {
    // State for data from the backend
    const [driverProfile, setDriverProfile] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [recentRides, setRecentRides] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        today: { rides: 0, earnings: 0, rating: 4.9, hours: 9.5, tips: 180, multiRides: 6, peakHours: 4.5, acceptance: 92, cancellation: 3, fuel: 487 },
        weekly: { totalEarnings: 0, totalRides: 0, multiLocationRides: 28, avgRating: 4.8, singleRides: 0 }
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

    const [acceptSingle, setAcceptSingle] = useState(true);
    const [acceptMulti, setAcceptMulti] = useState(true);

    // MOCK DATA (for simulation, real data will be fetched)
    const generateMockRideRequest = async () => {
        const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
        const getRandomCoord = () => {
            const minLat = 28.4, maxLat = 28.9;
            const minLng = 76.8, maxLng = 77.4;
            const lat = Math.random() * (maxLat - minLat) + minLat;
            const lng = Math.random() * (maxLng - minLng) + minLng;
            return [lat, lng];
        };
        const getLocationName = async (lat, lng) => {
            if (!apiKey) return `Location at ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
            try {
                const res = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lat=${lat}&point.lon=${lng}&size=1`);
                const data = await res.json();
                if (data.features?.length > 0) {
                    return data.features[0].properties.label || data.features[0].properties.name || 'Unknown';
                }
            } catch (e) {
                console.error(e);
            }
            return 'Unknown location';
        };
        const types = [];
        if (acceptSingle) types.push("single");
        if (acceptMulti) types.push("multi-pickup");
        if (types.length === 0) return null;
        const type = types[Math.floor(Math.random() * types.length)];
        let pickups = [];
        let drops = [];
        let totalPassengers = 0;
        let pickupCoords = [];
        let dropCoords = [];
        if (type === "multi-pickup") {
            const numPickups = Math.floor(Math.random() * 3) + 2; // 2-4
            for (let i = 0; i < numPickups; i++) {
                const coord = getRandomCoord();
                const loc = await getLocationName(...coord);
                const pax = Math.floor(Math.random() * 2) + 1; // 1-2
                pickups.push({ location: loc, passengers: pax, coord: [coord[1], coord[0]] });
                pickupCoords.push([coord[1], coord[0]]);
                totalPassengers += pax;
            }
            const numDrops = Math.floor(Math.random() * 3) + 2; // 2-4
            for (let i = 0; i < numDrops; i++) {
                const coord = getRandomCoord();
                const loc = await getLocationName(...coord);
                const pax = Math.floor(Math.random() * 2) + 1; // 1-2
                drops.push({ location: loc, passengers: pax, coord: [coord[1], coord[0]] });
                dropCoords.push([coord[1], coord[0]]);
            }
        } else {
            const pickupCoord = getRandomCoord();
            const pickupLoc = await getLocationName(...pickupCoord);
            const dropCoord = getRandomCoord();
            const dropLoc = await getLocationName(...dropCoord);
            const pax = Math.floor(Math.random() * 3) + 1;
            pickups = [{ location: pickupLoc, passengers: pax, coord: [pickupCoord[1], pickupCoord[0]] }];
            drops = [{ location: dropLoc, passengers: pax, coord: [dropCoord[1], dropCoord[0]] }];
            pickupCoords = [[pickupCoord[1], pickupCoord[0]]];
            dropCoords = [[dropCoord[1], dropCoord[0]]];
            totalPassengers = pax;
        }
        let distance = (Math.random() * (50 - 10) + 10).toFixed(1);
        let duration = Math.floor(Math.random() * 60 + 30);
        if (apiKey) {
            try {
                const routePoints = [...pickupCoords, ...dropCoords];
                if (routePoints.length >= 2) {
                    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': apiKey,
                        },
                        body: JSON.stringify({ coordinates: routePoints }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const summary = data.routes[0].summary;
                        distance = (summary.distance / 1000).toFixed(1);
                        duration = Math.round(summary.duration / 60);
                    }
                }
            } catch (e) {
                console.error('Route calc error:', e);
            }
        }
        const pricePerKm = 15 + Math.random() * 5;
        const fare = Math.round(parseFloat(distance) * pricePerKm);
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

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileRes, ridesRes] = await Promise.all([
                axios.get(`${API_URL}/api/drivers/profile`, getAuthHeaders()),
                axios.get(`${API_URL}/api/drivers/rides`, getAuthHeaders())
            ]);

            const allRides = ridesRes.data || [];
            // FIX: Sort rides by bookedAt in descending order to show most recent first
            setRecentRides(allRides.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));
            setDriverProfile(profileRes.data);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todaysRides = allRides.filter(ride => {
                if (!ride.bookedAt) {
                    console.warn("⛔ Missing bookedAt for ride:", ride._id);
                    return false;
                }

                const rideDate = new Date(ride.bookedAt);

                if (isNaN(rideDate.getTime())) {
                    console.warn("⛔ Invalid bookedAt format:", ride.bookedAt);
                    return false;
                }

                return rideDate >= today;
            });

            const todayEarnings = todaysRides.reduce((acc, ride) => acc + Number(ride.fare || 0) + Number(ride.tip || 0), 0);
            const todayTips = todaysRides.reduce((acc, ride) => acc + Number(ride.tip || 0), 0);
            const todayMultiRides = todaysRides.filter(ride => ride.rideType === 'multi').length;

            const weeklyMultiRides = allRides.filter(ride => ride.rideType === 'multi').length;
            const weeklySingleRides = allRides.length - weeklyMultiRides;

            setDashboardStats(prev => ({
                ...prev,
                today: {
                    ...prev.today,
                    rides: todaysRides.length,
                    earnings: todayEarnings,
                    tips: todayTips,
                    multiRides: todayMultiRides,
                },
                weekly: {
                    ...prev.weekly,
                    totalEarnings: profileRes.data.wallet?.totalEarnings || 0,
                    totalRides: allRides.length,
                    multiLocationRides: weeklyMultiRides,
                    singleRides: weeklySingleRides
                }
            }));
        } catch (err) {
            setError('Failed to fetch data. Please check your connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, fetchData]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isOnline && !activeRide && incomingRequests.length < 3 && (acceptSingle || acceptMulti)) {
            const generateAndAddRide = async () => {
                const ride = await generateMockRideRequest();
                if (ride) {
                    setIncomingRequests(prev => [...prev, ride].slice(-3));
                }
            };
            const timer = setInterval(generateAndAddRide, 15000);
            return () => clearInterval(timer);
        }
    }, [isOnline, activeRide, incomingRequests.length, acceptSingle, acceptMulti]);

    const handleGoOnline = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        setIsOnline(true);
    };

    const handleLogout = () => {
        navigate('/driver/logout');
    };

    const handleGoOffline = () => {
        setIsOnline(false);
        setActiveRide(null);
        setIncomingRequests([]);
    };

    // ========= FIX START: Updated acceptRide function logic =========
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

        if (ride.type === 'single') {
            // For a single ride, all passengers go from the same pickup to the same drop.
            const pickupLocation = ride.pickups[0].location;
            const dropLocation = ride.drops[0].location;
            const numPassengers = ride.totalPassengers || 1;

            for (let i = 0; i < numPassengers; i++) {
                passengers.push({
                    name: getUniqueName(),
                    pickup: pickupLocation,
                    drop: dropLocation,
                    status: "waiting",
                    pickupCoord: ride.pickups[0].coord,
                    dropCoord: ride.drops[0].coord
                });
            }
        } else { // 'multi-pickup' logic
            // For multi-pickup, use the original logic.
            for (const pickup of ride.pickups) {
                for (let j = 0; j < pickup.passengers; j++) {
                    const name = getUniqueName();
                    // Each passenger from a pickup gets a randomly assigned drop from the available drops.
                    const dropObj = ride.drops[Math.floor(Math.random() * ride.drops.length)];
                    passengers.push({
                        name,
                        pickup: pickup.location,
                        drop: dropObj.location,
                        status: "waiting",
                        pickupCoord: pickup.coord,
                        dropCoord: dropObj.coord
                    });
                }
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
    // ========= FIX END: Updated acceptRide function logic =========

    const rejectRide = (rideId) => {
        setIncomingRequests(prev => prev.filter(r => r.id !== rideId));
    };

    const handleCompleteRide = async (completedRide) => {
        try {
            const uniquePickups = new Set(completedRide.passengers.map(p => p.pickup));
            const uniqueDrops = new Set(completedRide.passengers.map(p => p.drop));
            const isMultiRide = uniquePickups.size > 1 || uniqueDrops.size > 1;

            const numericFare = parseFloat(String(completedRide.fare).replace(/[^0-9.]/g, ''));

            if (isNaN(numericFare)) {
                console.error("Could not parse a valid fare from:", completedRide.fare);
                setError("An error occurred with the ride fare. Please try again.");
                return;
            }

            const payload = {
                pickups: [...uniquePickups].map(loc => ({ address: loc })),
                drops: [...uniqueDrops].map(loc => ({ address: loc })),
                fare: numericFare,
                tip: 0,
                rideType: isMultiRide ? "multi" : "single",
            };

            const { data } = await axios.post(`${API_URL}/api/drivers/rides/log-mock-ride`, payload, getAuthHeaders());
            const { earned: earnedAmount, ride: savedRide } = data;

            setDashboardStats(prev => {
                const updated = {
                    ...prev,
                    today: {
                        ...prev.today,
                        earnings: prev.today.earnings + earnedAmount,
                        rides: prev.today.rides + 1,
                        multiRides: isMultiRide ? prev.today.multiRides + 1 : prev.today.multiRides,
                        tips: prev.today.tips + (savedRide.tip || 0)
                    },
                    weekly: {
                        ...prev.weekly,
                        totalEarnings: prev.weekly.totalEarnings + earnedAmount,
                        totalRides: prev.weekly.totalRides + 1,
                        multiLocationRides: isMultiRide ? prev.weekly.multiLocationRides + 1 : prev.weekly.multiLocationRides
                    }
                };
                return updated;
            });

            const newRideForUI = {
                ...savedRide,
                passengers: completedRide.passengers.length,
                rating: 5,
            };

            setRecentRides(prev => [newRideForUI, ...prev]);

            setDriverProfile(prev => {
                if (!prev) return prev;
                const updatedProfile = {
                    ...prev,
                    wallet: {
                        ...prev.wallet,
                        balance: (prev.wallet?.balance || 0) + earnedAmount,
                        totalEarnings: (prev.wallet?.totalEarnings || 0) + earnedAmount,
                    },
                };
                return updatedProfile;
            });

            alert('Ride completed and saved to your history!');
            setActiveRide(null);
        } catch (err) {
            setError('Failed to save the completed ride. Please check your connection.');
            console.error('API Error:', err.response ? err.response.data : err.message);
            setActiveRide(null);
        }
    };

    const completeCurrentStop = () => {
        if (!activeRide) return;

        const currentStopIndex = activeRide.currentStop;

        if (currentStopIndex >= activeRide.totalStops) {
            handleCompleteRide(activeRide);
            return;
        }

        const allStops = activeRide.passengers.flatMap(p => [
            { type: 'pickup', location: p.pickup, passenger: p.name, phone: p.phone || '+91 98765 43210' },
            { type: 'drop', location: p.drop, passenger: p.name, phone: p.phone || '+91 98765 43210' }
        ]);

        const stopBeingCompleted = allStops[currentStopIndex];
        let updatedPassengers = activeRide.passengers;

        if (stopBeingCompleted.type === 'pickup') {
            updatedPassengers = activeRide.passengers.map(p =>
                p.name === stopBeingCompleted.passenger ? { ...p, status: 'picked' } : p
            );
        } else if (stopBeingCompleted.type === 'drop') {
            updatedPassengers = activeRide.passengers.map(p =>
                p.name === stopBeingCompleted.passenger ? { ...p, status: 'dropped' } : p
            );
        }

        setActiveRide(prev => ({
            ...prev,
            currentStop: prev.currentStop + 1,
            passengers: updatedPassengers,
            nextStop: allStops[currentStopIndex + 1] || prev.nextStop
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
                <div className="text-gray-600 text-lg animate-pulse">Loading driver data...</div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen font-sans">
            {/* FIX: The 'user' prop is now passed to the navbar. */}
            <DriverNavbar user={user} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* === CODE UPDATED: Online/Offline Status Component === */}
                <section className={`bg-white rounded-2xl shadow-xl p-6 mb-6 border-l-8 transition-all duration-300 ${isOnline ? 'border-emerald-500' : 'border-gray-300'}`}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Status Info */}
                        <div className="flex items-center space-x-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${isOnline ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                                <Zap className={`h-7 w-7 transition-colors duration-300 ${isOnline ? 'text-emerald-500' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    {isOnline ? "You're Online" : "You're Offline"}
                                </h2>
                                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                    {isOnline ? "Accepting new ride requests" : "Tap the switch to start earning"}
                                </p>
                            </div>
                        </div>

                        {/* Toggle Switch Button */}
                        <button
                            onClick={isOnline ? handleGoOffline : handleGoOnline}
                            aria-pressed={isOnline}
                            // CHANGED: Reduced height and width of the button
                            className={`relative inline-flex items-center h-10 w-24 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOnline ? 'bg-emerald-500 focus:ring-emerald-500' : 'bg-gray-200 focus:ring-gray-500'
                                }`}
                        >
                            <span className="sr-only">Toggle Online Status</span>
                            <span
                                // CHANGED: Reduced size and translation of the inner circle
                                className={`inline-block w-8 h-8 transform bg-white rounded-full transition-transform duration-300 ease-in-out shadow-lg ${isOnline ? 'translate-x-[3.75rem]' : 'translate-x-1' // 60px
                                    }`}
                            />
                            {/* Icons inside the switch */}
                            {/* CHANGED: Reduced padding and icon size */}
                            <div className="absolute inset-0 flex items-center justify-between px-2">
                                <CheckCircle className={`h-5 w-5 transition-opacity duration-200 ${isOnline ? 'opacity-100 text-white' : 'opacity-0'}`} />
                                <X className={`h-5 w-5 transition-opacity duration-200 ${isOnline ? 'opacity-0' : 'opacity-100 text-gray-500'}`} />
                            </div>
                        </button>
                    </div>

                    {/* Ride Preferences and Searching Indicator (only when online) */}
                    {isOnline && (
                        <div className="mt-6 pt-5 border-t border-gray-200 border-dashed">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="font-semibold text-gray-700">Accepting Ride Types:</p>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={acceptSingle} onChange={(e) => setAcceptSingle(e.target.checked)} className="form-checkbox h-5 w-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                                        <span className="text-sm text-gray-800">Single Rides</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={acceptMulti} onChange={(e) => setAcceptMulti(e.target.checked)} className="form-checkbox h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                                        <span className="text-sm text-gray-800">Multi-Location</span>
                                    </label>
                                </div>
                            </div>

                            {!activeRide && incomingRequests.length === 0 && (
                                <div className="mt-6 p-4 bg-emerald-50 rounded-xl flex items-center justify-center space-x-3 text-emerald-800">
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                    <span className="font-medium">Looking for rides nearby...</span>
                                </div>
                            )}
                        </div>
                    )}
                </section>
                {/* === END OF UPDATED CODE === */}

                {/* Incoming Ride Requests */}
                {isOnline && !activeRide && incomingRequests.length > 0 && (
                    <section className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Ride Requests</h3>
                        {incomingRequests.map((request) => (
                            <div key={request.id} className="bg-gray-50 rounded-xl p-6 mb-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{request.passengerName}</p>
                                            <div className="flex items-center space-x-2">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm text-gray-600">{request.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <p className="text-2xl font-bold text-emerald-600">{request.estimatedFare}</p>
                                        <p className="text-sm text-gray-500">Estimated fare</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
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
                                {request.type === 'multi-pickup' && (
                                    <div className="bg-purple-50 p-4 rounded-xl mb-4">
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
                                <div className="mt-4">
                                    <div className="h-64 rounded-xl overflow-hidden">
                                        <OpenSourceRouteMap
                                            pickups={request.pickups.map(p => ({address: p.location, coord: p.coord}))}
                                            drops={request.drops.map(d => ({address: d.location, coord: d.coord}))}
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
                                </div>
                                <div className="flex space-x-3 mt-4">
                                    <button
                                        onClick={() => acceptRide(request)}
                                        className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors transform hover:scale-105"
                                    >
                                        Accept Ride
                                    </button>
                                    <button
                                        onClick={() => rejectRide(request.id)}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors transform hover:scale-105"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Active Ride */}
                {activeRide && (
                    <section className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-l-4 border-emerald-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {activeRide.type === 'multi-pickup' ? 'Active Multi-Location Ride' : 'Active Ride'}
                            </h3>
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                                STOP {activeRide.currentStop + 1 > activeRide.totalStops ? activeRide.totalStops : activeRide.currentStop + 1}/{activeRide.totalStops}
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
                            </div>
                            {activeRide.nextStop && (
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-blue-900">Next Stop: {activeRide.nextStop.type}</h4>
                                        <button className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors">
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
                                </div>
                            )}
                            <div className="h-64 rounded-xl overflow-hidden mb-4">
                                <OpenSourceRouteMap
                                    pickups={activeRide.passengers.map(p => ({address: p.pickup, coord: p.pickupCoord}))}
                                    drops={activeRide.passengers.map(p => ({address: p.drop, coord: p.dropCoord}))}
                                />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900">Passengers Status</h4>
                                {activeRide.passengers.map((passenger, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 rounded-full ${passenger.status === 'dropped' ? 'bg-blue-500' :
                                                passenger.status === 'picked' ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}></div>
                                            <div>
                                                <p className="font-medium text-gray-900">{passenger.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {passenger.status === 'dropped' ? 'Dropped' : passenger.status === 'picked' ? 'Picked Up' : 'Waiting'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold ${passenger.status === 'dropped' ? 'text-blue-600' :
                                            passenger.status === 'picked' ? 'text-green-600' : 'text-yellow-600'
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
                                className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors transform hover:scale-105 flex items-center justify-center"
                            >
                                <Navigation className="mr-2 h-5 w-5" />
                                {activeRide.currentStop >= activeRide.totalStops ? 'Complete Ride' : activeRide.nextStop ? `Complete ${activeRide.nextStop.type}` : 'Complete Ride'}
                            </button>
                        </div>
                    </section>
                )}

                {/* Weekly Summary */}
                <section className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">This Week's Summary</h3>
                        <Award className="h-8 w-8 text-emerald-200" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">₹{dashboardStats.weekly.totalEarnings.toLocaleString()}</p>
                            <p className="text-sm text-emerald-100">Total Earnings</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{dashboardStats.weekly.totalRides}</p>
                            <p className="text-sm text-emerald-100">Rides</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{dashboardStats.weekly.multiLocationRides}</p>
                            <p className="text-sm text-emerald-100">Multi-Location</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{dashboardStats.weekly.avgRating}★</p>
                            <p className="text-sm text-emerald-100">Avg Rating</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{dashboardStats.weekly.singleRides}</p>
                            <p className="text-sm text-emerald-100">Single Rides</p>
                        </div>
                    </div>
                </section>

                {/* Recent Rides */}
                {recentRides.length > 0 && (
                    <section className="bg-white rounded-2xl shadow-xl p-6 mb-20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Recent Rides</h3>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setSelectedRideType('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors transform hover:scale-105 ${selectedRideType === 'all' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setSelectedRideType('single')}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors transform hover:scale-105 ${selectedRideType === 'single' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    Single
                                </button>
                                <button
                                    onClick={() => setSelectedRideType('multi')}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors transform hover:scale-105 ${selectedRideType === 'multi' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    Multi
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {recentRides
                                .filter(ride => {
                                    if (selectedRideType === 'all') return true;
                                    if (selectedRideType === 'multi') return ride.rideType === 'multi';
                                    if (selectedRideType === 'single') return ride.rideType === 'single';
                                    return false;
                                })
                                .slice(0, 3)
                                .map((ride) => (
                                    <div key={ride._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <p className="text-sm font-semibold text-gray-900">{ride.pickups[0]?.address} → {ride.drops[0]?.address}</p>
                                                {ride.rideType === 'multi' && (
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        MULTI
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span>{new Date(ride.bookedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                                {ride.passengers && (
                                                    <span className="flex items-center">
                                                        <Users className="h-3 w-3 mr-1" />
                                                        {ride.passengers} passengers
                                                    </span>
                                                )}
                                                {ride.rating && (
                                                    <span className="flex items-center">
                                                        <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                                                        {ride.rating}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="font-bold text-emerald-600 text-lg">₹{ride.fare}</p>
                                    </div>
                                ))}
                        </div>
                        <button
                            onClick={() => navigate('/driver/rides')}
                            className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors transform hover:scale-105"
                        >
                            View All Rides
                        </button>
                    </section>
                )}

                {/* Quick Actions */}
                <section className="bg-white rounded-2xl shadow-xl p-6 mb-20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <button className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors transform hover:scale-105 text-center">
                            <Fuel className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Fuel Tracker</p>
                        </button>
                        <button className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors transform hover:scale-105 text-center">
                            <CreditCard className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Instant Pay</p>
                        </button>
                        <button className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors transform hover:scale-105 text-center">
                            <ShieldCheck className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Safety Center</p>
                        </button>
                        <button className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors transform hover:scale-105 text-center">
                            <MessageCircle className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Support</p>
                        </button>
                    </div>
                </section>
            </main>

            {/* 2. REMOVED the old <nav> HTML block and 3. ADDED the reusable component here */}
            <DriverBottomNav />

            {/* Side Menu */}
            {showMenu && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="bg-white w-80 h-full shadow-2xl transform transition-transform duration-300 translate-x-0">
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                                <button onClick={() => setShowMenu(false)} className="p-2 rounded-full hover:bg-gray-100">
                                    <X className="h-6 w-6 text-gray-700" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{driverProfile?.name || 'Driver Name'}</p>
                                    <p className="text-sm text-gray-500">Balance: ₹{driverProfile?.wallet?.balance?.toFixed(2) || '0.00'}</p>
                                    <div className="flex items-center mt-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm font-medium ml-1">4.9</span>
                                        <span className="text-xs text-gray-500 ml-2">Multi-location Expert</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/driver/earnings')}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <BarChart3 className="h-5 w-5 text-gray-600" />
                                    <span>Earnings Report</span>
                                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/driver/rides');
                                        setShowMenu(false);
                                    }}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Route className="h-5 w-5 text-gray-600" />
                                    <span>My Rides</span>
                                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                </button>
                                <button
                                    onClick={() => navigate('/driver/contact')}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <MessageCircle className="h-5 w-5 text-gray-600" />
                                    <span>Support</span>
                                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                </button>
                                <button
                                    onClick={() => navigate('/driver/settings')}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Settings className="h-5 w-5 text-gray-600" />
                                    <span>Settings</span>
                                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                </button>
                            </div>
                            <div className="pt-4 border-t">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                    <span className="font-medium">Log Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black bg-opacity-50 flex-1" onClick={() => setShowMenu(false)}></div>
                </div>
            )}
        </div>
    );
}