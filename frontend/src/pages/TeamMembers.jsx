import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../axios.js";
import toast from "react-hot-toast";

const roleStyles = {
    ADMIN: "bg-purple-100 text-purple-700 border border-purple-200",
    DEVELOPER: "bg-blue-100 text-blue-700 border border-blue-200",
    REPORTER: "bg-red-100 text-red-700 border border-red-200"
};

const ROLES = ["ADMIN", "DEVELOPER", "REPORTER"];

const TeamMembers = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [members, setMembers] = useState([]);
    const [myRole, setMyRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);

                const response = await api.get(`/teams/${teamId}/members`);
                setMembers(response.data);
                const me = response.data.find(m => m.userId === user.id);
                setMyRole(me?.role || null);
            } catch (err) {
                console.error("Error fetching members", err);
                toast.error("Failed to load members");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [teamId, user.id]);

    const handleRoleChange = async (targetUserId, newRole, currentRole) => {
        if (newRole === currentRole) {
            toast.error("Role is already set to this value");
            return;
        }
        if (!window.confirm(`Change this member's role to ${newRole}?`)) return;

        try {
            await api.patch(`/teams/${teamId}/members/${targetUserId}/role`, {
                role: newRole
            });
            toast.success("Role updated successfully");
            setMembers(prev => prev.map(m =>
                m.userId === targetUserId ? { ...m, role: newRole } : m
            ));
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update role";
            toast.error(message);
            console.error("Error updating role", err);
        }
    };

    const isAdmin = myRole === "ADMIN";
    const adminCount = members.filter(m => m.role === "ADMIN").length;

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

                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-6">
                    Team Members
                </h1>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                    {/* TABLE HEADER */}
                    <div className="grid grid-cols-12 px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-slate-800 border-b border-slate-200 bg-slate-50">
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-2">Joined</div>
                        <div className="col-span-2 text-center">Change Role</div>
                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="px-6 py-10 text-center text-slate-500">
                            Loading members...
                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && members.length === 0 && (
                        <div className="px-6 py-10 text-center text-slate-500">
                            No members found.
                        </div>
                    )}

                    {/* MEMBER ROWS */}
                    {!loading && members.map((member) => (
                        <div
                            key={member.userId}
                            className="grid grid-cols-12 px-4 sm:px-6 py-4 items-center border-b border-slate-100 hover:bg-slate-50 transition text-xs sm:text-sm"
                        >
                            {/* NAME */}
                            <div className="col-span-3 font-medium text-slate-900">
                                {member.name}
                                {member.userId === user.id && (
                                    <span className="ml-2 text-xs text-slate-400">(you)</span>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div className="col-span-3 text-slate-600 truncate">
                                {member.email}
                            </div>

                            {/* ROLE BADGE */}
                            <div className="col-span-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${roleStyles[member.role]}`}>
                                    {member.role}
                                </span>
                            </div>

                            {/* JOINED DATE */}
                            <div className="col-span-2 text-slate-500">
                                {new Date(member.joinedAt).toLocaleDateString()}
                            </div>

                            {/* CHANGE ROLE — dropdown for admin, disabled for others */}
                            <div className="col-span-2 flex justify-center">
                                <select
                                    value={member.role}
                                    disabled={!isAdmin || (member.userId === user.id && adminCount === 1)}
                                    onChange={(e) => handleRoleChange(member.userId, e.target.value, member.role)}
                                    className="text-xs cursor-pointer border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {ROLES.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default TeamMembers;