'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSave, FiLoader, FiCheckCircle, FiImage, FiGlobe, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      const slugified = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: slugified }));
    }
  }, [formData.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${BASE_URL}/categories/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Category segment initialized! ✅');
        router.push('/dashboard/admin/category');
      } else {
        alert(result.message || 'Failed to create category');
      }
    } catch (error) {
      alert('Network error - check backend connectivity');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none text-sm transition-all bg-white font-bold text-slate-700 placeholder:text-slate-300";
  const labelClass = "block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em]";

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-xl mx-auto">

        {/* Navigation */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/dashboard/admin/category" className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all font-bold text-xs">
            <FiArrowLeft /> Back to Taxonomy
          </Link>
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-800 outfit tracking-tight">Expand Taxonomy</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Initialize Content Segment</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 p-10 border border-slate-100 space-y-8">

            {/* 1. Basic Identity */}
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Segment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Creative Engineering"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Unique Slug</label>
                  <div className="relative">
                    <FiGlobe className="absolute left-5 top-4.5 text-slate-300" />
                    <input
                      type="text"
                      required
                      readOnly
                      value={formData.slug}
                      className={`${inputClass} pl-12 bg-slate-50 border-transparent`}
                    />
                  </div>
                </div>
                <div className="w-24">
                  <label className={labelClass}>Status</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ${formData.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}
                  >
                    {formData.isActive ? 'Active' : 'Draft'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Media & Narrative */}
            <div className="space-y-5 pt-8 border-t border-slate-50">
              <div>
                <label className={labelClass}>Icon / Image URL</label>
                <div className="relative">
                  <FiImage className="absolute left-5 top-4.5 text-slate-300" />
                  <input
                    type="text"
                    placeholder="https://assets.motionboss.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Short Description</label>
                <textarea
                  rows={3}
                  placeholder="What kind of content belongs here?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${inputClass} resize-none leading-relaxed`}
                ></textarea>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-[2rem] text-white font-black text-sm flex items-center justify-center gap-3 transition-all shadow-2xl relative overflow-hidden group ${loading ? 'bg-slate-300' : 'bg-slate-800 hover:bg-slate-900 active:scale-95 shadow-slate-200'}`}
            >
              {loading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <>
                  <FiSave size={20} className="group-hover:translate-y-[-2px] transition-transform" />
                  <span className="uppercase tracking-[0.2em]">Deploy Segment</span>
                </>
              )}
            </button>
          </div>

          {/* Hint Box */}
          <div className="flex gap-4 p-6 bg-slate-800 text-white rounded-[2rem] shadow-xl">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
              <FiInfo className="text-slate-400" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Architect Tip</h4>
              <p className="text-[11px] font-medium leading-relaxed mt-1 opacity-80 italic">
                Categories define the top-level filtering for Courses, Softwares, and Websites. Ensure names are descriptive for SEO.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
