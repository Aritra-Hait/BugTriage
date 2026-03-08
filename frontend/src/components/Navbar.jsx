import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "/assets/logo.png";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="w-full bg-slate-800 text-white">
            <div className="max-w-7xl text-xs sm:text-lg mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                <Link to="/home" className="flex items-center gap-2">
                    <img src={logo} alt="BugTriage Logo" className="h-8 w-8" />
                    <span className="text-lg sm:text-xl font-semibold tracking-tight">
                        BugTriage
                    </span>
                </Link>

                <span className="sm:inline text-slate-200 text-md md:text-lg">
                    Welcome, {user?.name || "User"} !
                </span>

                <button
                    onClick={handleLogout}
                    className="bg-white text-slate-700 text-md font-medium px-4 py-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                >
                    Logout
                </button>

            </div>
        </header>
    );
};

export default Navbar;