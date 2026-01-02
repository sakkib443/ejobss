'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseContent } from '@/redux/CourseSlice';
import { updateLessonProgress } from '@/redux/enrollmentSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import {
    FiPlay, FiCheck, FiChevronDown, FiChevronUp,
    FiArrowLeft, FiClock, FiBookOpen, FiMenu, FiX,
    FiChevronRight, FiPlayCircle, FiAward
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseLearnPage() {
    const { courseId } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const { currentCourse, contentLoading, error } = useSelector((state) => state.courses);
    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseContent(courseId));
        }
    }, [courseId, dispatch]);

    const groupedContent = useMemo(() => {
        if (!currentCourse || !currentCourse.modules || !currentCourse.lessons) return [];
        return (currentCourse.modules || []).map(module => {
            const moduleId = module._id?.toString() || module._id;
            const moduleLessons = (currentCourse.lessons || []).filter(lesson => {
                const lessonModuleId = lesson.module?._id?.toString() || lesson.module?.toString() || lesson.module;
                return lessonModuleId === moduleId;
            }).sort((a, b) => (a.order || 0) - (b.order || 0));
            return { ...module, lessons: moduleLessons };
        }).sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [currentCourse]);

    useEffect(() => {
        if (groupedContent.length > 0 && !activeLesson) {
            for (const module of groupedContent) {
                if (module.lessons.length > 0) {
                    setActiveLesson(module.lessons[0]);
                    setExpandedModules(prev => ({ ...prev, [module._id]: true }));
                    break;
                }
            }
        }
    }, [groupedContent, activeLesson]);

    const handleMarkAsDone = async () => {
        if (!activeLesson || !courseId) return;
        try {
            await dispatch(updateLessonProgress({ courseId, lessonId: activeLesson._id })).unwrap();
            setCompletedLessons(prev => [...prev, activeLesson._id]);
            toast.success('Lesson completed!');

            let foundActive = false;
            let nextLesson = null;
            for (const module of groupedContent) {
                for (const lesson of module.lessons) {
                    if (foundActive) { nextLesson = lesson; break; }
                    if (lesson._id === activeLesson._id) foundActive = true;
                }
                if (nextLesson) break;
            }

            if (nextLesson) {
                setActiveLesson(nextLesson);
                const activeModule = groupedContent.find(m => m.lessons.some(l => l._id === nextLesson._id));
                if (activeModule) setExpandedModules(prev => ({ ...prev, [activeModule._id]: true }));
            } else {
                toast('🎉 Congratulations! Course completed!');
            }
        } catch (err) {
            toast.error(err || 'Failed to update progress');
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const getVideoEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        }
        if (url.includes('youtu.be')) {
            const videoId = url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        }
        return url;
    };

    const totalLessons = groupedContent.reduce((sum, m) => sum + m.lessons.length, 0);
    const totalDuration = groupedContent.reduce((sum, m) => sum + m.lessons.reduce((s, l) => s + (l.videoDuration || 0), 0), 0);
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

    // Loading
    if (contentLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-500 text-sm mt-4 font-poppins">Loading your course...</p>
                </div>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
                        <FiX size={36} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3 font-outfit">Oops! Something went wrong</h2>
                    <p className="text-slate-500 mb-8 font-poppins">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard/user/courses')}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all font-poppins"
                    >
                        Back to My Courses
                    </button>
                </div>
            </div>
        );
    }

    if (!currentCourse) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-poppins">
            {/* ===== BEAUTIFUL HEADER ===== */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="h-[70px] flex items-center justify-between">
                        {/* Left: Logo & Back */}
                        <div className="flex items-center gap-5">
                            {/* Logo */}
                            <Link href="/" className="block w-28 h-9 group">
                                <Image
                                    src="/images/ejobsitlogo.png"
                                    alt="eJobsIT"
                                    width={112}
                                    height={36}
                                    className="w-full h-full object-contain group-hover:opacity-80 transition-opacity"
                                />
                            </Link>

                            {/* Divider */}
                            <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

                            {/* Back Button */}
                            <button
                                onClick={() => router.push('/dashboard/user/courses')}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-all group"
                            >
                                <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                                <span className="text-sm font-medium">My Courses</span>
                            </button>
                        </div>

                        {/* Center: Course Title & Progress (Desktop) */}
                        <div className="hidden lg:flex items-center gap-6 flex-1 max-w-xl mx-8">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">Now Learning</p>
                                <h1 className="text-slate-800 font-semibold font-outfit truncate">
                                    {currentCourse.title}
                                </h1>
                            </div>
                            {/* Progress Ring */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12">
                                    <svg className="w-12 h-12 -rotate-90">
                                        <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                        <circle
                                            cx="24" cy="24" r="20" fill="none"
                                            stroke="url(#progressGradient)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeDasharray={`${progressPercent * 1.256} 999`}
                                        />
                                        <defs>
                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                                        {progressPercent}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Stats & Menu */}
                        <div className="flex items-center gap-4">
                            {/* Stats Pills */}
                            <div className="hidden md:flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
                                    <FiBookOpen size={14} />
                                    <span>{totalLessons}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 text-sm font-medium">
                                    <FiClock size={14} />
                                    <span>{totalDuration}m</span>
                                </div>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all"
                            >
                                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                <div className="flex gap-8">
                    {/* Video & Info Section */}
                    <main className="flex-1 min-w-0">
                        {/* Video Player Card */}
                        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20 mb-6">
                            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                {activeLesson?.videoUrl ? (
                                    <iframe
                                        src={getVideoEmbedUrl(activeLesson.videoUrl)}
                                        title={activeLesson.title}
                                        className="absolute inset-0 w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    ></iframe>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950">
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/10">
                                                <FiPlayCircle size={40} className="text-white/50" />
                                            </div>
                                            <p className="text-white/50 font-medium">Select a lesson to start learning</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lesson Info Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-6 lg:p-8">
                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                <div className="flex-1">
                                    {/* Breadcrumb Tags */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 text-xs font-semibold border border-indigo-100/50">
                                            <FiBookOpen size={12} />
                                            Module {groupedContent.findIndex(m => m.lessons.some(l => l._id === activeLesson?._id)) + 1}
                                        </span>
                                        <FiChevronRight size={14} className="text-gray-300" />
                                        <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-100">
                                            Lesson {activeLesson?.order || 1}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3 font-outfit leading-tight">
                                        {activeLesson?.title || 'Course Overview'}
                                    </h2>

                                    {/* Description */}
                                    {activeLesson?.description && (
                                        <p className="text-slate-500 leading-relaxed mb-4">
                                            {activeLesson.description}
                                        </p>
                                    )}

                                    {/* Duration Badge */}
                                    {activeLesson?.videoDuration && (
                                        <div className="inline-flex items-center gap-2 text-sm text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                                            <FiClock size={14} />
                                            <span>{activeLesson.videoDuration} minutes</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="flex-shrink-0">
                                    {completedLessons.includes(activeLesson?._id) ? (
                                        <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                                                <FiCheck size={18} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-emerald-700 font-semibold">Completed!</p>
                                                <p className="text-emerald-600/60 text-sm">Great job!</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleMarkAsDone}
                                            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <FiCheck size={16} />
                                            </div>
                                            <span>Mark as Complete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* ===== CURRICULUM SIDEBAR (Desktop) ===== */}
                    <aside className={`hidden lg:block w-[380px] flex-shrink-0 ${!sidebarOpen ? 'lg:hidden' : ''}`}>
                        <div className="sticky top-[94px] bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 overflow-hidden">
                            {/* Header */}
                            <div className="p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-b border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <FiBookOpen size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 font-outfit">Course Content</h3>
                                        <p className="text-xs text-slate-500">{groupedContent.length} modules • {totalLessons} lessons</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">{completedLessons.length} of {totalLessons} completed</span>
                                        <span className="text-indigo-600 font-bold">{progressPercent}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Module List */}
                            <div className="max-h-[calc(100vh-340px)] overflow-y-auto">
                                {groupedContent.map((module, mIdx) => (
                                    <div key={module._id} className="border-b border-gray-50 last:border-0">
                                        <button
                                            onClick={() => toggleModule(module._id)}
                                            className={`w-full p-4 flex items-start gap-4 text-left transition-all ${expandedModules[module._id] ? 'bg-indigo-50/30' : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${expandedModules[module._id]
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200'
                                                : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {mIdx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-slate-700 line-clamp-2 font-outfit leading-snug">
                                                    {module.title}
                                                </h4>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {module.lessons.length} lessons • {module.lessons.reduce((s, l) => s + (l.videoDuration || 0), 0)} min
                                                </p>
                                            </div>
                                            <div className={`text-slate-400 transition-transform ${expandedModules[module._id] ? 'rotate-180' : ''}`}>
                                                <FiChevronDown size={18} />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {expandedModules[module._id] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pb-3 px-2">
                                                        {module.lessons.map((lesson) => {
                                                            const isActive = activeLesson?._id === lesson._id;
                                                            const isCompleted = completedLessons.includes(lesson._id);

                                                            return (
                                                                <button
                                                                    key={lesson._id}
                                                                    onClick={() => setActiveLesson(lesson)}
                                                                    className={`w-full ml-[52px] mr-2 px-4 py-3 rounded-xl flex items-center gap-3 text-left mb-1 transition-all ${isActive
                                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200'
                                                                        : 'hover:bg-slate-50'
                                                                        }`}
                                                                >
                                                                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${isActive
                                                                        ? 'bg-white/20'
                                                                        : isCompleted
                                                                            ? 'bg-emerald-100 text-emerald-600'
                                                                            : 'bg-slate-100 text-slate-400'
                                                                        }`}>
                                                                        {isCompleted && !isActive ? <FiCheck size={12} /> : <FiPlay size={10} />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-slate-600'}`}>
                                                                            {lesson.title}
                                                                        </p>
                                                                        <p className={`text-xs ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                                                                            {lesson.videoDuration || 0} min
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ===== MOBILE SIDEBAR ===== */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="sticky top-0 p-5 bg-white border-b border-gray-100 flex items-center justify-between z-10">
                                <h3 className="text-lg font-bold text-slate-800 font-outfit">Course Content</h3>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                    <FiX size={20} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="p-4 space-y-2">
                                {groupedContent.map((module, mIdx) => (
                                    <div key={module._id}>
                                        <button
                                            onClick={() => toggleModule(module._id)}
                                            className={`w-full p-4 rounded-xl flex items-center gap-3 text-left transition-all ${expandedModules[module._id] ? 'bg-indigo-50' : 'bg-slate-50 hover:bg-slate-100'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${expandedModules[module._id] ? 'bg-indigo-500 text-white' : 'bg-white text-slate-500'
                                                }`}>
                                                {mIdx + 1}
                                            </div>
                                            <span className="flex-1 text-sm font-semibold text-slate-700 truncate">{module.title}</span>
                                            <FiChevronDown className={`text-slate-400 transition-transform ${expandedModules[module._id] ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {expandedModules[module._id] && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="ml-11 mt-1 space-y-1 pb-2">
                                                        {module.lessons.map((lesson) => {
                                                            const isActive = activeLesson?._id === lesson._id;
                                                            return (
                                                                <button
                                                                    key={lesson._id}
                                                                    onClick={() => { setActiveLesson(lesson); setSidebarOpen(false); }}
                                                                    className={`w-full p-3 rounded-lg text-left text-sm font-medium transition-all ${isActive
                                                                        ? 'bg-indigo-500 text-white'
                                                                        : 'text-slate-600 hover:bg-slate-100'
                                                                        }`}
                                                                >
                                                                    {lesson.title}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
