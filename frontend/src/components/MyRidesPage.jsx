import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import axios from 'axios';

export default function MyRidesPage() {
    const navigate = useNavigate();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }
                // Updated the URL to match the backend route
                const response = await axios.get('http://localhost:5000/api/rides/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRides(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching rides:', err);
                setError(err.message || 'Failed to fetch rides');
                setLoading(false);
            }
        };
        fetchRides();
    }, []);

    const handleGoHome = () => navigate('/');

    return (
        <div className="bg-gray-50 min-h-screen mt-8 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">My Rides</h1>
                {loading ? (
                    <div className="mt-8 text-center">
                        <p className="text-xl text-gray-600">Loading your rides...</p>
                    </div>
                ) : error ? (
                    <div className="mt-8 text-center">
                        <p className="text-xl text-red-600">{error}</p>
                    </div>
                ) : rides.length === 0 ? (
                    <div className="mt-8 text-center">
                        <p className="text-xl text-gray-600">No rides found.Book first to see the rides</p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-6">
                        {rides.map((ride) => (
                            <div key={ride._id} className="bg-white p-6 rounded-2xl shadow-md">
                                <h2 className="text-2xl font-bold text-gray-900">Ride Details</h2>
                                <div className="mt-4 space-y-2">
                                    <p><strong>Driver:</strong> {ride.driver.name}</p>
                                    <p><strong>Vehicle:</strong> {ride.selectedVehicle.name}</p>
                                    <p><strong>Plate:</strong> {ride.driver.plate}</p>
                                    <div className="flex items-center">
                                        <strong>Rating:</strong> <Star className="h-5 w-5 text-yellow-400 ml-2" /> {ride.driver.rating}
                                    </div>
                                    <p><strong>Pickup:</strong> {ride.pickups[0]}</p>
                                    <p><strong>Drop-off:</strong> {ride.drops[ride.drops.length - 1]}</p>
                                    <p><strong>Status:</strong> {ride.status}</p>
                                    <p><strong>Booked At:</strong> {new Date(ride.bookedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-12">
                    <button
                        onClick={handleGoHome}
                        className="w-full max-w-lg mx-auto bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" /> Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}