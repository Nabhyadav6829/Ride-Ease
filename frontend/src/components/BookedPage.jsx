// components/BookedPage.
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import OpenSourceRouteMap from '../OpenSourceRouteMap.jsx';
import axios from 'axios';

export default function BookedPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [isSearching, setIsSearching] = useState(true);
    const [driver, setDriver] = useState(null);
    const [arrivalTime, setArrivalTime] = useState(0);
    const [hasArrived, setHasArrived] = useState(false);
    const [destinationTime, setDestinationTime] = useState(0);

    if (!state || !state.selectedVehicle || !state.pickups || !state.drops) {
        return <div>Invalid booking</div>;
    }

    const { selectedVehicle, pickups, drops } = state;

    useEffect(() => {
        let arrivalInterval;
        let destInterval;
        const searchTimer = setTimeout(() => {
            const names = ['Ramesh Kumar', 'Alice Singh', 'Bob Builder', 'Kalu Lala', 'Mike'];
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomPlate = `DL${Math.floor(Math.random() * 90 + 10)}AB${Math.floor(Math.random() * 9000 + 1000)}`;
            const randomRating = (Math.random() * 1 + 4).toFixed(1);
            const driverData = { name: randomName, plate: randomPlate, rating: randomRating };
            setDriver(driverData);

            const arrivalMinutes = Math.floor(Math.random() * 3) + 1;
            setArrivalTime(arrivalMinutes);

            const destMinutes = Math.floor(Math.random() * 11) + 5;
            setDestinationTime(destMinutes);

            // Save the ride to the backend
            axios.post('http://localhost:5000/api/rides', {
                selectedVehicle,
                pickups,
                drops,
                driver: driverData,
                arrivalTime: arrivalMinutes,
                destinationTime: destMinutes,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }).catch((err) => {
                console.error('Error saving ride:', err.response?.data || err.message);
            });

            setIsSearching(false);

            arrivalInterval = setInterval(() => {
                setArrivalTime((prev) => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        clearInterval(arrivalInterval);
                        setHasArrived(true);
                        destInterval = setInterval(() => {
                            setDestinationTime((prevDest) => {
                                const newDest = prevDest - 1;
                                if (newDest <= 0) {
                                    clearInterval(destInterval);
                                    navigate('/');
                                    return 0;
                                }
                                return newDest;
                            });
                        }, 60000);
                        return 0;
                    }
                    return newTime;
                });
            }, 60000);

        }, 3000);

        return () => {
            clearTimeout(searchTimer);
            if (arrivalInterval) clearInterval(arrivalInterval);
            if (destInterval) clearInterval(destInterval);
        };
    }, [navigate, selectedVehicle, pickups, drops]);

    const handleCancel = () => navigate('/');

    return (
        <div className="bg-gray-50 mt-5 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 lg:gap-12 min-h-screen">
                    <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div className="w-full max-w-lg mx-auto lg:mx-0">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Your Ride is Booked</h1>
                            <p className="mt-3 text-lg text-gray-600">{isSearching ? 'Searching for a driver...' : 'Your driver is on the way.'}</p>
                            
                            {isSearching ? (
                                <div className="mt-8 text-center">
                                    <p className="text-xl text-emerald-600">Searching for the best driver...</p>
                                </div>
                            ) : (
                                <div className="mt-8 space-y-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-md">
                                        <h2 className="text-2xl font-bold text-gray-900">Driver Assigned</h2>
                                        <div className="mt-4 space-y-2">
                                            <p><strong>Name:</strong> {driver.name}</p>
                                            <p><strong>Vehicle:</strong> {selectedVehicle.name}</p>
                                            <p><strong>Plate:</strong> {driver.plate}</p>
                                            <div className="flex items-center">
                                                <strong>Rating:</strong> <Star className="h-5 w-5 text-yellow-400 ml-2" /> {driver.rating}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50 p-6 rounded-2xl">
                                        {hasArrived ? (
                                            <div>
                                                <p className="text-xl font-semibold text-emerald-800">✅ Arrived</p>
                                                <p className="mt-2 text-md text-gray-700">
                                                    You will be at your destination shortly.
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xl font-semibold text-emerald-700">
                                                Arriving in {arrivalTime} minutes
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <div className="flex">
                                            <div className="flex flex-col items-center mr-4">
                                                <div className="w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-emerald-100"></div>
                                                <div className="w-px h-12 bg-gray-300 my-1"></div>
                                                <div className="w-3 h-3 bg-red-500 rounded-full ring-2 ring-red-100"></div>
                                            </div>
                                            <div className="flex flex-col justify-between h-full py-1 w-full">
                                                <p className="font-semibold text-gray-800 truncate">{pickups[0]}</p>
                                                <div className="flex-grow"></div>
                                                <p className="font-semibold text-gray-800 mt-7 truncate">{drops[drops.length - 1]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="mt-12">
                                <button onClick={handleCancel} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center">
                                    <ArrowLeft className="mr-2 h-5 w-5" /> Go Home
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="lg:sticky lg:top-0 h-96 lg:h-screen py-8 lg:py-16 pl-6 lg:pl-0 pr-6 lg:pr-8">
                        <div className="w-full h-full bg-gray-200 rounded-2xl shadow-xl overflow-hidden">
                            <OpenSourceRouteMap
                                pickups={pickups}
                                drops={drops}
                                draggableMarkerPosition={null}
                                onMarkerDragEnd={() => {}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}