'use client';

import React from 'react';
import { FiGlobe, FiDownload, FiExternalLink, FiClock, FiShield, FiLayout, FiEye } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function MyWebsitesPage() {
    const { isDark } = useTheme();

    // Sample purchased website templates
    const websites = [
        {
            id: 1,
            name: 'MotionBoss E-commerce Kit',
            type: 'Next.js Frontend',
            purchaseDate: 'Dec 28, 2024',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
            license: 'Commercial License',
            demoUrl: '#'
        },
        {
            id: 2,
            name: 'Creative Agency Portfolio',
            type: 'Tailwind HTML',
            purchaseDate: 'Nov 30, 2024',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
            license: 'Single Use',
            demoUrl: '#'
        }
    ];

    const cardClass = `rounded-3xl border transition-all duration-300 overflow-hidden group ${isDark ? 'bg-slate-800/50 border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-200 shadow-sm hover:shadow-lg'
        }`;

    return (
        <div className="space-y-8">
            <div>
                <h1 className={`text-2xl font-black outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    My Website Templates
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Access your purchased website source codes and documentation
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.map(item => (
                    <div key={item.id} className={cardClass}>
                        <div className="relative h-44 overflow-hidden">
                            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                                    Website Template
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className={`text-lg font-bold outfit mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {item.name}
                            </h3>
                            <p className="text-xs text-indigo-500 font-bold mb-4">{item.type}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiClock /> ACQUIRED</span>
                                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item.purchaseDate}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiShield /> LICENSE</span>
                                    <span className="text-emerald-500">{item.license}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
                                    <FiDownload /> Source Code
                                </button>
                                <button className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'} hover:text-indigo-500`}>
                                    <FiEye />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State Help */}
            <div className={`mt-12 p-8 rounded-[2.5rem] border-2 border-dashed text-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <FiLayout size={40} className="mx-auto text-slate-300 mb-4 opacity-30" />
                <h3 className={`text-lg font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Looking for customized solutions?</h3>
                <p className="text-sm text-slate-500 mb-6">Our developers can help you customize these templates as per your brand needs.</p>
                <button className="text-indigo-500 font-bold text-sm underline hover:text-indigo-400">Request Customization</button>
            </div>
        </div>
    );
}
