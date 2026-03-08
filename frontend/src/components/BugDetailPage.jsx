import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Check, Trash, Target, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../axios.js";
import Navbar from "./Navbar.jsx";

const severityStyles = {
    CRITICAL: "bg-red-100 text-red-700 border border-red-200",
    HIGH: "bg-orange-100 text-orange-700 border border-orange-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    LOW: "bg-green-100 text-green-700 border border-green-200"
};

const statusStyles = {
    OPEN: "bg-green-100 text-green-700 border border-green-200",
    RESOLVED: "bg-blue-100 text-blue-700 border border-blue-200"
};

export default function BugDetailPage() {
    const { bugId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [bug, setBug] = useState(location.state?.bug || null);
    const [error, setError] = useState("");
    const [loadingBug, setLoadingBug] = useState(!location.state?.bug);



    useEffect(() => {
        const fetchBug = async () => {
            try {
                setLoadingBug(true);
                const response = await api.get(`/bugs/${bugId}`);
                setBug(response.data);
                console.log("Fetched bug details:", response.data);
            } catch (err) {
                console.error("Error fetching bug", err);
                setError("Failed to load bug details");
                toast.error("Failed to load bug details");
            } finally {
                setLoadingBug(false);
            }
        };
        if (!bug) fetchBug();

    }, [bugId, bug]);

    const handleResolveBug = async (bugId) => {
        if (!window.confirm("Are you sure you have resolved this bug?")) return;
        try {
            await api.patch(`/bugs/${bugId}/resolve`);
            toast.success("Bug resolved");
            // Update local state to reflect resolved status
            setBug(prev => ({ ...prev, status: "RESOLVED" }));

        } catch (err) {
            console.error("Error resolving bug", err);
            setError("Failed to resolve bug");
            toast.error("Failed to resolve bug");
        }
    };

    const handleDeleteBug = async (bugId) => {

        if (!window.confirm("Are you sure you want to delete this bug?")) return;
        try {
            await api.delete(`/bugs/${bugId}`);
            toast.success("Bug deleted");
            navigate(-1);
        } catch (err) {
            console.error("Error deleting bug", err);
            setError("Failed to delete bug");
            toast.error("Failed to delete bug");
        }
    };

    if (loadingBug)
        return (
            <div>
                <Navbar />
                <div className="flex items-center justify-center h-screen text-slate-500">
                    Loading bug details...
                </div>
            </div>
        );

    if (error)
        return (
            <div>
                <Navbar />
                <div> {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center cursor-pointer gap-2 text-md my-4 ml-4 font-medium text-slate-700 hover:text-black transition"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back
                    </button>
                    <div className="flex items-center justify-center h-screen text-red-500">
                        {error}
                    </div>
                </div>

            </div>
        );

    return (
        <div className="min-h-screen bg-gray-100 pb-6 ">
            <Navbar />

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center cursor-pointer gap-2 text-md my-4 ml-4 font-medium text-slate-700 hover:text-black transition"
            >
                <ArrowLeftIcon className="h-5 w-5" />
                Back
            </button>
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-semibold text-slate-800 mb-6">
                    Bug Details
                </h1>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                    {/* HEADER */}
                    <div className="p-6 border-b border-slate-200">

                        <h2 className="text-2xl font-semibold text-slate-900">
                            {bug?.title}
                        </h2>

                        <div className="mt-3 ">
                            Description :
                        </div>

                        <p className="text-slate-800 text-sm sm:text-base mt-4 leading-relaxed max-w-3xl">
                            {bug?.description}
                        </p>

                    </div>

                    {/* DETAILS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                        {/* SEVERITY */}
                        <div className="p-6 border-b sm:border-r border-slate-200">
                            <p className="text-sm sm:text-base text-slate-700">Severity</p>

                            <span
                                className={`inline-block mt-2 text-sm sm:text-base font-semibold px-3 py-1 rounded-md ${severityStyles[bug?.severity]}`}
                            >
                                {bug?.severity}
                            </span>
                        </div>

                        {/* REPORTED BY */}
                        <div className="p-6 border-b lg:border-r border-slate-200">
                            <p className="text-sm sm:text-base text-slate-700">Reported By</p>

                            <p className="mt-2 text-slate-800 font-medium sm:text-lg">
                                {bug?.userName}
                            </p>
                        </div>

                        {/* CREATED AT */}
                        <div className="p-6 border-b border-slate-200">
                            <p className="text-sm sm:text-base text-slate-700">Created At</p>

                            <p className="mt-2 text-slate-800">
                                {bug?.createdAt ? new Date(bug.createdAt).toLocaleString() : "N/A"}
                            </p>
                        </div>

                        {/* STATUS */}
                        <div className="p-6 border-b sm:border-r border-slate-200">
                            <p className="text-sm sm:text-base text-slate-700">Status</p>

                            <span
                                className={`inline-block mt-2 text-sm sm:text-base font-semibold px-3 py-1 rounded-md ${statusStyles[bug?.status]}`}
                            >
                                {bug?.status}
                            </span>
                        </div>

                        {/* REPORTER EMAIL */}
                        <div className="p-6 border-b lg:border-r border-slate-200">
                            <p className="text-sm sm:text-base text-slate-700">Reporter Email</p>

                            <p className="mt-2 text-slate-800 font-medium sm:text-lg">
                                {bug?.userEmail}
                            </p>
                        </div>

                        {/* PRIORITY SCORE */}
                        <div className="p-6 border-b border-slate-200">

                            <p className="text-sm sm:text-base text-slate-700 flex items-center gap-2">
                                <Target className="w-4 h-4 text-red-500" />
                                Priority Score
                            </p>

                            <div className="flex items-center gap-3 mt-3">

                                <span className="text-2xl font-bold text-slate-800">
                                    {bug?.priority}
                                </span>

                            </div>

                            <p className="text-xs text-slate-600 mt-2">
                                Higher score indicates higher bug resolution priority.
                            </p>

                        </div>

                    </div>

                    {/* ACTION BUTTON */}
                    <div className="p-6 flex flex-col sm:flex-row justify-between items-center">


                        <button
                            disabled={bug?.status === "RESOLVED"}
                            onClick={() => handleResolveBug(bug?._id)}
                            className="flex disabled:bg-blue-900 disabled:cursor-not-allowed items-center gap-2 bg-blue-600 text-white text-sm sm:text-base font-medium px-5 py-2.5 rounded-md cursor-pointer hover:bg-blue-700 transition"
                        >
                            <Check className="w-4 h-4" />
                            Resolve Bug
                        </button>

                        <button
                            onClick={() => handleDeleteBug(bug?._id)}
                            className="mt-3 sm:mt-0 flex items-center gap-2 bg-red-600 text-white text-sm sm:text-base font-medium px-5 py-2.5 rounded-md cursor-pointer hover:bg-red-700 transition"
                        >
                            <Trash className="w-4 h-4" />
                            Delete Bug
                        </button>


                    </div>

                </div>

            </div>
        </div>
    );
}