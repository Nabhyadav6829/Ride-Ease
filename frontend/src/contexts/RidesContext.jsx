// contexts/RidesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const RidesContext = createContext(null);

export const RidesProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [userRides, setUserRides] = useState([]);
    const [driverRides, setDriverRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load driver rides from localStorage on mount (for simulation)
    useEffect(() => {
        if (user?.role === 'driver') {
            const savedRides = localStorage.getItem('recentRides');
            if (savedRides) {
                setDriverRides(JSON.parse(savedRides));
            }
        }
    }, [user]);
    
    const fetchUserRides = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/rides/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const sortedRides = response.data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
            setUserRides(sortedRides);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch rides');
        } finally {
            setLoading(false);
        }
    };

    const addRide = async (rideData) => {
        if (!token) return { success: false, message: 'Not authenticated' };
        try {
            await axios.post('http://localhost:5000/api/rides', rideData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { success: true };
        } catch (err) {
            console.error('Error saving ride:', err.response?.data || err.message);
            return { success: false, message: 'Failed to save ride' };
        }
    };
    
    // Function to update driver rides in state and localStorage
    const updateDriverRides = (newRides) => {
        setDriverRides(newRides);
        localStorage.setItem('recentRides', JSON.stringify(newRides));
    };

    const value = {
        userRides,
        driverRides,
        loading,
        error,
        fetchUserRides,
        addRide,
        updateDriverRides,
    };

    return (
        <RidesContext.Provider value={value}>
            {children}
        </RidesContext.Provider>
    );
};

export const useRides = () => {
    return useContext(RidesContext);
};