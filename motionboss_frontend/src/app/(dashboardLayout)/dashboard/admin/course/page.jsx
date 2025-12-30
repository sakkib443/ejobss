'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiBook,
  FiUser,
  FiStar,
  FiFilter,
  FiGrid,
  FiList,
} from 'react-icons/fi';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const loadCourses = async () => {
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((course) => course._id !== id));
      } else {
        alert('Failed to delete course');
      }
    } catch (error) {
      alert('Network error!');
    }
  };

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.instructorName?.toLowerCase().includes(search.toLowerCase())
  );

  // Loading Skeleton
  const CourseSkeleton = () => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="h-40 bg-slate-200 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-slate-200 rounded animate-pulse flex-1"></div>
          <div className="h-8 bg-slate-200 rounded animate-pulse flex-1"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 outfit">Course Central</h1>
          <p className="text-slate-500 text-sm work">Create, edit and manage platform curriculum</p>
        </div>
        <Link href="/dashboard/admin/course/create">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm rounded-xl shadow-lg transition-all hover:scale-105">
            <FiPlus size={16} />
            Publish New Course
          </button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-100 outline-none text-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}><FiGrid size={18} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}><FiList size={18} /></button>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
          <FiBook className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{courses.length} Live Courses</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CourseSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBook className="text-2xl text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Catalogue Empty</h3>
          <p className="text-slate-500 text-sm mt-1">Start by clicking &quot;Publish New Course&quot;</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((course) => (
            <div key={course._id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-44 overflow-hidden bg-slate-100">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><FiBook size={40} /></div>
                )}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold uppercase rounded-md shadow-sm">
                  {course.courseType}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">
                  ৳{(course.discountPrice || course.price).toLocaleString()}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-3 min-h-[40px] leading-relaxed italic">{course.title}</h3>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {course.instructorImage ? <img src={course.instructorImage} className="w-full h-full object-cover" /> : <FiUser className="text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-slate-800 truncate">{course.instructorName || 'MotionBoss Team'}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{course.level}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                    <FiUsers size={12} /> {course.totalEnrollments || 0} Students
                  </div>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <FiStar size={12} fill="currentColor" /> {course.averageRating || 5.0}
                  </div>
                </div>
              </div>

              <div className="flex border-t border-slate-100 bg-slate-50/50">
                <Link
                  href={`/dashboard/admin/course/edit/${course._id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-slate-600 hover:text-slate-900 hover:bg-white text-xs font-bold transition-all"
                >
                  <FiEdit2 size={13} /> Edit
                </Link>
                <div className="w-px bg-slate-100 h-10 self-center"></div>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-rose-400 hover:text-rose-600 hover:bg-white text-xs font-bold transition-all"
                >
                  <FiTrash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {filtered.map((course) => (
            <div key={course._id} className="flex items-center gap-5 p-4 hover:bg-slate-50 transition-colors">
              <div className="w-24 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                <img src={course.thumbnail} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-bold text-slate-800 truncate">{course.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                  <span className="uppercase font-bold text-[9px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 tracking-wider font-work">{course.courseType}</span>
                  <span>{course.level}</span>
                  <span>{course.language}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-slate-800">৳{course.price.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">{course.totalEnrollments || 0} enrolled</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/admin/course/edit/${course._id}`} className="p-2.5 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-white border border-slate-100 rounded-xl shadow-sm transition-all"><FiEdit2 size={15} /></Link>
                <button onClick={() => handleDelete(course._id)} className="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-white border border-rose-100 rounded-xl shadow-sm transition-all"><FiTrash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
