
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Car, User, Star, Clock, CheckCircle } from 'lucide-react';
import OpenSourceRouteMap from '../../components/OpenSourceRouteMap';

const LiveRidePage = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();

    const [ride, setRide] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null); // [lat, lng]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusText, setStatusText] = useState('Connecting to ride...');

    const BackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Effect: Fetch initial ride details
    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) { navigate('/login'); return; }
                const response = await axios.get(`${BackendUrl}/api/rides/${rideId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const rideData = response.data;
                setRide(rideData);

                if (rideData.tripPhase === 'arriving') {
                    setStatusText('Driver is arriving at your pickup location');
                } else {
                    setStatusText('On the way to your destination');
                }

                const initialCoords = rideData.driverLocation?.coordinates;
                if (initialCoords && initialCoords[0] !== 0) {
                    // model stores [lng, lat] -> convert to [lat, lng]
                    setDriverLocation([initialCoords[1], initialCoords[0]]);
                }
            } catch (err) {
                console.error(err);
                setError('Could not load ride details.');
            } finally {
                setLoading(false);
            }
        };
        fetchRideDetails();
    }, [rideId, navigate, BackendUrl]);

    // Effect: WebSocket for live updates
    useEffect(() => {
        if (!rideId) return;

        const socket = io(BackendUrl, { transports: ['websocket'] });

        socket.on('connect', () => {
            // join server room for this ride ID
            socket.emit('joinRide', rideId);
            setStatusText('Connected. Waiting for driver updates...');
        });

        function onDriverLocationUpdate(data) {
            if (data.rideId === rideId) {
                // driver location is [lat, lng]
                setDriverLocation(data.location);
                if (data.ride) setRide(data.ride);
                if (data.phase === 'arriving') {
                    setStatusText('Driver is arriving at your pickup location');
                } else {
                    setStatusText('Driver is enroute to destination');
                }
            }
        }

        function onRideCompleted(data) {
            if (data.rideId === rideId) {
                setRide(data.ride);
                setStatusText('Ride completed');
            }
        }

        socket.on('driverLocationUpdate', onDriverLocationUpdate);
        socket.on('rideCompleted', onRideCompleted);

        socket.on('disconnect', () => {
            setStatusText('Disconnected from live updates');
        });

        return () => {
            socket.off('driverLocationUpdate', onDriverLocationUpdate);
            socket.off('rideCompleted', onRideCompleted);
            socket.disconnect();
        };
    }, [rideId, BackendUrl]);

    if (loading) {
        return (
            <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-lg text-gray-700">Loading your ride...</p>
            </div>
        );
    }

    if (error) {
         return (
            <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-50 p-4">
                <p className="text-lg text-red-600">{error}</p>
                <button onClick={() => navigate('/my-rides')} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg">
                    Go to My Rides
                </button>
            </div>
        );
    }

    if (!ride) return null;

    return (
        <div className="h-screen w-screen flex flex-col">
            <div className="bg-white shadow-md p-4 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Tracking Your Ride</h1>
                        <p className="text-emerald-600 font-semibold animate-pulse">{statusText}</p>
                    </div>
                     <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-gray-500" />
                            <div>
                                <span className="font-semibold">{ride.driver?.name || 'Driver'}</span>
                                <div className="flex items-center text-xs">
                                    <Star className="h-3 w-3 mr-1 text-yellow-500"/>{ride.driver?.rating || 'N/A'}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Car className="h-5 w-5 mr-2 text-gray-500" />
                            <div>
                                <span className="font-semibold">{ride.selectedVehicle?.name || 'Vehicle'}</span>
                                <span className="text-gray-500">({ride.driver?.plate || '—'})</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-gray-500" />
                            <div>
                                <span className="font-semibold">{ride.arrivalTime || '--'} min</span>
                                <span className="text-gray-500"> ETA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-grow relative">
                <OpenSourceRouteMap
                    pickups={ride.pickups}
                    drops={ride.drops}
                    driverPosition={driverLocation}
                    tripPhase={ride.tripPhase}
                />
                
                {ride.status === 'completed' && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-20 transition-opacity duration-500">
                        <CheckCircle className="h-24 w-24 text-white bg-emerald-500 rounded-full p-2 mb-4"/>
                        <h2 className="text-4xl font-bold text-white">Ride Completed!</h2>
                        <p className="text-white/80 mt-2">You have arrived at your destination.</p>
                        <button onClick={() => navigate('/my-rides')} className="mt-6 px-8 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-gray-100 transition">
                            View Ride History
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveRidePage;
