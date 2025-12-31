"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchWebsiteById, fetchWebsites } from "@/redux/websiteSlice";
import { useLanguage } from "@/context/LanguageContext";
import { addToCart } from "@/redux/cartSlice";
import {
    LuExternalLink, LuBadgeCheck, LuGlobe, LuClock,
    LuShieldCheck, LuShoppingCart, LuStar, LuShare2, LuCalendar, LuLayers, LuPlus, LuArrowRight,
    LuLayoutGrid, LuInfo, LuSettings, LuChevronRight
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const WebsiteDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { singleWebsite: website, websiteList = [], loading, error } = useSelector((state) => state.websites || {});
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState("overview");
    const [recommended, setRecommended] = useState([]);
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        if (id) {
            dispatch(fetchWebsiteById(id));
        }
        dispatch(fetchWebsites());
    }, [id, dispatch]);

    useEffect(() => {
        if (websiteList.length > 0 && id) {
            setRecommended(websiteList.filter(item => item._id !== id).slice(0, 4));
        }
    }, [websiteList, id]);

    const handleAddToCart = () => {
        if (!website) return;
        dispatch(addToCart({
            id: website._id,
            title: website.title,
            price: website.price,
            image: website.images?.[0] || website.image || "/images/placeholder.png",
            type: 'website'
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
                <p className="mt-6 text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Assembling Interface...</p>
            </div>
        );
    }

    if (error || !website) {
        return (
            <div className="text-center py-20 min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8">
                    <LuGlobe className="text-gray-200 text-4xl" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 outfit">Resource Unavailable</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">{error || "The requested website project could not be located in our secure database."}</p>
                <button
                    onClick={() => router.push('/website')}
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
                    animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[-5%] w-[900px] h-[900px] bg-[#41bfb8]/5 rounded-full blur-[140px]"
                ></motion.div>
                <motion.div
                    animate={{ y: [0, 50, 0], x: [0, -30, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[40%] left-[-15%] w-[700px] h-[700px] bg-[#F79952]/5 rounded-full blur-[120px]"
                ></motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(65,191,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(65,191,184,0.03)_1px,transparent_1px)] bg-[size:45px_45px]"></div>
            </div>

            {/* Product Hero */}
            <section className="relative pt-36 pb-24 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-16 container-max-width-8xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Left: Interactive Showcase */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative p-4 bg-white/50 backdrop-blur-3xl border border-white rounded-[3.5rem] shadow-2xl shadow-[#41bfb8]/10 overflow-hidden"
                            >
                                <img
                                    src={website.images?.[0] || website.image || "/images/placeholder.png"}
                                    alt={website.title}
                                    className="w-full aspect-[16/10] object-cover rounded-[3rem] shadow-sm transform transition-transform duration-1000 group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                                    <div className="flex gap-4">
                                        <button className="px-8 py-3 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl flex items-center gap-2 hover:bg-[#41bfb8] hover:text-white transition-all">
                                            <LuLayers /> Explore Gallery
                                        </button>
                                        {website.previewUrl && (
                                            <a href={website.previewUrl} target="_blank" className="px-8 py-3 bg-[#41bfb8] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform">
                                                <LuExternalLink /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Gallery Gird */}
                            <div className="grid grid-cols-4 gap-6">
                                {website.images?.slice(1, 5).map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="group relative aspect-square bg-white rounded-[2rem] border border-gray-100 overflow-hidden cursor-pointer shadow-sm hover:border-[#41bfb8] transition-all"
                                    >
                                        <img src={img} alt="Shot" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Info Architecture */}
                        <div className="lg:col-span-5 space-y-10 relative">
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#41bfb8]/10 text-[#26a69a] rounded-xl text-xs font-black uppercase tracking-[0.2em] work"
                                >
                                    <LuGlobe className="animate-pulse" size={14} /> {website.projectType || 'Premium Architecture'}
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className={`text-4xl lg:text-6xl font-black text-gray-900 outfit leading-[0.95] tracking-tighter ${bengaliClass}`}
                                >
                                    {website.title}
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-wrap items-center gap-8"
                                >
                                    <div className="flex items-center gap-2 bg-teal-50/50 px-5 py-2.5 rounded-2xl border border-teal-100/50">
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map((s) => <LuStar key={s} size={14} className="fill-current" />)}
                                        </div>
                                        <span className="font-black text-teal-900 text-sm outfit">{website.rating || '5.0'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-[#F79952] rounded-full animate-pulse shadow-[0_0_15px_rgba(247,153,82,0.5)]"></div>
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest work">{website.salesCount || '500'}+ Active Deployments</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Sticky Price Hub */}
                            <div className="sticky top-24">
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-[#41bfb8] via-[#F79952] to-[#41bfb8] rounded-[3.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
                                    <div className="relative bg-white/80 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white shadow-2xl space-y-8">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-end gap-3 mb-1">
                                                    <span className="text-5xl font-black text-gray-900 outfit tracking-tighter">৳{website.price?.toLocaleString()}</span>
                                                    {website.offerPrice && (
                                                        <span className="text-xl text-gray-400 line-through font-bold pb-1">৳{website.offerPrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-black text-[#41bfb8] uppercase tracking-[0.4em] work">Fully Synchronized System</p>
                                            </div>
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-inner border border-slate-50 flex items-center justify-center text-[#F79952]">
                                                <LuShieldCheck size={24} />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <button
                                                    onClick={handleBuyNow}
                                                    className="group relative flex items-center justify-center gap-3 py-6 bg-gray-900 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-[0.98] overflow-hidden"
                                                >
                                                    <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                    <span>Acquire Now</span>
                                                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                                </button>
                                                <button
                                                    onClick={handleAddToCart}
                                                    className="group flex items-center justify-center gap-3 py-6 bg-white border-2 border-slate-100 text-gray-900 rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-slate-200/50 transition-all hover:border-[#41bfb8] hover:text-[#41bfb8] active:scale-[0.98]"
                                                >
                                                    <LuPlus size={16} /> Add to Vault
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-100 space-y-6">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ready-to-Deploy Assets:</h4>
                                            <ul className="grid grid-cols-1 gap-4">
                                                {[
                                                    'Full Responsive Frontend',
                                                    'Scaleable Backend Core',
                                                    'Database Schema Architecture',
                                                    '1 Month Premium Setup Support'
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700 work">
                                                        <div className="w-1.5 h-1.5 bg-[#41bfb8] rounded-full"></div>
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
                        <div className="flex gap-12 border-b border-slate-100 mb-12 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'overview', label: 'Project Narrative', icon: LuInfo },
                                { id: 'technical', label: 'Architecture', icon: LuSettings },
                                { id: 'support', label: 'Deployment & Support', icon: LuShieldCheck }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2.5 pb-6 text-xs font-black uppercase tracking-[0.25em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-[#41bfb8]' : 'text-gray-400 hover:text-gray-900'}`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="activeTabWebsite" className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#41bfb8] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tabs Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.99 }}
                                transition={{ duration: 0.4 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="space-y-12">
                                        <div className="prose prose-2xl max-w-none text-gray-600 work leading-[1.6] font-medium text-justify">
                                            {website.description}
                                        </div>
                                        {website.longDescription && (
                                            <div className="p-12 bg-teal-50/20 rounded-[4rem] border border-teal-100/30 text-gray-700 work text-xl leading-relaxed shadow-sm">
                                                {website.longDescription}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'technical' && (
                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {website.features?.map((feature, idx) => (
                                                <div key={idx} className="group flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-[#41bfb8]/20 transition-all">
                                                    <div className="w-16 h-16 rounded-2xl bg-[#F79952]/10 text-[#F79952] flex items-center justify-center group-hover:rotate-12 transition-transform">
                                                        <LuBadgeCheck size={32} />
                                                    </div>
                                                    <span className="text-gray-800 font-extrabold text-lg tracking-tight">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'support' && (
                                    <div className="space-y-10">
                                        <div className="bg-gray-900 p-12 rounded-[4rem] text-white space-y-8 relative overflow-hidden">
                                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#41bfb8]/10 blur-[100px] rounded-full"></div>
                                            <h3 className="text-3xl font-black outfit uppercase tracking-tighter italic">MotionBoss Deployment Standard</h3>
                                            <p className="text-gray-400 work text-lg font-medium leading-relaxed max-w-3xl relative z-10">
                                                We don't just sell code; we deliver platforms. Our technical engineering team provides a white-glove setup service for every website acquisition. This includes server configuration, database mapping, and final UI optimization for your specific requirements.
                                            </p>
                                            <div className="flex gap-8 relative z-10">
                                                <div className="flex flex-col">
                                                    <span className="text-4xl font-black outfit text-[#41bfb8]">24H</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Response Guarantee</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-4xl font-black outfit text-[#F79952]">LIFETIME</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Core Updates</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Sidebar: Project Registry */}
                    <div className="lg:col-span-4 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-10"
                        >
                            <h3 className="text-xl font-black text-gray-900 outfit uppercase tracking-widest flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-[#41bfb8] rounded-full"></div>
                                Project Registry
                            </h3>
                            <div className="space-y-8">
                                {[
                                    { label: 'Integration Status', val: 'MB-Verified', color: 'text-[#41bfb8]' },
                                    { label: 'Platform Engine', val: website.projectType, type: 'badge' },
                                    { label: 'Initial Release', val: new Date(website.publishDate || website.createdAt).toLocaleDateString() },
                                    { label: 'Global Registry', val: `#MBW-${website._id?.slice(-6).toUpperCase()}` }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                        {item.type === 'badge' ? (
                                            <span className="bg-gray-900 text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest">{item.val}</span>
                                        ) : (
                                            <span className={`text-sm font-black outfit ${item.color || 'text-gray-900'}`}>{item.val}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6 pt-6">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ecosystem Stack</p>
                                <div className="flex flex-wrap gap-2.5">
                                    {website.technologies?.map((tech, idx) => (
                                        <span key={idx} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all cursor-default shadow-sm hover:shadow-xl">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Related Projects */}
            <section className="py-32 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-4 lg:px-16">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-20 gap-8 px-6">
                        <div className="space-y-3">
                            <h2 className="text-3xl lg:text-6xl font-black text-gray-900 outfit tracking-tighter uppercase italic">Strategic Alternatives</h2>
                            <p className="text-gray-500 work font-bold text-xl">Compatible architectures for your roadmap</p>
                        </div>
                        <button
                            onClick={() => router.push('/website')}
                            className="w-fit flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-200 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:border-[#41bfb8] hover:text-[#41bfb8] transition-all group"
                        >
                            Global Marketplace <LuChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {recommended.map((item) => (
                            <Link
                                key={item._id}
                                href={`/website/${item._id}`}
                                className="group bg-white rounded-[3rem] p-5 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-700"
                            >
                                <div className="aspect-[16/11] rounded-[2.5rem] overflow-hidden mb-8 relative">
                                    <img src={item.images?.[0] || item.image || "/images/placeholder.png"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <div className="absolute top-5 left-5 px-4 py-2 bg-white/95 backdrop-blur rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl">{item.projectType}</div>
                                </div>
                                <div className="px-3 space-y-4">
                                    <h3 className="text-xl font-black text-gray-900 outfit line-clamp-1 group-hover:text-[#41bfb8] transition-colors">{item.title}</h3>
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry Fee</span>
                                            <span className="text-2xl font-black text-gray-900 outfit tracking-tighter">৳{item.price?.toLocaleString()}</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-amber-500 group-hover:bg-[#41bfb8] group-hover:text-white transition-all">
                                            <LuArrowRight />
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

export default WebsiteDetailsPage;
