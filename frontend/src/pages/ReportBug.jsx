import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../axios.js";

const ReportBug = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("LOW");
    const [loading, setLoading] = useState(false);

    const severityLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

    const navigate = useNavigate();
    const { teamId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);

        try {
            await api.post("/bugs/add", {
                title,
                description,
                severity,
                teamId
            });

            toast.success("Bug reported successfully!");
            setTitle("");
            setDescription("");
            setSeverity("LOW");
            navigate(-1);
        } catch (err) {
            console.error("Error reporting bug", err);
            toast.error("Failed to report bug");
        } finally {
            setLoading(false);

        }
    };

    return (
        <div>
            <Navbar />

            <div className="min-h-screen bg-gray-100">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center cursor-pointer gap-2 text-sm font-medium text-slate-800 hover:text-slate-900 transition"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back
                    </button>

                    {/* Card */}
                    <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-8">

                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-5 sm:mb-6">
                            Report New Bug
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

                            {/* Bug Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Bug Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter bug title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Describe the issue in detail..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 h-28 sm:h-32 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-none transition"
                                />
                            </div>

                            {/* Severity */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Severity
                                </label>
                                <select
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                                >
                                    {severityLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto sm:text-md px-6 py-2.5 cursor-pointer bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                                >
                                    {loading ? "Reporting..." : "Report Bug"}
                                </button>
                            </div>

                        </form>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReportBug;