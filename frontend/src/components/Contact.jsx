import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import {
  Phone, Mail, MapPin, Clock, Users, MessageSquare,
  Twitter, Linkedin, Facebook, Instagram
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    feedbackType: 'general'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    emailjs.sendForm(
      'service_a00dheg',  // Your Service ID
      'template_22gfvci', // Your Template ID
      e.target,           // The form element
      'iICrVezhwGYgciHCg'   // Your Public Key
    ).then((result) => {
        console.log('SUCCESS!', result.text);
        alert('Thank you for your message! It has been sent successfully.');
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            feedbackType: 'general'
        });
    }, (error) => {
        console.log('FAILED...', error.text);
        alert(`An error occurred, please try again. Error: ${error.text}`);
    }).finally(() => {
        setIsLoading(false);
    });
  };

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in <span className="text-emerald-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We value every interaction with our customers. Your feedback, questions, and suggestions help us improve RideEase every day.
          </p>
        </div>

        {/* Customer Commitment Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-l-4 border-emerald-500">
          <div className="flex items-center mb-6">
            <Users className="h-8 w-8 text-emerald-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">We Respect Our Customers</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                At RideEase, we believe that exceptional customer service is the foundation of our success. Every message, inquiry, and piece of feedback is treated with the utmost importance and care.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  24/7 customer support availability
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Response within 2 hours during business hours
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  Dedicated support team for immediate assistance
                </li>
              </ul>
            </div>
            {/* Centered and slightly moved upward */}
            <div className="flex justify-center items-start pt-0">
              <div className="bg-emerald-50 rounded-lg p-6 max-w-md">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">Our Promise to You</h3>
                <p className="text-emerald-700 text-sm leading-relaxed">
                  "Every customer interaction is an opportunity to exceed expectations. We listen, we care, and we act on your feedback to continuously improve your RideEase experience."
                </p>
                <p className="text-emerald-600 text-sm mt-3 font-medium">- RideEase Customer Success Team</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-7 w-7 text-emerald-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
              </div>
              <div className="space-y-6 flex-grow">
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone Support</h4>
                    <p className="text-gray-600 text-sm mb-1">+91 98765 43210</p>
                    <p className="text-gray-500 text-xs">Available 24/7 for emergencies</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email Support</h4>
                    <p className="text-gray-600 text-sm mb-1">support@rideease.com</p>
                    <p className="text-gray-500 text-xs">Response within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Office Address</h4>
                    <p className="text-gray-600 text-sm mb-1">Ghaziabad, Uttar Pradesh</p>
                    <p className="text-gray-600 text-sm">India - 201001</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-600 text-sm">Mon - Fri: 9:00 AM - 8:00 PM</p>
                    <p className="text-gray-600 text-sm">Sat - Sun: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-center">Follow Us</h4>
                  <div className="flex items-center justify-center space-x-9">
                    <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                      <Instagram className="h-6 w-6" />
                    </a>
                  </div>
                </div>

              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white">
                <h4 className="font-semibold mb-2">Need Immediate Help?</h4>
                <p className="text-sm text-emerald-100">For urgent ride assistance or emergencies, call our 24/7 hotline immediately.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
              <p className="text-gray-600 mb-8">
                Have a question, suggestion, or need assistance? We're here to help! Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div>
                    <label htmlFor="feedbackType" className="block text-gray-700 font-medium mb-2">
                      Message Type
                    </label>
                    <select
                      id="feedbackType"
                      name="feedbackType"
                      value={formData.feedbackType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="complaint">Complaint</option>
                      <option value="suggestion">Suggestion</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Issue</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200 resize-vertical"
                    placeholder="Please describe your inquiry, feedback, or concern in detail. The more information you provide, the better we can assist you."
                  ></textarea>
                  <p className="text-gray-500 text-sm mt-1">Minimum 10 characters required</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-[1.02] transition duration-300 font-semibold shadow-lg disabled:opacity-75 disabled:scale-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ name: '', email: '', subject: '', message: '', feedbackType: 'general' })}
                    className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-200 transition duration-300 font-medium"
                  >
                    Clear Form
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Privacy Notice:</span> Your personal information is secure with us. We only use your contact details to respond to your inquiry and will never share your information with third parties without your consent.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition duration-200">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-600 font-bold">?</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">How do I book a ride?</h4>
              <p className="text-gray-600 text-sm">Learn about our easy booking process</p>
            </div>
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition duration-200">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-600 font-bold">₹</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Pricing & Payment</h4>
              <p className="text-gray-600 text-sm">Understand our transparent pricing</p>
            </div>
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition duration-200">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-600 font-bold">🛡️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Safety & Security</h4>
              <p className="text-gray-600 text-sm">Your safety is our top priority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}








