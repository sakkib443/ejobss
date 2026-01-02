'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiBook,
    FiAward,
    FiUser,
    FiMenu,
    FiX,
    FiLogOut,
    FiArrowLeft,
    FiHelpCircle,
    FiCalendar,
    FiCreditCard,
    FiChevronDown,
    FiChevronRight,
    FiStar,
    FiDownload,
    FiLayout,
    FiLayers,
    FiClock,
    FiCode,
    FiGlobe
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

const UserSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const { isDark } = useTheme();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) { }
        }
    }, []);

    const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

    const toggleSubmenu = (title) => {
        setOpenSubmenu(openSubmenu === title ? null : title);
    };

    const menuItems = [
        {
            title: 'Dashboard',
            href: '/dashboard/user',
            icon: FiHome,
            gradient: 'from-indigo-600 to-purple-600'
        },
        {
            title: 'Learning Area',
            icon: FiBook,
            gradient: 'from-blue-500 to-indigo-600',
            submenu: [
                { title: 'My Courses', href: '/dashboard/user/courses', icon: FiBook },
                { title: 'My Schedule', href: '/dashboard/user/schedule', icon: FiClock },
                { title: 'Assignments', href: '/dashboard/user/assignments', icon: FiLayout },
            ],
        },
        {
            title: 'Achievements',
            icon: FiAward,
            gradient: 'from-amber-500 to-orange-600',
            submenu: [
                { title: 'Certificates', href: '/dashboard/user/certificates', icon: FiAward },
                { title: 'Points & Badges', href: '/dashboard/user/points', icon: FiStar },
            ],
        },
        {
            title: 'Digital Assets',
            icon: FiDownload,
            gradient: 'from-pink-500 to-rose-600',
            submenu: [
                { title: 'Softwares', href: '/dashboard/user/assets/softwares', icon: FiCode },
                { title: 'Websites', href: '/dashboard/user/assets/websites', icon: FiGlobe },
            ],
        },
        {
            title: 'Billing',
            href: '/dashboard/user/payments',
            icon: FiCreditCard,
            gradient: 'from-purple-500 to-pink-600'
        },
        {
            title: 'Profile',
            href: '/dashboard/user/profile',
            icon: FiUser,
            gradient: 'from-cyan-500 to-blue-600'
        },
        {
            title: 'Support',
            href: '/dashboard/user/support',
            icon: FiHelpCircle,
            gradient: 'from-slate-500 to-slate-700'
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden fixed top-4 left-4 z-50 p-3 rounded-2xl shadow-xl transition-all ${isOpen ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'
                    }`}
            >
                {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen transition-all duration-500 z-40 overflow-hidden
        ${isOpen ? 'w-72' : 'w-0 lg:w-72'} 
        ${isDark
                        ? 'bg-slate-900 border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.3)]'
                        : 'bg-white border-r border-slate-200 shadow-[10px_0_30px_rgba(0,0,0,0.02)]'}`}
            >
                {/* Background Decorative Gradient */}
                <div className={`absolute top-0 right-0 w-64 h-64 opacity-20 blur-[100px] pointer-events-none rounded-full transition-colors duration-1000 ${isDark ? 'bg-indigo-500' : 'bg-indigo-300'
                    }`} />

                <div className="relative h-full flex flex-col">
                    {/* Header/Logo */}
                    <div className="px-6 py-5">
                        <Link href="/" className="block w-32 h-10 group">
                            <img src="/images/ejobsitlogo.png" alt="eJobsIT" className="w-full h-full object-contain group-hover:opacity-80 transition-opacity" />
                        </Link>
                    </div>

                    {/* Back to Website */}
                    <div className="px-6 mb-6">
                        <Link
                            href="/"
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border group ${isDark
                                ? 'border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                                : 'border-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                        >
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <span>Visit Marketplace</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar pb-24">
                        <p className={`px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            Main Navigation
                        </p>

                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const hasSubmenu = item.submenu && item.submenu.length > 0;
                            const isSubOpen = openSubmenu === item.title;
                            const isItemActive = item.href ? isActive(item.href) : item.submenu?.some(sub => isActive(sub.href));

                            return (
                                <div key={item.title} className="space-y-1">
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative ${isActive(item.href)
                                                ? isDark
                                                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white'
                                                    : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700'
                                                : isDark
                                                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                                                }`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isActive(item.href)
                                                ? `bg-gradient-to-br ${item.gradient} shadow-lg shadow-indigo-500/20`
                                                : isDark ? 'bg-slate-800' : 'bg-slate-100'
                                                }`}>
                                                <Icon size={18} className={isActive(item.href) ? 'text-white' : ''} />
                                            </div>
                                            <span className="text-sm font-bold tracking-tight">{item.title}</span>
                                            {isActive(item.href) && (
                                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                                            )}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => toggleSubmenu(item.title)}
                                            className={`w-full group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isSubOpen || isItemActive
                                                ? isDark ? 'bg-white/5 text-white' : 'bg-indigo-50 text-indigo-700'
                                                : isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                                                }`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isItemActive
                                                ? `bg-gradient-to-br ${item.gradient} shadow-lg shadow-indigo-500/20`
                                                : isDark ? 'bg-slate-800' : 'bg-slate-100'
                                                }`}>
                                                <Icon size={18} className={isItemActive ? 'text-white' : ''} />
                                            </div>
                                            <span className="text-sm font-bold tracking-tight flex-1 text-left">{item.title}</span>
                                            <FiChevronDown className={`transition-transform duration-300 ${isSubOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    )}

                                    {/* Submenu */}
                                    {hasSubmenu && (
                                        <div className={`overflow-hidden transition-all duration-300 ${isSubOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="pl-12 pr-4 py-2 space-y-1 relative">
                                                {/* Submenu line */}
                                                <div className={`absolute left-7 top-0 w-0.5 h-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />

                                                {item.submenu.map((sub) => {
                                                    const SubIcon = sub.icon;
                                                    const isSubActive = isActive(sub.href);
                                                    return (
                                                        <Link
                                                            key={sub.href}
                                                            href={sub.href}
                                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${isSubActive
                                                                ? isDark ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-600 bg-indigo-50'
                                                                : isDark ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                                                }`}
                                                        >
                                                            <div className={`w-1.5 h-1.5 rounded-full transition-all ${isSubActive ? 'bg-indigo-500 scale-125' : 'bg-slate-600 group-hover:bg-indigo-400'
                                                                }`} />
                                                            <span>{sub.title}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* User Profile / Logout - Bottom */}
                    <div className={`p-4 border-t ${isDark ? 'border-white/5 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="flex items-center gap-3 p-3 rounded-2xl mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                                {user?.firstName?.[0] || 'S'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {user?.firstName || 'Student'}
                                </p>
                                <p className={`text-[10px] font-medium truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Level: Beginner
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-300 font-bold text-xs"
                        >
                            <FiLogOut size={16} />
                            <span>Sign Out Account</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default UserSidebar;
