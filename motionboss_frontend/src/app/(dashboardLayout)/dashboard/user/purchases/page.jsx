'use client';

import React, { useEffect, useState } from 'react';
import { LuPackage, LuDownload, LuClock, LuCircleCheck, LuCircleX, LuRefreshCw, LuShoppingBag, LuExternalLink } from 'react-icons/lu';
import Link from 'next/link';

export default function UserPurchasesPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        const BASE_URL = 'http://localhost:5000/api';

        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/orders/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data.data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-semibold flex items-center gap-1"><LuCircleCheck size={12} /> Completed</span>;
            case 'pending':
                return <span className="px-2.5 py-1 bg-amber-100 text-amber-600 rounded-lg text-xs font-semibold flex items-center gap-1"><LuClock size={12} /> Pending</span>;
            case 'failed':
                return <span className="px-2.5 py-1 bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1"><LuCircleX size={12} /> Failed</span>;
            default:
                return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <LuPackage className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">My Purchases</h1>
                        <p className="text-sm text-slate-500">Your order history and downloads</p>
                    </div>
                </div>
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                >
                    <LuRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
                    <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
                    <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Completed</p>
                    <p className="text-2xl font-bold text-emerald-600">{orders.filter(o => o.paymentStatus === 'completed').length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
                    <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-slate-800">৳{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 animate-pulse">
                            <div className="h-5 bg-slate-100 rounded w-1/4 mb-3"></div>
                            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LuShoppingBag className="text-slate-300 text-3xl" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Purchases Yet</h3>
                    <p className="text-slate-500 mb-6">You haven't made any purchases. Start shopping now!</p>
                    <Link href="/software" className="px-6 py-2.5 bg-[#41bfb8] text-white rounded-xl font-semibold hover:bg-[#38a89d] transition-all">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg transition-all">
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Order #{order.orderNumber}</p>
                                    <p className="text-sm text-slate-400">{new Date(order.orderDate).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(order.paymentStatus)}
                                    <span className="text-lg font-bold text-slate-800">৳{order.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                    <LuPackage className="text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-800 truncate">{item.title}</h4>
                                            <p className="text-xs text-slate-400 capitalize">{item.productType}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-700">৳{item.price?.toLocaleString()}</span>
                                            {order.paymentStatus === 'completed' && (
                                                <Link
                                                    href={`/${item.productType}/${item.product}`}
                                                    className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-all"
                                                    title="View Product"
                                                >
                                                    <LuExternalLink size={16} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
