// pages/Payment/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, Clock, CheckCircle, AlertCircle, Star, MapPin, Navigation, Tag, X, Percent, Car, User } from 'lucide-react';
import axios from 'axios';

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [hasClickedPay, setHasClickedPay] = useState(false); // Prevent multiple clicks
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);

  const BackendUrl = import.meta.env.VITE_API_URL;
  const RazorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // Check if environment variables are set
  useEffect(() => {
    if (!BackendUrl || !RazorpayKey) {
      console.error('Missing environment variables: BackendUrl or RazorpayKey');
      setPaymentStatus('failed');
      alert('Configuration error. Please contact support.');
    }
  }, [BackendUrl, RazorpayKey]);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Load available coupons from backend
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/coupons`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAvailableCoupons(response.data);
      } catch (error) {
        console.error('Error fetching coupons:', error.response?.data || error.message);
        setCouponError('Failed to load coupons');
      }
    };
    fetchCoupons();
  }, [BackendUrl]);

  // Load Razorpay script
  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setPaymentStatus('failed');
      alert('Failed to load payment system. Please try again.');
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Validate booking data
  if (!state || !state.selectedVehicle || !state.pickups || !state.drops || !state.driver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Invalid Payment Request</h2>
          <p className="text-gray-600 mb-8">No booking information found.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const { selectedVehicle, pickups, drops, driver } = state;

  const savePaymentToDatabase = async (paymentData) => {
    try {
      await axios.post(`${BackendUrl}/api/payments`, paymentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (error) {
      console.error('Error saving payment:', error.response?.data || error.message);
      // Optionally notify user of failure to save payment
    }
  };

  const calculateBreakdown = () => {
    const baseFare = 40;
    const distanceFare = selectedVehicle.price - baseFare;
    const taxes = Math.round(selectedVehicle.price * 0.05); // 5% tax
    const subtotal = selectedVehicle.price + taxes;

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = Math.min((subtotal * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount);
      } else {
        discount = appliedCoupon.discount;
      }
    }

    const total = Math.max(subtotal - discount, 0);

    return { baseFare, distanceFare, taxes, subtotal, discount, total };
  };

  const applyCoupon = async (coupon) => {
    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const breakdown = calculateBreakdown();

      // Validate coupon
      if (!coupon.isActive) {
        throw new Error('This coupon is no longer active');
      }

      if (breakdown.subtotal < coupon.minAmount) {
        throw new Error(`Minimum order amount is ₹${coupon.minAmount}`);
      }

      // Apply coupon
      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      setShowCoupons(false);
    } catch (error) {
      setCouponError(error.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const applyCouponByCode = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const coupon = availableCoupons.find((c) => c.code.toLowerCase() === couponCode.toLowerCase());
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    await applyCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePayment = async () => {
    if (hasClickedPay || !razorpayLoaded || paymentStatus === 'success') {
      return; // Prevent multiple clicks or invalid states
    }

    if (!BackendUrl || !RazorpayKey) {
      alert('Payment system configuration error. Please contact support.');
      console.error('Missing environment variables');
      setPaymentStatus('failed');
      return;
    }

    setIsProcessing(true);
    setHasClickedPay(true);
    setPaymentStatus('processing');

    try {
      // Fetch order ID from backend
      const breakdown = calculateBreakdown();
      const response = await axios.post(
        `${BackendUrl}/api/payment/create-order`,
        { amount: breakdown.total, currency: 'INR' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const orderId = response.data.orderId;

      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const options = {
        key: RazorpayKey,
        amount: breakdown.total * 100, // Amount in paise
        currency: 'INR',
        name: 'Your Ride App',
        description: `${selectedVehicle.name} Ride`,
        image: '/logo.png',
        order_id: orderId, // Backend-generated order_id
        handler: async function (response) {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            rideDetails: {
              selectedVehicle,
              pickups,
              drops,
              driver,
              arrivalTime: state.arrivalTime,
              destinationTime: state.destinationTime,
              appliedCoupon,
              discount: breakdown.discount,
              fare: breakdown.total,
            },
          };

          // Verify payment and save ride in one call
          const verifyResponse = await axios.post(
            `${BackendUrl}/api/payment/verify-and-save-ride`,
            paymentData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );

          setPaymentStatus('success');
          setIsProcessing(false);

          setTimeout(() => {
            navigate('/booked', {
              state: {
                ...state,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentAmount: breakdown.total,
                appliedCoupon,
                discount: breakdown.discount,
              },
            });
          }, 2000);
        },
        prefill: {
          name: user.name || 'User Name',
          email: user.email || 'user@example.com',
          contact: user.phone || '9999999999',
        },
        notes: {
          pickup: pickups[0],
          dropoff: drops[drops.length - 1],
          vehicle: selectedVehicle.name,
          driver: driver.name,
          coupon: appliedCoupon?.code || 'none',
        },
        theme: {
          color: '#059669',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setHasClickedPay(false);
            setPaymentStatus('pending');
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', async function (response) {
        const failedPaymentData = {
          razorpay_order_id: options.order_id,
          razorpay_payment_id: null,
          razorpay_signature: null,
          rideDetails: {
            selectedVehicle,
            pickups,
            drops,
            driver,
            appliedCoupon,
            discount: breakdown.discount,
          },
          errorCode: response.error.code,
          errorDescription: response.error.description,
          errorSource: response.error.source,
          errorStep: response.error.step,
          errorReason: response.error.reason,
        };

        await axios.post(
          `${BackendUrl}/api/payment/verify-and-save-ride`,
          failedPaymentData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        ).catch((err) => {
          console.error('Error logging failed payment:', err.response?.data || err.message);
        });

        setPaymentStatus('failed');
        setIsProcessing(false);
        setHasClickedPay(false);
        console.error('Payment failed:', response.error);
      });

      rzp.open();
    } catch (error) {
      console.error('Payment initialization error:', error.response?.data || error.message);
      setPaymentStatus('failed');
      setIsProcessing(false);
      setHasClickedPay(false);
    }
  };

  const handleCancel = () => {
    navigate('/booking', { state: { pickups, drops } });
  };

  const breakdown = calculateBreakdown();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600 text-lg">Secure checkout for your ride</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Details */}
          <div className="space-y-6">
            {/* Trip Overview Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                Trip Overview
              </h2>

              {/* Route Display */}
              <div className="relative bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl mb-6">
                <div className="flex items-center">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-emerald-100 shadow-lg"></div>
                    <div className="w-0.5 h-16 bg-gradient-to-b from-emerald-300 to-red-300 my-2"></div>
                    <div className="w-4 h-4 bg-red-500 rounded-full ring-4 ring-red-100 shadow-lg"></div>
                  </div>
                  <div className="flex-1 space-y-8">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-emerald-600 mr-3" />
                      <div>
                        <p className="text-sm text-emerald-700 font-medium">PICKUP</p>
                        <p className="font-bold text-gray-900">{pickups[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Navigation className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <p className="text-sm text-red-700 font-medium">DROP-OFF</p>
                        <p className="font-bold text-gray-900">{drops[drops.length - 1]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle & Driver Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                  <div className="flex items-center mb-3">
                    <Car className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-semibold text-sm">YOUR RIDE</span>
                  </div>
                  <p className="text-xl font-bold text-blue-900 mb-1">{selectedVehicle.name}</p>
                  <p className="text-blue-700 text-sm">{selectedVehicle.capacity} seats available</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-100">
                  <div className="flex items-center mb-3">
                    <User className="h-6 w-6 text-purple-600 mr-2" />
                    <span className="text-purple-800 font-semibold text-sm">YOUR DRIVER</span>
                  </div>
                  <p className="text-xl font-bold text-purple-900 mb-1">{driver.name}</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-purple-700 text-sm font-semibold">{driver.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-orange-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                  <Tag className="h-4 w-4 text-white" />
                </div>
                Promo Codes
              </h2>

              {/* Coupon Input */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter promo code"
                    disabled={appliedCoupon}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                  />
                  <Tag className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {!appliedCoupon ? (
                  <button
                    onClick={applyCouponByCode}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                ) : (
                  <button
                    onClick={removeCoupon}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 font-semibold flex items-center transition-all duration-200 transform hover:scale-105"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                )}
              </div>

              {/* Applied Coupon Display */}
              {appliedCoupon && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                      <Percent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-green-800">{appliedCoupon.title}</p>
                      <p className="text-green-600 text-sm">{appliedCoupon.description}</p>
                      <p className="text-green-700 font-bold text-sm mt-1">
                        🎉 You saved ₹{breakdown.discount}!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Coupon Error */}
              {couponError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4">
                  <p className="text-red-700 font-medium">{couponError}</p>
                </div>
              )}

              {/* Show Available Coupons */}
              <button
                onClick={() => setShowCoupons(!showCoupons)}
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center"
              >
                <Tag className="h-4 w-4 mr-2" />
                {showCoupons ? 'Hide available coupons' : 'View available coupons'}
              </button>

              {showCoupons && (
                <div className="mt-4 space-y-3">
                  {availableCoupons.map((coupon) => (
                    <div
                      key={coupon.code}
                      className="bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-xl text-sm font-bold">
                              {coupon.code}
                            </span>
                          </div>
                          <p className="font-bold text-gray-800">{coupon.title}</p>
                          <p className="text-gray-600 text-sm">{coupon.description}</p>
                          {coupon.minAmount > 0 && (
                            <p className="text-orange-600 text-sm font-medium mt-1">
                              Min. order: ₹{coupon.minAmount}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => applyCoupon(coupon)}
                          disabled={appliedCoupon?.code === coupon.code || breakdown.subtotal < coupon.minAmount}
                          className={`ml-4 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                            appliedCoupon?.code === coupon.code
                              ? 'bg-green-500 text-white'
                              : breakdown.subtotal < coupon.minAmount
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 transform hover:scale-105'
                          }`}
                        >
                          {appliedCoupon?.code === coupon.code ? '✓ Applied' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                Payment Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-semibold">₹{breakdown.baseFare}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Distance Fare</span>
                  <span className="font-semibold">₹{breakdown.distanceFare}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Taxes & Fees (5%)</span>
                  <span className="font-semibold">₹{breakdown.taxes}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Subtotal</span>
                  <span className="font-bold">₹{breakdown.subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center py-2 text-green-600 bg-green-50 px-3 rounded-xl">
                    <span className="font-medium">Discount ({appliedCoupon.code})</span>
                    <span className="font-bold">-₹{breakdown.discount}</span>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ₹{breakdown.total}
                  </span>
                </div>
              </div>

              {/* Payment Status Messages */}
              {paymentStatus === 'processing' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mr-4"></div>
                    <div>
                      <p className="font-bold text-blue-800">Processing Payment</p>
                      <p className="text-blue-600 text-sm">Please complete the payment process</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-800">Payment Successful! 🎉</p>
                      <p className="text-green-600 text-sm">Redirecting to booking confirmation...</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-red-800">Payment Failed</p>
                      <p className="text-red-600 text-sm">Please try again or contact support</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || paymentStatus === 'success' || hasClickedPay}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-3 ${
                    isProcessing || paymentStatus === 'success' || hasClickedPay
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-6 h-6 rounded-full border-3 border-white border-t-transparent animate-spin"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : paymentStatus === 'success' ? (
                    <>
                      <CheckCircle className="h-6 w-6" />
                      <span>Payment Completed ✓</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6" />
                      <span>Pay ₹{breakdown.total} Securely</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 border-2 border-gray-200 hover:border-gray-300"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Booking
                </button>
              </div>

              {/* Security Info */}
              <div className="mt-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">🔒 Secure Payment</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Your payment is protected by industry-standard encryption. We never store your card details.
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">SSL Encrypted</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">PCI Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-friendly bottom action (visible only on mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-xl font-bold text-emerald-600">₹{breakdown.total}</span>
            </div>
            <button
              onClick={handlePayment}
              disabled={isProcessing || paymentStatus === 'success' || hasClickedPay}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-3 ${
                isProcessing || paymentStatus === 'success' || hasClickedPay
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 rounded-full border-3 border-white border-t-transparent animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : paymentStatus === 'success' ? (
                <>
                  <CheckCircle className="h-6 w-6" />
                  <span>Completed ✓</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-6 w-6" />
                  <span>Pay Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add padding bottom for mobile to account for fixed bottom bar */}
        <div className="lg:hidden h-32"></div>
      </div>
    </div>
  );
}