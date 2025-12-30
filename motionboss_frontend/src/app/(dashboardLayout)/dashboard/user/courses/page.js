'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FiBook, FiClock, FiPlay, FiLock, FiSearch,
    FiGrid, FiList, FiLoader, FiExternalLink, FiFilter, FiCpu, FiMonitor
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserCoursesPage() {
    const { isDark } = useTheme();
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) { }
        }
    }, []);

    const availableCourses = [
        {
            id: 1,
            title: 'Complete Web Development Bootcamp',
            instructor: 'John Doe',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
            duration: '48 hours',
            lessons: 180,
            price: 4999,
            category: 'Web Development',
            level: 'Beginner'
        },
        {
            id: 2,
            title: 'UI/UX Design Masterclass',
            instructor: 'Jane Smith',
            thumbnail: 'https://images.unsplash.com/photo-1541462608141-ad4d157ee78a?auto=format&fit=crop&q=80&w=600',
            duration: '32 hours',
            lessons: 95,
            price: 3999,
            category: 'Design',
            level: 'All Levels'
        },
        {
            id: 3,
            title: 'Digital Marketing Complete Course',
            instructor: 'Mike Johnson',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
            duration: '24 hours',
            lessons: 72,
            price: 2999,
            category: 'Marketing',
            level: 'Intermediate'
        },
    ];

    const filteredCourses = availableCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const cardClass = `rounded-3xl border transition-all duration-300 overflow-hidden group ${isDark ? 'bg-slate-800/50 border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1'
        }`;

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-black outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Learning Catalog
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Discover professional courses and start learning today
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2.5 rounded-xl border-none text-sm transition-all w-64 ${isDark ? 'bg-slate-800 text-slate-200 outline-none ring-1 ring-white/5 focus:ring-indigo-500/50' : 'bg-white shadow-sm ring-1 ring-slate-200 focus:ring-indigo-500/20 outline-none'
                                }`}
                        />
                    </div>
                    <div className={`flex items-center gap-1 p-1 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400'}`}
                        >
                            <FiGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400'}`}
                        >
                            <FiList size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Section Banner */}
            <div className="rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-800 p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                <div className="relative z-10 max-w-xl">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Learning Path</span>
                    <h2 className="text-3xl font-black mt-4 mb-2 outfit">Master Full-Stack in 90 Days</h2>
                    <p className="text-indigo-100 text-sm mb-6">Our most popular learning path updated for 2025. Enroll now and get professional mentorship.</p>
                    <button className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">Enroll Now</button>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent flex items-center justify-center">
                    <FiMonitor className="text-[120px] opacity-20 rotate-12" />
                </div>
            </div>

            {/* Courses List */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredCourses.map((course) => (
                    <div key={course.id} className={cardClass}>
                        {/* Course Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute top-4 right-4 bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                                {course.level}
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest">
                                    {course.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className={`text-lg font-bold mb-2 outfit line-clamp-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {course.title}
                            </h3>
                            <p className="text-slate-500 text-sm mb-4 truncate">Instructor: {course.instructor}</p>

                            <div className="flex items-center justify-between py-4 border-y border-white/5 dark:border-white/5 border-slate-100 mb-6">
                                <div className="flex items-center gap-2">
                                    <FiClock className="text-indigo-500" />
                                    <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiPlay className="text-indigo-500" />
                                    <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{course.lessons} Lessons</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-xl font-black outfit ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>৳{course.price.toLocaleString()}</span>
                                <button
                                    onClick={() => alert('Feature coming soon!')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isDark ? 'bg-slate-700 text-slate-200 hover:bg-indigo-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-indigo-500 hover:text-white'
                                        }`}
                                >
                                    Purchase <FiExternalLink />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="py-20 text-center">
                    <FiSearch size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className={`text-xl font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No courses found</h3>
                    <p className="text-slate-500">Try adjusting your search terms</p>
                </div>
            )}
        </div>
    );
}
