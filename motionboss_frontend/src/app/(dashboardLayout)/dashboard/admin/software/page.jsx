'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiSearch, FiMonitor, FiTag, FiCheckCircle, FiClock,
    FiTrash2, FiEdit2, FiTerminal, FiZap, FiDownload
} from 'react-icons/fi';

export default function SoftwareAdminPage() {
    const [softwares, setSoftwares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchSoftwares = async () => {
        const BASE_URL = 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/software`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setSoftwares(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSoftwares(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Remove this software from inventory?")) return;
        const BASE_URL = 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BASE_URL}/software/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchSoftwares();
        } catch (err) { alert("Delete failed"); }
    };

    const filtered = softwares.filter(s =>
        s.title?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-2 py-0.5 bg-sky-100 text-sky-600 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><FiCheckCircle size={10} /> Live</span>;
            case 'pending': return <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><FiClock size={10} /> Review</span>;
            default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest">{status}</span>;
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 outfit tracking-tight">Marketplace: Software</h1>
                    <p className="text-slate-500 text-sm font-medium italic">High-performance tools, plugins and standalone binary assets</p>
                </div>
                <Link href="/dashboard/admin/software/create">
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
                        <FiPlus size={18} /> Add Dynamic Software
                    </button>
                </Link>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                {/* Background Decorative */}
                <div className="absolute top-0 right-0 p-4 opacity-5"><FiTerminal size={100} /></div>

                <div className="relative flex-1 z-10">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        placeholder="Search binaries & tools..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-slate-300 outline-none text-sm font-bold transition-all placeholder:text-slate-300"
                    />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="px-5 py-3 bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest border border-slate-700 flex items-center gap-2 shadow-lg">
                        <FiMonitor /> {softwares.length} Binaries
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-outfit">Software Artifact</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-outfit">Architecture</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-outfit">Revenue</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-outfit">Visibility</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-outfit text-right">Operation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-5 h-20"></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                                <FiMonitor className="text-3xl text-slate-200" />
                                            </div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">No toolkits in inventory</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(s => (
                                <tr key={s._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500 flex items-center justify-center p-2">
                                                {s.images?.[0] ? <img src={s.images[0]} className="w-full h-full object-contain" /> : <FiZap className="text-amber-400" size={24} />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-[13px] font-black text-slate-800 italic">{s.title}</h4>
                                                <div className="flex items-center gap-2 mt-1.5 font-mono text-[9px] text-slate-400 bg-slate-100 w-fit px-1.5 py-0.5 rounded">
                                                    <FiTerminal size={8} /> {s.version || 'v1.0.0'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-1.5">
                                            <p className="text-[11px] font-bold text-slate-600 flex items-center gap-2 tracking-tight"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> {s.category?.name || 'Utility'}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3.5 italic">{s.platform?.name || 'Standalone'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div>
                                            <p className="text-sm font-black text-slate-800 font-mono">৳{s.price.toLocaleString()}</p>
                                            {s.offerPrice && <p className="text-[9px] text-indigo-400 font-black tracking-tighter">OFFER ACTIVE</p>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {getStatusBadge(s.status)}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <Link href={`/dashboard/admin/software/edit/${s._id}`} className="p-3 bg-white text-slate-400 hover:text-slate-800 rounded-2xl transition-all border border-slate-100 shadow-sm hover:shadow-md"><FiEdit2 size={15} /></Link>
                                            <button onClick={() => handleDelete(s._id)} className="p-3 bg-rose-50 text-rose-300 hover:text-rose-600 rounded-2xl transition-all border border-rose-100 shadow-sm hover:shadow-md"><FiTrash2 size={15} /></button>
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
