/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  FiUsers, FiBook, FiDollarSign, FiShoppingCart,
  FiTrendingUp, FiTrendingDown, FiPlus, FiArrowRight,
  FiArrowUpRight, FiCalendar, FiActivity, FiEye, FiDownload,
  FiMonitor, FiPackage, FiAward, FiGrid,
  FiRefreshCw, FiMoreVertical, FiCheckCircle,
  FiClock, FiAlertCircle, FiBarChart2, FiPlay,
  FiTarget, FiZap, FiStar, FiHeart, FiCode, FiGlobe,
  FiLayers, FiCreditCard
} from 'react-icons/fi';

// ==================== ANIMATED COUNTER ====================
const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
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
  }, [value, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ==================== PREMIUM STATS CARD ====================
const StatsCard = ({ title, value, change, changeType, icon: Icon, gradient, loading, subtitle }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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


// ==================== PROFESSIONAL AREA CHART ====================
const AreaChart = ({ data, height = 250 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const maxValue = Math.max(...data.map(d => d.value), 1);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate points for the curve
  const getPoints = () => {
    return data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - (d.value / maxValue) * 85
    }));
  };

  // Generate smooth curve using cubic bezier
  const generateCurvePath = () => {
    const points = getPoints();
    if (points.length < 2) return '';

    let path = `M 0 ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;
      path += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  // Area path (closed)
  const generateAreaPath = () => {
    const curvePath = generateCurvePath();
    return `${curvePath} L 100 100 L 0 100 Z`;
  };

  return (
    <div style={{ height }} className="w-full">
      {/* Chart Container */}
      <div className="relative h-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-right pr-3">
          {[10000, 7500, 5000, 2500, 0].map((val, i) => (
            <span key={i} className="text-[11px] text-slate-400 leading-none">{val >= 1000 ? `${val / 1000}k` : val}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="absolute left-12 right-0 top-0 bottom-8">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b border-slate-100" style={{ height: 1 }} />
            ))}
          </div>

          {/* SVG Chart */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Area */}
            <path
              d={generateAreaPath()}
              fill="url(#chartGradient)"
              className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Line */}
            <path
              d={generateCurvePath()}
              fill="none"
              stroke="#6366F1"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Data points */}
            {getPoints().map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="1.2"
                fill="white"
                stroke="#6366F1"
                strokeWidth="0.4"
                className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${i * 50}ms` }}
              />
            ))}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute left-12 right-0 bottom-0 h-8 flex justify-between items-start pt-2">
          {data.map((d, i) => (
            <span key={i} className="text-[11px] text-slate-400">{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== DONUT CHART COMPONENT ====================
const DonutChart = ({ data, size = 160 }) => {
  const [animated, setAnimated] = useState(false);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  let currentOffset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />

        {/* Data segments */}
        {data.map((segment, i) => {
          const percentage = segment.value / total;
          const segmentLength = percentage * circumference;
          const offset = currentOffset;
          currentOffset += segmentLength;

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${animated ? segmentLength : 0} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ transitionDelay: `${i * 150}ms` }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">{total}</span>
        <span className="text-xs text-slate-500">Total</span>
      </div>
    </div>
  );
};

// ==================== ACTIVITY ITEM ====================
const ActivityItem = ({ icon: Icon, title, description, time, color, isNew }) => (
  <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${isNew ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
      style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)` }}
    >
      <Icon className="text-lg" style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {isNew && <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
      </div>
      <p className="text-xs text-slate-500 truncate mt-0.5">{description}</p>
    </div>
    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{time}</span>
  </div>
);

// ==================== MAIN DASHBOARD ====================
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalEnrollments: 0,
    totalCourses: 0,
    publishedCourses: 0,
    totalLessons: 0,
    totalStudents: 0,
    totalUsers: 0,
    totalWebsites: 0,
    totalSoftware: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    categories: 0,
    todayRevenue: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    newUsersThisMonth: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    totalLikes: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Mock revenue data for area chart
  const defaultRevenueData = [
    { label: 'Jan', value: 32000 },
    { label: 'Feb', value: 45000 },
    { label: 'Mar', value: 38000 },
    { label: 'Apr', value: 52000 },
    { label: 'May', value: 48000 },
    { label: 'Jun', value: 61000 },
    { label: 'Jul', value: 55000 },
    { label: 'Aug', value: 67000 },
    { label: 'Sep', value: 58000 },
    { label: 'Oct', value: 72000 },
    { label: 'Nov', value: 68000 },
    { label: 'Dec', value: 85000 },
  ];

  const fetchDashboardData = async () => {
    const BASE_URL = 'https://motionboss-backend.vercel.app/api';
    const token = localStorage.getItem('token');

    try {
      setRefreshing(true);

      const [summaryRes, topProductsRes, recentPurchasesRes, revenueRes] = await Promise.all([
        fetch(`${BASE_URL}/analytics/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/analytics/top-products?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/analytics/recent-purchases?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/analytics/revenue`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const { data: summary } = await summaryRes.json();
      const { data: topProducts } = await topProductsRes.json();
      const { data: recentPurchases } = await recentPurchasesRes.json();
      const { data: revData } = await revenueRes.json();

      setDashboardData({
        totalRevenue: summary?.totalRevenue || 0,
        totalEnrollments: summary?.totalEnrollments || 0,
        activeEnrollments: summary?.activeEnrollments || 0,
        completedEnrollments: summary?.completedEnrollments || 0,
        totalCourses: summary?.totalCourses || 0,
        publishedCourses: summary?.publishedCourses || 0,
        totalLessons: summary?.totalLessons || 0,
        totalStudents: summary?.totalStudents || 0,
        totalUsers: summary?.totalUsers || 0,
        totalWebsites: summary?.totalWebsites || 0,
        totalSoftware: summary?.totalSoftware || 0,
        totalOrders: summary?.totalOrders || 0,
        pendingOrders: summary?.pendingOrders || 0,
        completedOrders: summary?.completedOrders || 0,
        categories: summary?.totalCategories || 0,
        todayRevenue: summary?.todayRevenue || 0,
        todayOrders: summary?.todayOrders || 0,
        monthlyRevenue: summary?.monthlyRevenue || 0,
        newUsersThisMonth: summary?.newUsersThisMonth || 0,
        totalLikes: summary?.totalLikes || 0,
      });

      if (revData && revData.length > 0) {
        setRevenueHistory(revData.map(d => ({
          label: new Date(d.date).toLocaleDateString([], { month: 'short' }),
          value: d.revenue
        })));
      }

      setTopCourses(topProducts || []);

      setRecentOrders((recentPurchases || []).map(p => ({
        id: p.orderNumber || p._id?.slice(-6).toUpperCase(),
        customer: `${p.user?.firstName || 'User'} ${p.user?.lastName || ''}`,
        product: p.items?.[0]?.title || 'Product',
        amount: p.totalAmount,
        status: p.paymentStatus,
        time: new Date(p.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));

      // Fetch notifications for recent activities
      try {
        const notifRes = await fetch(`${BASE_URL}/notifications?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } });
        const notifData = await notifRes.json();
        if (notifData.data) {
          setRecentActivities(notifData.data.map(n => ({
            icon: n.type === 'order' ? FiCheckCircle : n.type === 'enrollment' ? FiUsers : n.type === 'review' ? FiStar : FiActivity,
            title: n.title,
            description: n.message,
            time: getTimeAgo(new Date(n.createdAt)),
            color: n.type === 'order' ? '#10B981' : n.type === 'enrollment' ? '#3B82F6' : n.type === 'review' ? '#F59E0B' : '#6366F1',
            isNew: !n.isRead
          })));
        }
      } catch (e) {
        console.log('Notifications fetch error:', e);
      }

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    fetchDashboardData();
  }, []);

  // Platform distribution for donut chart
  const platformData = [
    { name: 'Courses', value: dashboardData.totalCourses || 3, color: '#6366F1' },
    { name: 'Websites', value: dashboardData.totalWebsites || 5, color: '#10B981' },
    { name: 'Software', value: dashboardData.totalSoftware || 4, color: '#F59E0B' },
  ];

  // Stats cards data
  const mainStats = [
    {
      title: 'Total Likes',
      value: dashboardData.totalLikes || 0,
      subtitle: 'Across all products',
      change: '+15.2%',
      changeType: 'up',
      icon: FiHeart,
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      title: 'Today Revenue',
      value: dashboardData.todayRevenue,
      subtitle: "Today's earnings",
      change: '+8.5%',
      changeType: 'up',
      icon: FiDollarSign,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'This Month Revenue',
      value: dashboardData.monthlyRevenue,
      subtitle: 'Monthly earnings',
      change: '+18.2%',
      changeType: 'up',
      icon: FiTrendingUp,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Total Orders',
      value: dashboardData.totalOrders,
      subtitle: `${dashboardData.completedOrders || 0} completed`,
      change: '+24.5%',
      changeType: 'up',
      icon: FiPackage,
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  // Product stats for cards
  const productStats = [
    { title: 'All Courses', value: dashboardData.totalCourses, icon: FiBook, gradient: 'from-indigo-500 to-purple-500', href: '/dashboard/admin/course' },
    { title: 'All Softwares', value: dashboardData.totalSoftware, icon: FiCode, gradient: 'from-cyan-500 to-teal-500', href: '/dashboard/admin/software' },
    { title: 'All Websites', value: dashboardData.totalWebsites, icon: FiGlobe, gradient: 'from-pink-500 to-rose-500', href: '/dashboard/admin/website' },
    { title: 'All Categories', value: dashboardData.categories, icon: FiLayers, gradient: 'from-amber-500 to-orange-500', href: '/dashboard/admin/category' },
  ];

  const quickActions = [
    { title: 'Add Course', href: '/dashboard/admin/course/create', icon: FiBook, gradient: 'from-amber-500 to-orange-500' },
    { title: 'Add Website', href: '/dashboard/admin/website/create', icon: FiGlobe, gradient: 'from-pink-500 to-rose-500' },
    { title: 'Add Software', href: '/dashboard/admin/software/create', icon: FiCode, gradient: 'from-cyan-500 to-teal-500' },
    { title: 'Add Category', href: '/dashboard/admin/category/create', icon: FiLayers, gradient: 'from-violet-500 to-purple-500' },
  ];

  // Helper function for time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
    return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'pending': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'processing': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const chartData = revenueHistory.length > 0 ? revenueHistory : defaultRevenueData;

  return (
    <div className="space-y-6">
      {/* ==================== COMPACT HEADER BAR ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <FiGrid className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard Overview</h1>
            <p className="text-sm text-slate-500">
              {hasMounted ? new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading date...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          >
            <FiRefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Syncing...' : 'Reload'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all">
            <FiDownload size={16} />
            Export
          </button>
        </div>
      </div>

      {/* ==================== MAIN STATS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mainStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} loading={loading} />
        ))}
      </div>

      {/* ==================== CHARTS SECTION ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart - Revenue Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Revenue Overview</h2>
              <p className="text-sm text-slate-500">Monthly revenue and sales</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                <span className="text-xs text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg text-emerald-600 text-sm font-semibold">
                <FiTrendingUp />
                +18.2%
              </div>
            </div>
          </div>
          <div className="p-6">
            <AreaChart
              data={chartData}
              height={280}
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Total Revenue: <span className="font-bold text-slate-800">৳{dashboardData.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="text-sm text-slate-500">
                This Month: <span className="font-bold text-emerald-600">৳{dashboardData.monthlyRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart - Platform Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Platform Distribution</h2>
              <p className="text-sm text-slate-500">Content by category</p>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center">
            <DonutChart data={platformData} size={180} />

            {/* Legend */}
            <div className="mt-6 w-full space-y-3">
              {platformData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
                    <span className="text-xs text-slate-400">
                      {Math.round((item.value / platformData.reduce((a, b) => a + b.value, 0)) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PRODUCT STATS ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {productStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
            >
              <div className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-xl`} />
              <div className="relative flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="text-xl text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {loading ? '...' : stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">{stat.title}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ==================== MIDDLE SECTION ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group relative flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-transparent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                    <Icon className="text-xl text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 text-center">{action.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Content */}
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Top Content</h2>
            <Link href="/dashboard/admin/course" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {loading ? (
              <div className="text-center py-8 text-slate-400">
                <FiRefreshCw className="animate-spin mx-auto mb-2" size={24} />
                Loading...
              </div>
            ) : topCourses.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No content found</div>
            ) : (
              topCourses.slice(0, 4).map((course, idx) => (
                <div key={course._id || idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${['from-indigo-500 to-purple-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-teal-500', 'from-pink-500 to-rose-500'][idx % 4]
                    } flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                    <p className="text-xs text-slate-500">{course.salesCount || 0} sales</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">৳{course.price || 0}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Stats */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-6 shadow-sm">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-slate-600">Live Statistics</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-sm text-slate-500">Today's Revenue</span>
                <span className="text-lg font-bold text-slate-800">৳{dashboardData.todayRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-sm text-slate-500">This Month</span>
                <span className="text-lg font-bold text-slate-800">৳{dashboardData.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-sm text-slate-500">New Users</span>
                <span className="text-lg font-bold text-emerald-600">+{dashboardData.newUsersThisMonth}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-sm text-slate-500">Active Enrollments</span>
                <span className="text-lg font-bold text-indigo-600">{dashboardData.activeEnrollments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== BOTTOM SECTION ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
            <Link href="/dashboard/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 text-xs text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="text-left p-4 font-semibold">Order ID</th>
                  <th className="text-left p-4 font-semibold">Customer</th>
                  <th className="text-left p-4 font-semibold">Product</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No orders found</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className="text-sm font-semibold text-slate-800">#{order.id}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {order.customer?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm text-slate-600">{order.customer}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 max-w-[200px] truncate">{order.product}</td>
                      <td className="p-4 text-sm font-bold text-emerald-600">৳{order.amount?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            <Link href="/dashboard/admin/notifications" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {recentActivities.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FiActivity className="mx-auto mb-2" size={24} />
                <p className="text-sm">No recent activities</p>
              </div>
            ) : (
              recentActivities.map((activity, idx) => (
                <ActivityItem key={idx} {...activity} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
