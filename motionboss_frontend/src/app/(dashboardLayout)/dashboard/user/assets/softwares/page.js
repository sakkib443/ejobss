'use client';

import React from 'react';
import { FiCode, FiDownload, FiExternalLink, FiClock, FiShield, FiCpu, FiMonitor } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function MySoftwaresPage() {
    const { isDark } = useTheme();

    // Sample purchased softwares
    const softwares = [
        {
            id: 1,
            name: 'Vector Magic Pro',
            version: 'v4.2.0',
            purchaseDate: 'Dec 25, 2024',
            thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
            fileSize: '1.2 GB',
            license: 'Active - Private Use'
        },
        {
            id: 2,
            name: 'Motion Graphics Suite',
            version: 'v1.0.5',
            purchaseDate: 'Nov 12, 2024',
            thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc4a0?auto=format&fit=crop&q=80&w=400',
            fileSize: '850 MB',
            license: 'Active - Commercial'
        }
    ];

    const cardClass = `rounded-3xl border transition-all duration-300 overflow-hidden group ${isDark ? 'bg-slate-800/50 border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-200 shadow-sm hover:shadow-lg'
        }`;

    return (
        <div className="space-y-8">
            <div>
                <h1 className={`text-2xl font-black outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    My Softwares
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Download and manage your purchased software licenses
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {softwares.map(item => (
                    <div key={item.id} className={cardClass}>
                        <div className="relative h-40 overflow-hidden">
                            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                                    Software
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className={`text-lg font-bold outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {item.name}
                                </h3>
                                <span className="text-[10px] font-black text-indigo-500">{item.version}</span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiClock /> PURCHASED</span>
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.purchaseDate}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiMonitor /> SIZE</span>
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.fileSize}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiShield /> LICENSE</span>
                                    <span className="text-emerald-500">{item.license}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all">
                                    <FiDownload /> Download
                                </button>
                                <button className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                    <FiExternalLink />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
