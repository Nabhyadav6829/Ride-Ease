import React, { useState } from 'react';
import { Menu, X, UserRound } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ user }) {
   console.log("Navbar user:", user); 
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const navLinks = ['Home', 'Partner', 'Deliverables', 'Contact'];

  const handleLogout = () => {
    navigate('/logout');
  };

  const getValidAvatar = () => {
    return user?.profileImageUrl && user.profileImageUrl !== 'no-photo.jpg' ? user.profileImageUrl : null;
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => navigate('/')}>
            <div className="text-2xl font-bold text-emerald-600">RideEase</div>
          </button>

          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link, idx) =>
              link === 'Home' || link === 'Contact' || link === 'Partner' || link === 'Deliverables' ? (
                <Link
                  key={idx}
                  to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 relative group"
                >
                  {link}
                  <span className="block h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              ) : (
                <a
                  key={idx}
                  href={`#${link.toLowerCase()}`}
                  className="text-gray-700 hover:text-emerald-600 transition-colors duration-300 relative group"
                >
                  {link}
                  <span className="block h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              )
            )}

            {!user ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="ml-4 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="ml-2 px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div
                className="relative ml-4"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="cursor-pointer flex items-center">
                  {getValidAvatar() ? (
                    <img
                      src={getValidAvatar()}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-200"
                    />
                  ) : (
                    <UserRound className="w-9 h-9 p-1.5 text-emerald-700 bg-emerald-100 rounded-full" />
                  )}
                </div>

                <div
                  className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 transition-all duration-200 ${showDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-medium text-gray-800 truncate">{user.name}</p>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-emerald-100 text-gray-700"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-emerald-100 text-gray-700"
                    onClick={() => navigate('/settings')}
                  >
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-emerald-100 text-gray-700"
                    onClick={() => navigate('/my-rides')}
                  >
                    My Rides
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-emerald-100 text-gray-700"
                    onClick={() => navigate('/deliverables')}
                  >
                    Deliverables
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-emerald-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-100 px-4 py-4 space-y-2 animate-fade-down">
          {navLinks.map((link, idx) =>
            link === 'Home' || link === 'Contact' || link === 'Partner' ? (
              <Link
                key={idx}
                to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                className="block text-gray-700 hover:text-emerald-600 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {link}
              </Link>
            ) : (
              <a
                key={idx}
                href={`#${link.toLowerCase()}`}
                className="block text-gray-700 hover:text-emerald-600 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {link}
              </a>
            )
          )}

          {!user ? (
            <>
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full mt-4 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setIsOpen(false);
                }}
                className="w-full mt-2 px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all duration-300"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="pt-4 border-t mt-4">
              <div className="flex items-center space-x-3 mb-4">
                {getValidAvatar() ? (
                  <img
                    src={getValidAvatar()}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <UserRound className="w-10 h-10 p-2 text-emerald-700 bg-emerald-100 rounded-full" />
                )}
                <div className="text-gray-800 font-semibold">Hi, {user.name}</div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full mt-2 px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx="true">{`
        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-down {
          animation: fade-down 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}