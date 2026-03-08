import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import bgImage from "/assets/bg2.png";
import logoImage from "/assets/logo.png";
const Signup = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error("Fields cannot be empty");
            setLoading(false);
            return;
        }
        try {
            const res = await api.post("/auth/signup", {
                name,
                email,
                password,
            });

            /*
              Backend returns { user, token } after signup.
              This avoids double API call.
            */
            login(res.data.user, res.data.token);

            // Redirect handled by useEffect
        } catch (err) {
            const message =
                err.response?.data?.message || "Signup failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center text-white">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center filter blur-[2px]"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>

            {/* Header */}
            <div className="relative z-10 text-center mb-8 -mt-6 flex flex-col items-center">
                <div className="flex flex-row items-center ml-2 space-x-1 ">

                    <h1 className="text-5xl font-bold leading-snug pb-1 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
                        BugTriage
                    </h1>
                    <img src={logoImage} alt="BugTriage Logo" className="w-12 h-12 object-contain" />
                </div>
                <p className="italic text-2xl font-medium text-gray-200 mt-2">
                    Track. Prioritize. Resolve.
                </p>
            </div>

            {/* Signup form */}
            <div className="relative z-10 w-full max-w-sm">
                <form
                    onSubmit={handleSignup}
                    className="bg-slate-800/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-2xl shadow-xl shadow-black/30 border border-slate-700/40"
                >
                    <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                        Sign Up
                    </h2>

                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-3 mb-4 rounded-lg border border-slate-600 bg-slate-700/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 mb-4 rounded-lg border border-slate-600 bg-slate-700/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 mb-6 rounded-lg border border-slate-600 bg-slate-700/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all p-3 rounded-lg text-white font-medium disabled:opacity-60"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link to="/" className="text-teal-400 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;