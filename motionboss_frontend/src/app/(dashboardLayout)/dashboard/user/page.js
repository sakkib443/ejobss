'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiBook, FiAward, FiClock, FiTrendingUp, FiArrowRight,
    FiUser, FiMail, FiPhone, FiCalendar, FiLoader,
    FiShield, FiPlay, FiStar, FiRefreshCw, FiGrid, FiExternalLink,
    FiCheck, FiChevronRight, FiDownload
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserDashboard() {
    const { isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) { }
        }
        setLoading(false);
    }, []);

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 1000);
    };

    const stats = [
        { title: 'Enrolled Courses', value: '04', icon: FiBook, gradient: 'from-blue-500 to-indigo-600', trend: '+1 this month' },
        { title: 'Digital Assets', value: '06', icon: FiDownload, gradient: 'from-pink-500 to-rose-600', trend: 'Softwares & Web' },
        { title: 'Reward Points', value: '1,250', icon: FiStar, gradient: 'from-amber-500 to-orange-600', trend: 'Top 10%' },
        { title: 'Certificates', value: '00', icon: FiAward, gradient: 'from-purple-500 to-pink-600', trend: 'Earn your first' },
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <FiLoader className={`text-4xl animate-spin ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
        );
    }

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark ? 'bg-slate-800/50 border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-200/60 shadow-sm hover:shadow-md'
        }`;

    return (
        <div className="space-y-6">
            {/* Professional Compact Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 ${cardClass}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <FiGrid size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Student Overview
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {hasMounted ? new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading date...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSync}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <FiRefreshCw className={isSyncing ? 'animate-spin' : ''} />
                        Sync Data
                    </button>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all"
                    >
                        <FiBook />
                        Browse Courses
                    </Link>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                            Ongoing Learning
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white outfit">
                            Welcome Back, {user?.firstName || 'Learner'}! 🚀
                        </h2>
                        <p className="text-indigo-50 text-base max-w-lg">
                            You have completed <span className="font-bold text-white underline">0%</span> of your current learning goals. Pickup where you left off and sharpen your skills.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                            <button className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm shadow-xl hover:bg-indigo-50 transition-all active:scale-95">
                                My Classes
                            </button>
                            <button className="px-6 py-3 bg-indigo-500/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                                View Schedule
                            </button>
                        </div>
                    </div>
                    <div className="relative hidden lg:block">
                        <div className="w-48 h-48 rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/20 rotate-12 flex items-center justify-center overflow-hidden group">
                            <FiPlay className="text-white text-6xl group-hover:scale-125 transition-transform duration-500" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-400 blur-[50px] opacity-50" />
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`${cardClass} p-6 relative group overflow-hidden`}>
                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {stat.title}
                                </p>
                                <h3 className={`text-2xl font-black mt-2 outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {stat.value}
                                </h3>
                                <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-lg text-xs font-bold ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                                    }`}>
                                    <FiTrendingUp /> {stat.trend}
                                </div>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={22} />
                            </div>
                        </div>
                        {/* Underline decorative bar */}
                        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.gradient} transition-all duration-300 group-hover:w-full w-0`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Continue Learning Section */}
                <div className={`lg:col-span-2 ${cardClass} p-6`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-lg font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Continue Learning
                        </h2>
                        <Link href="/dashboard/user/courses" className="text-sm font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
                            All Courses <FiArrowRight />
                        </Link>
                    </div>

                    {/* Placeholder for no active courses */}
                    <div className={`rounded-3xl border-2 border-dashed p-12 text-center transition-colors ${isDark ? 'border-slate-700 hover:border-indigo-500/50' : 'border-slate-100 hover:border-indigo-500/30'
                        }`}>
                        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-50'
                            }`}>
                            <FiBook className={`text-3xl ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                        </div>
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Your learning shelf is empty
                        </h3>
                        <p className={`text-sm mb-6 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            Expand your skill set. Browse our marketplace to find the perfect professional course for you.
                        </p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-600 transition-all"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                </div>

                {/* Right Column: Profile & Schedule */}
                <div className="space-y-6">
                    {/* Compact Profile Card */}
                    <div className={`${cardClass} p-6`}>
                        <h2 className={`text-base font-black outfit mb-5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Personal Account
                        </h2>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/50 dark:border-white/5 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                                <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <span className="text-xl font-black text-indigo-600">
                                        {user?.firstName?.[0] || 'S'}
                                    </span>
                                </div>
                            </div>
                            <div className="min-min-0 flex-1">
                                <h4 className={`font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                    {user?.firstName} {user?.lastName}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                                <span className="flex items-center gap-2 tracking-wide"><FiShield size={14} className="text-indigo-500" /> STATUS</span>
                                <span className="text-indigo-500">PRO VERIFIED</span>
                            </div>
                            <div className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                                <span className="flex items-center gap-2 tracking-wide"><FiCalendar size={14} className="text-blue-500" /> JOINED</span>
                                <span>JANUARY 2025</span>
                            </div>
                        </div>

                        <Link
                            href="/dashboard/user/profile"
                            className="mt-5 w-full flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all text-xs font-black outfit uppercase tracking-widest group"
                        >
                            Account Settings
                            <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Weekly Progress Card */}
                    <div className={`${cardClass} p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl relative overflow-hidden`}>
                        <div className="relative z-10">
                            <h2 className="text-base font-black outfit mb-1">Learning Momentum</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Weekly Activity Tracking</p>

                            <div className="flex items-end justify-between h-20 gap-1 px-2">
                                {[30, 0, 0, 0, 0, 0, 0].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-lg group transition-all hover:brightness-110"
                                            style={{ height: `${h || 5}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                                {h * 12}min
                                            </div>
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-500">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] mb-1">THIS WEEK</p>
                                    <p className="text-xl font-black outfit">0 hrs</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] mb-1">TOTAL</p>
                                    <p className="text-xl font-black outfit">0 hrs</p>
                                </div>
                            </div>
                        </div>
                        {/* Mesh background effect */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.15)_0%,_transparent_50%)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
