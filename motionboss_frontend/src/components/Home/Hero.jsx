"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LuSearch, LuDownload, LuUsers, LuStar, LuLayoutTemplate, LuCircleCheck } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState({ users: 0, downloads: 0, rating: 0, templates: 0 });
    const [typedText, setTypedText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [heroData, setHeroData] = useState(null);
    const { t, language } = useLanguage();

    // Apply Bengali font class when language is Bengali
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

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
                    // Set dynamic texts based on language
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
        fetchRealStats();
    }, []);

    useEffect(() => {
        setIsVisible(true);

        // Get target values from real stats API (database counts) or defaults
        const targetUsers = realStats?.activeUsers || 0;
        const targetDownloads = realStats?.downloads || 0;
        const targetRating = realStats?.avgRating || 4.8;
        const targetProducts = realStats?.totalProducts || 0;

        // Counter animation
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounts({
                users: Math.floor(targetUsers * progress),
                downloads: Math.floor(targetDownloads * progress),
                rating: Math.min(targetRating, targetRating * progress),
                templates: Math.floor(targetProducts * progress)
            });

            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, [realStats]);

    // Typing effect
    useEffect(() => {
        if (!dynamicTexts || dynamicTexts.length === 0) return;

        const currentWord = dynamicTexts[currentTextIndex];
        let i = 0;
        let isDeleting = false;
        let speed = 100;

        const type = () => {
            const current = isDeleting
                ? currentWord.substring(0, i - 1)
                : currentWord.substring(0, i + 1);

            setTypedText(current);

            if (!isDeleting && current === currentWord) {
                isDeleting = true;
                speed = 2000; // Pause at end
            } else if (isDeleting && current === "") {
                isDeleting = false;
                setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
                speed = 500;
            } else {
                speed = isDeleting ? 50 : 100;
                i = isDeleting ? i - 1 : i + 1;
            }

            setTimeout(type, speed);
        };

        const timer = setTimeout(type, speed);
        return () => clearTimeout(timer);
    }, [currentTextIndex, dynamicTexts]);

    const getBadgeText = () => {
        if (heroData?.badge?.text) {
            return language === 'bn' ? heroData.badge.textBn : heroData.badge.text;
        }
        return language === 'bn' ? 'আমাদের নতুন কালেকশন দেখুন' : 'Explore our newest collection';
    };

    const getHeading = () => {
        if (heroData?.heading) {
            return language === 'bn' ? heroData.heading.textBn : heroData.heading.text;
        }
        return language === 'bn' ? 'আপনার ভবিষ্যৎ গড়ুন' : 'Elevate Your Digital Success with';
    };

    const getDescription = () => {
        if (heroData?.description) {
            return {
                text: language === 'bn' ? heroData.description.textBn : heroData.description.text,
                brand: language === 'bn' ? heroData.description.brandBn : heroData.description.brand
            };
        }
        return {
            text: language === 'bn' ? 'সবচেয়ে নির্ভরযোগ্য লার্নিং প্ল্যাটফর্ম' : 'The most powerful learning and creative platform by',
            brand: 'Motion Boss'
        };
    };

    const getFeatures = () => {
        if (heroData?.features && heroData.features.length > 0) {
            return heroData.features.map(f => ({
                icon: LuCircleCheck,
                text: language === 'bn' ? f.textBn : f.text
            }));
        }
        return [
            { icon: LuCircleCheck, text: language === 'bn' ? 'তাৎক্ষণিক অ্যাক্সেস' : 'Instant Access' },
            { icon: LuCircleCheck, text: language === 'bn' ? 'আজীবন আপডেট' : 'Lifetime Updates' },
            { icon: LuCircleCheck, text: language === 'bn' ? 'প্রিমিয়াম সাপোর্ট' : 'Premium Support' },
            { icon: LuCircleCheck, text: language === 'bn' ? 'মানি ব্যাক গ্যারান্টি' : 'Money Back Guarantee' },
        ];
    };

    const getSearchPlaceholder = () => {
        if (heroData?.searchPlaceholder) {
            return language === 'bn' ? heroData.searchPlaceholder.textBn : heroData.searchPlaceholder.text;
        }
        return language === 'bn' ? 'কোর্স, সফটওয়্যার, থিম খুঁজুন...' : 'Search courses, software, themes...';
    };

    const stats = [
        { icon: LuUsers, value: counts.users.toLocaleString(), label: language === 'bn' ? 'সক্রিয় শিক্ষার্থী' : 'Active Learners', color: 'bg-blue-500' },
        { icon: LuDownload, value: counts.downloads.toLocaleString(), label: language === 'bn' ? 'ডাউনলোড' : 'Downloads', color: 'bg-teal-500' },
        { icon: LuStar, value: counts.rating.toFixed(1), label: language === 'bn' ? 'গড় রেটিং' : 'Avg Rating', color: 'bg-amber-500' },
        { icon: LuLayoutTemplate, value: counts.templates.toLocaleString(), label: language === 'bn' ? 'মোট প্রোডাক্ট' : 'Products', color: 'bg-purple-500' },
    ];

    const features = getFeatures();
    const description = getDescription();

    return (
        <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-[#f0fffe] via-[#e8f9f8] to-[#f5f5ff]">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-400/10 to-transparent blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-400/8 rounded-full blur-3xl pointer-events-none"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                    {/* Top Heading/Badge */}
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
                        <span className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        </span>
                        <span className={`text-sm font-medium text-gray-700 ${bengaliClass}`}>
                            {getBadgeText()}
                        </span>
                        {heroData?.badge?.showNew !== false && (
                            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-bold rounded-full uppercase italic">New</span>
                        )}
                    </div>

                    {/* Main Heading */}
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 ${bengaliClass}`}>
                        {getHeading()}
                        <br />
                        <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            {typedText}
                            <span className="animate-pulse">|</span>
                        </span>
                    </h1>

                    {/* Description with Brand */}
                    <div className="mb-6">
                        <p className={`text-lg text-gray-600 ${bengaliClass}`}>
                            {description.text} <span className="font-bold text-teal-600">{description.brand}</span>
                            {language === 'bn' ? ' দ্বারা তৈরি।' : ''}
                        </p>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                                <feature.icon className="w-4 h-4 text-teal-500" />
                                <span className={`text-sm text-gray-700 ${bengaliClass}`}>{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-10">
                        <div className="relative flex items-center bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                            <LuSearch className="absolute left-5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={getSearchPlaceholder()}
                                className={`w-full pl-12 pr-32 py-4 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none ${bengaliClass}`}
                            />
                            <Link
                                href={`/courses${searchQuery ? `?search=${searchQuery}` : ''}`}
                                className="absolute right-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full transition-colors"
                            >
                                {language === 'bn' ? 'খুঁজুন' : 'Search'}
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                    <p className={`text-xs text-gray-500 ${bengaliClass}`}>{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
