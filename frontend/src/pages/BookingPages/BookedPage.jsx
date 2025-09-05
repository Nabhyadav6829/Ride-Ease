// components/BookedPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import OpenSourceRouteMap from '../../components/OpenSourceRouteMap';
import axios from 'axios';

export default function BookedPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState(true);
  const [driver, setDriver] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);
  const [destinationTime, setDestinationTime] = useState(0);
  const BackendUrl = import.meta.env.VITE_API_URL;

  if (!state || !state.selectedVehicle || !state.pickups || !state.drops) {
    return <div>Invalid booking</div>;
  }

  const { selectedVehicle, pickups, drops } = state;

  useEffect(() => {
    if (!state || !state.driver || !state.arrivalTime || !state.destinationTime) {
      return;
    }
    let arrivalInterval;
    let destInterval;
    setDriver(state.driver);
    setArrivalTime(state.arrivalTime);
    setDestinationTime(state.destinationTime);
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

    return () => {
      if (arrivalInterval) clearInterval(arrivalInterval);
      if (destInterval) clearInterval(destInterval);
    };
  }, [navigate, state]);

  const handleCancel = () => navigate('/');

  return (
    <div className="bg-gray-50 mt-5 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid adjusted for responsiveness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 min-h-screen">
          {/* Left Section */}
          <div className="flex flex-col justify-center py-8 sm:py-12">
            <div className="w-full max-w-lg mx-auto lg:mx-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 text-center lg:text-left">
                Your Ride is Booked
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-600 text-center lg:text-left">
                {isSearching ? 'Searching for a driver...' : 'Your driver is on the way.'}
              </p>

              {isSearching ? (
                <div className="mt-8 text-center">
                  <p className="text-lg sm:text-xl text-emerald-600">
                    Searching for the best driver...
                  </p>
                </div>
              ) : (
                <div className="mt-8 space-y-6">
                  {/* Driver Card */}
                  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Driver Assigned</h2>
                    <div className="mt-4 space-y-2 text-sm sm:text-base">
                      <p><strong>Name:</strong> {driver.name}</p>
                      <p><strong>Vehicle:</strong> {selectedVehicle.name}</p>
                      <p><strong>Plate:</strong> {driver.plate}</p>
                      <div className="flex items-center">
                        <strong>Rating:</strong>
                        <Star className="h-5 w-5 text-yellow-400 ml-2" /> {driver.rating}
                      </div>
                    </div>
                  </div>

                  {/* Arrival / Destination Info */}
                  <div className="bg-emerald-50 p-4 sm:p-6 rounded-2xl text-center sm:text-left">
                    {hasArrived ? (
                      <div>
                        <p className="text-lg sm:text-xl font-semibold text-emerald-800">✅ Arrived</p>
                        <p className="mt-2 text-sm sm:text-md text-gray-700">
                          You will be at your destination shortly.
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg sm:text-xl font-semibold text-emerald-700">
                        Arriving in {arrivalTime} minutes
                      </p>
                    )}
                  </div>

                  {/* Pickup & Drop Info */}
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-3 sm:mr-4">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-emerald-100"></div>
                        <div className="w-px h-12 bg-gray-300 my-1"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full ring-2 ring-red-100"></div>
                      </div>
                      <div className="flex flex-col justify-between h-full py-1 w-full">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{pickups[0]}</p>
                        <div className="flex-grow"></div>
                        <p className="font-semibold text-gray-800 mt-5 sm:mt-7 text-sm sm:text-base truncate">
                          {drops[drops.length - 1]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancel Button */}
              <div className="mt-8 sm:mt-12">
                <button
                  onClick={handleCancel}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Go Home
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Map */}
          <div className="mt-8 lg:mt-0 lg:sticky lg:top-0 h-64 sm:h-80 md:h-96 lg:h-screen py-6 sm:py-8 lg:py-16">
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
