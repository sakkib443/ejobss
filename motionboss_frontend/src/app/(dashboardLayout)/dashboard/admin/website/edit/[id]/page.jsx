'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    FiArrowLeft, FiSave, FiLoader, FiImage, FiGlobe,
    FiLayers, FiTag, FiDollarSign, FiPlus, FiTrash2, FiEye
} from 'react-icons/fi';
import Link from 'next/link';

const websiteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    platform: z.string().min(1, "Platform is required"),
    category: z.string().min(1, "Category is required"),
    projectType: z.string().min(1, "Project type is required"),
    price: z.coerce.number().min(0),
    offerPrice: z.coerce.number().min(0).optional(),
    description: z.string().min(1, "Description is required").max(1000),
    longDescription: z.string().optional(),
    images: z.array(z.string().url()).min(1, "At least one image URL required"),
    previewUrl: z.string().url().optional().or(z.literal('')),
    downloadFile: z.string().min(1, "Download file URL/Path is required"),
    features: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'draft']),
    isFeatured: z.boolean(),
});

export default function EditWebsitePage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const router = useRouter();
    const { id } = useParams();

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(websiteSchema)
    });

    const imageFields = useFieldArray({ control, name: 'images' });
    const featureFields = useFieldArray({ control, name: 'features' });
    const techFields = useFieldArray({ control, name: 'technologies' });

    const fetchData = useCallback(async () => {
        const BASE_URL = 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        try {
            setFetching(true);
            const [catRes, platRes, assetRes] = await Promise.all([
                fetch(`${BASE_URL}/categories`),
                fetch(`${BASE_URL}/platforms`),
                fetch(`${BASE_URL}/websites/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            const catData = await catRes.json();
            const platData = await platRes.json();
            const assetData = await assetRes.json();

            setCategories(catData.data || []);
            setPlatforms(platData.data || []);

            const asset = assetData.data;
            if (asset) {
                reset({
                    ...asset,
                    category: asset.category?._id || asset.category,
                    platform: asset.platform?._id || asset.platform,
                    images: asset.images?.length ? asset.images : [''],
                    features: asset.features?.length ? asset.features : [''],
                    technologies: asset.technologies?.length ? asset.technologies : [''],
                });
            }
        } catch (err) { console.error(err); }
        finally { setFetching(false); }
    }, [id, reset]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const onSubmit = async (values) => {
        setLoading(true);
        const BASE_URL = 'http://localhost:5000/api';
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${BASE_URL}/websites/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                alert('Asset updated successfully! ✅');
                router.push('/dashboard/admin/website');
            } else {
                const err = await response.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) { alert('Network error'); }
        finally { setLoading(false); }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none text-sm transition-all bg-white font-medium text-slate-700";
    const labelClass = "block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest";
    const cardClass = "bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6";

    if (fetching) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <FiLoader className="animate-spin text-slate-800" size={40} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Retrieving Asset Metadata...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10">
            <div className="max-w-5xl mx-auto pb-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/admin/website" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                            <FiArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 outfit">Modify Asset</h1>
                            <p className="text-slate-500 text-sm italic tracking-tight">Updating: <span className="font-mono text-slate-400 uppercase">{id?.slice(-8)}</span></p>
                        </div>
                    </div>
                    <button onClick={handleSubmit(onSubmit)} disabled={loading} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all disabled:opacity-50">
                        {loading ? 'Updating...' : <><FiSave /> Commit Changes</>}
                    </button>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="md:col-span-2 space-y-8">
                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Core Identity</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Asset Title</label>
                                    <input {...register('title')} className={inputClass} />
                                    {errors.title && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.title.message}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Project Type</label>
                                        <input {...register('projectType')} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Lifecycle Status</label>
                                        <select {...register('status')} className={inputClass}>
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                            <option value="draft">Draft</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Extended Specification</h2>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className={labelClass}>Tooling Ecosystem</label>
                                    <button type="button" onClick={() => techFields.append('')} className="text-[10px] font-black underline text-slate-800 tracking-tighter hover:text-indigo-600">+ EXTEND STACK</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {techFields.fields.map((field, idx) => (
                                        <div key={field.id} className="group relative">
                                            <input {...register(`technologies.${idx}`)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold border-transparent outline-none focus:bg-white focus:border-indigo-200 transition-all w-24 shadow-sm" />
                                            <button type="button" onClick={() => techFields.remove(idx)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all shadow-md"><FiTrash2 size={8} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50">
                                <div className="flex justify-between items-center mb-4">
                                    <label className={labelClass}>Technical Highpoints</label>
                                    <button type="button" onClick={() => featureFields.append('')} className="text-[10px] font-black underline text-slate-800 tracking-tighter hover:text-indigo-600">+ APPEND VALUE</button>
                                </div>
                                <div className="space-y-2">
                                    {featureFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input {...register(`features.${idx}`)} className={inputClass} />
                                            <button type="button" onClick={() => featureFields.remove(idx)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Visual & Delivery</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className={labelClass}>High-Res Gallery</label>
                                        <button type="button" onClick={() => imageFields.append('')} className="text-[10px] font-black underline text-slate-800 tracking-tighter hover:text-indigo-600 font-mono">+ PUSH IMAGE</button>
                                    </div>
                                    <div className="space-y-2">
                                        {imageFields.fields.map((field, idx) => (
                                            <div key={field.id} className="flex gap-2 relative">
                                                <FiImage className="absolute left-4 top-3.5 text-slate-300" />
                                                <input {...register(`images.${idx}`)} className={`${inputClass} pl-10`} />
                                                <button type="button" onClick={() => imageFields.remove(idx)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    <div>
                                        <label className={labelClass}>Production Preview (URL)</label>
                                        <input {...register('previewUrl')} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Locked Artifact (Cloud Path)</label>
                                        <input {...register('downloadFile')} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-slate-800 p-8 rounded-[2rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><FiDollarSign size={80} /></div>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-700 pb-4 relative z-10">Revenue Configuration</h2>
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 font-outfit underline decoration-slate-600">Standard License (BDT)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 font-bold text-slate-500">৳</span>
                                        <input type="number" {...register('price')} className="w-full bg-slate-700 border-none rounded-2xl py-3 pl-8 px-4 text-white text-xl font-black focus:ring-2 focus:ring-slate-500 transition-all font-mono" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 font-outfit">Campaign Offer Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 font-bold text-slate-500">৳</span>
                                        <input type="number" {...register('offerPrice')} className="w-full bg-slate-700 border-none rounded-2xl py-3 pl-8 px-4 text-white text-xl font-black focus:ring-2 focus:ring-slate-500 transition-all font-mono" />
                                    </div>
                                </div>
                                <div className="p-5 bg-slate-900 rounded-[1.5rem] border border-slate-700 flex items-center justify-between group cursor-pointer">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest leading-none">Promote Asset?</p>
                                        <p className="text-[8px] text-slate-500 uppercase mt-1">Showcase on landing</p>
                                    </div>
                                    <input type="checkbox" {...register('isFeatured')} className="w-6 h-6 rounded-lg accent-emerald-500 cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Taxonomy</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Host Platform</label>
                                    <select {...register('platform')} className={inputClass}>
                                        <option value="">Select Base</option>
                                        {platforms.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Market Category</label>
                                    <select {...register('category')} className={inputClass}>
                                        <option value="">Select Genre</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Executive Summary</h2>
                            <textarea {...register('description')} rows={8} className={`${inputClass} resize-none text-[12px] leading-relaxed font-italic`} placeholder="Update the compelling summary..."></textarea>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
