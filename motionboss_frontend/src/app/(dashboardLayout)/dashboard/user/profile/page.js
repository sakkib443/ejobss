'use client';

import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit3, FiSave, FiCamera, FiLoader, FiShield, FiLock } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserProfilePage() {
    const { isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    address: userData.address || '',
                    dateOfBirth: userData.dateOfBirth || '',
                });
            } catch (e) { }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        alert('🔄 Profile update is processing. This feature will be available soon!');
        setIsEditing(false);
    };

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark ? 'bg-slate-800/50 border-white/5 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`;
    const inputClass = `w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all outline-none ${isDark
        ? 'bg-slate-900 border-white/10 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
        : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white'
        } disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500`;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-black outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    My Profile
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-50'}`}>
                    Manage your personal information and account settings
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className={`${cardClass} p-8`}>
                    {/* Avatar */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl shadow-indigo-500/20">
                                <div className="w-full h-full rounded-[20px] bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <span className="text-4xl font-black text-indigo-600">
                                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'S'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => alert('🔄 Avatar upload is processing. This feature will be available soon!')}
                                className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl border flex items-center justify-center transition-all shadow-lg ${isDark
                                    ? 'bg-slate-700 border-white/10 text-indigo-400 hover:bg-indigo-500 hover:text-white'
                                    : 'bg-white border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                                    }`}
                            >
                                <FiCamera size={18} />
                            </button>
                        </div>
                        <h2 className={`text-xl font-bold mt-6 outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-indigo-500/20">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                            {user?.role || 'Student'} Member
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8 mb-8">
                        <div className={`text-center p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <p className={`text-2xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>0</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Courses</p>
                        </div>
                        <div className={`text-center p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <p className={`text-2xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>0</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Certificates</p>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10' : 'bg-white'}`}>
                                <FiShield className="text-emerald-500" size={20} />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-900'}`}>Account Protected</p>
                                <p className={`text-xs font-medium ${isDark ? 'text-emerald-500/70' : 'text-emerald-700'}`}>Identity Verified</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className={`lg:col-span-2 ${cardClass} p-8`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <FiUser size={20} />
                            </div>
                            <h2 className={`text-lg font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Personal Information</h2>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all border border-indigo-500/20"
                            >
                                <FiEdit3 size={14} />
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25"
                            >
                                <FiSave size={14} />
                                Save Changes
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>First Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Last Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className={inputClass}
                                />
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 mt-2 ml-1 uppercase tracking-widest italic flex items-center gap-1 opacity-60">
                                <FiLock size={10} /> Immutable Identifier
                            </p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Phone Number</label>
                            <div className="relative">
                                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter phone number"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Residential Address</label>
                            <div className="relative">
                                <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder={isEditing ? 'Enter your complete address' : 'Address not specified'}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="mt-10 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <FiLock size={20} />
                            </div>
                            <h2 className={`text-lg font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Account Security</h2>
                        </div>
                        <div className={`p-6 rounded-2xl border-2 border-dashed ${isDark ? 'border-slate-800 bg-white/5' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <h4 className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Password Management</h4>
                                    <p className="text-xs text-slate-500 mt-1">Update your password to keep your account safe and secure.</p>
                                </div>
                                <button
                                    onClick={() => alert('🔄 Password change feature is coming soon!')}
                                    className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${isDark
                                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        : 'bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
