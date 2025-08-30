import React, { useState, useEffect } from 'react';
import {
  Package, Clock, Truck, MapPin, Calendar, Bell,
  CheckCircle, Star, Shield, Zap, Users, ArrowRight,
  Gift, Coffee, ShoppingBag, Utensils, Pill, Book
} from 'lucide-react';


export default function DeliverablesComingSoon() {
  const [emailSignup, setEmailSignup] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // No countdown timer needed anymore
  }, []);

  const handleEmailSubmit = () => {
    if (emailSignup) {
      setIsSubscribed(true);
      setEmailSignup('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const deliverableCategories = [
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Food Delivery",
      description: "From your favorite restaurants to your doorstep",
      features: ["Real-time tracking", "Hot food guarantee", "Multi-restaurant orders"],
      color: "from-red-500 to-orange-500"
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "Shopping Delivery",
      description: "Groceries, electronics, and daily essentials",
      features: ["Same-day delivery", "Quality assurance", "Bulk order discounts"],
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Pill className="h-8 w-8" />,
      title: "Medicine Delivery",
      description: "Emergency and scheduled medicine delivery",
      features: ["24/7 availability", "Prescription verification", "Cold chain delivery"],
      color: "from-green-500 to-teal-500"
    },
  ];

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              RideEase <span className="text-emerald-600">Deliverables</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Beyond rides, we're expanding to deliver everything you need. From food to medicines, 
              gifts to groceries - all with the same reliability you trust.
            </p>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-12 border-l-4 border-emerald-500 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="text-6xl md:text-6xl font-bold text-emerald-600 mb-4 leading-none">
                COMING
              <span className="text-6xl md:text-6xl font-bold text-gray-900 mb-6 leading-none">
                 -SOON
                </span>
              </div>
              <p className="text-xl md:text-2xl text-gray-600 font-medium">
                Revolutionary delivery services are on their way
              </p>
              <div className="mt-8 inline-flex items-center bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-lg font-semibold">
                <Package className="h-6 w-6 mr-3" />
                Something Amazing is Coming
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What We're Bringing You</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive delivery solutions designed to make your life easier and more convenient.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliverableCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${category.color} text-white mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="space-y-2">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose RideEase Deliverables?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Lightning Fast</h4>
                    <p className="text-gray-600 text-sm">Average delivery time of 30 minutes for local orders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">100% Secure</h4>
                    <p className="text-gray-600 text-sm">End-to-end tracking and insurance coverage</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Trusted Network</h4>
                    <p className="text-gray-600 text-sm">Verified delivery partners and quality assurance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Premium Experience</h4>
                    <p className="text-gray-600 text-sm">White-glove service with personalized care</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Early Access Benefits</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                  50% off your first 5 orders
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                  Priority delivery slots
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                  Exclusive partner restaurants & stores
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                  24/7 premium customer support
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                  No delivery fees for the first month
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-6 text-white">
                <h4 className="font-bold text-lg mb-2">Limited Beta Access</h4>
                <p className="text-emerald-100 text-sm">Only 1,000 early access spots available. Reserve yours today!</p>
              </div>
            </div>
          </div>

          {/* Email Signup */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <Bell className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Be the First to Know</h3>
              <p className="text-gray-600">
                Join our waitlist and get notified the moment RideEase Deliverables goes live in your area.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={emailSignup}
                  onChange={(e) => setEmailSignup(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                />
                <button
                  onClick={handleEmailSubmit}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition duration-300 font-semibold whitespace-nowrap"
                >
                  Notify Me
                </button>
              </div>
              {isSubscribed && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
                  🎉 Thank you! You'll be notified when we launch.
                </div>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Join <span className="font-semibold text-emerald-600">2,847</span> people already on the waitlist
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">When will the service launch?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  We're targeting a launch in approximately 45 days. Waitlist subscribers will get 48-hour early access.
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Which areas will be covered first?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  We're starting with major cities including Delhi NCR, Mumbai, Bangalore, and expanding rapidly to other metros.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Will this affect ride services?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Not at all! Our ride services continue as usual. Deliverables is an additional service using our trusted network.
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-2">How do I become a delivery partner?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Partner applications will open 2 weeks before launch. Existing RideEase drivers get priority enrollment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}