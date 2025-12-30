'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { FiPlus, FiTrash2, FiSave, FiArrowLeft, FiImage, FiGlobe, FiTarget, FiBriefcase, FiVideo, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

// Zod Schema based on real backend validation
const courseValidationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  titleBn: z.string().min(3, "Bengali title must be at least 3 characters"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(50, "English description must be at least 50 characters"),
  descriptionBn: z.string().min(50, "Bengali description must be at least 50 characters"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  discountPrice: z.coerce.number().min(0).optional(),
  courseType: z.enum(['online', 'offline', 'recorded']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.enum(['bangla', 'english', 'both']),
  instructorName: z.string().min(1, "Instructor name required"),
  instructorImage: z.string().url("Invalid image URL").optional().or(z.literal('')),
  instructorBio: z.string().optional(),
  features: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  whatYouWillLearn: z.array(z.string()).optional(),
  previewVideo: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']),
});

const EditCourse = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { id } = useParams();

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(courseValidationSchema),
    defaultValues: {
      courseType: 'online',
      level: 'beginner',
      language: 'bangla',
      status: 'published',
      features: [''],
      requirements: [''],
      whatYouWillLearn: [''],
    }
  });

  const featuresFields = useFieldArray({ control, name: 'features' });
  const requirementsFields = useFieldArray({ control, name: 'requirements' });
  const learningFields = useFieldArray({ control, name: 'whatYouWillLearn' });

  const fetchData = useCallback(async () => {
    if (!id) return;
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    try {
      setFetching(true);
      const [catRes, courseRes] = await Promise.all([
        fetch(`${BASE_URL}/categories`),
        fetch(`${BASE_URL}/courses/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const catData = await catRes.json();
      const courseData = await courseRes.json();

      setCategories(catData.data || []);

      const course = courseData.data;
      if (course) {
        reset({
          ...course,
          category: course.category?._id || course.category,
          features: course.features?.length ? course.features : [''],
          requirements: course.requirements?.length ? course.requirements : [''],
          whatYouWillLearn: course.whatYouWillLearn?.length ? course.whatYouWillLearn : [''],
        });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load course data');
    } finally {
      setFetching(false);
    }
  }, [id, reset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data) => {
    setLoading(true);
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${BASE_URL}/courses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Course Updated Successfully! ✅');
        router.push('/dashboard/admin/course');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Network error or server down!');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none text-sm transition-all bg-white font-medium text-slate-700";
  const labelClass = "block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider";
  const sectionHeader = "text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 after:content-[''] after:h-px after:bg-slate-100 after:flex-1";

  if (fetching) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <FiLoader className="animate-spin text-slate-800" size={40} />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Hydrating Curriculum...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto pb-20">

        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin/course" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-all shadow-sm">
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-800 outfit">Modify Course</h1>
              <p className="text-slate-500 text-sm italic">ID: <span className="font-mono text-slate-400 uppercase">{id?.slice(-8)}</span></p>
            </div>
          </div>
          <button onClick={handleSubmit(onSubmit)} disabled={loading} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all disabled:opacity-50">
            {loading ? 'Updating...' : <><FiSave /> Save Changes</>}
          </button>
        </div>

        <form className="space-y-10">

          {/* 1. Language Pairs Header */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
            <h2 className={sectionHeader}>Basic Multilingual Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>English Title</label>
                  <input {...register('title')} className={inputClass} />
                  {errors.title && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.title.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>English Description</label>
                  <textarea {...register('description')} className={`${inputClass} min-h-[150px]`} />
                  {errors.description && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.description.message}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Bengali Title (বাংলা শিরোনাম)</label>
                  <input {...register('titleBn')} className={inputClass} />
                  {errors.titleBn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.titleBn.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Bengali Description (বাংলা বিবরণ)</label>
                  <textarea {...register('descriptionBn')} className={`${inputClass} min-h-[150px]`} />
                  {errors.descriptionBn && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.descriptionBn.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Media & Taxonomy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <h2 className={sectionHeader}>Media & Identity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Short Slug</label>
                  <input {...register('slug')} className={inputClass} readOnly />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select {...register('category')} className={inputClass}>
                    <option value="">Choose Module</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Thumbnail Image (URL)</label>
                  <div className="relative">
                    <FiImage className="absolute left-4 top-3.5 text-slate-300" />
                    <input {...register('thumbnail')} className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Preview Video (URL)</label>
                  <div className="relative">
                    <FiVideo className="absolute left-4 top-3.5 text-slate-300" />
                    <input {...register('previewVideo')} className={`${inputClass} pl-10`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-[2rem] text-white space-y-6 shadow-2xl">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Price & Specs</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Regular Price (BDT)</label>
                  <input type="number" {...register('price')} className="w-full bg-slate-700 border-none rounded-xl py-3 px-4 text-white text-lg font-black mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Discount Price</label>
                  <input type="number" {...register('discountPrice')} className="w-full bg-slate-700 border-none rounded-xl py-3 px-4 text-white text-lg font-black mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                    <select {...register('status')} className="w-full bg-slate-700 border-none rounded-lg py-2 px-3 text-xs text-white mt-1">
                      <option value="draft">Draft</option>
                      <option value="published">Live</option>
                      <option value="archived">Archive</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Type</label>
                    <select {...register('courseType')} className="w-full bg-slate-700 border-none rounded-lg py-2 px-3 text-xs text-white mt-1">
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="recorded">Recorded</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Instructor Details */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
            <h2 className={sectionHeader}>Instructor Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <label className={labelClass}>Photo URL</label>
                <input {...register('instructorImage')} className={inputClass} />
              </div>
              <div className="md:col-span-1">
                <label className={labelClass}>Full Name</label>
                <input {...register('instructorName')} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Short Bio</label>
                <input {...register('instructorBio')} className={inputClass} />
              </div>
            </div>
          </div>

          {/* 4. Lists Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Features */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Included Items</h2>
                <button type="button" onClick={() => featuresFields.append('')} className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"><FiPlus size={12} /></button>
              </div>
              <div className="space-y-3">
                {featuresFields.fields.map((field, index) => (
                  <div key={field.id} className="group flex gap-2">
                    <input {...register(`features.${index}`)} className={`${inputClass} border-transparent bg-slate-50`} />
                    <button type="button" onClick={() => featuresFields.remove(index)} className="opacity-0 group-hover:opacity-100 text-rose-400 transition-all"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">What You'll Learn</h2>
                <button type="button" onClick={() => learningFields.append('')} className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"><FiPlus size={12} /></button>
              </div>
              <div className="space-y-3">
                {learningFields.fields.map((field, index) => (
                  <div key={field.id} className="group flex gap-2">
                    <input {...register(`whatYouWillLearn.${index}`)} className={`${inputClass} border-transparent bg-slate-50`} />
                    <button type="button" onClick={() => learningFields.remove(index)} className="opacity-0 group-hover:opacity-100 text-rose-400 transition-all"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Requirements</h2>
                <button type="button" onClick={() => requirementsFields.append('')} className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"><FiPlus size={12} /></button>
              </div>
              <div className="space-y-3">
                {requirementsFields.fields.map((field, index) => (
                  <div key={field.id} className="group flex gap-2">
                    <input {...register(`requirements.${index}`)} className={`${inputClass} border-transparent bg-slate-50`} />
                    <button type="button" onClick={() => requirementsFields.remove(index)} className="opacity-0 group-hover:opacity-100 text-rose-400 transition-all"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;