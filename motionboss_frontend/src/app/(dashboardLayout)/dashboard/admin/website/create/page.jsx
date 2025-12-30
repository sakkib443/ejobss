'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    FiArrowLeft, FiSave, FiLoader, FiImage, FiGlobe,
    FiLayers, FiTag, FiDollarSign, FiPlus, FiTrash2, FiLink
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

export default function CreateWebsitePage() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const router = useRouter();

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(websiteSchema),
        defaultValues: {
            status: 'approved',
            isFeatured: false,
            images: [''],
            features: [''],
            technologies: [''],
            projectType: 'Web Template'
        }
    });

    const imageFields = useFieldArray({ control, name: 'images' });
    const featureFields = useFieldArray({ control, name: 'features' });
    const techFields = useFieldArray({ control, name: 'technologies' });

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

        // Add author automatically
        const payload = { ...values, author: user._id };

        try {
            const response = await fetch(`${BASE_URL}/websites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Website asset added to marketplace! ✅');
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
                            <h1 className="text-2xl font-black text-slate-800 outfit">New Marketplace Item</h1>
                            <p className="text-slate-500 text-sm italic">Categorized under premium websites & scripts</p>
                        </div>
                    </div>
                    <button onClick={handleSubmit(onSubmit)} disabled={loading} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all disabled:opacity-50">
                        {loading ? 'Publishing...' : <><FiSave /> Deploy Asset</>}
                    </button>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left: General Info */}
                    <div className="md:col-span-2 space-y-8">
                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Basic Metadata</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Asset Title</label>
                                    <input {...register('title')} placeholder="e.g. Agency Pro - Next.js Business Template" className={inputClass} />
                                    {errors.title && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.title.message}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Project Type</label>
                                        <input {...register('projectType')} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Status</label>
                                        <select {...register('status')} className={inputClass}>
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Dynamic Properties</h2>

                            {/* Technologies */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className={labelClass}>Stack & Tools</label>
                                    <button type="button" onClick={() => techFields.append('')} className="text-[10px] font-black underline text-slate-800">+ Add Tool</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {techFields.fields.map((field, idx) => (
                                        <div key={field.id} className="group relative">
                                            <input {...register(`technologies.${idx}`)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold border-transparent outline-none focus:bg-white focus:border-slate-300 w-24" />
                                            <button type="button" onClick={() => techFields.remove(idx)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 size={8} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="pt-4 border-t border-slate-50">
                                <div className="flex justify-between items-center mb-4">
                                    <label className={labelClass}>Key Features</label>
                                    <button type="button" onClick={() => featureFields.append('')} className="text-[10px] font-black underline text-slate-800">+ Add Point</button>
                                </div>
                                <div className="space-y-2">
                                    {featureFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input {...register(`features.${idx}`)} className={inputClass} placeholder={`Feature #${idx + 1}`} />
                                            <button type="button" onClick={() => featureFields.remove(idx)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Media & Catalog</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className={labelClass}>Gallery URLs</label>
                                        <button type="button" onClick={() => imageFields.append('')} className="text-[10px] font-black underline text-slate-800">+ Add Link</button>
                                    </div>
                                    <div className="space-y-2">
                                        {imageFields.fields.map((field, idx) => (
                                            <div key={field.id} className="flex gap-2 relative">
                                                <FiImage className="absolute left-4 top-3.5 text-slate-300" />
                                                <input {...register(`images.${idx}`)} className={`${inputClass} pl-10`} placeholder="Image URL..." />
                                                <button type="button" onClick={() => imageFields.remove(idx)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                        {errors.images && <p className="text-rose-500 text-[10px] font-bold">{errors.images.message || errors.images[0]?.message}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    <div>
                                        <label className={labelClass}>Live Preview (URL)</label>
                                        <input {...register('previewUrl')} className={inputClass} placeholder="https://..." />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Source Link (Drive/Cloud)</label>
                                        <input {...register('downloadFile')} className={inputClass} placeholder="Path to zip..." />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Pricing & Meta */}
                    <div className="space-y-8">
                        <div className="bg-slate-800 p-8 rounded-[2rem] text-white shadow-2xl space-y-8">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-700 pb-4">Financial Ledger</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 font-outfit underline decoration-slate-600">Standard License Price (BDT)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 font-bold text-slate-400">৳</span>
                                        <input type="number" {...register('price')} className="w-full bg-slate-700 border-none rounded-2xl py-3 pl-8 px-4 text-white text-xl font-black focus:ring-2 focus:ring-slate-500" />
                                    </div>
                                    {errors.price && <p className="text-rose-400 text-[9px] mt-1 font-bold">{errors.price.message}</p>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 font-outfit">Discounted Offer Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 font-bold text-slate-400">৳</span>
                                        <input type="number" {...register('offerPrice')} className="w-full bg-slate-700 border-none rounded-2xl py-3 pl-8 px-4 text-white text-xl font-black focus:ring-2 focus:ring-slate-500" />
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mark Featured?</span>
                                    <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded-md accent-emerald-500" />
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Classification</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Ecosystem Platform</label>
                                    <select {...register('platform')} className={inputClass}>
                                        <option value="">Select Base</option>
                                        {platforms.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Taxonomy Category</label>
                                    <select {...register('category')} className={inputClass}>
                                        <option value="">Select Genre</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2">Narrative</h2>
                            <textarea {...register('description')} rows={6} className={`${inputClass} resize-none text-[12px] leading-relaxed`} placeholder="Write a compelling executive summary..."></textarea>
                            {errors.description && <p className="text-rose-500 text-[10px] font-black">{errors.description.message}</p>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
