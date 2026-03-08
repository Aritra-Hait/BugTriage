import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../axios.js";

const JoinTeam = () => {
    const [teamJoinCode, setTeamJoinCode] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamJoinCode.trim()) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);
        try {
            await api.post("/teams/join", {
                joinCode: teamJoinCode,
            });

            toast.success("Team joined successfully!");
            navigate(-1);
        } catch (err) {

            if (err.response?.status === 404) {
                toast.error("Invalid join code! Please check and try again.");
            } else if (err.response?.status === 400) {
                toast.error("You're already a member of this team!");
            } else toast.error("Failed to join team");
            console.log("Error joining team", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />

            <div className="min-h-screen bg-gray-100">
                <div className="max-w-2xl mx-auto px-4 py-10">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back
                    </button>

                    {/* Card */}
                    <div className="mt-6 bg-white rounded-xl shadow-md border border-slate-200 p-8">

                        <h2 className="text-2xl font-bold text-slate-800 mb-6">
                            Join Existing Team
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Team Joincode */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Team JoinCode
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter team joincode"
                                    value={teamJoinCode}
                                    onChange={(e) => setTeamJoinCode(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                />
                            </div>



                            {/* Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition"
                                >
                                    {loading ? "Joining..." : "Join Team"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinTeam;