'use client';

import React from 'react';
import { FiAward, FiDownload, FiShare2, FiClock, FiLock, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserCertificatesPage() {
    const { isDark } = useTheme();

    // Empty certificates for now
    const certificates = [];

    // Sample locked certificates (courses not completed yet)
    const lockedCertificates = [
        { id: 1, courseName: 'Complete Web Development Bootcamp', instructor: 'John Doe', estimatedCompletion: '48 hours remaining' },
        { id: 2, courseName: 'UI/UX Design Masterclass', instructor: 'Jane Smith', estimatedCompletion: '32 hours remaining' },
        { id: 3, courseName: 'Digital Marketing Course', instructor: 'Mike Johnson', estimatedCompletion: '24 hours remaining' },
    ];

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark ? 'bg-slate-800/50 border-white/5 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-black outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    My Certificates
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    View and download your earned certificates
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${cardClass} p-6 group hover:border-indigo-500/30`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                            <FiAward className="text-indigo-500 text-xl" />
                        </div>
                        <div>
                            <p className={`text-2xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>{certificates.length}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Earned</p>
                        </div>
                    </div>
                </div>
                <div className={`${cardClass} p-6 group hover:border-amber-500/30`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                            <FiClock className="text-amber-500 text-xl" />
                        </div>
                        <div>
                            <p className={`text-2xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>{lockedCertificates.length}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">In Progress</p>
                        </div>
                    </div>
                </div>
                <div className={`${cardClass} p-6 group hover:border-purple-500/30`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                            <FiShare2 className="text-purple-500 text-xl" />
                        </div>
                        <div>
                            <p className={`text-2xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>0</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Shared</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earned Certificates */}
            <div className={`${cardClass} p-8`}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <FiAward size={20} />
                    </div>
                    <h2 className={`text-lg font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Earned Certificates</h2>
                </div>

                {certificates.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiAward className="text-4xl text-indigo-400 opacity-50" />
                        </div>
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No Certificates Yet</h3>
                        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
                            Complete a course to earn your certificate. Certificates can be downloaded and shared on professional networks!
                        </p>
                        <Link
                            href="/dashboard/user/courses"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                        >
                            Browse My Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Certificates would be displayed here */}
                    </div>
                )}
            </div>

            {/* Locked Certificates (Courses in Progress) */}
            <div className={`${cardClass} p-8`}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <FiLock size={20} />
                    </div>
                    <h2 className={`text-lg font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Certificates In Progress</h2>
                </div>

                <div className="grid gap-4">
                    {lockedCertificates.map((cert) => (
                        <div
                            key={cert.id}
                            className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                                    <FiLock className="text-slate-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cert.courseName}</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">By {cert.instructor}</p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>
                                    <FiClock size={12} />
                                    {cert.estimatedCompletion}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
