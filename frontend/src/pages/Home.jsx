import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { Plus, UserPlus, SearchX } from "lucide-react";
import TeamCard from '../components/TeamCard.jsx';
import api from '../axios.js';
import { Link } from 'react-router-dom';

const Home = () => {

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);
            try {
                const response = await api.get('/teams/');
                setTeams(response.data);
            } catch (err) {
                console.error("Error fetching teams", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();

    }, []);

    return (
        <div className='min-h-screen bg-gray-100'>
            <Navbar />

            <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12'>

                {/* HEADER */}

                <div className='flex items-center justify-between mb-8'>

                    <div>
                        <h1 className='text-2xl sm:text-3xl font-semibold text-slate-800'>
                            My Teams
                        </h1>
                        <div className="w-12 h-1 bg-blue-600 mt-2 rounded"></div>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-3'>

                        <Link
                            to="/teams/create"
                            className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-blue-800 transition-colors duration-200 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Create Team
                        </Link>

                        <Link
                            to="/teams/join"
                            className='cursor-pointer inline-flex items-center justify-center gap-2 bg-white text-slate-700 text-sm font-medium px-5 py-2.5 rounded-md border border-slate-500 hover:border-slate-800 hover:bg-slate-100 transition-colors duration-200'
                        >
                            <UserPlus className="w-6 h-6 text-blue-800" />
                            Join Team
                        </Link>

                    </div>

                </div>

                {/* TEAM LIST */}

                <div className='flex flex-col gap-2 sm:gap-3'>

                    {/* LOADING UI */}

                    {loading && (
                        <div className="flex flex-col items-center py-16 text-slate-500">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-sm">Loading your teams...</p>
                        </div>
                    )}

                    {/* EMPTY STATE */}

                    {!loading && teams.length === 0 && (
                        <div className='flex flex-col gap-3 items-center py-12'>
                            <SearchX className='w-16 h-16 text-slate-400' />
                            <div className='text-center font-semibold text-slate-800 text-lg'>
                                You are not part of any teams yet
                            </div>
                            <p className="text-sm text-slate-500">
                                Create or join a team to get started
                            </p>
                        </div>
                    )}

                    {/* TEAM LIST */}

                    {!loading && teams.length > 0 && (
                        teams.map((team) => (
                            <TeamCard key={team._id} team={team} />
                        ))
                    )}

                </div>

            </div>

        </div>
    )
}

export default Home;