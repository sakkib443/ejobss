'use client';

import React, { useEffect, useState } from 'react';
import {
  FiSearch, FiUsers, FiUserCheck, FiShield, FiTrash2,
  FiEdit3, FiMail, FiPhone, FiCalendar, FiLoader, FiMoreVertical
} from 'react-icons/fi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editRole, setEditRole] = useState(null);

  const fetchUsers = async () => {
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/users/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data.data?.data || data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleUpdate = async (id, newRole) => {
    const BASE_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/users/admin/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setEditRole(null);
        fetchUsers();
      }
    } catch (err) { alert("Failed to update role"); }
  };

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'student': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'mentor': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 outfit tracking-tight">Access Control</h1>
          <p className="text-slate-500 text-sm font-medium italic">Monitor user activity and manage system permissions</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <FiUserCheck className="text-emerald-500" size={20} />
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Registry</p>
            <p className="text-lg font-black text-slate-800 leading-none mt-1">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="relative">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            placeholder="Search by name, email or alias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-4 py-4 rounded-[1.5rem] bg-slate-50 border border-transparent focus:bg-white focus:border-slate-300 outline-none text-sm font-bold transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <FiLoader className="animate-spin text-slate-800" size={40} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-slate-300">
          <FiUsers className="mx-auto text-4xl text-slate-200 mb-4" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching identities found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(user => (
            <div key={user._id} className="group bg-white rounded-[2.5rem] border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col">
              {/* Background Glow */}
              <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-5 blur-3xl ${user.role === 'admin' ? 'bg-rose-500' : 'bg-slate-500'}`}></div>

              <div className="p-8 pb-4 relative z-10 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white text-xl font-black border-4 border-white shadow-xl">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-800 line-clamp-1">{user.firstName} {user.lastName}</h3>
                <div className="space-y-3 mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                    <FiMail className="shrink-0" size={14} />
                    <span className="text-[11px] font-bold truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                    <FiPhone className="shrink-0" size={14} />
                    <span className="text-[11px] font-bold">{user.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <FiCalendar className="shrink-0" size={14} />
                    <span className="text-[11px] font-bold opacity-60">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-widest ${user.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  ● {user.status || 'Active'}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => setEditRole(editRole === user._id ? null : user._id)}
                    className="p-3 bg-white text-slate-400 hover:text-slate-800 rounded-xl border border-slate-100 shadow-sm transition-all"
                  >
                    <FiShield size={14} title="Manage Role" />
                  </button>
                </div>
              </div>

              {/* Role Toggle Expandable */}
              {editRole === user._id && (
                <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-5 duration-300">
                  <FiShield className="text-rose-500 mb-4" size={40} />
                  <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Modify Access Level</h4>
                  <div className="grid grid-cols-1 w-full gap-2">
                    {['admin', 'student', 'mentor'].map(role => (
                      <button
                        key={role}
                        onClick={() => handleRoleUpdate(user._id, role)}
                        className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${user.role === role ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setEditRole(null)} className="mt-8 text-slate-500 text-[9px] font-black uppercase tracking-widest underline decoration-slate-700">Cancel Override</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
