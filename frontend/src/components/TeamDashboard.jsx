import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import api from "../axios.js";
import { Bug, Check, Trash2, Copy, ArrowLeftIcon } from "lucide-react";
import Navbar from "./Navbar.jsx";
import toast from "react-hot-toast";

const severityStyles = {
    CRITICAL: "bg-red-100 text-red-700 border border-red-200",
    HIGH: "bg-orange-100 text-orange-700 border border-orange-200",
    MEDIUM: "bg-amber-100 text-amber-700 border border-amber-200",
    LOW: "bg-green-100 text-green-700 border border-green-200",
};

const TeamDashboard = () => {

    const { teamId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [team, setTeam] = useState(location.state?.team || null);
    const [bugs, setBugs] = useState([]);
    const [loadingBugs, setLoadingBugs] = useState(true);
    const [loadingTeam, setLoadingTeam] = useState(!location.state?.team);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchBugs = async () => {
            try {
                setLoadingBugs(true);
                const response = await api.get(`/bugs/?teamId=${teamId}`);
                setBugs(response.data || []);
                // console.log("Fetched bugs:", response.data);
            } catch (err) {
                console.error("Error fetching team bugs", err);
                toast.error("Failed to load bugs");
            } finally {
                setLoadingBugs(false);
            }
        };

        const fetchTeam = async () => {
            try {
                setLoadingTeam(true);
                const response = await api.get(`/teams/${teamId}`);
                setTeam(response.data);
            } catch (err) {
                console.error("Error fetching team", err);
                toast.error("Failed to load team");
            } finally {
                setLoadingTeam(false);
            }
        };

        if (!team) fetchTeam();
        fetchBugs();
    }, [teamId, team]);

    const openBugs = useMemo(() => bugs.filter(bug => bug.status === "OPEN"), [bugs]);
    const resolvedBugs = useMemo(() => bugs.filter(bug => bug.status === "RESOLVED"), [bugs]);

    const handleResolveBug = async (bugId) => {
        if (!window.confirm("Are you sure you have resolved this bug?")) return;
        try {
            await api.patch(`/bugs/${bugId}/resolve`);
            toast.success("Bug resolved");
            setBugs(prev => prev.map(bug => bug._id === bugId ? { ...bug, status: "RESOLVED" } : bug));

        } catch (err) {
            console.error("Error resolving bug", err);
            toast.error("Failed to resolve bug");
        }
    };

    const handleDeleteBug = async (bugId) => {

        if (!window.confirm("Are you sure you want to delete this bug?")) return;
        try {
            await api.delete(`/bugs/${bugId}`);
            toast.success("Bug deleted");
            setBugs(prev => prev.filter(bug => bug._id !== bugId));
        } catch (err) {
            console.error("Error deleting bug", err);
            toast.error("Failed to delete bug");
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch {
            toast.error("Failed to copy");
        }
    };

    const handleLeave = async () => {

        if (!window.confirm("Are you sure you want to leave this team?")) return;
        try {
            await api.post(`/teams/leave`, {
                teamId
            });
            toast.success("Left team successfully");
            navigate("/home");
        } catch (err) {
            console.error("Error leaving team", err);
            toast.error("Failed to leave team");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center cursor-pointer gap-2 text-md mb-4 ml-1 font-medium text-slate-800 hover:text-slate-900 transition"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back
                </button>

                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">
                    {loadingTeam ? "Loading team..." : team?.name || "Team Dashboard"}
                </h1>

                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">


                    <div>
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                            Team Description
                        </h2>

                        {/* TEAM DESCRIPTION */}
                        <div className="bg-white rounded-xl shadow p-6 max-w-xl w-full">
                            <p
                                className={`text-slate-700 wrap-break-words ${expanded ? "" : "line-clamp-2"
                                    }`}
                            >
                                {loadingTeam
                                    ? "Loading team description..."
                                    : team?.description || "No description available"}
                            </p>

                            {!loadingTeam &&
                                team?.description &&
                                team.description.length > 120 && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="text-xs text-blue-600 mt-1 hover:underline cursor-pointer"
                                    >
                                        {expanded ? "Show less" : "Show more"}
                                    </button>
                                )}
                        </div>
                    </div>


                    <div className="flex flex-wrap items-center gap-3">

                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-md text-xs sm:text-sm text-slate-700">

                            Join Code
                            <span className="font-bold tracking-wide">
                                {loadingTeam ? "Loading..." : team?.joinCode}
                            </span>

                            <div className="relative group">
                                <Copy
                                    className="w-4 h-4 text-slate-500 cursor-pointer"
                                    onClick={() => copyToClipboard(team?.joinCode)}
                                />

                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 whitespace-nowrap
                                bg-slate-800 text-white text-xs px-2 py-1 rounded transition">
                                    Copy
                                </span>
                            </div>

                        </div>

                        <Link
                            to={`/teams/${teamId}/bugs/report`}
                            className="flex items-center gap-2 bg-blue-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            <Bug className="w-4 h-4" />
                            Report Bug
                        </Link>

                    </div>
                    <button onClick={handleLeave} className="flex items-center gap-2 max-w-35 bg-red-600 hover:cursor-pointer text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 transition">
                        Leave Team
                    </button>

                </div>

                {/* OPEN BUGS */}

                <div className="mt-5 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200">

                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>

                            <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                                Open Bugs
                            </h2>

                            <span className="bg-slate-100 text-black text-xs px-2 py-1 rounded">
                                {openBugs.length}
                            </span>

                            <span className="text-xs sm:text-sm text-slate-700">
                                • Sorted by priority score
                            </span>
                        </div>

                        <p className="mt-1 ml-6 text-xs sm:text-sm text-slate-500">
                            Click a bug title to view details.
                        </p>

                    </div>
                    <div className="overflow-x-auto">

                        <div className="grid grid-cols-12 px-4 sm:px-6 py-3 text-xs sm:text-sm text-slate-800 border-b border-slate-200 min-w-[150px]">
                            <div className="col-span-3 sm:col-span-5">Title</div>
                            <div className="col-span-2">Severity</div>
                            <div className="col-span-2 sm:col-span-3">Reported By</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>

                        {loadingBugs && (
                            <div className="px-6 py-8 text-center text-slate-500">
                                Loading bugs...
                            </div>
                        )}

                        {!loadingBugs && openBugs.length === 0 && (
                            <div className="px-6 py-8 text-center text-slate-500">
                                No open bugs reported yet.
                            </div>
                        )}

                        {openBugs.map((bug) => (
                            <div
                                key={bug._id}
                                className="grid grid-cols-12 px-4 sm:px-6 py-4 items-center border-b border-slate-100 hover:bg-slate-50 transition text-xs sm:text-sm min-w-[150px]"
                            >

                                <Link to={`/teams/${teamId}/bug/${bug._id}`} state={{ bug }} className="col-span-3 sm:col-span-5 text-slate-900 font-medium">
                                    {bug.title}
                                </Link>

                                <div className="col-span-2">
                                    <span className={`text-xs px-2 py-1 rounded font-medium ${severityStyles[bug.severity]}`}>
                                        {bug.severity}
                                    </span>
                                </div>

                                <div className="col-span-2 sm:col-span-3 text-slate-800 font-medium">
                                    {bug.reportedBy?.name}
                                </div>

                                <div className="col-span-2 flex justify-center gap-2 sm:gap-4">

                                    <div className="relative group">
                                        <button
                                            onClick={() => handleResolveBug(bug._id)}
                                            className="p-2 rounded-md hover:cursor-pointer hover:bg-green-100 hover:text-green-800 text-green-600 transition"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 whitespace-nowrap
                                bg-slate-800 text-white text-xs px-2 py-1 rounded transition">
                                            Mark bug as resolved
                                        </span>
                                    </div>

                                    <div className="relative group">

                                        <button
                                            onClick={() => handleDeleteBug(bug._id)}
                                            className="p-2 rounded-md hover:bg-red-100 hover:cursor-pointer text-red-600 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 whitespace-nowrap
                                bg-slate-800 text-white text-xs px-2 py-1 rounded transition">
                                            Delete bug
                                        </span>
                                    </div>



                                </div>

                            </div>
                        ))}

                    </div>

                </div>

                {/* RESOLVED BUGS */}

                <div className="mt-5 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                    <div className="px-4 sm:px-6 py-4 border-b border-slate-200">

                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>

                            <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                                Resolved Bugs
                            </h2>

                            <span className="bg-slate-100 text-black text-xs px-2 py-1 rounded">
                                {resolvedBugs.length}
                            </span>

                            <span className="text-xs sm:text-sm text-slate-700">
                                • Sorted by priority score
                            </span>
                        </div>

                        <p className="mt-1 ml-6 text-xs sm:text-sm text-slate-500">
                            Click a bug title to view details.
                        </p>

                    </div>

                    <div className="overflow-x-auto">

                        <div className="grid grid-cols-12 px-4 sm:px-6 py-3 text-xs sm:text-sm text-slate-800 border-b border-slate-200 min-w-[150px]">
                            <div className="col-span-3 sm:col-span-5">Title</div>
                            <div className="col-span-2">Severity</div>
                            <div className="col-span-2 sm:col-span-3">Reported By</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>

                        {!loadingBugs && resolvedBugs.length === 0 && (
                            <div className="px-6 py-8 text-center text-slate-500">
                                No bugs resolved yet.
                            </div>
                        )}

                        {resolvedBugs.map((bug) => (
                            <div
                                key={bug._id}
                                className="grid grid-cols-12 px-4 sm:px-6 py-4 items-center border-b border-slate-100 hover:bg-slate-50 transition text-xs sm:text-sm min-w-[150px]"
                            >

                                <Link to={`/teams/${teamId}/bug/${bug._id}`} state={{ bug }} className="col-span-3 sm:col-span-5 text-slate-900 font-medium">
                                    {bug.title}
                                </Link>

                                <div className="col-span-2">
                                    <span className={`text-xs px-2 py-1 rounded font-medium ${severityStyles[bug.severity]}`}>
                                        {bug.severity}
                                    </span>
                                </div>

                                <div className="col-span-2 sm:col-span-3 text-slate-800 font-medium">
                                    {bug.reportedBy?.name}
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    <div className="relative group">

                                        <button
                                            onClick={() => handleDeleteBug(bug._id)}
                                            className="p-2 rounded-md hover:bg-red-100 hover:cursor-pointer text-red-600 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 whitespace-nowrap
                                bg-slate-800 text-white text-xs px-2 py-1 rounded transition">
                                            Delete bug
                                        </span>
                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default TeamDashboard;