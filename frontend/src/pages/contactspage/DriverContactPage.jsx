import React, { useState } from 'react';
import {
  MessageCircle, Phone, Mail, HelpCircle, Clock,
  ChevronLeft, Send, Search, ExternalLink,
  AlertCircle, CheckCircle, BookOpen, Video,
  User, Shield, Car, DollarSign, Settings,
  Star, FileText, Headphones, Globe
} from 'lucide-react';

export default function DriverContactPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const supportCategories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle, count: 12 },
    { id: 'account', name: 'Account Issues', icon: User, count: 3 },
    { id: 'rides', name: 'Ride Problems', icon: Car, count: 4 },
    { id: 'earnings', name: 'Payment & Earnings', icon: DollarSign, count: 2 },
    { id: 'safety', name: 'Safety & Security', icon: Shield, count: 2 },
    { id: 'app', name: 'App Issues', icon: Settings, count: 1 }
  ];

  const faqItems = [
    {
      question: "How do I handle multi-location ride disputes?",
      answer: "For multi-location rides, document each pickup and drop-off with photos. Contact support immediately if there are fare disputes.",
      category: 'rides'
    },
    {
      question: "When will I receive my weekly earnings?",
      answer: "Weekly earnings are processed every Monday and deposited within 1-2 business days to your registered bank account.",
      category: 'earnings'
    },
    {
      question: "How to report unsafe passenger behavior?",
      answer: "Tap the safety button during or immediately after the ride. You can also call our 24/7 safety helpline at 1800-123-SAFE.",
      category: 'safety'
    },
    {
      question: "App crashes during multi-pickup rides",
      answer: "Update to the latest version. If issues persist, restart the app and contact technical support with your device details.",
      category: 'app'
    },
    {
      question: "How to update my vehicle documents?",
      answer: "Go to Profile > Vehicle Documents. Upload clear photos of updated documents. Approval takes 24-48 hours.",
      category: 'account'
    },
    {
      question: "Passenger didn't show up at pickup location",
      answer: "Wait for the full pickup window (5 minutes), then mark 'No Show'. You'll receive a cancellation fee automatically.",
      category: 'rides'
    }
  ];

  const supportTickets = [
    {
      id: 'T001',
      subject: 'Multi-location fare calculation error',
      status: 'open',
      priority: 'high',
      created: '2025-08-28T10:30:00Z',
      lastUpdate: '2025-08-28T14:20:00Z',
      category: 'rides',
      messages: [
        {
          sender: 'driver',
          message: 'The fare for my multi-location ride was calculated incorrectly. It should have been ₹850 but I only received ₹650.',
          timestamp: '2025-08-28T10:30:00Z'
        },
        {
          sender: 'support',
          message: 'Thank you for reaching out. I\'ve reviewed your ride #RID123456. The fare adjustment of ₹200 has been processed and will reflect in your next payout.',
          timestamp: '2025-08-28T14:20:00Z'
        }
      ]
    },
    {
      id: 'T002',
      subject: 'Payment not received for last week',
      status: 'resolved',
      priority: 'medium',
      created: '2025-08-26T09:15:00Z',
      lastUpdate: '2025-08-27T11:45:00Z',
      category: 'earnings'
    }
  ];

  const contactMethods = [
    {
      type: 'Emergency Support',
      description: '24/7 safety and emergency assistance',
      contact: '1800-123-SAFE',
      icon: Shield,
      color: 'bg-red-500',
      available: 'Always Available'
    },
    {
      type: 'Driver Support',
      description: 'General queries and ride issues',
      contact: '1800-DRIVER-HELP',
      icon: Phone,
      color: 'bg-blue-500',
      available: '6:00 AM - 12:00 AM'
    },
    {
      type: 'Technical Support',
      description: 'App issues and technical problems',
      contact: 'tech@rideease.com',
      icon: Settings,
      color: 'bg-purple-500',
      available: '24/7 (Email)'
    },
    {
      type: 'Payment Issues',
      description: 'Earnings, payments, and wallet queries',
      contact: 'payments@rideease.com',
      icon: DollarSign,
      color: 'bg-green-500',
      available: '9:00 AM - 6:00 PM'
    }
  ];

  const filteredFAQs = faqItems.filter(item =>
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    (searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedTicket) {
      // In a real app, this would send the message to the backend
      setNewMessage('');
      alert('Message sent successfully!');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            {/* === MODIFIED BUTTON === */}
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            {/* === END OF MODIFICATION === */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">Support & Help</h1>
              <p className="text-sm text-gray-500">Get help when you need it</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Emergency Contact Banner */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Emergency Support</h2>
                <p className="text-red-100">24/7 safety assistance available</p>
              </div>
            </div>
            <a
              href="tel:1800-123-SAFE"
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Call Now</span>
            </a>
          </div>
        </div>

        {/* Quick Contact Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Methods</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {contactMethods.map((method) => (
              <div key={method.type} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center`}>
                    <method.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{method.type}</h4>
                    <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                    <div className="flex items-center justify-between">
                      <a
                        href={method.contact.includes('@') ? `mailto:${method.contact}` : `tel:${method.contact}`}
                        className="text-emerald-600 font-medium hover:text-emerald-700"
                      >
                        {method.contact}
                      </a>
                      <span className="text-xs text-gray-500">{method.available}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets */}
        {supportTickets.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Support Tickets</h3>
            <div className="space-y-3">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">#{ticket.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                          ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {ticket.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(ticket.lastUpdate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium">{ticket.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(ticket.created).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {supportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
                <span className="bg-white bg-opacity-70 text-xs px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-xl">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                  <h4 className="font-medium text-gray-900 group-open:text-emerald-700">
                    {faq.question}
                  </h4>
                  <HelpCircle className="h-5 w-5 text-gray-400 group-open:text-emerald-600 transform group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No FAQs found for your search.</p>
              <p className="text-sm text-gray-500 mt-1">Try different keywords or contact support directly.</p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => setSelectedTicket(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden relative">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">#{selectedTicket.id}</h3>
                  <p className="text-gray-600">{selectedTicket.subject}</p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedTicket.messages && (
                <div className="space-y-4 mb-6">
                  {selectedTicket.messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.sender === 'driver'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                        }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'driver' ? 'text-emerald-100' : 'text-gray-500'
                          }`}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}