'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyEnrollments } from '@/redux/enrollmentSlice';
import {
    FiSearch, FiBook, FiClock, FiStar, FiFilter,
    FiGrid, FiList, FiTrendingUp, FiArrowRight,
    FiPlay, FiLayers, FiRefreshCw, FiMinusCircle,
    FiCheckCircle, FiInfo
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserCoursesPage() {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const { enrollments, loading, error } = useSelector((state) => state.enrollment);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchMyEnrollments());
    }, [dispatch]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await dispatch(fetchMyEnrollments());
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const filteredEnrollments = enrollments.filter(enroll =>
        enroll.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    if (loading && !isRefreshing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <FiBook className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={24} />
                </div>
                <p className={`text-sm font-bold animate-pulse ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Synchronizing your learning shelf...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className={`relative p-8 rounded-[2.5rem] overflow-hidden border transition-all ${isDark
                ? 'bg-slate-900/40 border-white/5 shadow-2xl shadow-indigo-500/10'
                : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'
                }`}>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                            <FiLayers size={12} />
                            My Subscription
                        </div>
                        <h1 className={`text-3xl md:text-4xl font-black outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            My Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Shelf</span>
                        </h1>
                        <p className={`text-sm max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Resume your courses and keep track of your progress. All your purchased courses are listed here.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 lg:flex-none lg:w-64">
                            <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <input
                                type="text"
                                placeholder="Find a course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm transition-all focus:outline-none focus:ring-2 ${isDark
                                    ? 'bg-slate-800/50 border-white/5 text-slate-200 focus:ring-indigo-500/30'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-indigo-500/20'
                                    }`}
                            />
                        </div>
                        <button
                            onClick={handleRefresh}
                            className={`p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-3xl border transition-all ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <FiBook size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total Courses</p>
                            <p className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>{enrollments.length}</p>
                        </div>
                    </div>
                </div>
                <div className={`p-4 rounded-3xl border transition-all ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                            <FiTrendingUp size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">In Progress</p>
                            <p className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`p-4 rounded-3xl border transition-all ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <FiCheckCircle size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Completed</p>
                            <p className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {enrollments.filter(e => (e.progress || 0) === 100).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`p-4 rounded-3xl border transition-all ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                            <FiStar size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Points Earned</p>
                            <p className={`text-xl font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {enrollments.reduce((acc, e) => acc + (e.progress || 0) * 10, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses View */}
            {filteredEnrollments.length === 0 ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`py-20 text-center rounded-[3rem] border-2 border-dashed ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-100 bg-slate-50/50'
                        }`}
                >
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-indigo-500/5 flex items-center justify-center mb-6">
                        <FiMinusCircle size={40} className="text-slate-300" />
                    </div>
                    <h2 className={`text-2xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        No Courses Found
                    </h2>
                    <p className={`text-sm mt-3 ${isDark ? 'text-slate-500' : 'text-slate-500'} max-w-sm mx-auto`}>
                        {searchTerm
                            ? `We couldn't find any courses matching "${searchTerm}" in your shelf.`
                            : "Your learning shelf is currently empty. Start your learning journey today!"}
                    </p>
                    {!searchTerm && (
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/30 hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95"
                        >
                            Browse All Courses <FiArrowRight />
                        </Link>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {filteredEnrollments.map((enroll) => (
                        <motion.div
                            key={enroll._id}
                            variants={itemVariants}
                            className={`group relative rounded-[2rem] border overflow-hidden transition-all duration-500 ${isDark
                                ? 'bg-slate-900/40 border-white/5 hover:border-indigo-500/30 hover:bg-slate-800/40 shadow-2xl shadow-black/20'
                                : 'bg-white border-slate-200/60 hover:border-indigo-500/20 hover:shadow-2xl shadow-slate-200/40'
                                }`}
                        >
                            {/* Thumbnail Area */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={enroll.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800'}
                                    alt={enroll.course?.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Progress Circular indicator */}
                                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                    <div className="text-white text-[10px] font-black leading-none text-center">
                                        {enroll.progress || 0}<span className="text-[8px] opacity-70">%</span>
                                    </div>
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle
                                            cx="24" cy="24" r="21"
                                            fill="transparent"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="3"
                                        />
                                        <circle
                                            cx="24" cy="24" r="21"
                                            fill="transparent"
                                            stroke="#6366f1"
                                            strokeWidth="3"
                                            strokeDasharray={`${2 * Math.PI * 21}`}
                                            strokeDashoffset={`${2 * Math.PI * 21 * (1 - (enroll.progress || 0) / 100)}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg border border-white/30 uppercase tracking-widest mb-2">
                                        {enroll.course?.category?.title || 'Course'}
                                    </span>
                                    <h3 className="text-white font-bold outfit text-lg line-clamp-1 group-hover:text-indigo-300 transition-colors">
                                        {enroll.course?.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'} flex flex-col items-center justify-center text-center`}>
                                        <FiLayers className="text-indigo-500 mb-1" size={14} />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</p>
                                        <p className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {enroll.completedLessons || 0} Lessons
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'} flex flex-col items-center justify-center text-center`}>
                                        <FiClock className="text-purple-500 mb-1" size={14} />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</p>
                                        <p className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {enroll.progress || 0}% Done
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                                        <span>Completion progress</span>
                                        <span>{enroll.progress || 0}%</span>
                                    </div>
                                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${enroll.progress || 0}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Link
                                        href={`/learn/${enroll.course?._id}`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                                    >
                                        <FiPlay /> Continue Learning
                                    </Link>
                                    <Link
                                        href={`/courses/${enroll.course?._id}`}
                                        className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                            }`}
                                    >
                                        <FiInfo />
                                    </Link>
                                </div>
                            </div>

                            {/* Indicator for new courses */}
                            {(!enroll.progress || enroll.progress === 0) && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                                    New Course
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Support Widget */}
            <div className={`mt-12 p-8 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${isDark
                ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 shadow-2xl shadow-indigo-500/10'
                : 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100 shadow-xl'
                }`}>
                <div className="flex items-center gap-6 text-center md:text-left">
                    <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-xl border border-slate-100 dark:border-white/5 shrink-0">
                        <FiRefreshCw size={28} />
                    </div>
                    <div>
                        <h4 className={`text-xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Facing Issues?</h4>
                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            If your course isn't appearing, use the sync button above or contact support.
                        </p>
                    </div>
                </div>
                <Link
                    href="/dashboard/user/support"
                    className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-white/10"
                >
                    Contact Support
                </Link>
            </div>
        </div>
    );
}

