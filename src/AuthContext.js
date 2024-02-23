import React, { useState, createContext, useContext } from 'react';

// Create the authentication context
export const AuthContext = createContext();

// Custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};

// provide authentication context
export const AuthProvider = ({ children }) => {
    // track authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // login
    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    // logout
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    // check user auth
    const checkAuthentication = () => {
        return isAuthenticated;
    };

    const getToken = () => {
        return localStorage.getItem('token');
    };

    //  get the user ID from JWT token
    const getUserId = () => {
        const token = getToken();
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload && payload.sub) {
                return payload.sub;
            } else {
                console.error('User ID not found in the token payload.');
                return null;
            }
        }
        return null;
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: checkAuthentication, login, logout, getToken, getUserId }}>
            {children}
        </AuthContext.Provider>
    );
};
