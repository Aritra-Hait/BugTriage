import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../axios.js";

const CreateTeam = () => {
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamName.trim() || !description.trim()) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);
        try {
            await api.post("/teams/create", {
                name: teamName,
                description: description,
            });

            toast.success("Team created successfully!");
            navigate(-1);
        } catch (err) {
            console.log("Error creating team", err);
            toast.error("Failed to create team");
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
                            Create New Team
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Team Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Team Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter team name"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Describe your team..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 h-32 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition"
                                >
                                    {loading ? "Creating..." : "Create Team"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTeam;