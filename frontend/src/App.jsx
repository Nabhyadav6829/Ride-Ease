import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePages/HomePage';
import LoginPage from './pages/auth/loginPage';
import SignupPage from './pages/auth/SignupPage';
import LogoutPage from './pages/LogoutPages/LogoutPage';
import Contact from './pages/contactspage/Contact';
import Partner from './pages/StaticPages/Partner';
import Deliverables from './pages/StaticPages/Deliverables';
import ProfilePage from './pages/Profile/ProfilePage';
import Navbar from './components/Navbar';
import BookingPage from './pages/BookingPages/BookingPage';
import BookedPage from './pages/BookingPages/BookedPage';
import MyRidesPage from './pages/RidesPages/MyRidesPage';
import SettingsPage from './pages/SettingsPages/Settings';
import DriverRidesPage from './pages/RidesPages/DriverRidesPage';
import DriverHomePage from './pages/HomePages/DriverHome';
import DriverLogoutPage from './pages/LogoutPages/DriverLogoutPage';
import DriverProfilePage from './pages/Profile/DriverProfilePage';
import EarningsPage from './pages/StaticPages/EarningsPage';
import DriverContactPage from './pages/contactspage/DriverContactPage';
import DriverSettingsPage from './pages/SettingsPages/DriverSettings';
import PaymentPage from './pages/Payment/PaymentPage';
import LiveRidePage from './pages/BookingPages/LiveRidePage';

// A placeholder for the RideStatusBanner component to avoid errors
const RideStatusBanner = ({ details, onCancel }) => (
  <div style={{ position: 'fixed', bottom: 0, width: '100%', background: '#f0f0f0', padding: '10px', borderTop: '1px solid #ccc', zIndex: 100 }}>
    <h4>Ride in Progress...</h4>
    {details && details.isSearching && <p>Searching for a driver...</p>}
    {details && details.driver && <p>Driver: {details.driver.name} is on the way.</p>}
    <button onClick={onCancel}>Cancel Ride</button>
  </div>
);

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRideActive, setIsRideActive] = useState(false);
  const [rideDetails, setRideDetails] = useState(null);

  const shouldHideNavbar =
    location.pathname.startsWith('/driver') || location.pathname === '/logout';

  const handleStartRide = (bookingInfo) => {
    if (isRideActive) return;

    setIsRideActive(true);
    let rideTimers = {};

    setRideDetails({
      ...bookingInfo,
      isSearching: true,
      driver: null,
      arrivalTime: 0,
      hasArrived: false,
      destinationTime: 0,
    });

    const searchTimer = setTimeout(() => {
      const names = ['Ramesh Kumar', 'Alice Singh', 'Bob Builder', 'Kalu Lala', 'Mike'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomPlate = `DL${Math.floor(Math.random() * 90 + 10)}AB${Math.floor(Math.random() * 9000 + 1000)}`;
      const randomRating = (Math.random() * 1 + 4).toFixed(1);
      const arrivalMinutes = Math.floor(Math.random() * 3) + 1;
      const destMinutes = Math.floor(Math.random() * 11) + 5;

      const driver = { name: randomName, plate: randomPlate, rating: randomRating };

      setRideDetails(prev => (prev ? {
        ...prev,
        isSearching: false,
        driver,
        arrivalTime: arrivalMinutes,
        destinationTime: destMinutes,
        timers: rideTimers
      } : null));

      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5000/api/rides', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            selectedVehicle: bookingInfo.selectedVehicle,
            pickups: bookingInfo.pickups,
            drops: bookingInfo.drops,
            driver,
            arrivalTime: arrivalMinutes,
            destinationTime: destMinutes,
            status: 'booked',
          }),
        }).catch(err => console.error('Error saving ride:', err));
      }

      const arrivalInterval = setInterval(() => {
        setRideDetails(prev => {
          if (!prev) return null;
          let newArrival = prev.arrivalTime - 1;
          if (newArrival <= 0) {
            clearInterval(arrivalInterval);
            const destInterval = setInterval(() => {
              setRideDetails(prevDest => {
                if (!prevDest) return null;
                let newDest = prevDest.destinationTime - 1;
                if (newDest <= 0) {
                  clearInterval(destInterval);
                  setIsRideActive(false);
                  setRideDetails(null);
                  navigate('/');
                  return null;
                }
                return { ...prevDest, destinationTime: newDest };
              });
            }, 60000);
            rideTimers.destIntervalId = destInterval;
            return { ...prev, hasArrived: true, arrivalTime: 0, timers: { ...rideTimers } };
          }
          return { ...prev, arrivalTime: newArrival };
        });
      }, 60000);

      rideTimers.arrivalIntervalId = arrivalInterval;
    }, 3000);

    rideTimers.searchTimerId = searchTimer;
    setRideDetails(prev => (prev ? { ...prev, timers: rideTimers } : null));
  };

  const handleCancelRide = () => {
    if (rideDetails && rideDetails.timers) {
      clearTimeout(rideDetails.timers.searchTimerId);
      if (rideDetails.timers.arrivalIntervalId) clearInterval(rideDetails.timers.arrivalIntervalId);
      if (rideDetails.timers.destIntervalId) clearInterval(rideDetails.timers.destIntervalId);
    }
    setIsRideActive(false);
    setRideDetails(null);
    navigate('/');
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const role = localStorage.getItem('role');

      if (role === 'driver' && token && storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }

      if (token) {
        try {
          const endpoint = role === 'driver' ? '/api/drivers/verify' : '/api/users/verify';
          const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            setIsLoggedIn(true);
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              const tokenPayload = JSON.parse(atob(token.split('.')[1]));
              const userData = tokenPayload.user || tokenPayload;
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          setIsLoggedIn(true);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('role');
      }
      if (e.key === 'user') {
          setUser(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleUserUpdate = (updatedUserData) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = {
      ...currentUser,
      ...updatedUserData,
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role || 'driver');
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberDriver');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: isRideActive ? '120px' : '0' }}>
      {!shouldHideNavbar && (
        <Navbar user={user} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}
      <Routes>
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/deliverables" element={<Deliverables />} />
        <Route path="/partner" element={<Partner />} />
        <Route
          path="/profile"
          element={
            isLoggedIn && user ? (
              <ProfilePage
                isLoggedIn={isLoggedIn}
                user={user}
                onUserUpdate={handleUserUpdate}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            <SettingsPage
              isLoggedIn={isLoggedIn}
              user={user}
              onUserUpdate={setUser}
            />
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn && localStorage.getItem('role') === 'driver' ? (
              <Navigate to="/driver/home" replace />
            ) : (
              <HomePage
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                user={user}
                setUser={setUser}
              />
            )
          }
        />
        <Route
          path="/logout"
          element={
            <LogoutPage
              setIsLoggedIn={setIsLoggedIn}
              setUser={setUser}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={localStorage.getItem('role') === 'driver' ? '/driver/home' : '/'} replace />
            ) : (
              <LoginPage
                setIsLoggedIn={setIsLoggedIn}
                setUser={setUser}
                onLogin={handleLogin}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to={localStorage.getItem('role') === 'driver' ? '/driver/home' : '/'} replace />
            ) : (
              <SignupPage
                setIsLoggedIn={setIsLoggedIn}
                setUser={setUser}
                onLogin={handleLogin}
              />
            )
          }
        />
        <Route path="/ride/live/:rideId" element={<LiveRidePage />} />
        <Route path="/booked" element={<BookedPage onRideStart={handleStartRide} />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route
          path="/my-rides"
          element={
            isLoggedIn ? (
              <MyRidesPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* --- DRIVER ROUTES --- */}
        <Route 
            path="/driver/home" 
            element={<DriverHomePage isLoggedIn={isLoggedIn} user={user} />} 
        />
        <Route 
            path="/driver/settings" 
            element={<DriverSettingsPage isLoggedIn={isLoggedIn} user={user} />} 
        />
        <Route 
            path="/driver/rides" 
            element={<DriverRidesPage isLoggedIn={isLoggedIn} user={user} />} 
        />
        <Route
          path="/driver/logout"
          element={<DriverLogoutPage onLogout={handleLogout} />}
        />
        <Route
          path="/driver/earnings"
          element={isLoggedIn ? <EarningsPage isLoggedIn={isLoggedIn} user={user} /> : <Navigate to="/driver/login" />}
        />
        <Route
          path="/driver/profile"
          element={
            isLoggedIn && user ? (
              <DriverProfilePage
                isLoggedIn={isLoggedIn}
                user={user}
                onUserUpdate={handleUserUpdate}
              />
            ) : (
              <Navigate to="/driver/login" />
            )
          }
        />
        <Route
          path="/driver/contact"
          element={isLoggedIn ? <DriverContactPage isLoggedIn={isLoggedIn} user={user} /> : <Navigate to="/driver/login" />}
        />
      </Routes>
      
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;