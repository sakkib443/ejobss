'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiPlay, FiArrowLeft, FiSave, FiUpload, FiClock, FiBook, FiLayers
} from 'react-icons/fi';

export default function CreateLessonPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        description: '',
        descriptionBn: '',
        course: '',
        module: '',
        videoUrl: '',
        videoDuration: 0,
        videoProvider: 'youtube',
        order: 1,
        isPublished: false,
        isFree: false,
    });
    const [modules, setModules] = useState([]);
    const [fetchingModules, setFetchingModules] = useState(false);

    const BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${BASE_URL}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCourses(data.data || []);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };
        fetchCourses();
    }, []);

    const fetchModules = async (courseId) => {
        if (!courseId) {
            setModules([]);
            return;
        }
        setFetchingModules(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/modules/course/${courseId}?includeUnpublished=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setModules(data.data || []);
        } catch (err) {
            console.error('Error fetching modules:', err);
        } finally {
            setFetchingModules(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'videoDuration' || name === 'order' ? Number(value) : value)
        }));

        if (name === 'course') {
            fetchModules(value);
            setFormData(prev => ({ ...prev, module: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/lessons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {
                alert('Lesson Created Successfully! ✅');
                router.push('/dashboard/admin/lesson');
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path.split('.').pop()}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Validation Error ❌\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Create error:', err);
            alert('Network error!');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm transition-all bg-white text-slate-700 placeholder:text-slate-400";
    const labelClass = "block text-sm font-medium text-slate-700 mb-2";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/lesson" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all">
                        <FiArrowLeft size={18} />
                    </Link>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
                        <FiPlay className="text-white text-lg" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">Create New Lesson</h1>
                        <p className="text-sm text-slate-500">Add a new lesson to your course</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50"
                >
                    <FiSave size={16} />
                    {loading ? 'Creating...' : 'Create Lesson'}
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Lesson Title (English) *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Introduction to React"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Lesson Title (বাংলা)</label>
                        <input
                            type="text"
                            name="titleBn"
                            value={formData.titleBn}
                            onChange={handleChange}
                            placeholder="যেমনঃ রিঅ্যাক্ট পরিচিতি"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Course & Module Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>
                            <FiBook className="inline-block mr-2" size={14} />
                            Select Course *
                        </label>
                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="">Choose a course</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>
                            <FiLayers className="inline-block mr-2" size={14} />
                            Select Module *
                        </label>
                        <select
                            name="module"
                            value={formData.module}
                            onChange={handleChange}
                            required
                            disabled={!formData.course || fetchingModules}
                            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}
                        >
                            <option value="">{fetchingModules ? 'Loading modules...' : (formData.course ? 'Choose a module' : 'Select a course first')}</option>
                            {modules.map(mod => (
                                <option key={mod._id} value={mod._id}>{mod.order}. {mod.title}</option>
                            ))}
                        </select>
                        {formData.course && modules.length === 0 && !fetchingModules && (
                            <p className="text-[10px] text-rose-500 mt-1 font-bold">No modules found for this course. Please create one first.</p>
                        )}
                    </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Description (English)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe the lesson content..."
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Description (বাংলা)</label>
                        <textarea
                            name="descriptionBn"
                            value={formData.descriptionBn}
                            onChange={handleChange}
                            rows={4}
                            placeholder="লেসনের বর্ণনা লিখুন..."
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>

                {/* Video Info */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Video Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Video URL *</label>
                            <div className="relative">
                                <FiPlay className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="url"
                                    name="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://youtube.com/watch?v=..."
                                    className={`${inputClass} pl-11`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Video Provider</label>
                            <select
                                name="videoProvider"
                                value={formData.videoProvider}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="youtube">YouTube</option>
                                <option value="vimeo">Vimeo</option>
                                <option value="bunny">Bunny</option>
                                <option value="cloudinary">Cloudinary</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Duration & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Duration (minutes) *</label>
                        <div className="relative">
                            <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="number"
                                name="videoDuration"
                                value={formData.videoDuration}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 15"
                                className={`${inputClass} pl-11`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Order</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            min="1"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-200 flex-1">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-5 h-5 rounded-lg border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-sm font-bold text-slate-700">Publish this lesson</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-200 flex-1">
                        <input
                            type="checkbox"
                            name="isFree"
                            checked={formData.isFree}
                            onChange={handleChange}
                            className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-bold text-slate-700">Free preview lesson</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-rose-500/30 transition-all disabled:opacity-50"
                    >
                        <FiSave size={18} />
                        {loading ? 'Creating...' : 'Create Lesson'}
                    </button>
                </div>
            </form>
        </div>
    );
}

