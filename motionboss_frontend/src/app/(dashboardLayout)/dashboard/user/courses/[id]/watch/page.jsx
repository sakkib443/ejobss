'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseContent } from '@/redux/CourseSlice';
import { updateLessonProgress } from '@/redux/enrollmentSlice';
import toast from 'react-hot-toast';
import {
    FiPlay, FiCheckCircle, FiChevronDown, FiChevronUp,
    FiArrowLeft, FiClock, FiBookOpen, FiDownload, FiStar, FiChevronRight, FiMaximize,
    FiFileText, FiLock, FiCheck as FiCircleCheck
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseWatchPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { isDark } = useTheme();

    const { currentCourse, contentLoading, error } = useSelector((state) => state.courses);
    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});

    useEffect(() => {
        if (id) {
            dispatch(fetchCourseContent(id));
        }
    }, [id, dispatch]);

    // Group lessons by module manually (or use the populated modules)
    const groupedContent = useMemo(() => {
        if (!currentCourse || !currentCourse.modules || !currentCourse.lessons) return [];

        // The API returns course with modules and lessons arrays
        // We need to associate lessons with their modules
        return (currentCourse.modules || []).map(module => {
            const moduleId = module._id?.toString() || module._id;
            const moduleLessons = (currentCourse.lessons || []).filter(lesson => {
                const lessonModuleId = lesson.module?._id?.toString() || lesson.module?.toString() || lesson.module;
                return lessonModuleId === moduleId;
            }).sort((a, b) => (a.order || 0) - (b.order || 0));

            return {
                ...module,
                lessons: moduleLessons
            };
        }).sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [currentCourse]);


    useEffect(() => {
        if (groupedContent.length > 0 && !activeLesson) {
            // Find first published lesson
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
        if (!activeLesson || !id) return;

        try {
            await dispatch(updateLessonProgress({ courseId: id, lessonId: activeLesson._id })).unwrap();
            toast.success('Lesson marked as completed!', {
                style: {
                    borderRadius: '1.5rem',
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#fff' : '#1e293b',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9'
                }
            });

            // Find next lesson to play
            let foundActive = false;
            let nextLesson = null;

            for (const module of groupedContent) {
                for (const lesson of module.lessons) {
                    if (foundActive) {
                        nextLesson = lesson;
                        break;
                    }
                    if (lesson._id === activeLesson._id) {
                        foundActive = true;
                    }
                }
                if (nextLesson) break;
            }

            if (nextLesson) {
                setActiveLesson(nextLesson);
                // Ensure module is expanded
                const activeModule = groupedContent.find(m => m.lessons.some(l => l._id === nextLesson._id));
                if (activeModule) {
                    setExpandedModules(prev => ({ ...prev, [activeModule._id]: true }));
                }
            } else {
                toast('Congratulations! You have finished the course.', {
                    icon: '🎉',
                });
            }
        } catch (err) {
            toast.error(err || 'Failed to update progress');
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    if (contentLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className={`text-sm font-bold tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading Course Content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className={`max-w-md w-full p-8 rounded-[2rem] text-center border ${isDark ? 'bg-slate-800 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                    <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FiMaximize size={40} />
                    </div>
                    <h2 className={`text-2xl font-black mb-2 outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Content Access Error</h2>
                    <p className="text-slate-500 mb-8">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard/user/courses')}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
                    >
                        <FiArrowLeft /> Back to My Courses
                    </button>
                </div>
            </div>
        );
    }

    if (!currentCourse) return null;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Top Navigation Bar */}
            <div className={`sticky top-0 z-50 border-b backdrop-blur-md ${isDark ? 'bg-slate-900/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
                <div className="max-w-[1800px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        <button
                            onClick={() => router.push('/dashboard/user/courses')}
                            className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-sm font-bold outfit truncate uppercase tracking-wider text-indigo-500">Learning Mode</h1>
                            <h2 className={`text-base font-black truncate outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {currentCourse.title}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                            <FiStar size={12} fill="currentColor" /> Premium Access
                        </div>
                        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>
                            Resources
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Video Player & Info */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Video Player Container */}
                        <div className={`aspect-video rounded-[2rem] overflow-hidden shadow-2xl relative ${isDark ? 'bg-black' : 'bg-slate-200'}`}>
                            {activeLesson ? (
                                <iframe
                                    src={activeLesson.videoUrl?.includes('youtube')
                                        ? `https://www.youtube.com/embed/${activeLesson.videoUrl.split('v=')[1]?.split('&')[0] || activeLesson.videoUrl.split('/').pop()}`
                                        : activeLesson.videoUrl}
                                    title={activeLesson.title}
                                    className="w-full h-full"
                                    allowFullScreen
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center flex-col gap-4 text-slate-500">
                                    <FiPlay size={64} className="opacity-20 translate-y-2" />
                                    <p className="font-bold tracking-widest uppercase text-xs">Select a lesson to start</p>
                                </div>
                            )}
                        </div>

                        {/* Lesson Info */}
                        <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                            Module {groupedContent.findIndex(m => m.lessons.some(l => l._id === activeLesson?._id)) + 1}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                            Lesson {activeLesson?.order}
                                        </span>
                                    </div>
                                    <h1 className={`text-2xl md:text-3xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {activeLesson?.title || 'Course Overview'}
                                    </h1>
                                    <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {activeLesson?.description || currentCourse.description}
                                    </p>
                                </div>

                                <div className="flex flex-row md:flex-column gap-3">
                                    <button
                                        onClick={handleMarkAsDone}
                                        className="flex-1 md:w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        Mark as Done <FiCheckCircle />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Course Curriculum */}
                    <div className="lg:col-span-4 h-fit max-lg:order-last">
                        <div className={`rounded-[2rem] border overflow-hidden sticky top-28 ${isDark ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                            <div className={`p-6 border-b ${isDark ? 'bg-slate-800 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <h3 className={`text-lg font-black outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    <FiBookOpen className="text-indigo-500" /> Course Curriculum
                                </h3>
                                <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>{groupedContent.length} Modules</span>
                                    <span>•</span>
                                    <span>{currentCourse.lessons.length} Lessons</span>
                                    <span>•</span>
                                    <span className="text-indigo-500">{currentCourse.totalDuration} Min</span>
                                </div>
                            </div>

                            <div className="max-h-[calc(100vh-350px)] overflow-y-auto curriculum-scroll">
                                {groupedContent.map((module, mIdx) => (
                                    <div key={module._id} className={`border-b last:border-0 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                        <button
                                            onClick={() => toggleModule(module._id)}
                                            className={`w-full p-6 flex flex-col gap-1 text-left transition-all ${expandedModules[module._id]
                                                ? (isDark ? 'bg-white/5' : 'bg-indigo-50/50')
                                                : (isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50')
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    Module {mIdx + 1}
                                                </span>
                                                {expandedModules[module._id] ? <FiChevronUp /> : <FiChevronDown />}
                                            </div>
                                            <h4 className={`text-sm font-bold outfit ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                                {module.title}
                                            </h4>
                                        </button>

                                        <AnimatePresence>
                                            {expandedModules[module._id] && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden bg-transparent"
                                                >
                                                    <div className="px-2 pb-2">
                                                        {module.lessons.map((lesson, lIdx) => (
                                                            <button
                                                                key={lesson._id}
                                                                onClick={() => setActiveLesson(lesson)}
                                                                className={`w-full p-4 rounded-2xl flex items-center gap-4 group transition-all mb-1 ${activeLesson?._id === lesson._id
                                                                    ? (isDark ? 'bg-indigo-500 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200')
                                                                    : (isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-50 text-slate-600')
                                                                    }`}
                                                            >
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeLesson?._id === lesson._id
                                                                    ? 'bg-white/20'
                                                                    : (isDark ? 'bg-slate-700' : 'bg-slate-100')
                                                                    }`}>
                                                                    {activeLesson?._id === lesson._id ? <FiPlay fill="currentColor" size={14} /> : <FiPlay size={14} />}
                                                                </div>
                                                                <div className="flex-1 text-left min-w-0">
                                                                    <p className="text-xs font-bold line-clamp-1">{lesson.title}</p>
                                                                    <div className={`flex items-center gap-2 mt-1 text-[9px] font-black uppercase ${activeLesson?._id === lesson._id ? 'text-white/60' : 'text-slate-500'
                                                                        }`}>
                                                                        <FiClock size={10} /> {lesson.videoDuration} Min
                                                                    </div>
                                                                </div>
                                                                {/* Placeholder for completion check */}
                                                                <FiCircleCheck className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeLesson?._id === lesson._id ? 'text-white' : 'text-indigo-500'
                                                                    }`} />
                                                            </button>
                                                        ))}
                                                        {module.lessons.length === 0 && (
                                                            <div className="p-8 text-center opacity-30">
                                                                <FiLock size={24} className="mx-auto mb-2" />
                                                                <p className="text-[10px] font-black uppercase">Coming Soon</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .curriculum-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .curriculum-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .curriculum-scroll::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#334155' : '#e2e8f0'};
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
