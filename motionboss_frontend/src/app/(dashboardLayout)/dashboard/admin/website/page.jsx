'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiSearch, FiGlobe, FiTag, FiCheckCircle, FiClock,
    FiAlertTriangle, FiTrash2, FiEdit2, FiEye, FiDownload
} from 'react-icons/fi';

export default function WebsiteAdminPage() {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchWebsites = async () => {
        const BASE_URL = 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/websites`, {
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
            const res = await fetch(`${BASE_URL}/websites/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchWebsites();
        } catch (err) { alert("Delete failed"); }
    };

    const filtered = websites.filter(w =>
        w.title?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><FiCheckCircle size={10} /> Approved</span>;
            case 'pending': return <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><FiClock size={10} /> Pending</span>;
            default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest">{status}</span>;
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 outfit tracking-tight">Marketplace: Websites</h1>
                    <p className="text-slate-500 text-sm font-medium italic">Manage premium website templates and digital assets</p>
                </div>
                <Link href="/dashboard/admin/website/create">
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-2xl shadow-xl transition-all hover:scale-105">
                        <FiPlus size={18} /> Add Website
                    </button>
                </Link>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white outline-none text-sm font-bold transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                        <FiGlobe /> {websites.length} Assets
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/50"></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FiGlobe className="text-4xl text-slate-200" />
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching assets found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(w => (
                                <tr key={w._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                                                {w.images?.[0] ? <img src={w.images[0]} className="w-full h-full object-cover" /> : <FiGlobe className="m-auto text-slate-300" size={24} />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-slate-800 line-clamp-1">{w.title}</h4>
                                                <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">{w.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><FiTag size={12} className="text-slate-400" /> {w.category?.name || 'Uncategorized'}</p>
                                            <p className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded-md inline-block uppercase tracking-tighter italic">{w.platform?.name || 'Web'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-black text-slate-800">৳{w.price.toLocaleString()}</p>
                                            {w.offerPrice && <p className="text-[10px] text-rose-400 font-bold line-through">৳{w.offerPrice.toLocaleString()}</p>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(w.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={w.previewUrl || '#'} target="_blank" className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-xl transition-all border border-slate-100"><FiEye size={14} /></Link>
                                            <Link href={`/dashboard/admin/website/edit/${w._id}`} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-800 rounded-xl transition-all border border-slate-100"><FiEdit2 size={14} /></Link>
                                            <button onClick={() => handleDelete(w._id)} className="p-2.5 bg-rose-50 text-rose-300 hover:text-rose-600 rounded-xl transition-all border border-rose-100"><FiTrash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
