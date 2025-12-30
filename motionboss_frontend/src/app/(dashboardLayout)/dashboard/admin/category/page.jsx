'use client';

import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiLoader, FiCheck, FiX, FiGrid, FiSearch, FiImage, FiActivity } from 'react-icons/fi';
import Link from 'next/link';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/categories/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setCategories(result.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this category?")) return;
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/categories/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) { alert("Delete failed"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/categories/admin/${editData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editData.name,
          slug: editData.slug,
          description: editData.description,
          image: editData.image,
          isActive: editData.isActive
        }),
      });
      if (res.ok) {
        setEditData(null);
        fetchCategories();
      } else {
        const err = await res.json();
        alert(`Update failed: ${err.message}`);
      }
    } catch (err) { alert("Network error"); }
  };

  const filtered = categories.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 outfit tracking-tight">Taxonomy Hub</h1>
          <p className="text-slate-500 text-sm italic font-medium">Manage course categories and marketplace segments</p>
        </div>
        <Link href="/dashboard/admin/category/create">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
            <FiPlus size={18} />
            New Category
          </button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            placeholder="Search categories by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none text-sm transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200">
          <FiGrid size={16} />
          <span className="text-xs font-black uppercase tracking-widest">{categories.length} Segments</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <FiLoader className="animate-spin text-slate-800" size={40} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Taxonomy...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiGrid className="text-3xl text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-800">No Segments Found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">Create a category to start organizing your platform content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((cat) => (
            <div key={cat._id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              {/* Background Decorative Element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-white p-1 overflow-hidden shadow-lg">
                    {cat.image ? (
                      <img src={cat.image} className="w-full h-full object-cover" />
                    ) : (
                      <FiGrid size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 line-clamp-1">{cat.name}</h3>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-1">{cat.slug}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-2 min-h-[32px] font-medium italic">
                  {cat.description || "No description provided for this segment."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-slate-300 animate-pulse'}`}></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.isActive ? 'Active' : 'Draft'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditData(cat)} className="p-3 bg-slate-50 hover:bg-slate-800 hover:text-white rounded-xl transition-all"><FiEdit3 size={14} /></button>
                    <button onClick={() => handleDelete(cat._id)} className="p-3 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-400 transition-all rounded-xl"><FiTrash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Professional Edit Drawer/Modal */}
      {editData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-end z-50 p-4">
          <div className="bg-white h-full w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="p-10 flex justify-between items-center group">
              <div>
                <h3 className="text-2xl font-black text-slate-800 outfit">Edit Segment</h3>
                <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-widest">Metadata Configuration</p>
              </div>
              <button onClick={() => setEditData(null)} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-800 hover:text-white rounded-2xl transition-all">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-10 pt-0 space-y-8 overflow-y-auto flex-1 scrollbar-hide">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Display Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">SEO Slug</label>
                  <input
                    type="text"
                    value={editData.slug}
                    onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Icon URL</label>
                  <div className="relative">
                    <FiImage className="absolute left-5 top-4.5 text-slate-300" />
                    <input
                      type="text"
                      value={editData.image}
                      onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Narrative</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none transition-all resize-none"
                    placeholder="Briefly describe this category..."
                  ></textarea>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800">Visibility Status</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Show this category in public filters</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditData({ ...editData, isActive: !editData.isActive })}
                    className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${editData.isActive ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                  >
                    <div className="w-6 h-6 bg-white rounded-full shadow-lg"></div>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <FiCheck size={18} /> Update Taxonomy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
