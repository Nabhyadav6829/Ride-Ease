import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Route, Filter, ChevronDown } from 'lucide-react';
import axios from 'axios';
import DriverBottomNav from "../../components/DriverBottomNav"; // Make sure this path is correct
import DriverNavbar from '../../components/DriverNavbar';

// Helper for API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// FIX: Accept the 'user' prop to pass to the navbar.
export default function DriverRidesPage({ user }) {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'single', 'multi'
  const [filterDate, setFilterDate] = useState('all'); // 'all', 'today', 'this_week', 'this_month'

  useEffect(() => {
    const fetchRides = async () => {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        navigate('/driver/login');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${BackendUrl}/api/drivers/rides`, authHeaders);
        // Sort rides by date, newest first
        const sortedRides = (response.data || []).sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
        setRides(sortedRides);
      } catch (err) {
        console.error("Failed to fetch rides:", err);
        setError("Could not load your ride history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [navigate]);

  const filteredRides = useMemo(() => {
    return rides.filter(ride => {
      const typeMatch = filterType === 'all' || ride.rideType === filterType;
      
      if (filterDate === 'all') {
        return typeMatch;
      }
      
      const rideDate = new Date(ride.bookedAt);
      const now = new Date();
      
      if (filterDate === 'today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return typeMatch && rideDate >= today;
      }
      
      if (filterDate === 'this_week') {
        const firstDayOfWeek = now.getDate() - now.getDay();
        const startOfWeek = new Date(now.setDate(firstDayOfWeek));
        startOfWeek.setHours(0, 0, 0, 0);
        return typeMatch && rideDate >= startOfWeek;
      }
      
      if (filterDate === 'this_month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return typeMatch && rideDate >= startOfMonth;
      }
      
      return typeMatch;
    });
  }, [rides, filterType, filterDate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-700">Loading Ride History...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <p className="text-lg font-medium text-red-600 text-center">{error}</p>
        <button
          onClick={() => navigate('/driver/home')}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    // This is the single parent element. Everything must be inside it.
    <div className="bg-gray-50 min-h-screen">
      {/* FIX: Pass the 'user' prop to the DriverNavbar. */}
      <DriverNavbar user={user} />

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pb-24"> {/* Added padding-bottom */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors mr-4"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            My <span className="text-emerald-600">Rides</span>
          </h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">Filter Rides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Ride Type</label>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('single')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'single' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Single
                </button>
                <button
                  onClick={() => setFilterType('multi')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'multi' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Multi
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="date-filter" className="text-sm font-medium text-gray-600">Date Range</label>
              <div className="relative mt-2">
                <select
                  id="date-filter"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full appearance-none bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 text-gray-800 leading-tight focus:outline-none focus:bg-white focus:border-emerald-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rides List */}
        <div className="space-y-4">
          {filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <div key={ride._id} className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-transparent hover:border-emerald-500 transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500 mb-1">{formatDate(ride.bookedAt)}</p>
                    <div className="flex items-start space-x-3">
                      <Route className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0"/>
                      <p className="font-semibold text-gray-800">
                        {ride.pickups[0]?.address || 'N/A'} → {ride.drops[0]?.address || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 md:mt-0 md:justify-start md:space-x-8">
                    <div className="text-right md:text-center">
                      {ride.rideType === 'multi' ? (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                          MULTI-LOCATION
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          SINGLE
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-bold text-emerald-600">₹{ride.fare}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">No Rides Found</h3>
              <p className="text-gray-500 mt-2">No rides match your current filters.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* CORRECTED: The BottomNav component now lives inside the main div */}
      <DriverBottomNav />
    </div>
  );
}