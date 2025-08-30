import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, DollarSign, Clock, Star, Route,
  ChevronLeft, Calendar, Download, Users, CheckCircle, Award
} from 'lucide-react';
// recharts से संबंधित imports हटा दिए गए हैं

export default function EarningsPage() {
  const navigate = useNavigate();

  // State to hold data loaded from localStorage
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for UI controls
  const [selectedPeriod, setSelectedPeriod] = useState('weekly'); // 'today' or 'weekly'

  const loadData = useCallback(() => {
    const savedStats = localStorage.getItem('dashboardStats');
    const savedRides = localStorage.getItem('recentRides');

    if (savedStats) {
      setDashboardStats(JSON.parse(savedStats));
    }

    if (savedRides) {
      setRecentRides(JSON.parse(savedRides));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    window.addEventListener('focus', loadData);
    return () => {
      window.removeEventListener('focus', loadData);
    };
  }, [loadData]);

  // Helper to format date for display
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50">Loading earnings data...</div>;
  }

  if (!dashboardStats) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center px-4">
        <BarChart3 className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">No Earnings Data Found</h2>
        <p className="text-gray-500 mt-2">Complete a ride to see your earnings statistics here.</p>
        <button
          onClick={() => navigate('/driver/home')}
          className="mt-6 bg-emerald-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const statsToShow = selectedPeriod === 'today' ? dashboardStats.today : dashboardStats.weekly;
  const totalEarnings = selectedPeriod === 'today' ? dashboardStats.today.earnings : dashboardStats.weekly.totalEarnings;
  const totalRides = selectedPeriod === 'today' ? dashboardStats.today.rides : dashboardStats.weekly.totalRides;

  // chartData वेरिएबल हटा दिया गया है

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/driver/home')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">My Earnings</h1>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Download className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Earnings Display Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 mb-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-emerald-100 font-medium">
              {selectedPeriod === 'today' ? "Today's Earnings" : "This Week's Earnings"}
            </p>
            <div className="flex items-center space-x-1 bg-emerald-700/50 rounded-full p-1">
              <button
                onClick={() => setSelectedPeriod('today')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${selectedPeriod === 'today' ? 'bg-white text-emerald-600' : 'text-emerald-100'}`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedPeriod('weekly')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${selectedPeriod === 'weekly' ? 'bg-white text-emerald-600' : 'text-emerald-100'}`}
              >
                This Week
              </button>
            </div>
          </div>
          <p className="text-5xl font-bold tracking-tight">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center space-x-6 mt-4 opacity-90">
            <div className="text-center">
              <p className="font-bold text-lg">{totalRides}</p>
              <p className="text-xs text-emerald-100">Rides</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{statsToShow.hours || statsToShow.totalHours}h</p>
              <p className="text-xs text-emerald-100">Online</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">
                {statsToShow.rating || statsToShow.avgRating}
                <span className="text-yellow-300">★</span>
              </p>
              <p className="text-xs text-emerald-100">Rating</p>
            </div>
          </div>
        </div>

        {/* Daily Earnings Chart वाला सेक्शन यहाँ से हटा दिया गया है */}

        {/* Recent Rides History from localStorage */}
        {recentRides.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-4"> {/* मार्जिन टॉप जोड़ा गया */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentRides.slice(0, 5).map((ride) => (
                <div key={ride._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {ride.pickups[0].address} → {ride.drops[0].address}
                      </p>
                      {ride.rideType === 'multi' && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">MULTI</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatDate(ride.createdAt)}</span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {ride.passengers}
                      </span>
                    </div>
                  </div>
                  <p className="font-bold text-emerald-600 text-lg">
                    ₹{ride.fare.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/driver/rides')}
              className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              View All Transactions
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          <button onClick={() => navigate('/driver/home')} className="flex flex-col items-center py-2 text-gray-400 hover:text-emerald-600">
            <Route className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center py-2 text-emerald-600">
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs mt-1">Earnings</span>
          </button>
           <button onClick={() => navigate('/driver/rides')} className="flex flex-col items-center py-2 text-gray-400 hover:text-emerald-600">
            <Route className="h-6 w-6" />
            <span className="text-xs mt-1">My Rides</span>
          </button>
          <button onClick={() => navigate('/driver/schedule')} className="flex flex-col items-center py-2 text-gray-400 hover:text-emerald-600">
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Schedule</span>
          </button>
          <button onClick={() => navigate('/driver/profile')} className="flex flex-col items-center py-2 text-gray-400 hover:text-emerald-600">
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}