'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    FiSettings, FiSave, FiUser, FiBell, FiLock, FiGlobe,
    FiMail, FiDollarSign, FiDatabase, FiChevronRight, FiCheck
} from 'react-icons/fi';

export default function SettingsPage() {
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'general');

    // Update tab when URL changes
    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'MotionBoss',
        siteEmail: 'admin@motionboss.com',
        currency: 'BDT',
        currencySymbol: '৳',
        emailNotifications: true,
        orderNotifications: true,
        maintenanceMode: false,
    });

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert('Settings saved successfully!');
    };

    const tabs = [
        { id: 'general', label: 'General', icon: FiSettings },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'payment', label: 'Payment', icon: FiDollarSign },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your platform settings</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                >
                    {saving ? <FiCheck size={18} /> : <FiSave size={18} />}
                    {saving ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 h-fit">
                    <nav className="space-y-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon size={18} />
                                        {tab.label}
                                    </span>
                                    <FiChevronRight size={16} className={activeTab === tab.id ? 'text-indigo-400' : 'text-slate-300'} />
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">General Settings</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => handleChange('siteName', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Site Email</label>
                                    <input
                                        type="email"
                                        value={settings.siteEmail}
                                        onChange={(e) => handleChange('siteEmail', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                    >
                                        <option value="BDT">BDT - Bangladeshi Taka</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Currency Symbol</label>
                                    <input
                                        type="text"
                                        value={settings.currencySymbol}
                                        onChange={(e) => handleChange('currencySymbol', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <div>
                                    <p className="font-semibold text-slate-800">Maintenance Mode</p>
                                    <p className="text-sm text-slate-500">Put your site in maintenance mode</p>
                                </div>
                                <button
                                    onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                                    className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.maintenanceMode ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                                        }`}
                                >
                                    <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Notification Settings</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-slate-800">Email Notifications</p>
                                        <p className="text-sm text-slate-500">Receive email alerts for important updates</p>
                                    </div>
                                    <button
                                        onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                                        className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.emailNotifications ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                                            }`}
                                    >
                                        <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-slate-800">Order Notifications</p>
                                        <p className="text-sm text-slate-500">Get notified when new orders come in</p>
                                    </div>
                                    <button
                                        onClick={() => handleChange('orderNotifications', !settings.orderNotifications)}
                                        className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.orderNotifications ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                                            }`}
                                    >
                                        <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Security Settings</h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="font-semibold text-slate-800 mb-2">Change Password</p>
                                    <p className="text-sm text-slate-500 mb-4">Update your admin account password</p>
                                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
                                        Update Password
                                    </button>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="font-semibold text-slate-800 mb-2">Two-Factor Authentication</p>
                                    <p className="text-sm text-slate-500 mb-4">Add an extra layer of security</p>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100">Payment Settings</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border-2 border-emerald-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold">bK</div>
                                        <div>
                                            <p className="font-bold text-slate-800">bKash</p>
                                            <p className="text-xs text-emerald-600 font-semibold">Active</p>
                                        </div>
                                    </div>
                                    <button className="text-sm text-indigo-600 font-medium">Configure →</button>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">N</div>
                                        <div>
                                            <p className="font-bold text-slate-800">Nagad</p>
                                            <p className="text-xs text-slate-400 font-semibold">Inactive</p>
                                        </div>
                                    </div>
                                    <button className="text-sm text-indigo-600 font-medium">Setup →</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
