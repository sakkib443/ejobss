"use client";

import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { LuSearch, LuArrowRight, LuPlay, LuZap, LuUsers, LuDownload, LuStar, LuLayoutTemplate, LuSmile, LuTrophy, LuCode, LuGlobe } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const Hero = () => {
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const [searchQuery, setSearchQuery] = useState("");
    const [heroData, setHeroData] = useState(null);

    // Parallax effects - exactly like AboutHero
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const headingFont = "font-outfit";

    // Typing animation texts from API or defaults
    const [dynamicTexts, setDynamicTexts] = useState(["Professional Courses", "Software Tools", "Web Development"]);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    // Fetch hero design from API
    useEffect(() => {
        const fetchHeroDesign = async () => {
            try {
                const res = await fetch(`${API_URL}/design/hero`);
                const data = await res.json();
                if (data.success && data.data?.heroContent) {
                    setHeroData(data.data.heroContent);
                    if (language === 'bn' && data.data.heroContent.dynamicTextsBn?.length > 0) {
                        setDynamicTexts(data.data.heroContent.dynamicTextsBn);
                    } else if (data.data.heroContent.dynamicTexts?.length > 0) {
                        setDynamicTexts(data.data.heroContent.dynamicTexts);
                    }
                }
            } catch (error) {
                console.error('Error fetching hero design:', error);
            }
        };
        fetchHeroDesign();
    }, [language]);

    // Fetch real stats from database
    const [realStats, setRealStats] = useState(null);
    const [softwareCount, setSoftwareCount] = useState(0);
    const [websiteCount, setWebsiteCount] = useState(0);

    useEffect(() => {
        const fetchRealStats = async () => {
            try {
                const res = await fetch(`${API_URL}/stats/dashboard`);
                const data = await res.json();
                if (data.success && data.data) {
                    setRealStats(data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        // Fetch software count
        const fetchSoftwareCount = async () => {
            try {
                const res = await fetch(`${API_URL}/software`);
                const data = await res.json();
                console.log('Software API Response:', data);
                // Try meta.total first (pagination total), then array length
                if (data.meta?.total) {
                    setSoftwareCount(data.meta.total);
                } else if (data.data && Array.isArray(data.data)) {
                    setSoftwareCount(data.data.length);
                } else if (data.software && Array.isArray(data.software)) {
                    setSoftwareCount(data.software.length);
                } else if (Array.isArray(data)) {
                    setSoftwareCount(data.length);
                }
            } catch (error) {
                console.error('Error fetching software:', error);
            }
        };

        // Fetch website count
        const fetchWebsiteCount = async () => {
            try {
                const res = await fetch(`${API_URL}/websites`);
                const data = await res.json();
                console.log('Website API Response:', data);
                // Try meta.total first (pagination total), then array length
                if (data.meta?.total) {
                    setWebsiteCount(data.meta.total);
                } else if (data.data && Array.isArray(data.data)) {
                    setWebsiteCount(data.data.length);
                } else if (data.websites && Array.isArray(data.websites)) {
                    setWebsiteCount(data.websites.length);
                } else if (Array.isArray(data)) {
                    setWebsiteCount(data.length);
                }
            } catch (error) {
                console.error('Error fetching websites:', error);
            }
        };

        fetchRealStats();
        fetchSoftwareCount();
        fetchWebsiteCount();
    }, []);

    // Flip Clock Animation State
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayIndex, setDisplayIndex] = useState(0);

    // Cycle through texts with smooth flip animation
    useEffect(() => {
        if (!dynamicTexts || dynamicTexts.length === 0) return;

        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setDisplayIndex((prev) => (prev + 1) % dynamicTexts.length);
                setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
            }, 600);
            setTimeout(() => {
                setIsAnimating(false);
            }, 1200);
        }, 4000);

        return () => clearInterval(interval);
    }, [dynamicTexts]);

    const getHeading = () => {
        return language === 'bn' ? 'সেরা' : 'THE BEST';
    };

    const getHeadingLine2 = () => {
        return language === 'bn' ? 'বিজনেস সলিউশন' : 'BUSINESS SOLUTION &';
    };

    const getHeadingLine3 = () => {
        return language === 'bn' ? 'প্রিমিয়াম কোর্স' : 'PREMIUM COURSES';
    };

    const getDescription = () => {
        if (heroData?.description) {
            const text = language === 'bn' ? heroData.description.textBn : heroData.description.text;
            const brand = heroData.description.brandName;
            if (text && text.trim()) {
                return { text, brand: brand || 'Motion Boss' };
            }
        }
        return {
            text: language === 'bn' ? 'সবচেয়ে নির্ভরযোগ্য লার্নিং প্ল্যাটফর্ম' : 'The most powerful learning and creative platform by',
            brand: 'Motion Boss'
        };
    };

    const getSearchPlaceholder = () => {
        if (heroData?.searchPlaceholder) {
            return language === 'bn' ? heroData.searchPlaceholder.textBn : heroData.searchPlaceholder.text;
        }
        return language === 'bn' ? 'কোর্স, সফটওয়্যার, থিম খুঁজুন...' : 'Search courses, software, themes...';
    };

    // Stats with real data - only 2 cards like AboutHero
    const targetUsers = realStats?.activeUsers || 0;
    const targetProducts = realStats?.totalProducts || 0;

    const stats = [
        { icon: LuCode, value: `${softwareCount}+`, label: language === 'bn' ? 'সফটওয়্যার' : 'Software', color: 'text-teal-500', bgColor: 'from-teal-50 to-teal-50/50', borderColor: 'border-teal-200/50', href: '/software' },
        { icon: LuGlobe, value: `${websiteCount}+`, label: language === 'bn' ? 'ওয়েবসাইট' : 'Website', color: 'text-[#F79952]', bgColor: 'from-orange-50 to-orange-50/50', borderColor: 'border-orange-200/50', href: '/website' },
    ];

    const description = getDescription();

    // Marquee items - exactly like AboutHero
    const marqueeItems = [
        { text: 'EJOBSIT', icon: LuZap, iconColor: 'text-[#F79952]' },
        { text: language === 'bn' ? 'কোর্স' : 'Courses', icon: LuUsers, iconColor: 'text-teal-500' },
        { text: language === 'bn' ? 'সফটওয়্যার' : 'Software', icon: LuDownload, iconColor: 'text-teal-500' },
        { text: language === 'bn' ? 'থিম' : 'Themes', icon: LuZap, iconColor: 'text-[#F79952]' }
    ];

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-[#020202] transition-colors duration-700 pt-8 pb-20">
            {/* Background Texture & Decorative Elements - exactly like AboutHero */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    style={{ y: y1 }}
                    className={`absolute -top-[5%] -left-[5%] text-[25vw] font-black text-gray-950/[0.03] dark:text-white/[0.01] select-none leading-none whitespace-nowrap ${headingFont}`}
                >
                    EJOBSIT
                </motion.div>

                {/* Clean Geometric Accents */}
                <div className="absolute top-1/4 right-10 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Water Wave Effect */}
                <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden pointer-events-none z-10 opacity-30">
                    <svg className="absolute bottom-0 w-[200%] h-full animate-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path fill="url(#wave-gradient)" d="M0,60 C360,120 720,0 1080,60 C1260,90 1350,30 1440,60 L1440,120 L0,120 Z" />
                        <defs>
                            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <svg className="absolute bottom-0 w-[200%] h-full animate-wave-slow" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ animationDelay: '-2s' }}>
                        <path fill="url(#wave-gradient-2)" d="M0,80 C240,40 480,100 720,60 C960,20 1200,80 1440,40 L1440,120 L0,120 Z" />
                        <defs>
                            <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#F79952" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#F79952" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-16 relative z-10 -mt-9">
                <div className="max-w-6xl">
                    {/* Professional Badge - exactly like AboutHero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gray-900/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-4 backdrop-blur-md"
                    >
                        <LuZap className="text-teal-500 animate-bounce" size={14} />
                        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 dark:text-gray-400 ${bengaliClass}`}>
                            {language === 'bn' ? 'প্রিমিয়াম লার্নিং প্ল্যাটফর্ম' : 'PREMIUM LEARNING PLATFORM'}
                        </span>
                    </motion.div>

                    {/* Main Title - All in proper lines like AboutHero */}
                    <div className="mb-4">
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`font-black tracking-tight text-gray-900 dark:text-white flex flex-col ${language === 'bn' ? 'hind-siliguri text-3xl sm:text-5xl lg:text-[55px] leading-[1.1] gap-1' : 'font-outfit text-4xl sm:text-6xl lg:text-[65px] leading-[0.9] gap-1'}`}
                        >
                            <span className={`text-[#F79952] ${language === 'bn' ? 'hind-siliguri' : ''}`}>{getHeading()}</span>
                            <span className={`text-teal-500 ${language === 'bn' ? 'hind-siliguri font-bold' : 'italic font-serif'} inline-flex items-center gap-4`}>
                                {getHeadingLine2()}
                                <span className={`h-[3px] ${language === 'bn' ? 'w-12 lg:w-24' : 'w-16 lg:w-32'} bg-gray-900 dark:bg-white inline-block rounded-full`} />
                            </span>
                            <span className={language === 'bn' ? 'hind-siliguri' : ''}>{getHeadingLine3()}</span>
                        </motion.h1>
                    </div>

                    {/* 
                    =====================================================
                    COMMENTED OUT: Dynamic Text Section (Learn + Flip Animation)
                    Uncomment this section if you want to show the dynamic 
                    text animation like "Learn Professional Courses", etc.
                    =====================================================
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-6 flex items-center gap-x-3 flex-wrap ${bengaliClass}`}
                    >
                        <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">{language === 'bn' ? 'শিখুন' : 'Learn'}</span>

                        <div
                            className="relative overflow-hidden inline-block"
                            style={{
                                minWidth: '320px',
                                height: '1.4em',
                            }}
                        >
                            <div
                                className="absolute inset-0 flex items-center"
                                style={{
                                    transform: isAnimating ? 'translateY(-110%) scale(0.95)' : 'translateY(0) scale(1)',
                                    opacity: isAnimating ? 0 : 1,
                                    transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            >
                                <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent font-black whitespace-nowrap">
                                    {dynamicTexts[displayIndex]}
                                </span>
                            </div>

                            <div
                                className="absolute inset-0 flex items-center"
                                style={{
                                    transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(110%) scale(0.95)',
                                    opacity: isAnimating ? 1 : 0,
                                    transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            >
                                <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent font-black whitespace-nowrap">
                                    {dynamicTexts[(displayIndex + 1) % dynamicTexts.length]}
                                </span>
                            </div>

                            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white dark:from-[#020202] via-white/80 dark:via-[#020202]/80 to-transparent pointer-events-none z-10" />
                            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-white dark:from-[#020202] via-white/80 dark:via-[#020202]/80 to-transparent pointer-events-none z-10" />
                        </div>
                    </motion.div>
                    */}


                    <div className="grid lg:grid-cols-2 gap-10 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <p className={`text-sm lg:text-base text-gray-500 dark:text-gray-500 leading-relaxed mb-5 font-normal ${bengaliClass}`}>
                                {description.text} <span className="font-bold text-teal-600">{description.brand}</span>
                                {language === 'bn' ? ' দ্বারা তৈরি।' : ''}
                            </p>

                            {/* Search Bar - styled like AboutHero buttons */}
                            <div className="max-w-xl mb-5">
                                <div className="relative flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
                                    <LuSearch className="absolute left-5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={getSearchPlaceholder()}
                                        className={`w-full pl-12 pr-32 py-4 bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none ${bengaliClass}`}
                                    />
                                    <Link
                                        href={`/courses${searchQuery ? `?search=${searchQuery}` : ''}`}
                                        className="absolute right-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
                                    >
                                        {language === 'bn' ? 'খুঁজুন' : 'Search'}
                                    </Link>
                                </div>
                            </div>

                            {/* CTA Buttons - exactly like AboutHero */}
                            <div className="flex flex-wrap items-center gap-5">
                                <Link
                                    href="/courses"
                                    className="group relative px-6 py-4 bg-teal-500 text-white rounded-xl font-bold text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20"
                                >
                                    <span className={`relative z-10 flex items-center gap-2 ${headingFont}`}>
                                        <LuLayoutTemplate className="w-4 h-4" />
                                        {language === 'bn' ? 'কোর্স নিন' : 'GET COURSES'}
                                        <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>

                                <button className="flex items-center gap-4 group">
                                    <div className="w-14 h-14 rounded-2xl border-2 border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all duration-500">
                                        <LuPlay className="ml-1 text-[#F79952]" />
                                    </div>
                                    <span className={`font-black text-sm tracking-[0.2em] uppercase text-gray-900 dark:text-white ${headingFont}`}>
                                        {language === 'bn' ? 'ভিডিও দেখুন' : 'Watch Demo'}
                                    </span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Stats Grid - ONLY 2 CARDS like AboutHero */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="hidden lg:grid grid-cols-2 gap-6"
                        >
                            {stats.map((item, i) => (
                                <Link
                                    href={item.href}
                                    key={i}
                                    className={`relative p-8 rounded-[32px] bg-gradient-to-br ${item.bgColor} border ${item.borderColor} dark:bg-white/5 dark:border-white/10 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group overflow-hidden`}
                                >
                                    {/* Background Glow */}
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${item.bgColor} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />

                                    {/* Icon */}
                                    <div className={`relative z-10 w-14 h-14 rounded-2xl bg-white dark:bg-white/10 shadow-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                        <item.icon className={`${item.color}`} size={28} />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className={`${headingFont} text-5xl font-black text-gray-900 dark:text-white mb-1`}>{item.value}</div>
                                        <div className={`text-sm font-bold tracking-wide text-gray-600 dark:text-gray-400 ${bengaliClass} flex items-center gap-2`}>
                                            {item.label}
                                            <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Refined Professional Marquee - at bottom of hero section */}
            <div className="absolute bottom-12 left-0 w-full overflow-hidden z-20">
                <div className="relative border-y border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-2xl py-5">
                    <div className="flex whitespace-nowrap animate-marquee-professional">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-16 px-8">
                                {marqueeItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-16 group">
                                        <div className="flex items-center gap-4">
                                            <item.icon className={`${item.iconColor} opacity-70 group-hover:opacity-100 transition-opacity`} size={18} />
                                            <span className={`text-xl font-bold tracking-[0.1em] text-gray-800 dark:text-gray-200 uppercase ${headingFont}`}>
                                                {item.text}
                                            </span>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#F79952]/50" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee-professional {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-professional {
                    animation: marquee-professional 40s linear infinite;
                    display: inline-flex;
                    width: max-content;
                }
                @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-wave {
                    animation: wave 8s linear infinite;
                }
                .animate-wave-slow {
                    animation: wave 12s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default Hero;
