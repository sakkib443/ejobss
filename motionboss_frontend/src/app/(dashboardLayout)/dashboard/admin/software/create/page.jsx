'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    FiArrowLeft, FiSave, FiLoader, FiTerminal, FiZap,
    FiPackage, FiSettings, FiTag, FiPlus, FiTrash2, FiFileText, FiCpu
} from 'react-icons/fi';
import Link from 'next/link';

const softwareSchema = z.object({
    title: z.string().min(1, "Title is required"),
    platform: z.string().min(1, "Platform is required"),
    category: z.string().min(1, "Category is required"),
    softwareType: z.string().min(1, "Software type is required"),
    version: z.string().min(1, "Version is required"),
    price: z.coerce.number().min(0),
    regularLicensePrice: z.coerce.number().min(0),
    extendedLicensePrice: z.coerce.number().min(0).optional(),
    offerPrice: z.coerce.number().min(0).optional(),
    description: z.string().min(1, "Description is required"),
    images: z.array(z.string().url()).min(1),
    downloadFile: z.string().min(1, "Binary download path required"),
    documentationUrl: z.string().url().optional().or(z.literal('')),
    features: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'draft']),
});

export default function CreateSoftwarePage() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const router = useRouter();

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(softwareSchema),
        defaultValues: {
            status: 'approved',
            version: '1.0.0',
            softwareType: 'Plugin/Script',
            images: [''],
            features: [''],
            requirements: [''],
            technologies: [''],
        }
    });

    const featureFields = useFieldArray({ control, name: 'features' });
    const requirementFields = useFieldArray({ control, name: 'requirements' });
    const techFields = useFieldArray({ control, name: 'technologies' });
    const imageFields = useFieldArray({ control, name: 'images' });

    useEffect(() => {
        const fetchData = async () => {
            const BASE_URL = 'http://localhost:5000/api';
            try {
                const [catRes, platRes] = await Promise.all([
                    fetch(`${BASE_URL}/categories`),
                    fetch(`${BASE_URL}/platforms`)
                ]);
                const catData = await catRes.json();
                const platData = await platRes.json();
                setCategories(catData.data || []);
                setPlatforms(platData.data || []);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const onSubmit = async (values) => {
        setLoading(true);
        const BASE_URL = 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const payload = { ...values, author: user._id };

        try {
            const response = await fetch(`${BASE_URL}/software`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Software successfully published! 🚀');
                router.push('/dashboard/admin/software');
            } else {
                const err = await response.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) { alert('Network error'); }
        finally { setLoading(false); }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none text-sm transition-all bg-white font-medium text-slate-700 placeholder:text-slate-300";
    const labelClass = "block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest";
    const cardClass = "bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6";

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10">
            <div className="max-w-6xl mx-auto pb-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/admin/software" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                            <FiArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 outfit tracking-tight">Binary Deployment</h1>
                            <p className="text-slate-500 text-sm italic">Publishing a new software artifact to the ecosystem</p>
                        </div>
                    </div>
                    <button onClick={handleSubmit(onSubmit)} disabled={loading} className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all disabled:opacity-50 active:scale-95">
                        {loading ? 'Synthesizing...' : <><FiZap /> Deploy Artifact</>}
                    </button>
                </div>

                <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Body */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2 flex items-center gap-2"><FiPackage /> Technical Identity</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Artifact Title</label>
                                    <input {...register('title')} placeholder="e.g. Motion Engine Pro 2025" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Version String</label>
                                    <div className="relative">
                                        <FiSettings className="absolute left-4 top-3.5 text-slate-300" />
                                        <input {...register('version')} className={`${inputClass} pl-10 font-mono`} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Artifact Classification</label>
                                    <input {...register('softwareType')} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2 flex items-center gap-2"><FiCpu /> Execution Context</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Requirements */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className={labelClass}>Environment Requirements</label>
                                        <button type="button" onClick={() => requirementFields.append('')} className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter underline">+ Add Spec</button>
                                    </div>
                                    <div className="space-y-2">
                                        {requirementFields.fields.map((f, i) => (
                                            <div key={f.id} className="flex gap-2">
                                                <input {...register(`requirements.${i}`)} className={inputClass} placeholder="e.g. Windows 10+" />
                                                <button type="button" onClick={() => requirementFields.remove(i)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Technologies */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className={labelClass}>Built With</label>
                                        <button type="button" onClick={() => techFields.append('')} className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter underline">+ Add Stack</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {techFields.fields.map((f, i) => (
                                            <div key={f.id} className="relative group">
                                                <input {...register(`technologies.${i}`)} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold w-24 outline-none focus:bg-white focus:border-slate-300 transition-all shadow-inner" />
                                                <button type="button" onClick={() => techFields.remove(i)} className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all bg-rose-500 text-white rounded-full p-0.5"><FiTrash2 size={8} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2 flex items-center gap-2"><FiFileText /> Functional Narrative</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className={labelClass}>Capabilities (Features)</label>
                                    <div className="space-y-2">
                                        {featureFields.fields.map((f, i) => (
                                            <div key={f.id} className="flex gap-2">
                                                <input {...register(`features.${i}`)} className={inputClass} placeholder={`Capability #${i + 1}...`} />
                                                <button type="button" onClick={() => featureFields.remove(i)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => featureFields.append('')} className="w-full py-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest hover:bg-slate-100 transition-all">+ Register New Capability</button>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Broad Documentation / Description</label>
                                    <textarea {...register('description')} rows={8} className={`${inputClass} resize-none leading-relaxed`}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl space-y-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5"><FiPlus size={100} /></div>
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-outfit border-b border-slate-800 pb-4">Revenue Engine</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1.5">Baseline License (BDT)</label>
                                    <input type="number" {...register('price')} className="w-full bg-slate-800 border-none rounded-2xl py-4 px-5 text-xl font-mono font-black" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase block mb-1.5">Regular Lic.</label>
                                        <input type="number" {...register('regularLicensePrice')} className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-mono font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase block mb-1.5">Extended Lic.</label>
                                        <input type="number" {...register('extendedLicensePrice')} className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-mono font-bold" />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Status</span>
                                    <select {...register('status')} className="bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-bold text-emerald-400">
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                        <option value="draft">Review</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4 mb-2">Artifact Storage</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Binary Repository Path</label>
                                    <input {...register('downloadFile')} className={inputClass} placeholder="Cloud link..." />
                                </div>
                                <div>
                                    <label className={labelClass}>Gallery Manifest (Image URL)</label>
                                    <div className="space-y-2">
                                        {imageFields.fields.map((f, i) => (
                                            <div key={f.id} className="flex gap-2">
                                                <input {...register(`images.${i}`)} className={inputClass} />
                                                <button type="button" onClick={() => imageFields.remove(i)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => imageFields.append('')} className="text-[9px] font-black text-indigo-600 underline tracking-tighter uppercase">+ Push Visual</button>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Documentation Portal</label>
                                    <input {...register('documentationUrl')} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4 mb-2">Taxonomy</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Host Lifecycle</label>
                                    <select {...register('platform')} className={inputClass}>
                                        <option value="">Select Platform</option>
                                        {platforms.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Segment Categorization</label>
                                    <select {...register('category')} className={inputClass}>
                                        <option value="">Select Genre</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
