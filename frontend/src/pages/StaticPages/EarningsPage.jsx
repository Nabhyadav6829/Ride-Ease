import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import DriverBottomNav from '../../components/DriverBottomNav'; 
import DriverNavbar from '../../components/DriverNavbar';

// Helper for API calls
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// FIX: Accept the 'user' prop passed from App.jsx to ensure the navbar has the user data.
export default function DriverEarningsPage({ user }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState({ message: '', type: '' });

  const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = useCallback(async () => {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) { 
      navigate('/driver/login'); 
      return; 
    }
    setLoading(true);
    setError(null);
    try {
      const [profileRes, transactionsRes] = await Promise.all([
        axios.get(`${BackendUrl}/api/drivers/profile`, authHeaders),
        axios.get(`${BackendUrl}/api/drivers/transactions`, authHeaders)
      ]);
      setProfile(profileRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      console.error("Failed to fetch earnings data:", err);
      setError("Could not load your earnings details.");
    } finally {
      setLoading(false);
    }
  }, [navigate, BackendUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawStatus({ message: 'Please enter a valid amount.', type: 'error' });
      return;
    }
    if (!profile || amount > profile.wallet.balance) {
      setWithdrawStatus({ message: 'Insufficient balance.', type: 'error' });
      return;
    }
    setWithdrawStatus({ message: 'Processing...', type: 'loading' });
    try {
      const authHeaders = getAuthHeaders();
      const response = await axios.post(`${BackendUrl}/api/drivers/withdraw`, { amount }, authHeaders);
      setWithdrawStatus({ message: response.data.message, type: 'success' });
      setWithdrawAmount('');
      await fetchData(); // Refresh data after withdrawal
    } catch (err) {
      const message = err.response?.data?.message || 'Withdrawal failed.';
      setWithdrawStatus({ message, type: 'error' });
    }
  };

  if (loading) {
    return (
      <>
        {/* FIX: Pass the 'user' prop to the DriverNavbar. */}
        <DriverNavbar user={user} />
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading Earnings...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* FIX: Pass the 'user' prop to the DriverNavbar. */}
        <DriverNavbar user={user} />
        <div className="flex justify-center items-center min-h-screen text-red-500">
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* FIX: Pass the 'user' prop to the DriverNavbar. */}
      <DriverNavbar user={user} />
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">My Earnings</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 pb-24">
          {/* Balance Section */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg text-emerald-100">Available Balance</p>
                <p className="text-4xl font-bold mt-1">₹{profile?.wallet?.balance?.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="h-10 w-10 text-emerald-200" />
            </div>
            <div className="mt-4 text-emerald-100">
              <p>Total lifetime earnings: ₹{profile?.wallet?.totalEarnings?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Request Withdrawal</h3>
            <form onSubmit={handleWithdrawal}>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <button 
                type="submit" 
                className="w-full mt-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
              >
                Request Payout
              </button>
            </form>
            {withdrawStatus.message && (
              <div className={`mt-4 flex items-center p-3 rounded-lg ${
                withdrawStatus.type === 'success' ? 'bg-green-100 text-green-700' :
                withdrawStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {withdrawStatus.type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
                {withdrawStatus.type === 'error' && <AlertCircle className="h-5 w-5 mr-2" />}
                {withdrawStatus.type === 'loading' && <RefreshCw className="h-5 w-5 mr-2 animate-spin" />}
                {withdrawStatus.message}
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>
            <div className="space-y-3">
              {transactions.length > 0 ? transactions.map(tx => (
                <div key={tx._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{tx.description}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                    {tx.status === 'pending' && (
                      <span className="text-xs text-orange-500 font-semibold"> (Pending)</span>
                    )}
                  </div>
                  <p className={`text-lg font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </p>
                </div>
              )) : (
                <p className="text-center text-gray-500">No transactions yet.</p>
              )}
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <DriverBottomNav />
      </div>
    </>
  );
}