/* eslint-disable react/no-unescaped-entities */
'use client';

import ProtectedRoute from '@/app/providers/protectedRoutes';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiUsers, FiBook, FiDollarSign, FiShoppingCart,
  FiTrendingUp, FiTrendingDown, FiPlus, FiArrowRight,
  FiCalendar, FiActivity, FiEye, FiDownload,
  FiMonitor, FiPackage, FiAward, FiGrid,
  FiRefreshCw, FiMoreVertical, FiCheckCircle,
  FiClock, FiAlertCircle, FiBarChart2
} from 'react-icons/fi';

// ==================== STATS CARD COMPONENT ====================
const StatsCard = ({ title, value, change, changeType, icon: Icon, color, loading }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mb-2">
          {loading ? (
            <span className="inline-block w-20 h-8 bg-slate-200 animate-pulse rounded"></span>
          ) : value}
        </p>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'up' ? 'text-emerald-600' : 'text-red-500'
            }`}>
            {changeType === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>{change}</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        )}
      </div>
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="text-2xl" style={{ color }} />
      </div>
    </div>
  </div>
);

// ==================== CHART BAR COMPONENT ====================
const ChartBar = ({ label, value, maxValue, color, subLabel }) => (
  <div className="flex items-end gap-3 group cursor-pointer">
    <div className="flex-1 flex flex-col items-center">
      <div className="relative w-full">
        <div
          className="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80"
          style={{
            height: `${Math.max(20, (value / maxValue) * 160)}px`,
            background: `linear-gradient(to top, ${color}, ${color}88)`
          }}
        ></div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {subLabel || value}
        </div>
      </div>
      <span className="text-xs text-slate-500 mt-2 font-medium">{label}</span>
    </div>
  </div>
);

// ==================== PROGRESS BAR COMPONENT ====================
const ProgressBar = ({ label, value, total, color }) => {
  const percentage = Math.round((value / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-800">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

// ==================== ACTIVITY ITEM COMPONENT ====================
const ActivityItem = ({ icon: Icon, title, description, time, color }) => (
  <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}15` }}
    >
      <Icon className="text-lg" style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 truncate">{description}</p>
    </div>
    <span className="text-xs text-slate-400 shrink-0">{time}</span>
  </div>
);

// ==================== MAIN DASHBOARD COMPONENT ====================
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalEnrollments: 0,
    totalCourses: 0,
    totalStudents: 0,
    totalWebsites: 0,
    totalSoftware: 0,
    totalOrders: 0,
    categories: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  // Mock data for charts (will be replaced with API data)
  const revenueData = [
    { month: 'Jul', value: 45000, label: '৳45,000' },
    { month: 'Aug', value: 52000, label: '৳52,000' },
    { month: 'Sep', value: 48000, label: '৳48,000' },
    { month: 'Oct', value: 61000, label: '৳61,000' },
    { month: 'Nov', value: 55000, label: '৳55,000' },
    { month: 'Dec', value: 72000, label: '৳72,000' },
  ];
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [enrollmentHistory, setEnrollmentHistory] = useState([]);

  const fetchDashboardData = async () => {
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    try {
      setRefreshing(true);

      // Fetch all data in parallel for speed
      const [summaryRes, topProductsRes, recentPurchasesRes, revenueRes] = await Promise.all([
        fetch(`${BASE_URL}/analytics/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/analytics/top-products?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/analytics/recent-purchases?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/analytics/revenue`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const { data: summary } = await summaryRes.json();
      const { data: topProducts } = await topProductsRes.json();
      const { data: recentPurchases } = await recentPurchasesRes.json();
      const { data: revenueData } = await revenueRes.json();

      setDashboardData({
        totalRevenue: summary.totalRevenue || 0,
        totalEnrollments: summary.totalEnrollments || 0,
        totalCourses: summary.totalCourses || 0,
        totalStudents: summary.totalStudents || 0,
        totalWebsites: summary.totalWebsites || 0,
        totalSoftware: summary.totalSoftware || 0,
        totalOrders: summary.totalOrders || 0,
        categories: summary.totalCategories || 0,
        todayRevenue: summary.todayRevenue || 0,
        monthlyRevenue: summary.monthlyRevenue || 0,
        newUsersThisMonth: summary.newUsersThisMonth || 0,
      });

      // Map revenue chart data (last 7 days or months)
      setRevenueHistory((revenueData || []).map(d => ({
        month: new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        value: d.revenue,
        label: `৳${d.revenue.toLocaleString()}`
      })));

      setTopCourses(topProducts || []);

      // Map backend orders to our display format
      setRecentOrders((recentPurchases || []).map(p => ({
        id: p.orderNumber || p._id.slice(-6).toUpperCase(),
        customer: `${p.user?.firstName || 'User'} ${p.user?.lastName || ''}`,
        product: p.items?.[0]?.title || 'Product',
        amount: p.totalAmount,
        status: p.paymentStatus,
        time: new Date(p.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Fetch error:', err);
      // Fallback to empty state but stop loading
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate max values for charts
  const currentRevenueSource = revenueHistory.length > 0 ? revenueHistory : revenueData;
  const maxRevenue = Math.max(...currentRevenueSource.map(d => d.value), 1000);

  // Stats configuration
  const mainStats = [
    {
      title: 'Total Revenue',
      value: `৳${(dashboardData.totalRevenue).toLocaleString()}`,
      change: '+18.2%',
      changeType: 'up',
      icon: FiDollarSign,
      color: '#10B981',
    },
    {
      title: 'Total Enrollments',
      value: dashboardData.totalEnrollments,
      change: '+24.5%',
      changeType: 'up',
      icon: FiUsers,
      color: '#3B82F6',
    },
    {
      title: 'Active Courses',
      value: dashboardData.totalCourses,
      change: '+5',
      changeType: 'up',
      icon: FiBook,
      color: '#F59E0B',
    },
    {
      title: 'Total Orders',
      value: dashboardData.totalOrders,
      change: '+12.3%',
      changeType: 'up',
      icon: FiShoppingCart,
      color: '#8B5CF6',
    },
  ];

  const productStats = [
    { title: 'Website Sales', value: dashboardData.totalWebsites, icon: FiMonitor, color: '#EC4899' },
    { title: 'Software Sales', value: dashboardData.totalSoftware, icon: FiPackage, color: '#14B8A6' },
    { title: 'Total Students', value: dashboardData.totalStudents, icon: FiUsers, color: '#6366F1' },
    { title: 'Categories', value: dashboardData.categories, icon: FiGrid, color: '#F97316' },
  ];

  // Quick actions
  const quickActions = [
    { title: 'Add Course', href: '/dashboard/admin/course/create', icon: FiBook, color: '#F59E0B' },
    { title: 'Add Website', href: '/dashboard/admin/websites/create', icon: FiMonitor, color: '#EC4899' },
    { title: 'Add Category', href: '/dashboard/admin/category/create', icon: FiGrid, color: '#8B5CF6' },
    { title: 'View Reports', href: '/dashboard/admin/reports', icon: FiBarChart2, color: '#10B981' },
  ];

  // Recent activities
  const recentActivities = [
    { icon: FiCheckCircle, title: 'New Order Received', description: 'Full Stack Course purchased by রহিম উদ্দিন', time: '2 min ago', color: '#10B981' },
    { icon: FiUsers, title: 'New Student Registered', description: 'করিম হাসান joined MotionBoss', time: '15 min ago', color: '#3B82F6' },
    { icon: FiBook, title: 'Course Updated', description: 'React Native Course content updated', time: '1 hour ago', color: '#F59E0B' },
    { icon: FiDownload, title: 'Download Request', description: 'Premium Template downloaded', time: '2 hours ago', color: '#8B5CF6' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheckCircle />;
      case 'pending': return <FiClock />;
      case 'processing': return <FiRefreshCw className="animate-spin" />;
      default: return <FiAlertCircle />;
    }
  };

  const downloadReport = async (type) => {
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/analytics/download/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        {/* ==================== HEADER ==================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Central</h1>
            <p className="text-slate-500 mt-1">Real-time platform performance & analytics.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadReport('sales')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-all shadow-lg shadow-slate-200"
            >
              <FiDownload />
              Export CSV
            </button>
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
              Sync
            </button>
          </div>
        </div>

        {/* ==================== MAIN STATS ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {mainStats.map((stat) => (
            <StatsCard key={stat.title} {...stat} loading={loading} />
          ))}
        </div>

        {/* ==================== CHARTS ROW ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Revenue Overview</h2>
                <p className="text-sm text-slate-500">Monthly revenue breakdown</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-600 text-sm font-semibold">
                <FiTrendingUp />
                +18.2%
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between gap-4 h-48">
                {(revenueHistory.length > 0 ? revenueHistory : revenueData).map((item, idx) => (
                  <ChartBar
                    key={idx}
                    label={item.month}
                    value={item.value}
                    maxValue={maxRevenue || 1}
                    color="#10B981"
                    subLabel={item.label}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500"></div>
                    <span className="text-sm text-slate-600">Revenue</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  Total: ৳{(dashboardData.totalRevenue).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Chart - Using mock peaks for now as backend doesn't provide daily enrollments yet */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Enrollment Trends</h2>
                <p className="text-sm text-slate-500">Current active student flow</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg text-blue-600 text-sm font-semibold">
                <FiTrendingUp />
                +{dashboardData.enrollmentsThisMonth || 0}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between gap-4 h-48">
                {[45, 62, 58, 74, 90, 110].map((val, idx) => (
                  <ChartBar
                    key={idx}
                    label={['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
                    value={val}
                    maxValue={120}
                    color="#3B82F6"
                    subLabel={`${val} students`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span className="text-sm text-slate-600">Growth</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  Monthly New: {dashboardData.enrollmentsThisMonth || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== MIDDLE SECTION ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Product Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Content Stats</h2>
            <div className="space-y-4">
              {productStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <Icon style={{ color: stat.color }} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{stat.title}</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800">
                      {loading ? '...' : stat.value.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Courses */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Top Content</h2>
              <Link href="/dashboard/admin/course" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading...</div>
              ) : topCourses.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No content found</div>
              ) : (
                topCourses.map((course, idx) => (
                  <div key={course._id || idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800 truncate">{course.title}</h3>
                      <p className="text-xs text-slate-500">{course.salesCount || 0} sales</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">৳{course.price || course.fee || 0}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all group"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${action.color}15` }}
                      >
                        <Icon className="text-xl" style={{ color: action.color }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 text-center">{action.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Live Stats Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium opacity-80">Live Stats</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">Today's Revenue</span>
                  <span className="text-xl font-bold">৳{(dashboardData.todayRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">This Month</span>
                  <span className="text-xl font-bold">৳{(dashboardData.monthlyRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">New Users (Month)</span>
                  <span className="text-xl font-bold">+{dashboardData.newUsersThisMonth || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== BOTTOM SECTION ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
              <Link href="/dashboard/admin/orders" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="text-left p-4 font-semibold">Order ID</th>
                    <th className="text-left p-4 font-semibold">Customer</th>
                    <th className="text-left p-4 font-semibold">Product</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-semibold text-slate-800">{order.id}</td>
                      <td className="p-4 text-sm text-slate-600">{order.customer}</td>
                      <td className="p-4 text-sm text-slate-600 max-w-[200px] truncate">{order.product}</td>
                      <td className="p-4 text-sm font-bold text-emerald-600">৳{order.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <FiMoreVertical className="text-slate-400" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity, idx) => (
                <ActivityItem key={idx} {...activity} />
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <button className="w-full py-2.5 text-sm text-teal-600 hover:text-teal-700 font-medium hover:bg-teal-50 rounded-xl transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
