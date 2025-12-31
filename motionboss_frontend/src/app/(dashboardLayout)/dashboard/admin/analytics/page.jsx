'use client';

import React, { useEffect, useState } from 'react';
import {
    FiBarChart2, FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers,
    FiShoppingBag, FiBook, FiRefreshCw, FiGlobe, FiCode,
    FiCalendar, FiPackage, FiActivity, FiPieChart, FiLayers
} from 'react-icons/fi';

// Animated counter component
const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const numValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
        const duration = 1500;
        const increment = numValue / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                setCount(numValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, gradient, change, changeType, subtitle, loading }) => (
    <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient.replace('from-', 'from-').replace('to-', 'to-')}/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl`} />
            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
                    <p className="text-3xl font-bold text-slate-800 mb-1">
                        {loading ? (
                            <span className="inline-block w-24 h-9 bg-gradient-to-r from-slate-200 to-slate-100 animate-pulse rounded-lg" />
                        ) : (
                            <AnimatedCounter value={value} prefix={title.includes('Revenue') ? '৳' : ''} />
                        )}
                    </p>
                    {subtitle && <p className="text-xs text-slate-400 mb-2">{subtitle}</p>}
                    {change && (
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${changeType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                            }`}>
                            {changeType === 'up' ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                            <span>{change}</span>
                        </div>
                    )}
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="text-2xl text-white" />
                </div>
            </div>
        </div>
    </div>
);

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30');

    const BASE_URL = 'http://localhost:5000/api';

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/analytics/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            setData(result.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Main stats
    const mainStats = [
        {
            title: 'Total Revenue',
            value: data?.totalRevenue || 0,
            icon: FiDollarSign,
            gradient: 'from-emerald-500 to-teal-500',
            change: '+18.2%',
            changeType: 'up',
            subtitle: 'All time earnings'
        },
        {
            title: 'Total Users',
            value: data?.totalUsers || 0,
            icon: FiUsers,
            gradient: 'from-blue-500 to-indigo-500',
            change: '+12.5%',
            changeType: 'up',
            subtitle: 'Registered accounts'
        },
        {
            title: 'Total Orders',
            value: data?.totalOrders || 0,
            icon: FiShoppingBag,
            gradient: 'from-amber-500 to-orange-500',
            change: '+8.3%',
            changeType: 'up',
            subtitle: `${data?.completedOrders || 0} completed`
        },
        {
            title: 'Active Courses',
            value: data?.totalCourses || 0,
            icon: FiBook,
            gradient: 'from-violet-500 to-purple-500',
            change: '+5',
            changeType: 'up',
            subtitle: `${data?.publishedCourses || 0} published`
        },
    ];

    // Product stats
    const productStats = [
        { title: 'Websites', value: data?.totalWebsites || 0, icon: FiGlobe, gradient: 'from-pink-500 to-rose-500' },
        { title: 'Software', value: data?.totalSoftware || 0, icon: FiCode, gradient: 'from-cyan-500 to-teal-500' },
        { title: 'Enrollments', value: data?.totalEnrollments || 0, icon: FiUsers, gradient: 'from-indigo-500 to-purple-500' },
        { title: 'Categories', value: data?.totalCategories || 0, icon: FiLayers, gradient: 'from-amber-500 to-orange-500' },
    ];

    // Revenue breakdown
    const revenueBreakdown = [
        { label: 'Courses', value: (data?.monthlyRevenue || 0) * 0.5, color: '#6366F1', percent: 50 },
        { label: 'Websites', value: (data?.monthlyRevenue || 0) * 0.3, color: '#10B981', percent: 30 },
        { label: 'Software', value: (data?.monthlyRevenue || 0) * 0.2, color: '#F59E0B', percent: 20 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <FiPieChart className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Analytics Dashboard</h1>
                        <p className="text-sm text-slate-500">Platform performance overview</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                        <FiCalendar size={16} className="text-slate-500" />
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium text-slate-700 cursor-pointer"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">This Year</option>
                        </select>
                    </div>
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {mainStats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} loading={loading} />
                ))}
            </div>

            {/* Revenue & Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Revenue by Category</h3>
                            <p className="text-sm text-slate-500">Monthly breakdown</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                            <FiTrendingUp className="text-emerald-500" size={14} />
                            <span className="text-sm font-semibold text-emerald-600">+24.3%</span>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {revenueBreakdown.map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-slate-800">৳{item.value.toLocaleString()}</span>
                                        <span className="text-xs text-slate-400">{item.percent}%</span>
                                    </div>
                                </div>
                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Monthly Total</span>
                            <span className="text-2xl font-bold text-slate-800">৳{(data?.monthlyRevenue || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <FiActivity className="text-indigo-400" />
                        <h3 className="text-lg font-bold">This Month</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <span className="text-slate-300 text-sm">Monthly Revenue</span>
                            <span className="text-xl font-bold">৳{(data?.monthlyRevenue || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <span className="text-slate-300 text-sm">Today's Revenue</span>
                            <span className="text-xl font-bold text-emerald-400">৳{(data?.todayRevenue || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <span className="text-slate-300 text-sm">New Users</span>
                            <span className="text-xl font-bold text-blue-400">+{data?.newUsersThisMonth || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <span className="text-slate-300 text-sm">Completed Orders</span>
                            <span className="text-xl font-bold text-purple-400">{data?.completedOrders || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-colors">
                            <span className="text-slate-300 text-sm">Pending Orders</span>
                            <span className="text-xl font-bold text-amber-400">{data?.pendingOrders || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {productStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                    <Icon className="text-white" size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{loading ? '—' : stat.value}</p>
                            <p className="text-xs text-slate-500 mt-1">{stat.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <FiUsers className="text-white" size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Total Students</p>
                            <p className="text-xs text-slate-500">Enrolled learners</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{data?.totalStudents || 0}</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                            <FiPackage className="text-white" size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Active Enrollments</p>
                            <p className="text-xs text-slate-500">In progress</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{data?.activeEnrollments || 0}</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <FiBook className="text-white" size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Total Lessons</p>
                            <p className="text-xs text-slate-500">All courses</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{data?.totalLessons || 0}</p>
                </div>
            </div>
        </div>
    );
}
