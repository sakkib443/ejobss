"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchSoftwareById, fetchSoftware } from "@/redux/softwareSlice";
import { useLanguage } from "@/context/LanguageContext";
import { addToCart } from "@/redux/cartSlice";
import {
    LuDownload, LuExternalLink, LuBadgeCheck, LuCpu, LuClock,
    LuShieldCheck, LuShoppingCart, LuStar, LuShare2, LuCalendar, LuLayers, LuPlus, LuArrowRight,
    LuLayoutGrid, LuInfo, LuMessageSquare, LuChevronRight
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SoftwareDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { singleSoftware: software, softwareList = [], loading, error } = useSelector((state) => state.software || {});
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState("overview");
    const [recommended, setRecommended] = useState([]);
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        if (id) {
            dispatch(fetchSoftwareById(id));
        }
        dispatch(fetchSoftware());
    }, [id, dispatch]);

    useEffect(() => {
        if (softwareList.length > 0 && id) {
            setRecommended(softwareList.filter(item => item._id !== id).slice(0, 4));
        }
    }, [softwareList, id]);

    const handleAddToCart = () => {
        if (!software) return;
        dispatch(addToCart({
            id: software._id,
            title: software.title,
            price: software.price,
            image: software.images?.[0] || software.image || "/images/placeholder.png",
            type: 'software'
        }));
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/cart');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-[#41bfb8]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#41bfb8] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Synchronizing Core...</p>
            </div>
        );
    }

    if (error || !software) {
        return (
            <div className="text-center py-20 min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8">
                    <LuCpu className="text-gray-200 text-4xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 outfit">System Sync Failure</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">{error || "The requested software interface could not be initialized."}</p>
                <button
                    onClick={() => router.push('/software')}
                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#41bfb8] transition-all shadow-xl"
                >
                    Back to Marketplace
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative">
            {/* Advanced Atmosphere Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-5%] right-[-5%] w-[800px] h-[800px] bg-[#41bfb8]/5 rounded-full blur-[120px]"
                ></motion.div>
                <motion.div
                    animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] bg-[#F79952]/5 rounded-full blur-[100px]"
                ></motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(65,191,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(65,191,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            {/* Product Hero */}
            <section className="relative pt-36 pb-24 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-16 container-max-width-8xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Left: Interactive Showcase */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative p-4 bg-white/40 backdrop-blur-3xl border border-white rounded-[3rem] shadow-2xl shadow-[#41bfb8]/10 overflow-hidden"
                            >
                                <img
                                    src={software.images?.[0] || software.image || "/images/placeholder.png"}
                                    alt={software.title}
                                    className="w-full aspect-[16/10] object-cover rounded-[2.5rem] shadow-sm transform transition-transform duration-1000 group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                                    <button className="px-8 py-3 bg-white/90 backdrop-blur text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl flex items-center gap-2">
                                        <LuLayers /> View All Screenshots
                                    </button>
                                </div>
                            </motion.div>

                            {/* Gallery Gird */}
                            <div className="grid grid-cols-4 gap-6">
                                {software.images?.slice(1, 5).map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="group relative aspect-square bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden cursor-pointer shadow-sm hover:border-[#41bfb8] transition-all"
                                    >
                                        <img src={img} alt="Shot" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Info Architecture */}
                        <div className="lg:col-span-5 space-y-10 relative">
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#41bfb8]/10 text-[#26a69a] rounded-xl text-xs font-black uppercase tracking-[0.2em] work"
                                >
                                    <LuCpu className="animate-pulse" size={14} /> {software.softwareType}
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className={`text-4xl lg:text-6xl font-black text-gray-900 outfit leading-[1] tracking-tighter ${bengaliClass}`}
                                >
                                    {software.title}
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-wrap items-center gap-8"
                                >
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map((s) => <LuStar key={s} size={14} className="fill-current" />)}
                                        </div>
                                        <span className="font-extrabold text-gray-900 text-sm outfit">{software.rating || '5.0'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 bg-[#41bfb8] rounded-full animate-ping"></div>
                                        <span className="text-sm font-black text-[#41bfb8] uppercase tracking-widest work">{software.salesCount || '1.2k'}+ Active Licenses</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Sticky Price Hub */}
                            <div className="sticky top-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#41bfb8] to-[#F79952] rounded-[3rem] blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
                                    <div className="relative bg-white/70 backdrop-blur-3xl p-10 rounded-[3rem] border border-white shadow-2xl space-y-8">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="flex items-end gap-3 mb-1">
                                                    <span className="text-5xl font-black text-gray-900 outfit tracking-tighter">৳{software.price?.toLocaleString()}</span>
                                                    {software.offerPrice && (
                                                        <span className="text-xl text-gray-400 line-through font-bold pb-1">৳{software.offerPrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-black text-[#41bfb8] uppercase tracking-[0.3em] work">Unlimited Access License</p>
                                            </div>
                                            <div className="text-right pb-1">
                                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-[#41bfb8] mx-auto mb-1">
                                                    <LuShieldCheck size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <button
                                                    onClick={handleBuyNow}
                                                    className="group relative flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-[#41bfb8] to-[#26a69a] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-[#41bfb8]/20 transition-all active:scale-[0.98] overflow-hidden"
                                                >
                                                    <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                    <span>Instant Deploy</span>
                                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                                </button>
                                                <button
                                                    onClick={handleAddToCart}
                                                    className="group flex items-center justify-center gap-3 py-6 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-gray-900/10 transition-all hover:bg-black active:scale-[0.98]"
                                                >
                                                    <LuPlus size={16} /> Add to Core
                                                </button>
                                            </div>
                                            {software.previewUrl && (
                                                <a
                                                    href={software.previewUrl}
                                                    target="_blank"
                                                    className="w-full flex items-center justify-center gap-3 py-5 bg-white border-2 border-slate-100 text-gray-800 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:border-[#41bfb8] hover:text-[#41bfb8] transition-all"
                                                >
                                                    <LuExternalLink /> Operational Preview
                                                </a>
                                            )}
                                        </div>

                                        <div className="pt-8 border-t border-slate-100">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">What's in the box:</h4>
                                            <ul className="space-y-4">
                                                {[
                                                    'Full Source Code Access',
                                                    '12 Months Free Updates',
                                                    'Deployment Documentation',
                                                    'Community Support'
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700 work">
                                                        <LuBadgeCheck className="text-[#41bfb8]" size={18} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Tabbed Navigation */}
            <section className="py-24 container mx-auto px-4 lg:px-16 relative z-10 border-t border-slate-50">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-8">
                        {/* Tabs Header */}
                        <div className="flex gap-10 border-b border-slate-100 mb-12">
                            {[
                                { id: 'overview', label: 'System Overview', icon: LuInfo },
                                { id: 'features', label: 'Technical Spec', icon: LuLayoutGrid },
                                { id: 'support', label: 'License & Support', icon: LuShieldCheck }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2.5 pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-[#41bfb8]' : 'text-gray-400 hover:text-gray-900'}`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="activeTabSoftware" className="absolute bottom-0 left-0 right-0 h-1 bg-[#41bfb8] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tabs Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="space-y-12">
                                        <div className="prose prose-xl max-w-none text-gray-600 work leading-relaxed font-medium">
                                            {software.description}
                                        </div>
                                        {software.longDescription && (
                                            <div className="p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 text-gray-700 work text-lg leading-relaxed shadow-inner">
                                                {software.longDescription}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'features' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {software.features?.map((feature, idx) => (
                                            <div key={idx} className="group flex items-center gap-5 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-[#41bfb8]/20 transition-all">
                                                <div className="w-14 h-14 rounded-2xl bg-[#41bfb8]/10 text-[#41bfb8] flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <LuBadgeCheck size={28} />
                                                </div>
                                                <span className="text-gray-800 font-extrabold text-base tracking-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'support' && (
                                    <div className="space-y-8">
                                        <div className="bg-emerald-50/30 p-12 rounded-[3rem] border border-emerald-100/50 space-y-6">
                                            <h3 className="text-2xl font-black text-emerald-800 outfit tracking-tighter uppercase">Deployment Promise</h3>
                                            <p className="text-emerald-700 work font-medium text-lg leading-relaxed">
                                                Our team provides full technical assistance for the initial deployment. Every license includes a guaranteed integrity check and 24/7 disaster recovery support for the first 30 days.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {software.requirements?.map((req, idx) => (
                                                <div key={idx} className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="w-2 h-2 bg-[#F79952] rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-gray-600 work font-bold">{req}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Sidebar: Registry Analysis */}
                    <div className="lg:col-span-4 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#41bfb8]/10 blur-3xl rounded-full"></div>
                            <h3 className="text-xl font-black text-white outfit uppercase tracking-widest relative z-10">System Registry</h3>
                            <div className="space-y-6 relative z-10">
                                {[
                                    { label: 'Core Version', val: software.version, type: 'badge' },
                                    { label: 'Initial Release', val: new Date(software.publishDate || software.createdAt).toLocaleDateString() },
                                    { label: 'Last Update', val: new Date(software.lastUpdate).toLocaleDateString() },
                                    { label: 'Code Status', val: 'Verified Integrity', color: 'text-[#41bfb8]' }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                        {item.type === 'badge' ? (
                                            <span className="bg-[#41bfb8] text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">{item.val}</span>
                                        ) : (
                                            <span className={`text-sm font-extrabold outfit ${item.color || 'text-white'}`}>{item.val}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-4 relative z-10">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Environment Ecosystem</p>
                                <div className="flex flex-wrap gap-2">
                                    {software.technologies?.map((tech, idx) => (
                                        <span key={idx} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest group hover:bg-[#41bfb8]/20 hover:text-white transition-all cursor-default">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Recommended Systems */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="container mx-auto px-4 lg:px-16">
                    <div className="flex items-center justify-between mb-16 px-4">
                        <div className="space-y-2">
                            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 outfit tracking-tighter uppercase">Related Systems</h2>
                            <p className="text-gray-500 work font-bold text-lg">Recommended for your ecosystem</p>
                        </div>
                        <button
                            onClick={() => router.push('/software')}
                            className="hidden sm:flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-[#41bfb8] transition-all group"
                        >
                            Explore All <LuChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommended.map((item) => (
                            <Link
                                key={item._id}
                                href={`/software/${item._id}`}
                                className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="aspect-[4/3] rounded-[1.8rem] overflow-hidden mb-6 relative">
                                    <img src={item.images?.[0] || item.image || "/images/placeholder.png"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur rounded-xl text-[9px] font-black uppercase tracking-widest">{item.softwareType}</div>
                                </div>
                                <div className="px-2 space-y-3">
                                    <h3 className="text-lg font-black text-gray-900 outfit line-clamp-1 group-hover:text-[#41bfb8] transition-colors">{item.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black text-gray-900 outfit tracking-tighter">৳{item.price?.toLocaleString()}</span>
                                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                            <LuStar className="fill-current" /> {item.rating || '5.0'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SoftwareDetailsPage;
