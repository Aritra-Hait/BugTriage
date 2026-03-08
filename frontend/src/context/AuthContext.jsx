import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Load auth state from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage", error);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const login = (userData, tokenData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", tokenData);

        setUser(userData);
        setToken(tokenData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setToken(null);
    };

    const isAuthenticated = !!user && !!token;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated,
                authLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }

    return context;
};