// contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    // This endpoint should return the user data for a given token
                    const res = await axios.get('http://localhost:5000/api/users/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error("Token validation failed", error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    setIsLoggedIn(false);
                }
            }
            setLoading(false);
        };
        validateToken();
    }, [token]);

    const login = async (role, formData) => {
        const endpoint = role === 'user' ? '/api/users/login' : '/api/drivers/login';
        const res = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            const userData = role === 'user' ? data.user : { ...data.driver, role: 'driver' };
            setUser(userData);
            setIsLoggedIn(true);
            setToken(data.token);
            return { success: true, user: userData, role };
        } else {
            return { success: false, message: data.message || 'Invalid credentials' };
        }
    };

    const signup = async (role, formData) => {
        const endpoint = role === 'user' ? '/api/users/register' : '/api/drivers/register';
        const res = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            const userData = role === 'user' ? data.user : { ...data.driver, role: 'driver' };
            setUser(userData);
            setIsLoggedIn(true);
            setToken(data.token);
            return { success: true, user: userData, role };
        } else {
            return { success: false, message: data.message || 'Registration failed' };
        }
    };

    const logout = (role = 'user') => {
        localStorage.removeItem('token');
        if (role === 'driver') {
            localStorage.removeItem('driverProfile');
            localStorage.removeItem('recentRides');
            localStorage.removeItem('dashboardStats');
        }
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        navigate(role === 'driver' ? '/' : '/');
    };

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        // If driver profile is stored separately, update it too
        if (updatedUserData.role === 'driver') {
            localStorage.setItem('driverProfile', JSON.stringify(updatedUserData));
        }
    };

    const value = {
        user,
        isLoggedIn,
        token,
        loading,
        login,
        signup,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};