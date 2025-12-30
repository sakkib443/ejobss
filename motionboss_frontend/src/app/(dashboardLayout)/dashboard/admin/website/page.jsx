'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiSearch, FiGlobe, FiTag, FiCheckCircle, FiClock,
    FiTrash2, FiEdit2, FiEye, FiRefreshCw, FiLayout, FiStar
} from 'react-icons/fi';

export default function WebsiteAdminPage() {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchWebsites = async () => {
        const BASE_URL = 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/websites/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setWebsites(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWebsites(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Remove this marketplace product?")) return;
        const BASE_URL = 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BASE_URL}/websites/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchWebsites();
        } catch (err) { alert("Delete failed"); }
    };

    const filtered = websites.filter(w => {
        const matchSearch = w.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || w.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><FiCheckCircle size={11} /> Live</span>;
            case 'pending': return <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><FiClock size={11} /> Pending</span>;
            case 'draft': return <span className="px-3 py-1 bg-slate-500/10 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Draft</span>;
            default: return <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{status}</span>;
        }
    };

    const stats = {
        total: websites.length,
        live: websites.filter(w => w.status === 'approved').length,
        pending: websites.filter(w => w.status === 'pending').length,
        featured: websites.filter(w => w.isFeatured).length,
    };

    return (
        <div className="p-6 md:p-10 space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <FiGlobe className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 outfit tracking-tight">Website Templates</h1>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Premium Theme Marketplace</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchWebsites} className="p-3.5 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 shadow-sm transition-all hover:scale-105">
                        <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <Link href="/dashboard/admin/website/create">
                        <button className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95">
                            <FiPlus size={18} /> New Website
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                        <FiLayout className="text-white" size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Templates</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <FiCheckCircle className="text-white" size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{stats.live}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Published</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <FiClock className="text-white" size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{stats.pending}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <FiStar className="text-white" size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{stats.featured}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Featured</p>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="Search templates by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-medium transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'approved', 'pending', 'draft'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-pulse">
                            <div className="h-48 bg-slate-100"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center">
                            <FiGlobe className="text-4xl text-slate-300" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-600">No Websites Found</p>
                            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or add new template</p>
                        </div>
                        <Link href="/dashboard/admin/website/create">
                            <button className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all">
                                <FiPlus size={14} /> Create Website
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map(w => (
                        <div key={w._id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                {w.images?.[0] ? (
                                    <img src={w.images[0]} alt={w.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                                        <FiGlobe className="text-4xl text-slate-300" />
                                    </div>
                                )}
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                                    <div className="flex gap-2 w-full">
                                        {w.previewUrl && (
                                            <Link href={w.previewUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-white/90 backdrop-blur text-slate-800 py-2.5 rounded-xl text-xs font-bold hover:bg-white transition-all">
                                                <FiEye size={14} /> Preview
                                            </Link>
                                        )}
                                        <Link href={`/dashboard/admin/website/edit/${w._id}`} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all">
                                            <FiEdit2 size={14} /> Edit
                                        </Link>
                                    </div>
                                </div>
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {w.isFeatured && (
                                        <span className="px-2 py-1 bg-amber-500 text-white text-[9px] font-black uppercase rounded-lg flex items-center gap-1">
                                            <FiStar size={10} /> Featured
                                        </span>
                                    )}
                                </div>
                                <div className="absolute top-3 right-3">
                                    {getStatusBadge(w.status)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-sm font-black text-slate-800 line-clamp-1 mb-2">{w.title}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">{w.category?.name || 'Web'}</span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase">{w.platform?.name || 'HTML'}</span>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div>
                                        <p className="text-lg font-black text-slate-800">৳{w.price?.toLocaleString()}</p>
                                        {w.offerPrice && <p className="text-[10px] text-rose-400 font-bold line-through">৳{w.offerPrice.toLocaleString()}</p>}
                                    </div>
                                    <button onClick={() => handleDelete(w._id)} className="p-2.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-400 rounded-xl transition-all">
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
