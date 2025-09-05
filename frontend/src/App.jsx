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

    const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const role = localStorage.getItem('role') || 'user';

        if (token) {
            try {
                const endpoint = role === 'driver' ? '/api/drivers/profile' : '/api/users/me';
                const response = await fetch(`${BackendUrl}${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    const userData = {
                        id: data.id || data._id,
                        name: data.name || 'User',
                        email: data.email || '',
                        profileImageUrl: data.profilePicture || data.avatarUrl || null,
                        role: role,
                        address: data.address || '',
                    };
                    setUser(userData);
                    setIsLoggedIn(true);
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('role', role);
                } else {
                    console.error('Auth verification failed:', data.message);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (err) {
                console.error('Error checking auth status:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                setIsLoggedIn(false);
                setUser(null);
            }
        } else if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
            } catch (err) {
                console.error('Error parsing stored user:', err);
                localStorage.removeItem('user');
                setUser(null);
                setIsLoggedIn(false);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuthStatus();
        const handleStorageChange = (e) => {
            if (e.key === 'token' && !e.newValue) {
                setIsLoggedIn(false);
                setUser(null);
                localStorage.removeItem('role');
            }
            if (e.key === 'user') {
                if (e.newValue) {
                    try {
                        setUser(JSON.parse(e.newValue));
                    } catch (err) {
                        console.error('Error parsing user from storage event:', err);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleUserUpdate = (updatedUserData) => {
        const updatedUser = {
            ...user,
            ...updatedUserData,
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const handleLogin = async (data, token) => {
        const userData = {
            id: data.id || data._id,
            name: data.name || 'User',
            email: data.email || '',
            profileImageUrl: data.profilePicture || data.profileImageUrl || data.avatarUrl || null,
            role: data.role || localStorage.getItem('role') || 'user',
            address: data.address || '',
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userData.role);
        setIsLoggedIn(true);
        setUser(userData);
        await checkAuthStatus(); // Call checkAuthStatus to ensure user state is updated
        navigate(userData.role === 'driver' ? '/driver/home' : '/');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberDriver');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setUser(null);
        navigate('/');
    };

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
                fetch(`${BackendUrl}/api/rides`, {
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
                <Route path="/booking" element={<BookingPage onRideStart={handleStartRide} />} />
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
                    element={<DriverLogoutPage setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
                />
                <Route
                    path="/driver/earnings"
                    element={isLoggedIn ? <EarningsPage isLoggedIn={isLoggedIn} user={user} /> : <Navigate to="/login" />}
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
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/driver/contact"
                    element={isLoggedIn ? <DriverContactPage isLoggedIn={isLoggedIn} user={user} /> : <Navigate to="/login" />}
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