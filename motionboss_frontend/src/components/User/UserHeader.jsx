'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FiSearch,
    FiBell,
    FiSettings,
    FiUser,
    FiLogOut,
    FiMoon,
    FiSun,
    FiChevronDown,
    FiMail,
    FiCheck,
    FiBookOpen,
    FiStar
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

const UserHeader = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { theme, toggleTheme, isDark } = useTheme();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Student specific mock notifications
    const notifications = [
        { id: 1, title: 'New Lesson Uploaded', message: 'Full Stack Course: Module 5 is live', time: '2 min ago', read: false },
        { id: 2, title: 'Exam Reminder', message: 'Your Next.js exam starts in 2 hours', time: '15 min ago', read: false },
        { id: 3, title: 'Review Approved', message: 'Your review for React Course is live', time: '1 hour ago', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-container')) {
                setShowNotifications(false);
                setShowProfile(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <header className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-colors duration-300 ${isDark
            ? 'bg-slate-900/80 border-slate-700/50'
            : 'bg-white/80 border-slate-200/50'
            }`}>
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left Section - Search */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative max-w-md w-full">
                        <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            placeholder="Search lessons, resources, mentor..."
                            className={`w-full pl-11 pr-4 py-2.5 border-0 rounded-xl text-sm transition-all ${isDark
                                ? 'bg-slate-800/80 text-slate-200 placeholder:text-slate-500 focus:ring-indigo-500/30 focus:bg-slate-800'
                                : 'bg-slate-100/80 text-slate-700 placeholder:text-slate-400 focus:ring-indigo-500/20 focus:bg-white'
                                } focus:outline-none focus:ring-2`}
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`relative p-2.5 rounded-xl transition-all duration-300 overflow-hidden group ${isDark
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50'
                            : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50'
                            }`}
                    >
                        <div className="relative w-5 h-5">
                            <FiSun size={20} className={`absolute inset-0 transition-all duration-300 transform ${isDark ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'}`} />
                            <FiMoon size={20} className={`absolute inset-0 transition-all duration-300 transform ${isDark ? '-rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>

                    {/* Notifications */}
                    <div className="relative dropdown-container">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowNotifications(!showNotifications);
                                setShowProfile(false);
                            }}
                            className={`relative p-2.5 rounded-xl transition-colors ${isDark
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <FiBell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {showNotifications && (
                            <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDark
                                ? 'bg-slate-800 border-slate-700 shadow-slate-900/50'
                                : 'bg-white border-slate-100 shadow-slate-200/50'
                                }`}>
                                <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark
                                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-slate-700'
                                    : 'bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-slate-100'
                                    }`}>
                                    <h3 className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Notifications</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{notif.title}</p>
                                                <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{notif.message}</p>
                                                <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{notif.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative ml-2 dropdown-container">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowProfile(!showProfile);
                                setShowNotifications(false);
                            }}
                            className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl transition-all ${isDark
                                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30'
                                : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20'
                                }`}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/25">
                                {user?.firstName?.[0] || 'S'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                    {user?.firstName || 'Student'}
                                </p>
                                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Student ID: #MB-2025
                                </p>
                            </div>
                            <FiChevronDown className={`transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Profile Dropdown */}
                        {showProfile && (
                            <div className={`absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDark
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-white border-slate-100'
                                }`}>
                                <div className="p-4 border-b">
                                    <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                                <div className="py-2">
                                    <Link href="/dashboard/user/profile" className={`flex items-center gap-3 px-4 py-2 text-sm ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        <FiUser size={16} /> My Profile
                                    </Link>
                                    <Link href="/dashboard/user/courses" className={`flex items-center gap-3 px-4 py-2 text-sm ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        <FiBookOpen size={16} /> My Courses
                                    </Link>
                                </div>
                                <div className="p-2 border-t">
                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
                                        <FiLogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
