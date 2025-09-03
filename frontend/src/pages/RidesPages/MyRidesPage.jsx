
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Star, User, Car, MapPin, Flag, Calendar, Hash, Route, XCircle } from 'lucide-react';
// import axios from 'axios';
// import { io } from 'socket.io-client'; // Import socket.io client
// import OpenSourceRouteMap from '../../components/OpenSourceRouteMap';


// // Helper function to get status color
// const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//         case 'completed': return 'bg-emerald-100 text-emerald-800';
//         case 'ongoing': return 'bg-blue-100 text-blue-800 animate-pulse'; // Added pulse for ongoing
//         case 'scheduled': return 'bg-yellow-100 text-yellow-800';
//         case 'cancelled': return 'bg-red-100 text-red-800';
//         default: return 'bg-gray-100 text-gray-800';
//     }
// };

// export default function MyRidesPage() {
//     const navigate = useNavigate();
//     const [rides, setRides] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedDate, setSelectedDate] = useState('');
//     const [isFiltering, setIsFiltering] = useState(false);
    
//     // New state for live tracking
//     const [ongoingRide, setOngoingRide] = useState(null);
//     const [driverLocation, setDriverLocation] = useState(null);

//     const BackendUrl = import.meta.env.VITE_API_URL;

//     // Effect to fetch initial ride data
//     useEffect(() => {
//         const fetchRides = async () => {
//             setLoading(true);
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) throw new Error('No authentication token found. Please log in.');
                
//                 const response = await axios.get(`${BackendUrl}/api/rides/`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
                
//                 const data = Array.isArray(response.data) ? response.data : [];
//                 const sortedRides = data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
                
//                 setRides(sortedRides);
                
//                 // Find and set the ongoing ride for tracking
//                 const findOngoing = sortedRides.find(r => r.status === 'ongoing');
//                 setOngoingRide(findOngoing);
//                 if (findOngoing && findOngoing.driverLocation?.coordinates[1] !== 0) {
//                     setDriverLocation([
//                         findOngoing.driverLocation.coordinates[1], // lat
//                         findOngoing.driverLocation.coordinates[0]  // lng
//                     ]);
//                 }

//             } catch (err) {
//                 console.error('Error fetching rides:', err);
//                 setError(err.response?.data?.message || err.message || 'Failed to fetch rides');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchRides();
//     }, [BackendUrl]);

//     // Effect for WebSocket connection and event listeners
//     useEffect(() => {
//         if (!ongoingRide) return;

//         const socket = io(BackendUrl);

//         socket.on('connect', () => {
//             console.log('Connected to socket server!');
//             socket.emit('joinRide', ongoingRide._id);
//         });

//         socket.on('driverLocationUpdate', (data) => {
//             if (data.rideId === ongoingRide._id) {
//                 setDriverLocation(data.location); // location is [lat, lng]
//             }
//         });

//         socket.on('rideCompleted', (data) => {
//             if (data.rideId === ongoingRide._id) {
//                 alert('Your ride has been completed!');
//                 // Reload the page to refresh the ride list
//                 window.location.reload();
//             }
//         });

//         // Cleanup on component unmount
//         return () => {
//             console.log('Disconnecting socket...');
//             socket.disconnect();
//         };
//     }, [ongoingRide, BackendUrl]);

//     const filteredRides = rides.filter(ride => {
//         if (!selectedDate) return true;
//         const rideDate = new Date(ride.bookedAt).toISOString().split('T')[0];
//         return rideDate === selectedDate;
//     });

//     const handleGoHome = () => navigate('/');
//     const handleBookRide = () => navigate('/booking');

//     const handleDateChange = (e) => {
//         setIsFiltering(true);
//         setSelectedDate(e.target.value);
//         setTimeout(() => setIsFiltering(false), 500);
//     };

//     const handleClearFilter = () => {
//         setIsFiltering(true);
//         setSelectedDate('');
//         setTimeout(() => setIsFiltering(false), 500);
//     };
    
//     // --- Render Functions ---
//     const renderLoading = () => (
//         <div className="text-center mt-16">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
//             <p className="mt-4 text-lg text-gray-600">Loading your rides...</p>
//         </div>
//     );
    
//     const renderFilteringLoader = () => (
//         <div className="text-center mt-16 h-48 flex flex-col justify-center items-center">
//              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
//              <p className="mt-3 text-gray-500">Filtering...</p>
//         </div>
//     );

//     const renderError = () => (
//         <div className="mt-16 text-center bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
//             <h3 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h3>
//             <p className="mt-2 text-gray-600">{error}</p>
//             <button onClick={handleGoHome} className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition duration-300 font-semibold shadow-lg flex items-center justify-center text-lg mx-auto">
//                 <ArrowLeft className="mr-2 h-5 w-5" /> Go Home
//             </button>
//         </div>
//     );

//     const renderNoRides = () => (
//         <div className="mt-16 text-center bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
//             <h3 className="text-2xl font-bold text-gray-800">No Rides Yet</h3>
//             <p className="mt-2 text-gray-600">Looks like you haven't booked any rides. Let's change that!</p>
//             <button onClick={handleBookRide} className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition duration-300 font-semibold shadow-lg flex items-center justify-center text-lg mx-auto">
//                 Book Your First Ride <Route className="ml-2 h-6 w-6" />
//             </button>
//         </div>
//     );

//     const renderNoFilteredRides = () => (
//         <div className="mt-8 text-center bg-white/50 p-8 rounded-2xl max-w-lg mx-auto">
//             <h3 className="text-2xl font-bold text-gray-800">No Rides Found</h3>
//             <p className="mt-2 text-gray-600">There are no rides booked on <strong>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.</p>
//             <button onClick={handleClearFilter} className="mt-6 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition duration-300 font-semibold flex items-center justify-center text-md mx-auto">
//                 <XCircle className="mr-2 h-5 w-5" /> Clear Filter
//             </button>
//         </div>
//     );
    
//     const renderContent = () => {
//         if (rides.length === 0 && !loading) return renderNoRides();
//         if (filteredRides.length === 0 && selectedDate) return renderNoFilteredRides();
//         return (
//             <div className="space-y-8 mt-8">
//                 {filteredRides.map((ride) => (
//                     <div key={ride._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
//                         <div className="p-6">
//                             <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
//                                 <div className="flex items-center text-gray-600">
//                                     <Calendar className="h-5 w-5 mr-2 text-emerald-600"/>
//                                     <span className="font-semibold">{new Date(ride.bookedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
//                                 </div>
//                                 <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusBadge(ride.status)}`}>
//                                     {ride.status}
//                                 </span>
//                             </div>
//                             <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
//                                 <div className="space-y-3">
//                                     <div className="flex items-start"><User className="h-5 w-5 mt-1 mr-3 text-emerald-600 flex-shrink-0" /><div><p className="text-sm text-gray-500">Driver</p><p className="font-bold text-gray-800">{ride.driver.name}</p><div className="flex items-center text-sm"><Star className="h-4 w-4 text-yellow-400 fill-current mr-1" /> {ride.driver.rating}</div></div></div>
//                                     <div className="flex items-start"><Car className="h-5 w-5 mt-1 mr-3 text-emerald-600 flex-shrink-0" /><div><p className="text-sm text-gray-500">Vehicle</p><p className="font-bold text-gray-800">{ride.selectedVehicle.name}</p></div></div>
//                                     <div className="flex items-start"><Hash className="h-5 w-5 mt-1 mr-3 text-emerald-600 flex-shrink-0" /><div><p className="text-sm text-gray-500">Plate No.</p><p className="font-bold text-gray-800">{ride.driver.plate}</p></div></div>
//                                 </div>
//                                 <div className="space-y-3">
//                                     <div className="flex items-start"><MapPin className="h-5 w-5 mt-1 mr-3 text-emerald-600 flex-shrink-0" /><div><p className="text-sm text-gray-500">From</p><p className="font-semibold text-gray-800">{ride.pickups[0]}</p></div></div>
//                                     <div className="flex items-start"><Flag className="h-5 w-5 mt-1 mr-3 text-emerald-600 flex-shrink-0" /><div><p className="text-sm text-gray-500">To</p><p className="font-semibold text-gray-800">{ride.drops[ride.drops.length - 1]}</p></div></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
//             <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center mb-6">
//                     <button onClick={handleGoHome} className="p-2 rounded-full hover:bg-gray-200 transition-colors mr-4" aria-label="Go back to homepage">
//                         <ArrowLeft className="h-6 w-6 text-gray-700" />
//                     </button>
//                     <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">My <span className="text-emerald-600">Rides</span></h1>
//                 </div>

//                 {/* Live Tracking Map for Ongoing Ride */}
//                 {ongoingRide && (
//                     <div className="mb-10 bg-white rounded-2xl shadow-xl overflow-hidden">
//                         <h2 className="text-2xl font-bold text-center p-4 text-gray-800 border-b">Tracking Your Active Ride</h2>
//                         <div className="h-96 w-full">
//                             <OpenSourceRouteMap
//                                 pickups={ongoingRide.pickups}
//                                 drops={ongoingRide.drops}
//                                 driverPosition={driverLocation}
//                             />
//                         </div>
//                     </div>
//                 )}
                
//                 <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-4 mb-10">
//                     <label htmlFor="date-filter" className="font-semibold text-gray-700">Filter by Date:</label>
//                     <input type="date" id="date-filter" value={selectedDate} onChange={handleDateChange} className="border-gray-300 rounded-lg p-2 flex-grow w-full sm:w-auto" />
//                     {selectedDate && (
//                         <button onClick={handleClearFilter} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors flex items-center justify-center font-semibold text-sm w-full sm:w-auto">
//                             <XCircle className="mr-2 h-4 w-4" /> Clear Filter
//                         </button>
//                     )}
//                 </div>

//                 {/* Content with Loader Logic */}
//                 {loading ? renderLoading() 
//                     : error ? renderError() 
//                     : isFiltering ? renderFilteringLoader() 
//                     : renderContent()}
//             </div>
//         </div>
//     );
// }












// src/pages/MyRidesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { ArrowLeft, Star, User, Car, MapPin, Flag, Calendar, Hash, Route, XCircle, Navigation } from 'lucide-react';
import axios from 'axios';

// Helper function to get status color and text
const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
        case 'completed': return { badge: 'bg-emerald-100 text-emerald-800', text: 'Completed' };
        case 'ongoing': return { badge: 'bg-blue-100 text-blue-800', text: 'Ongoing' };
        case 'scheduled': return { badge: 'bg-yellow-100 text-yellow-800', text: 'Scheduled' };
        case 'cancelled': return { badge: 'bg-red-100 text-red-800', text: 'Cancelled' };
        default: return { badge: 'bg-gray-100 text-gray-800', text: 'Pending' };
    }
};

export default function MyRidesPage() {
    const navigate = useNavigate();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);
    const BackendUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No authentication token found. Please log in.');
                
                const response = await axios.get(`${BackendUrl}/api/rides/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const data = Array.isArray(response.data) ? response.data : [];
                setRides(data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));
            } catch (err) {
                console.error('Error fetching rides:', err);
                setError(err.response?.data?.message || err.message || 'Failed to fetch rides');
            } finally {
                setLoading(false);
            }
        };
        fetchRides();
    }, [BackendUrl]);
    
    // Filtering logic remains the same
    const filteredRides = rides.filter(ride => {
        if (!selectedDate) return true;
        const rideDate = new Date(ride.bookedAt).toISOString().split('T')[0];
        return rideDate === selectedDate;
    });

    const handleGoHome = () => navigate('/');
    const handleBookRide = () => navigate('/booking');

    const handleDateChange = (e) => {
        setIsFiltering(true);
        setSelectedDate(e.target.value);
        setTimeout(() => setIsFiltering(false), 500);
    };

    const handleClearFilter = () => {
        setIsFiltering(true);
        setSelectedDate('');
        setTimeout(() => setIsFiltering(false), 500);
    };

    const RideCard = ({ ride }) => {
        const { badge, text } = getStatusInfo(ride.status);
        const isOngoing = ride.status === 'ongoing';

        const cardContent = (
             <div className={`bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden ${isOngoing ? 'ring-2 ring-emerald-500 hover:shadow-2xl cursor-pointer' : 'hover:shadow-xl'}`}>
                {isOngoing && (
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center font-bold py-2 flex items-center justify-center">
                        <Navigation className="h-5 w-5 mr-2 animate-pulse" />
                        Click to Track Your Live Ride
                    </div>
                )}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="h-5 w-5 mr-2 text-emerald-600"/>
                            <span className="font-semibold">{new Date(ride.bookedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${badge}`}>
                            {text}
                        </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Ride Details (Driver, Vehicle, etc.) */}
                         <div className="space-y-3">
                            <div className="flex items-start"><User className="h-5 w-5 mt-1 mr-3 text-emerald-600 flex-shrink-0" /><div><p className="text-sm text-gray-500">Driver</p><p className="font-bold text-gray-800">{ride.driver.name}</p><div className="flex items-center text-sm"><Star className="h-4 w-4 text-yellow-400 fill-current mr-1" /> {ride.driver.rating}</div></div></div>
                            <div className="flex items-start"><Car className="h-5 w-5 mt-1 mr-3 text-emerald-600 flex-shrink-0" /><div><p className="text-sm text-gray-500">Vehicle</p><p className="font-bold text-gray-800">{ride.selectedVehicle.name}</p></div></div>
                         </div>
                         <div className="space-y-3">
                            <div className="flex items-start"><MapPin className="h-5 w-5 mt-1 mr-3 text-emerald-600 flex-shrink-0" /><div><p className="text-sm text-gray-500">From</p><p className="font-semibold text-gray-800">{ride.pickups[0]}</p></div></div>
                            <div className="flex items-start"><Flag className="h-5 w-5 mt-1 mr-3 text-emerald-600 flex-shrink-0" /><div><p className="text-sm text-gray-500">To</p><p className="font-semibold text-gray-800">{ride.drops[ride.drops.length - 1]}</p></div></div>
                         </div>
                    </div>
                </div>
            </div>
        );

        if (isOngoing) {
            return <Link to={`/ride/live/${ride._id}`}>{cardContent}</Link>;
        }
        
        return cardContent;
    };
    
    // --- RENDER FUNCTIONS ---
    // (renderLoading, renderError, etc. remain the same as before)
    const renderLoading = () => ( <div className="text-center mt-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div><p className="mt-4 text-lg text-gray-600">Loading your rides...</p></div>);
    const renderFilteringLoader = () => (<div className="text-center mt-16 h-48 flex flex-col justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div><p className="mt-3 text-gray-500">Filtering...</p></div>);
    const renderError = () => (<div className="mt-16 text-center bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto"><h3 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h3><p className="mt-2 text-gray-600">{error}</p><button onClick={handleGoHome} className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg flex items-center justify-center text-lg mx-auto"><ArrowLeft className="mr-2 h-5 w-5" /> Go Home</button></div>);
    const renderNoRides = () => (<div className="mt-16 text-center bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto"><h3 className="text-2xl font-bold text-gray-800">No Rides Yet</h3><p className="mt-2 text-gray-600">Looks like you haven't booked any rides. Let's change that!</p><button onClick={handleBookRide} className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg flex items-center justify-center text-lg mx-auto">Book Your First Ride <Route className="ml-2 h-6 w-6" /></button></div>);
    const renderNoFilteredRides = () => (<div className="mt-8 text-center bg-white/50 p-8 rounded-2xl max-w-lg mx-auto"><h3 className="text-2xl font-bold text-gray-800">No Rides Found</h3><p className="mt-2 text-gray-600">There are no rides booked on <strong>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.</p><button onClick={handleClearFilter} className="mt-6 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center text-md mx-auto"><XCircle className="mr-2 h-5 w-5" /> Clear Filter</button></div>);
    
    const renderContent = () => {
        if (rides.length === 0 && !loading) return renderNoRides();
        if (filteredRides.length === 0 && selectedDate) return renderNoFilteredRides();
        return (
            <div className="space-y-8 mt-8">
                {filteredRides.map((ride) => <RideCard key={ride._id} ride={ride} />)}
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-6">
                    <button onClick={handleGoHome} className="p-2 rounded-full hover:bg-gray-200 transition-colors mr-4">
                        <ArrowLeft className="h-6 w-6 text-gray-700" />
                    </button>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">My <span className="text-emerald-600">Rides</span></h1>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-4 mb-10">
                    <label htmlFor="date-filter" className="font-semibold text-gray-700">Filter by Date:</label>
                    <input type="date" id="date-filter" value={selectedDate} onChange={handleDateChange} className="border-gray-300 rounded-lg p-2 flex-grow w-full sm:w-auto" />
                    {selectedDate && (
                        <button onClick={handleClearFilter} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold text-sm w-full sm:w-auto">
                            <XCircle className="mr-2 h-4 w-4" />Clear Filter
                        </button>
                    )}
                </div>

                {loading ? renderLoading() : error ? renderError() : isFiltering ? renderFilteringLoader() : renderContent()}
            </div>
        </div>
    );
}