'use client';

import React, { useState, useEffect } from 'react';
import {
    FiDownload, FiFileText, FiPieChart, FiShoppingBag,
    FiUsers, FiCalendar, FiFilter, FiCheckCircle, FiActivity
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [stats, setStats] = useState(null);

    const BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const [dashboardRes, recentRes, topRes] = await Promise.all([
                    fetch(`${BASE_URL}/analytics/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${BASE_URL}/analytics/recent-purchases?limit=50`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${BASE_URL}/analytics/top-products?limit=20`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                const dashboardData = await dashboardRes.json();
                const recentData = await recentRes.json();
                const topData = await topRes.json();

                setStats({
                    summary: dashboardData.data,
                    recent: recentData.data || [],
                    top: topData.data || []
                });
            } catch (err) {
                console.error('Error fetching data for reports:', err);
            }
        };
        fetchStats();
    }, []);

    const reportTypes = [
        {
            id: 'revenue',
            title: 'Revenue Analysis',
            description: 'Comprehensive revenue breakdown and financial summary.',
            icon: FiPieChart,
            color: 'bg-indigo-500',
            format: 'PDF'
        },
        {
            id: 'orders',
            title: 'Sales & Orders',
            description: 'List of all recent transactions and order status report.',
            icon: FiShoppingBag,
            color: 'bg-emerald-500',
            format: 'PDF'
        },
        {
            id: 'users',
            title: 'User Report',
            description: 'General user statistics and platform growth overview.',
            icon: FiUsers,
            color: 'bg-blue-500',
            format: 'PDF'
        },
        {
            id: 'inventory',
            title: 'Course Portfolio',
            description: 'Detailed list of courses, websites and software products.',
            icon: FiFileText,
            color: 'bg-amber-500',
            format: 'PDF'
        }
    ];

    const generatePDF = (type) => {
        if (!stats) return;
        setDownloadingId(type);

        try {
            const doc = new jsPDF();
            const timestamp = new Date().toLocaleString();

            // Header
            doc.setFillColor(79, 70, 229); // Indigo 600
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text('MOTION BOSS PLATFORM REPORT', 15, 20);
            doc.setFontSize(10);
            doc.text(`Generated on: ${timestamp}`, 15, 30);
            doc.text(`Report Type: ${type.toUpperCase()}`, 170, 30, { align: 'right' });

            if (type === 'revenue' || type === 'summary') {
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(16);
                doc.text('Financial Summary', 15, 55);

                const summaryData = [
                    ['Total Revenue', `৳${stats.summary?.totalRevenue?.toLocaleString()}`],
                    ['Monthly Revenue', `৳${stats.summary?.monthlyRevenue?.toLocaleString()}`],
                    ['Total Orders', stats.summary?.totalOrdersCount?.toString()],
                    ['Pending Orders', stats.summary?.pendingOrders?.toString()]
                ];

                doc.autoTable({
                    startY: 65,
                    head: [['Category', 'Value']],
                    body: summaryData,
                    theme: 'striped',
                    headStyles: { fillColor: [79, 70, 229] }
                });
            }

            if (type === 'orders' || type === 'summary') {
                const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 55;
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(16);
                doc.text('Recent Orders', 15, startY);

                const orderRows = stats.recent.map(order => [
                    new Date(order.orderDate).toLocaleDateString(),
                    `${order.user?.firstName || ''} ${order.user?.lastName || ''}`,
                    order.items?.[0]?.title || 'Product',
                    `৳${order.totalAmount?.toLocaleString()}`,
                    order.paymentStatus.toUpperCase()
                ]);

                doc.autoTable({
                    startY: startY + 10,
                    head: [['Date', 'Customer', 'Product', 'Amount', 'Status']],
                    body: orderRows,
                    theme: 'grid',
                    headStyles: { fillColor: [16, 185, 129] } // Emerald 500
                });
            }

            if (type === 'inventory' || type === 'top' || type === 'summary') {
                const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 55;
                if (startY > 250) doc.addPage();

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(16);
                doc.text('Top Performing Products', 15, startY > 250 ? 20 : startY);

                const productRows = stats.top.map(p => [
                    p.title,
                    p.category?.name || 'Category',
                    p.salesCount?.toString() || '0',
                    `৳${p.price?.toLocaleString()}`,
                    `৳${((p.salesCount || 0) * (p.price || 0)).toLocaleString()}`
                ]);

                doc.autoTable({
                    startY: (startY > 250 ? 20 : startY) + 10,
                    head: [['Product Name', 'Category', 'Sales', 'Price', 'Revenue']],
                    body: productRows,
                    theme: 'striped',
                    headStyles: { fillColor: [245, 158, 11] } // Amber 500
                });
            }

            if (type === 'users' || type === 'summary') {
                const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 55;
                if (startY > 250) doc.addPage();

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(16);
                doc.text('User Statistics', 15, startY > 250 ? 20 : startY);

                const userData = [
                    ['Total Students', stats.summary?.totalStudents?.toString()],
                    ['New Users (This Month)', stats.summary?.newUsersThisMonth?.toString()],
                    ['Active Enrollments', stats.summary?.activeEnrollments?.toString()]
                ];

                doc.autoTable({
                    startY: (startY > 250 ? 20 : startY) + 10,
                    head: [['Indicator', 'Count']],
                    body: userData,
                    theme: 'grid',
                    headStyles: { fillColor: [59, 130, 246] } // Blue 500
                });
            }

            doc.save(`MotionBoss_${type}_Report_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please check console for details.');
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDownload = (id) => {
        generatePDF(id);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Download Reports</h1>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-poppins mt-1`}>Export your platform data into professional reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium shadow-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                        }`}>
                        <FiCalendar className="text-indigo-500" />
                        <span>Last 30 Days</span>
                    </div>
                    <button className="p-2 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
                        <FiFilter size={20} />
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={`p-6 rounded-3xl ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'} border flex flex-col md:flex-row items-center justify-between gap-6`}>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                        <FiActivity size={32} />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Monthly Performance Summary</h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Generate a comprehensive audit-ready report for the current month.</p>
                    </div>
                </div>
                <button
                    onClick={() => handleDownload('summary')}
                    className="w-full md:w-auto px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 group active:scale-95"
                >
                    {downloadingId === 'summary' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <FiFileText className="group-hover:rotate-12 transition-transform" />
                    )}
                    Generate Full Audit
                </button>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTypes.map((report) => (
                    <div key={report.id} className={`backdrop-blur-sm rounded-3xl p-6 border transition-all group ${isDark ? 'bg-black/40 border-slate-800 shadow-none' : 'bg-white/80 border-slate-200/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl'
                        }`}>
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 ${report.color} rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                <report.icon size={24} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Available Formats</span>
                                <div className="flex gap-2">
                                    {report.format.split(', ').map(f => (
                                        <span key={f} className={`px-2 py-1 text-[10px] font-bold rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                                            }`}>
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <h3 className={`text-xl font-bold mb-2 font-outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>{report.title}</h3>
                        <p className={`text-sm mb-8 font-poppins leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {report.description}
                        </p>

                        <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-2 text-emerald-500">
                                <FiCheckCircle size={16} />
                                <span className="text-xs font-bold uppercase tracking-wide">Ready to Export</span>
                            </div>
                            <button
                                onClick={() => handleDownload(report.id)}
                                disabled={downloadingId !== null}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${downloadingId === report.id
                                        ? (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400')
                                        : (isDark ? 'bg-white text-slate-950 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg')
                                    }`}
                            >
                                {downloadingId === report.id ? (
                                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                                ) : (
                                    <FiDownload />
                                )}
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Help Section */}
            <div className={`text-center p-8 rounded-3xl border border-dashed ${isDark ? 'bg-black/20 border-slate-700' : 'bg-white/40 border-slate-300'
                }`}>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm`}>
                    Can't find the data you need? <button className="text-indigo-500 font-bold hover:underline">Request a Custom Report</button>
                </p>
            </div>
        </div>
    );
};

export default ReportsPage;
