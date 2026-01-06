"use client";

import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { LuSearch, LuArrowRight, LuPlay, LuZap, LuUsers, LuDownload, LuStar, LuLayoutTemplate, LuSmile, LuTrophy, LuCode, LuGlobe, LuSparkles, LuRocket, LuBadgeCheck } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://motionboss-backend.vercel.app/api';

const Hero = () => {
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const [searchQuery, setSearchQuery] = useState("");
    const [heroData, setHeroData] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mouse parallax tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            mouseX.set((clientX - innerWidth / 2) / 50);
            mouseY.set((clientY - innerHeight / 2) / 50);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    // Mouse parallax effects - MUST BE TOP LEVEL
    const mouseParallaxX1 = useTransform(smoothMouseX, v => v * -1.5);
    const mouseParallaxY1 = useTransform(smoothMouseY, v => v * -1.5);
    const mouseParallaxX2 = useTransform(smoothMouseX, v => v * 2);
    const mouseParallaxY2 = useTransform(smoothMouseY, v => v * 2);
    const mouseParallaxX3 = useTransform(smoothMouseX, v => v * -0.8);
    const mouseParallaxY3 = useTransform(smoothMouseY, v => v * -0.8);

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
                return { text, brand: brand || 'ejobs it' };
            }
        }
        return {
            text: language === 'bn' ? 'সবচেয়ে নির্ভরযোগ্য লার্নিং প্ল্যাটফর্ম' : 'The most powerful learning and creative platform by',
            brand: 'ejobs it'
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
            {/* Premium Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Animated Gradient Mesh */}
                <div className="absolute inset-0 opacity-30 dark:opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.15),transparent)]" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_60%_60%_at_100%_0%,rgba(247,153,82,0.1),transparent)]" />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_60%_60%_at_0%_100%,rgba(59,130,246,0.1),transparent)]" />
                </div>

                {/* Large Brand Text with Parallax */}
                <motion.div
                    style={isMobile ? {} : { y: y1 }}
                    className={`absolute -top-[5%] -left-[5%] text-[25vw] font-black text-gray-950/[0.03] dark:text-white/[0.015] select-none leading-none whitespace-nowrap ${headingFont}`}
                >
                    EJOBSIT
                </motion.div>

                {/* 3D Floating Orbs with Mouse Parallax */}
                <motion.div
                    style={isMobile ? {} : { x: smoothMouseX, y: smoothMouseY }}
                    className="absolute top-[15%] right-[15%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-500/10 blur-[80px] animate-float-slow"
                />
                <motion.div
                    style={isMobile ? {} : {
                        x: mouseParallaxX1,
                        y: mouseParallaxY1
                    }}
                    className="absolute top-[40%] left-[10%] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-blue-400/15 to-indigo-500/10 blur-[70px] animate-float-medium"
                />
                <motion.div
                    style={isMobile ? {} : {
                        x: mouseParallaxX2,
                        y: mouseParallaxY2
                    }}
                    className="absolute bottom-[20%] right-[25%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-orange-400/15 to-amber-500/10 blur-[90px] animate-float-fast"
                />
                <motion.div
                    style={isMobile ? {} : {
                        x: mouseParallaxX3,
                        y: mouseParallaxY3
                    }}
                    className="absolute top-[60%] right-[5%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-purple-400/10 to-pink-500/5 blur-[60px] animate-float-slow"
                />

                {/* Glowing Accent Lines */}
                <div className="absolute top-1/3 left-0 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
                <div className="absolute top-2/3 right-0 w-[40%] h-[1px] bg-gradient-to-l from-transparent via-orange-500/20 to-transparent" />

                {/* Premium Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_40%,transparent_100%)]" />

                {/* Floating Particles */}
                <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-teal-500/40"
                            style={{
                                left: `${15 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.3, 0.8, 0.3],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-16 relative z-10 -mt-9">
                <div className="max-w-6xl">
                    {/* Premium Badge with Shimmer Effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-gray-900/5 via-teal-500/10 to-gray-900/5 dark:from-white/5 dark:via-teal-500/10 dark:to-white/5 border border-gray-200/50 dark:border-white/10 mb-6 backdrop-blur-xl shadow-lg shadow-teal-500/5 relative overflow-hidden group"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="relative flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
                                <LuSparkles className="text-white animate-pulse" size={12} />
                            </div>
                            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase text-gray-700 dark:text-gray-300 ${bengaliClass}`}>
                                {language === 'bn' ? 'প্রিমিয়াম লার্নিং প্ল্যাটফর্ম' : 'PREMIUM LEARNING PLATFORM'}
                            </span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 animate-pulse" />
                    </motion.div>

                    {/* Main Title with Animated Gradient */}
                    <div className="mb-6">
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`font-black tracking-tight flex flex-col ${language === 'bn' ? 'hind-siliguri text-3xl sm:text-5xl lg:text-[60px] leading-[1.1] gap-2' : 'font-outfit text-4xl sm:text-6xl lg:text-[70px] leading-[0.95] gap-2'}`}
                        >
                            {/* First Line - Animated Gradient */}
                            <motion.span
                                className={`bg-gradient-to-r from-[#F79952] via-amber-500 to-[#F79952] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient ${language === 'bn' ? 'hind-siliguri' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                {getHeading()}
                            </motion.span>

                            {/* Second Line - Teal Color with Line */}
                            <motion.span
                                className={`inline-flex items-center gap-4 flex-wrap ${language === 'bn' ? 'hind-siliguri font-bold' : 'italic font-serif'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <span className="text-primary">
                                    {getHeadingLine2()}
                                </span>
                                <motion.span
                                    className={`h-[3px] ${language === 'bn' ? 'w-12 lg:w-24' : 'w-16 lg:w-32'} bg-gradient-to-r from-teal-500 to-cyan-500 inline-block rounded-full`}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                />
                            </motion.span>

                            {/* Third Line - Dark Text with Glow */}
                            <motion.span
                                className={`text-gray-900 dark:text-white drop-shadow-sm ${language === 'bn' ? 'hind-siliguri' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                {getHeadingLine3()}
                            </motion.span>
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

                            {/* Premium Search Bar with Glassmorphism */}
                            <div className="max-w-xl mb-6">
                                <div className="relative group">
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500" />

                                    <div className="relative flex items-center bg-white dark:bg-white/5 border border-gray-400/20 dark:border-white/30 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg shadow-gray-200/50 dark:shadow-none">
                                        <div className="absolute left-5 w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 flex items-center justify-center">
                                            <LuSearch className="w-5 h-5 text-teal-500" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={getSearchPlaceholder()}
                                            className={`w-full pl-16 pr-36 py-4 bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none ${bengaliClass}`}
                                        />
                                        <Link
                                            href={`/courses${searchQuery ? `?search=${searchQuery}` : ''}`}
                                            className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/30 flex items-center gap-2"
                                        >
                                            <LuSearch className="w-4 h-4" />
                                            {language === 'bn' ? 'খুঁজুন' : 'Search'}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Premium CTA Buttons */}
                            <div className="flex flex-wrap items-center gap-5">
                                {/* Primary CTA - Gradient with Shine */}
                                <Link
                                    href="/courses"
                                    className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 bg-[length:200%_auto] text-white rounded-2xl font-bold text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40"
                                >
                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                                    <span className={`relative z-10 flex items-center gap-3 ${headingFont}`}>
                                        <LuRocket className="w-5 h-5" />
                                        {language === 'bn' ? 'কোর্স নিন' : 'GET COURSES'}
                                        <LuArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>

                                {/* Secondary CTA - Watch Demo */}
                                <button className="flex items-center gap-4 group cursor-pointer">
                                    <div className="relative">
                                        {/* Pulsing Ring */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-[#F79952]/50 animate-ping opacity-30" />
                                        <div className="relative w-14 h-14 rounded-2xl border-2 border-gray-400/20 dark:border-white/40 flex items-center justify-center bg-white dark:bg-white/5 backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-[#F79952] group-hover:to-amber-500 group-hover:border-transparent transition-all duration-500 shadow-lg">
                                            <LuPlay className="ml-1 text-[#F79952] group-hover:text-white transition-colors" size={20} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className={`font-black text-sm tracking-[0.15em] uppercase text-gray-900 dark:text-white ${headingFont}`}>
                                            {language === 'bn' ? 'ভিডিও দেখুন' : 'Watch Demo'}
                                        </span>
                                        <span className="text-xs text-gray-500">2 min video</span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>

                        {/* Premium Stats Grid with Glassmorphism */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="hidden lg:grid grid-cols-2 gap-6 translate-x-[480px]"
                        >
                            {stats.map((item, i) => (
                                <Link
                                    href={item.href}
                                    key={i}
                                    className="relative group cursor-pointer"
                                >
                                    <div className={`relative p-8 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-gray-400/20 dark:border-white/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                                        {/* Icon */}
                                        <div className="relative z-10 mb-5">
                                            <div className={`w-14 h-14 rounded-xl ${i === 0 ? 'bg-teal-500/10' : 'bg-[#F79952]/10'} border ${i === 0 ? 'border-teal-500/20' : 'border-[#F79952]/20'} flex items-center justify-center`}>
                                                <item.icon className={`${item.color}`} size={28} />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <div className={`${headingFont} text-4xl font-black mb-1 ${i === 0 ? 'text-teal-600 dark:text-teal-500' : 'text-[#F79952]'}`}>
                                                {item.value}
                                            </div>
                                            <div className={`text-sm font-semibold text-gray-600 dark:text-gray-400 ${bengaliClass} flex items-center gap-2`}>
                                                {item.label}
                                                <LuArrowRight className={`w-4 h-4 ${item.color} group-hover:translate-x-1 transition-transform`} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Premium Marquee with Glassmorphism */}
            <div className="absolute bottom-12 left-0 w-full overflow-hidden z-20">
                <div className="relative border-y border-gray-100 dark:border-white/20 bg-white/70 dark:bg-black/70 backdrop-blur-2xl py-6">
                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />

                    <div className="flex whitespace-nowrap animate-marquee-professional">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-16 px-8">
                                {marqueeItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-16 group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl ${idx === 0 ? 'bg-gradient-to-r from-[#F79952]/10 to-amber-500/10' : 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10'} flex items-center justify-center`}>
                                                <item.icon className={`${item.iconColor}`} size={18} />
                                            </div>
                                            <span className={`text-xl font-bold tracking-[0.1em] text-gray-800 dark:text-gray-200 uppercase ${headingFont} group-hover:text-teal-500 transition-colors`}>
                                                {item.text}
                                            </span>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-[#F79952]" />
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
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-30px); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-medium 6s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </section>
    );
};

export default Hero;

