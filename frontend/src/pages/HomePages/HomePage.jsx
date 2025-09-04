
// pages/HomePages/HomePage.jsx
import React from 'react';
import {
  Car, Package, Wallet, Star,
  CheckCircle, MapPin, Navigation,
  Route, Users, Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';



export default function HomePage({ isLoggedIn }) {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Route className="h-8 w-8 text-white" />,
      title: "Multi-Stop Routes",
      description: "Pick up and drop off at multiple locations in a single trip. Perfect for group travel and errands.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Group-Friendly",
      description: "Coordinate rides for multiple people with different pickup points but same destination.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Clock className="h-8 w-8 text-white" />,
      title: "Time Efficient",
      description: "Optimize your route automatically. Save time with our intelligent multi-stop planning.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Wallet className="h-8 w-8 text-white" />,
      title: "Cost Effective",
      description: "Split costs across multiple stops. More locations, better value per kilometer traveled.",
      color: "from-green-500 to-green-600"
    }
  ];

  const useCases = [
    {
      title: "Airport Transfers",
      description: "Pick up multiple passengers from different hotels for airport transfers",
      icon: "✈️"
    },
    {
      title: "Shopping Trips",
      description: "Visit multiple malls and markets in a single organized trip",
      icon: "🛍️"
    },
    {
      title: "Corporate Events",
      description: "Coordinate employee transportation from multiple office locations",
      icon: "🏢"
    },
    {
      title: "Wedding Parties",
      description: "Transport wedding guests from various locations to the venue",
      icon: "💒"
    }
  ];

  const testimonials = [
    {
      quote: "The multi-pickup feature saved our wedding day! We could coordinate all family members from different hotels to the venue seamlessly.",
      name: "Priya & Arjun",
      role: "Wedding Couple"
    },
    {
      quote: "Perfect for our corporate events. One booking, multiple pickups from different offices, and everyone reaches the conference together.",
      name: "Rajesh Kumar",
      role: "HR Manager"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-emerald-50 text-gray-800">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
           
            {/* Left Column: Text Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Multiple Pickups,
                <br />
                <span className="text-emerald-600">One Smart Route.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
                Revolutionary multi-location ride booking. Add multiple pickup points and destinations in a single trip. Perfect for groups, events, and efficient city travel.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <button
                  onClick={() => navigate('/booking')}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition duration-300 font-semibold shadow-lg flex items-center justify-center text-lg w-full sm:w-auto"
                >
                  Book Your Ride Now <Route className="ml-2 h-6 w-6" />
                </button>
                <button
                  onClick={() => navigate('/deliverables')}
                  className="bg-white text-emerald-600 border border-emerald-600 py-4 px-8 rounded-xl hover:bg-emerald-50 transform hover:scale-105 transition duration-300 font-semibold shadow-lg flex items-center justify-center text-lg w-full sm:w-auto"
                >
                  Deliverables <Package className="ml-2 h-6 w-6" />
                </button>
              </div>
               <div className="mt-6 flex items-center justify-center md:justify-start gap-x-6">
                <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </div>
                <p className="text-sm text-gray-600">Rated 4.9/5 by 50K+ users</p>
              </div>
            </div>

            {/* Right Column: Animated Graphic */}
            <div className="hidden md:flex items-center justify-center relative h-96">
                {/* Dashed line circle */}
                <div className="absolute w-80 h-80 border-2 border-dashed border-emerald-300 rounded-full animate-spin-slow"></div>
               
                {/* Central Car Icon */}
                <div className="z-10 bg-white p-6 rounded-full shadow-2xl">
                    <Car className="h-16 w-16 text-emerald-600" />
                </div>

                {/* Floating Location Pins */}
                <div className="absolute top-8 left-12 z-20 bg-white p-3 rounded-full shadow-lg animate-float">
                    <MapPin className="h-8 w-8 text-red-500"/>
                </div>
                <div className="absolute top-20 right-4 z-20 bg-white p-3 rounded-full shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                    <MapPin className="h-8 w-8 text-red-500"/>
                </div>
                <div className="absolute bottom-12 left-4 z-20 bg-white p-3 rounded-full shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                    <MapPin className="h-8 w-8 text-red-500"/>
                </div>
                 <div className="absolute bottom-24 right-12 z-20 bg-white p-4 rounded-full shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                    <Users className="h-8 w-8 text-blue-500"/>
                </div>

            </div>
          </div>
        </div>
      </section>
     
      {/* NOTE: All other sections below remain unchanged */}

      {/* Quick Stats Section (optional, can be removed if redundant with hero) */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">50K+</div>
                            <div className="text-sm text-gray-600">Multi-location trips</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">8</div>
                            <div className="text-sm text-gray-600">Max stops per trip</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">35%</div>
                            <div className="text-sm text-gray-600">Cost savings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">4.9★</div>
                            <div className="text-sm text-gray-600">User rating</div>
                        </div>
                   </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Multi-Location Rides?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of urban mobility with intelligent multi-stop route planning.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Perfect for Every Occasion</h2>
            <p className="mt-2 text-lg text-gray-600">See how multi-location rides make life easier</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600 text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Book Multi-Location Rides in 3 Steps</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="bg-emerald-100 p-5 rounded-full mb-6 w-20 h-20 mx-auto flex items-center justify-center">
                        <MapPin className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">1. Add Multiple Locations</h3>
                    <p className="text-gray-600">Enter all your pickup and drop-off points. Add as many as you need for your journey.</p>
                </div>
                <div className="text-center">
                    <div className="bg-emerald-100 p-5 rounded-full mb-6 w-20 h-20 mx-auto flex items-center justify-center">
                        <Route className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">2. Optimize Route</h3>
                    <p className="text-gray-600">Our Platform plans the route for Pickups and Drops.</p>
                </div>
                <div className="text-center">
                    <div className="bg-emerald-100 p-5 rounded-full mb-6 w-20 h-20 mx-auto flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">3. Enjoy the Ride</h3>
                    <p className="text-gray-600">Track your multi-stop journey in real-time and get everyone where they need to go.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Loved by Event Organizers & Groups</h2>
            <p className="mt-2 text-lg text-emerald-100">Real stories from our multi-location ride users</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-emerald-50 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-emerald-200">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Start Your Multi-Location Journey</h2>
                <p className="mt-4 text-gray-600 text-lg">
                    Download RideEase and experience the most advanced multi-stop ride booking platform.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                        onClick={() => alert("Coming Soon 🚀")}
                        className="bg-gray-900 text-white py-3 px-6 rounded-lg flex items-center transition-transform hover:scale-105"
                    >
                        <div>
                            <p className="text-xs">Download on the</p>
                            <p className="text-lg font-semibold">App Store</p>
                        </div>
                    </button>
                    <button
                        onClick={() => alert("Coming Soon 🚀")}
                        className="bg-gray-900 text-white py-3 px-6 rounded-lg flex items-center transition-transform hover:scale-105"
                    >
                        <div>
                            <p className="text-xs">GET IT ON</p>
                            <p className="text-lg font-semibold">Google Play</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}