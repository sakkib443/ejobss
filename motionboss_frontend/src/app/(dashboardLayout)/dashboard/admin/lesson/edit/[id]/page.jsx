'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    FiPlay, FiArrowLeft, FiSave, FiClock, FiTrash2
} from 'react-icons/fi';

export default function EditLessonPage() {
    const router = useRouter();
    const params = useParams();
    const lessonId = params.id;

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch lesson
                const lessonRes = await fetch(`${BASE_URL}/lessons/${lessonId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const lessonData = await lessonRes.json();

                if (lessonData.data) {
                    const l = lessonData.data;
                    const courseId = l.course?._id || l.course || '';
                    setFormData({
                        title: l.title || '',
                        titleBn: l.titleBn || '',
                        description: l.description || '',
                        descriptionBn: l.descriptionBn || '',
                        course: courseId,
                        module: l.module?._id || l.module || '',
                        videoUrl: l.videoUrl || '',
                        videoDuration: l.videoDuration || 0,
                        videoProvider: l.videoProvider || 'youtube',
                        order: l.order || 1,
                        isPublished: l.isPublished || false,
                        isFree: l.isFree || false,
                    });

                    if (courseId) fetchModules(courseId);
                }

                // Fetch courses
                const coursesRes = await fetch(`${BASE_URL}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const coursesData = await coursesRes.json();
                setCourses(coursesData.data || []);

            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) fetchData();
    }, [lessonId]);

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
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/lessons/${lessonId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (res.ok) {
                alert('Lesson Updated Successfully! ✅');
                router.push('/dashboard/admin/lesson');
            } else {
                // Detailed error reporting
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path.split('.').pop()}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Update Failed ❌\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('Network error!');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this lesson?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/lessons/${lessonId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                router.push('/dashboard/admin/lesson');
            } else {
                alert('Failed to delete lesson');
            }
        } catch (err) {
            alert('Error deleting lesson');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Edit Lesson</h1>
                        <p className="text-slate-500 text-sm mt-1">Update lesson details</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                    <FiTrash2 size={16} />
                    Delete
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Lesson Title (English) *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Lesson Title (বাংলা)</label>
                        <input
                            type="text"
                            name="titleBn"
                            value={formData.titleBn}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Course & Module Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Course *</label>
                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none bg-white"
                        >
                            <option value="">Choose a course</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Module *</label>
                        <select
                            name="module"
                            value={formData.module}
                            onChange={handleChange}
                            required
                            disabled={!formData.course || fetchingModules}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                        >
                            <option value="">{fetchingModules ? 'Loading modules...' : (formData.course ? 'Choose a module' : 'Select a course first')}</option>
                            {modules.map(mod => (
                                <option key={mod._id} value={mod._id}>{mod.order}. {mod.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description (English)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description (বাংলা)</label>
                        <textarea
                            name="descriptionBn"
                            value={formData.descriptionBn}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Video Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Video URL *</label>
                        <div className="relative">
                            <FiPlay className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="url"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Video Provider</label>
                        <select
                            name="videoProvider"
                            value={formData.videoProvider}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        >
                            <option value="youtube">YouTube</option>
                            <option value="vimeo">Vimeo</option>
                            <option value="bunny">Bunny</option>
                            <option value="cloudinary">Cloudinary</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                </div>

                {/* Duration & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes) *</label>
                        <div className="relative">
                            <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="number"
                                name="videoDuration"
                                value={formData.videoDuration}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            min="1"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">Published</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isFree"
                            checked={formData.isFree}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">Free preview</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                    >
                        <FiSave size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
