'use client';

import React, { useEffect, useState } from 'react';
import {
    FiPackage, FiDownload, FiClock, FiCheckCircle,
    FiXCircle, FiRefreshCw, FiShoppingBag, FiExternalLink,
    FiTrendingUp, FiCreditCard, FiArrowRight, FiActivity
} from 'react-icons/fi';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserPurchasesPage() {
    const { isDark } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        const BASE_URL = 'http://localhost:5000/api';

        try {
            if (!isRefreshing) setLoading(true);
            const res = await fetch(`${BASE_URL}/orders/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data.data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchOrders();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        <FiCheckCircle size={12} /> Verified
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                        <FiClock size={12} /> Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
                        <FiXCircle size={12} /> Failed
                    </span>
                );
            default:
                return <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">{status}</span>;
        }
    };

    if (loading && !isRefreshing) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className={`text-sm font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Loading ledger...</p>
            </div>
        );
    }

    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className={`relative p-8 rounded-[2.5rem] overflow-hidden border transition-all ${isDark
                    ? 'bg-slate-900/40 border-white/5 shadow-2xl shadow-indigo-500/10'
                    : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'
                }`}>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                            <FiActivity size={12} />
                            Transaction History
                        </div>
                        <h1 className={`text-3xl md:text-4xl font-black outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Purchase <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Ledger</span>
                        </h1>
                        <p className={`text-sm max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Review your order history, manage invoices, and track your recent investments in learning.
                        </p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg active:scale-95 ${isDark
                                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 shadow-black/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-200/50'
                            }`}
                    >
                        <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} />
                        Sync Data
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Orders</p>
                    <div className="flex items-end gap-2">
                        <p className={`text-3xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>{orders.length}</p>
                        <span className="text-xs font-bold text-indigo-500 mb-1">Transactions</span>
                    </div>
                </div>
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Success Rate</p>
                    <div className="flex items-end gap-2">
                        <p className={`text-3xl font-black outfit text-emerald-500`}>
                            {orders.length ? Math.round((orders.filter(o => o.paymentStatus === 'completed').length / orders.length) * 100) : 0}%
                        </p>
                        <FiTrendingUp className="text-emerald-500 mb-1.5" />
                    </div>
                </div>
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Capital Invested</p>
                    <div className="flex items-end gap-2">
                        <p className={`text-3xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>৳{totalSpent.toLocaleString()}</p>
                        <FiCreditCard className="text-indigo-500 mb-1.5" />
                    </div>
                </div>
            </div>

            {/* Orders Feed */}
            {orders.length === 0 ? (
                <div className={`text-center py-20 rounded-[3rem] border-2 border-dashed ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                        <FiShoppingBag className="text-slate-300" size={40} />
                    </div>
                    <h3 className={`text-2xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>No Purchases Yet</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">Your purchase history is waiting for your first order. Explore our catalog today.</p>
                    <Link href="/courses" className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/30 hover:bg-indigo-600 transition-all">
                        Discover Courses <FiArrowRight />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, idx) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`group rounded-[2rem] border overflow-hidden transition-all duration-300 ${isDark
                                    ? 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 shadow-2xl shadow-black/20'
                                    : 'bg-white border-slate-200/60 hover:shadow-2xl shadow-slate-200/40'
                                }`}
                        >
                            {/* Order Header */}
                            <div className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black outfit ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'}`}>
                                        #
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Reference ID</p>
                                        <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>ORD-{order.orderNumber || order._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction Date</p>
                                        <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {new Date(order.orderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    {getStatusBadge(order.paymentStatus)}
                                    <div className={`px-4 py-2 rounded-2xl min-w-[100px] text-center ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'} font-black outfit`}>
                                        ৳{order.totalAmount?.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items?.map((item, id) => (
                                        <div key={id} className={`flex items-center gap-5 p-4 rounded-3xl transition-all ${isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-100 group-hover:shadow-sm'}`}>
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                                                <img
                                                    src={item.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200'}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-indigo-500 text-white">
                                                        {item.productType}
                                                    </span>
                                                </div>
                                                <h4 className={`text-sm font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                    Unit ID: {item.productId?.slice(-8).toUpperCase()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>৳{item.price?.toLocaleString()}</p>
                                                {order.paymentStatus === 'completed' && (
                                                    <Link
                                                        href={`/dashboard/user/${item.productType === 'course' ? 'courses' : 'assets/' + (item.productType === 'software' ? 'softwares' : 'websites')}`}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 hover:underline"
                                                    >
                                                        Access Vault <FiArrowRight size={10} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Transaction Metadata */}
                                <div className="mt-6 flex flex-wrap items-center gap-6 pt-6 border-t border-dashed border-slate-700/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Method: {order.paymentMethod || 'Dynamic'}</span>
                                    </div>
                                    {order.transactionId && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TXN: {order.transactionId}</span>
                                        </div>
                                    )}
                                    <div className="flex-1" />
                                    <button className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'} transition-colors`}>
                                        <FiDownload /> Download Invoice
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

