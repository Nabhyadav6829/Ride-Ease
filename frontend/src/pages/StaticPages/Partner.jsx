import React, { useState } from 'react';
import {
  Car, Shield, Clock, DollarSign, Users, MapPin,
  CheckCircle, Star, Phone, Mail, Upload, FileText,
  Calendar, IdCard, CreditCard, Award, TrendingUp,
  PlusCircle, MinusCircle, UserCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- NEW: Initial state for the form defined outside the component ---
const initialFormData = {
  // Step 1
  firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
  address: '', city: '',
  // Step 2
  licenseNumber: '', licenseExpiry: '', aadharNumber: '', panNumber: '',
  emergencyContact: '',
  vehicleClass: '4-wheeler',
  vehicleCondition: '',
  // Step 3
  vehicleMake: '', vehicleModel: '', vehicleYear: '',
  plateNumber: '', registeredRTO: '',
  vehicleOwnership: '',
  insuranceNumber: '',
  // Step 4
  bankAccount: '', ifscCode: '', bankName: '',
  bankBranch: '', isJointAccount: 'no',
  // Other
  agreeTerms: false, agreeBackground: false
};

export default function Partner() {
  // Use the initialFormData constant to set the initial state
  const [formData, setFormData] = useState(initialFormData);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      alert('Please fill all the required details on this page.');
      return;
    }

    if (!formData.agreeTerms || !formData.agreeBackground) {
      alert('You must agree to the Terms & Conditions and consent to a background check.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/signup');
    }, 2000);
  };

  const validateStep = (step) => {
    const fieldsByStep = {
      1: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address', 'city'],
      2: ['licenseNumber', 'licenseExpiry', 'aadharNumber', 'panNumber', 'emergencyContact', 'vehicleClass', 'vehicleCondition'],
      3: ['vehicleMake', 'vehicleModel', 'vehicleYear', 'plateNumber', 'registeredRTO', 'vehicleOwnership', 'insuranceNumber'],
      4: ['bankAccount', 'ifscCode', 'bankName', 'bankBranch']
    };

    const fieldsToValidate = fieldsByStep[step];
    if (!fieldsToValidate) return true;

    for (const field of fieldsToValidate) {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    } else {
      alert('Please fill all the required details on this page.');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const benefits = [
    { icon: DollarSign, title: "Earn Up to ₹50,000/month", description: "Flexible earning potential with competitive rates and bonuses" },
    { icon: Clock, title: "Work Your Own Hours", description: "Complete flexibility - drive when you want, where you want" },
    { icon: Shield, title: "Insurance Coverage", description: "Comprehensive insurance protection for you and your vehicle" },
    { icon: Award, title: "Weekly Payouts", description: "Get paid every week directly to your bank account" }
  ];

  const faqs = [
    { q: "How much can I earn?", a: "Earnings vary based on hours driven and demand. Most full-time drivers earn ₹35,000-50,000 monthly." },
    { q: "What documents do I need?", a: "You'll need a valid driving license, Aadhar card, PAN card, vehicle registration, and insurance papers." },
    { q: "How long is the approval process?", a: "Typically 3-5 business days after document verification and background check completion." },
    { q: "Do you provide vehicle insurance?", a: "Yes, we provide comprehensive insurance coverage for both driver and vehicle during rides." },
    { q: "Can I work part-time?", a: "Absolutely! You have complete flexibility to choose your working hours and days." },
    { q: "When do I get paid?", a: "We process payments weekly. Every Monday, your earnings are automatically transferred to your registered bank account." }
  ];

  const testimonials = [
      {
          stars: 5,
          quote: "RideEase changed my life! I'm earning ₹40,000+ monthly while maintaining my flexible schedule.",
          name: "Raj Sharma",
          location: "Delhi Partner since 2023",
          initials: "RS",
          color: "bg-emerald-100 text-emerald-600"
      },
      {
          stars: 5,
          quote: "Best decision ever! The support team is amazing and payments are always on time.",
          name: "Amit Kumar",
          location: "Gurgaon Partner since 2022",
          initials: "AK",
          color: "bg-blue-100 text-blue-600"
      },
      {
          stars: 5,
          quote: "Working part-time and still earning ₹25,000. Perfect for students like me!",
          name: "Priya Singh",
          location: "Noida Partner since 2023",
          initials: "PS",
          color: "bg-purple-100 text-purple-600"
      },
      {
          stars: 5,
          quote: "As a woman, safety was my priority. RideEase's safety features are top-notch. I feel secure on every trip.",
          name: "Sunita Devi",
          location: "Mumbai Partner since 2022",
          initials: "SD",
          color: "bg-pink-100 text-pink-600"
      },
      {
          stars: 4,
          quote: "A great way to supplement my pension. The app is easy to use and I enjoy meeting new people.",
          name: "Vijay Patil",
          location: "Pune Partner since 2021",
          initials: "VP",
          color: "bg-orange-100 text-orange-600"
      }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Hero Section (UNCHANGED) */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Drive with <span className="text-emerald-600">RideEase</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Join thousands of drivers earning flexible income on their own schedule. Start your journey as a RideEase partner today!
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-gray-700 mb-8">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-emerald-500" />
                  <span className="font-medium">High Earning Potential</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 mr-2 text-emerald-500" />
                  <span className="font-medium">Growing Community</span>
                </div>
              </div>
               <a href="#application-form" className="inline-block bg-emerald-600 text-white font-bold text-lg px-10 py-4 rounded-lg hover:bg-emerald-700 transition duration-300 shadow-lg">
                Start Application
               </a>
            </div>
            <div className="h-80 lg:h-full bg-emerald-100 rounded-2xl flex items-center justify-center">
                 <Car className="w-1/2 h-1/2 text-emerald-300" />
                 <p className="absolute text-emerald-500 font-semibold"></p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Benefits Section (UNCHANGED) */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Drive with RideEase?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-emerald-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements Section (UNCHANGED) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-16 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div className="order-last lg:order-first h-80 lg:h-full bg-blue-100 rounded-2xl flex items-center justify-center">
                   <IdCard className="w-1/2 h-1/2 text-blue-300" />
                   <p className="absolute text-blue-500 font-semibold"></p>
               </div>
               <div>
                   <h2 className="text-3xl font-bold text-gray-900 mb-8">
                   What You Need to Get Started
                   </h2>
                   <div className="space-y-6">
                       <div>
                           <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><UserCheck className="mr-2 text-emerald-600"/>Driver Requirements</h3>
                           <ul className="space-y-2">
                               <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3"/><span className="text-gray-700">Valid driving license & Aadhar/PAN</span></li>
                               <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3"/><span className="text-gray-700">Age between 21-65 years</span></li>
                               <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3"/><span className="text-gray-700">Clean driving record</span></li>
                           </ul>
                       </div>
                       <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center"><Car className="mr-2 text-emerald-600"/>Vehicle Requirements</h3>
                           <ul className="space-y-2">
                               <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3"/><span className="text-gray-700">2015 model or newer</span></li>
                               <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3"/><span className="text-gray-700">Valid RC & insurance</span></li>
                               <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3"/><span className="text-gray-700">Smartphone with internet</span></li>
                           </ul>
                       </div>
                   </div>
               </div>
            </div>
        </div>

        {/* --- Application Form --- */}
        <div id="application-form" className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center">
                {[1, 2, 3, 4].map((step) => (
                    <React.Fragment key={step}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 flex-shrink-0 ${currentStep >= step ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {step}
                    </div>
                    {step < 4 && (
                        <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${currentStep > step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                    )}
                    </React.Fragment>
                ))}
                </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "License & Vehicle Class"}
                {currentStep === 3 && "Vehicle Details"}
                {currentStep === 4 && "Financial & Final Details"}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {currentStep === 1 && (
              <div className="min-h-[480px]">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                    <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Enter first name"/>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Enter last name"/>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                   <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                      <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="you@example.com"/>
                   </div>
                   <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                      <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="10-digit mobile number"/>
                   </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                        <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                        <input id="city" type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Your current city"/>
                    </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Complete Address <span className="text-red-500">*</span></label>
                  <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="House no, street, locality"/>
                </div>
              </div>
            )}
            {currentStep === 2 && (
                <div className="min-h-[480px]">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">Driving License Number <span className="text-red-500">*</span></label>
                      <input id="licenseNumber" type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. DL1420110012345"/>
                    </div>
                    <div>
                      <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date <span className="text-red-500">*</span></label>
                      <input id="licenseExpiry" type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number <span className="text-red-500">*</span></label>
                        <input id="aadharNumber" type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="12-digit Aadhar number"/>
                    </div>
                    <div>
                        <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-1">PAN Number <span className="text-red-500">*</span></label>
                        <input id="panNumber" type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="10-character PAN"/>
                    </div>
                  </div>
                   <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label htmlFor="vehicleClass" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Class <span className="text-red-500">*</span></label>
                        <select id="vehicleClass" name="vehicleClass" value={formData.vehicleClass} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                          <option value="4-wheeler">4-Wheeler (Car, SUV, etc.)</option>
                          <option value="3-wheeler">3-Wheeler (Auto-rickshaw)</option>
                          <option value="2-wheeler">2-Wheeler (Bike, Scooter)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="vehicleCondition" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Condition <span className="text-red-500">*</span></label>
                        <select id="vehicleCondition" name="vehicleCondition" value={formData.vehicleCondition} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                          <option value="" disabled>Select Vehicle Condition</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                        </select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number <span className="text-red-500">*</span></label>
                    <input id="emergencyContact" type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="A family member's contact"/>
                  </div>
                </div>
            )}
            {currentStep === 3 && (
                <div className="min-h-[480px]">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Make <span className="text-red-500">*</span></label>
                        <input id="vehicleMake" type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g., Maruti"/>
                     </div>
                     <div>
                        <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model <span className="text-red-500">*</span></label>
                        <input id="vehicleModel" type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g., Swift"/>
                     </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700 mb-1">Manufacturing Year <span className="text-red-500">*</span></label>
                        <input id="vehicleYear" type="number" name="vehicleYear" value={formData.vehicleYear} onChange={handleInputChange} min="2015" max={new Date().getFullYear()} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g., 2020"/>
                    </div>
                     <div>
                        <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-1">License Plate Number <span className="text-red-500">*</span></label>
                        <input id="plateNumber" type="text" name="plateNumber" value={formData.plateNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. UP16AB1234"/>
                     </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label htmlFor="registeredRTO" className="block text-sm font-medium text-gray-700 mb-1">Registered RTO <span className="text-red-500">*</span></label>
                        <input id="registeredRTO" type="text" name="registeredRTO" value={formData.registeredRTO} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g., UP-21"/>
                    </div>
                    <div>
                        <label htmlFor="vehicleOwnership" className="block text-sm font-medium text-gray-700 mb-1">Ownership <span className="text-red-500">*</span></label>
                        <select id="vehicleOwnership" name="vehicleOwnership" value={formData.vehicleOwnership} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                            <option value="" disabled>Select Ownership</option>
                            <option value="first">First Owner</option>
                            <option value="second">Second Owner</option>
                            <option value="third_plus">Third Owner or More</option>
                        </select>
                    </div>
                  </div>
                   <div className="mt-6">
                        <label htmlFor="insuranceNumber" className="block text-sm font-medium text-gray-700 mb-1">Insurance Policy Number <span className="text-red-500">*</span></label>
                        <input id="insuranceNumber" type="text" name="insuranceNumber" value={formData.insuranceNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Enter valid policy number"/>
                   </div>
                </div>
            )}
            {currentStep === 4 && (
                <div className="min-h-[480px]">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number <span className="text-red-500">*</span></label>
                        <input id="bankAccount" type="text" name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Enter account number"/>
                    </div>
                    <div>
                        <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">IFSC Code <span className="text-red-500">*</span></label>
                        <input id="ifscCode" type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Enter IFSC code"/>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name <span className="text-red-500">*</span></label>
                        <input id="bankName" type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. State Bank of India"/>
                    </div>
                    <div>
                        <label htmlFor="bankBranch" className="block text-sm font-medium text-gray-700 mb-1">Bank Branch <span className="text-red-500">*</span></label>
                        <input id="bankBranch" type="text" name="bankBranch" value={formData.bankBranch} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="e.g. Civil Lines"/>
                    </div>
                  </div>
                   <div className="mt-6">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Is this a Joint Account? <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-x-6">
                            <label className="flex items-center">
                                <input type="radio" name="isJointAccount" value="no" checked={formData.isJointAccount === 'no'} onChange={handleInputChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"/>
                                <span className="ml-2 text-sm text-gray-700">No</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="isJointAccount" value="yes" checked={formData.isJointAccount === 'yes'} onChange={handleInputChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"/>
                                <span className="ml-2 text-sm text-gray-700">Yes</span>
                            </label>
                        </div>
                   </div>
                  <div className="space-y-4 pt-6 border-t mt-6">
                    <div className="flex items-start">
                        <input id="agreeTerms" type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1 mr-3"/>
                        <label htmlFor="agreeTerms" className="text-sm text-gray-700">I agree to the <span className="text-emerald-600 underline cursor-pointer">Terms & Conditions</span>.<span className="text-red-500">*</span></label>
                    </div>
                    <div className="flex items-start">
                        <input id="agreeBackground" type="checkbox" name="agreeBackground" checked={formData.agreeBackground} onChange={handleInputChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1 mr-3"/>
                        <label htmlFor="agreeBackground" className="text-sm text-gray-700">I consent to a background check.<span className="text-red-500">*</span></label>
                    </div>
                  </div>
                </div>
            )}
            <div className="flex justify-between mt-8">
              <button type="button" onClick={prevStep} disabled={currentStep === 1} className={`px-6 py-3 rounded-lg font-medium ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Previous</button>
              {currentStep < 4 ? (
                <button type="button" onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600">Next Step</button>
              ) : (
                <button type="submit" disabled={isLoading} className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 flex items-center">
                  {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Verifying details...</>) : ('Submit Application')}
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Success Stories Section (UNCHANGED) */}
        <div className="mt-16 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 relative">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Success Stories from Our Partners</h2>
          <div className="relative flex items-center justify-center">
            <button 
                onClick={prevTestimonial} 
                className="absolute left-0 -translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
                aria-label="Previous testimonial"
            >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div key={currentTestimonial} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-fade-in">
              {[0, 1, 2].map((offset) => {
                const testimonial = testimonials[(currentTestimonial + offset) % testimonials.length];
                return (
                  <div key={(currentTestimonial + offset)} className="bg-white rounded-xl p-6 shadow-lg flex flex-col">
                    <div className="flex-grow">
                      <div className="flex items-center mb-4">
                        {Array.from({ length: testimonial.stars }).map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                    </div>
                    <div className="flex items-center mt-auto">
                      <div className={`w-10 h-10 ${testimonial.color} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                        <span className="font-bold">{testimonial.initials}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-gray-500 text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button 
                onClick={nextTestimonial} 
                className="absolute right-0 translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
                aria-label="Next testimonial"
            >
                <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* FAQ Section (UNCHANGED) */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                        <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left">
                            <h3 className="text-lg font-semibold text-gray-800">{faq.q}</h3>
                            {openFaq === index ? <MinusCircle className="text-emerald-500"/> : <PlusCircle className="text-gray-500"/>}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 mt-2' : 'max-h-0'}`}>
                            <p className="text-gray-600">{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Contact Section (UNCHANGED) */}
        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl text-white p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Engine?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">Our partner support team is here to help you get on the road. Reach out with any questions.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center text-lg"><Phone className="h-6 w-6 mr-2" /><span>+91 98765 43210</span></div>
                <div className="flex items-center text-lg"><Mail className="h-6 w-6 mr-2" /><span>partners@rideease.com</span></div>
            </div>
            <div className="pt-10">Refer to contact page for more help or feedback</div>
        </div>
      </div>
    </div>
  );
}