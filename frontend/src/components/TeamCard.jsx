import { Users, ClipboardCheck, Bug, Folder, Target, Zap } from "lucide-react";
import React from 'react'
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";


const teamIcons = [
    Users,
    ClipboardCheck,
    Bug,
    Folder,
    Target,
    Zap,
];

// Simple hash function to map a string (team._id) to a number
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0; // 32-bit positive int
    }
    return hash;
}

const TeamCard = ({ team }) => {
    const index = hashString(team._id) % teamIcons.length;
    const Icon = teamIcons[index];

    return (
        <Link
            to={`/teams/${team._id}`}
            state={{ team }}
            className="group flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 sm:px-6 py-4 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200"
        >
            {/* LEFT SECTION */}
            <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-10 w-10 mt-1.5 rounded-lg bg-slate-200 text-blue-900 ">
                    <Icon className="w-6 h-6" />
                </div>

                <div className="flex flex-col">
                    <div className="text-base sm:text-lg font-semibold tracking-tight text-slate-800">
                        {team.name}
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5 leading-snug line-clamp-2 max-w-xs sm:max-w-md lg:max-w-lg">
                        {team.description}
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200 shrink-0" />
        </Link>
    );
};

export default TeamCard;