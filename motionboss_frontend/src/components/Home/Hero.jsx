"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiBookOpen, FiUsers, FiAward, FiTrendingUp } from "react-icons/fi";
import { LuSparkles, LuGraduationCap, LuRocket } from "react-icons/lu";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState({ courses: 0, students: 0, placement: 0 });
    const { t, language } = useLanguage();

    // Apply Bengali font class when language is Bengali
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        setIsVisible(true);

        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounts({
                courses: Math.floor(50 * progress),
                students: Math.floor(4200 * progress),
                placement: Math.floor(92 * progress)
            });

            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative overflow-hidden lg:py-12 bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
            {/* Animated Background Gradient Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#41bfb8]/20 to-[#41bfb8]/5 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-[#F79952]/20 to-[#F79952]/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-[#41bfb8]/15 to-purple-200/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

            {/* Floating Geometric Shapes */}
            <div className="absolute bottom-20 right-[5%] w-16 h-16 border-2 border-[#41bfb8]/20 rounded-lg animate-float rotate-12"></div>
            <div className="absolute top-40 left-[10%] w-12 h-12 border-2 border-[#F79952]/20 rounded-full animate-float animation-delay-1000"></div>
            <div className="absolute bottom-32 right-[25%] w-10 h-10 bg-[#41bfb8]/10 rounded-lg animate-float animation-delay-2000 rotate-45"></div>
            <div className="absolute top-1/2 left-[5%] w-8 h-8 border-2 border-[#41bfb8]/15 rounded-full animate-float animation-delay-3000"></div>

            {/* Floating Dots */}
            <div className="absolute top-24 right-1/4 w-3 h-3 bg-[#41bfb8] rounded-full animate-ping opacity-40"></div>
            <div className="absolute top-40 left-1/3 w-2 h-2 bg-[#F79952] rounded-full animate-ping animation-delay-1000 opacity-40"></div>
            <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-[#41bfb8]/50 rounded-full animate-ping animation-delay-2000 opacity-30"></div>
            <div className="absolute top-1/3 right-[10%] w-2 h-2 bg-[#F79952]/60 rounded-full animate-ping animation-delay-3000 opacity-50"></div>

            {/* Moving Particles */}
            <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-[#41bfb8] rounded-full animate-particle opacity-60"></div>
            <div className="absolute top-[60%] right-[30%] w-1.5 h-1.5 bg-[#F79952] rounded-full animate-particle animation-delay-2000 opacity-50"></div>
            <div className="absolute top-[40%] left-[60%] w-1 h-1 bg-[#41bfb8] rounded-full animate-particle animation-delay-4000 opacity-40"></div>

            {/* Gradient Lines */}
            <div className="absolute top-0 left-1/2 w-px h-40 bg-gradient-to-b from-transparent via-[#41bfb8]/20 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 right-1/3 w-px h-32 bg-gradient-to-t from-transparent via-[#F79952]/20 to-transparent animate-pulse animation-delay-1000"></div>

            {/* Grid Pattern with Animation */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(65,191,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(65,191,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-flow"></div>

            {/* Sparkle Effects */}
            <svg className="absolute top-[15%] right-[20%] w-6 h-6 text-[#F79952]/40 animate-sparkle" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <svg className="absolute bottom-[25%] left-[15%] w-4 h-4 text-[#41bfb8]/40 animate-sparkle animation-delay-2000" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <svg className="absolute top-[50%] right-[5%] w-5 h-5 text-[#F79952]/30 animate-sparkle animation-delay-4000" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>

            {/* Soft Ambient Light for Contrast */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/10 rounded-full blur-[100px]"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

                    {/* Left Section - Content */}
                    <div className={`flex-1 w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-full w-fit shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#41bfb8] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#41bfb8]"></span>
                            </span>
                            <p className={`text-sm font-medium text-gray-700 work ${bengaliClass}`}>
                                {t("hero.badge")}
                            </p>
                        </div>

                        {/* Main Heading */}
                        <div className="mb-4">
                            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold outfit leading-tight ${bengaliClass}`}>
                                <span className="text-gray-800">{t("hero.heading1")} </span>
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-[#41bfb8] via-[#26a69a] to-[#41bfb8] bg-clip-text text-transparent">
                                        {t("hero.heading2")}
                                    </span>
                                    {/* Ice underline */}
                                    <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                                        <path d="M2 6C50 2 150 2 198 6" stroke="#4db6ac" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                                    </svg>
                                </span>
                            </h1>
                            <p className={`mt-2 text-lg lg:text-3xl text-gray-600 outfit-semibold ${bengaliClass}`}>
                                {t("hero.headingWith")} <span className="text-[#41bfb8]">{t("hero.academyName")}</span>
                            </p>
                        </div>

                        {/* Description */}
                        <p className={`text-gray-600 text-sm sm:text-base leading-relaxed mb-5 work ${bengaliClass}`}>
                            {t("hero.description")}
                        </p>

                        {/* Stats Cards - Frosted Glass */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            {/* Courses */}
                            <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 rounded-lg p-3 hover:shadow-lg hover:bg-white/60 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <FiBookOpen className="text-[#26a69a] text-base" />
                                    <span className={`text-xs text-gray-600 work ${bengaliClass}`}>{t("hero.courses")}</span>
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800 outfit">{counts.courses}+</p>
                                <p className={`text-[10px] text-gray-500 work hidden sm:block ${bengaliClass}`}>{t("hero.vendorCertified")}</p>
                            </div>

                            {/* Students */}
                            <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 rounded-lg p-3 hover:shadow-lg hover:bg-white/60 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <FiUsers className="text-[#F79952] text-base" />
                                    <span className={`text-xs text-gray-600 work ${bengaliClass}`}>{t("hero.students")}</span>
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800 outfit">{counts.students.toLocaleString()}+</p>
                                <p className={`text-[10px] text-gray-500 work hidden sm:block ${bengaliClass}`}>{t("hero.buildingSkills")}</p>
                            </div>

                            {/* Placement */}
                            <div className="group relative bg-white/40 backdrop-blur-md border border-white/50 rounded-lg p-3 hover:shadow-lg hover:bg-white/60 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <FiTrendingUp className="text-[#26a69a] text-base" />
                                    <span className={`text-xs text-gray-600 work ${bengaliClass}`}>{t("hero.placement")}</span>
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-800 outfit">{counts.placement}%</p>
                                <p className={`text-[10px] text-gray-500 work hidden sm:block ${bengaliClass}`}>{t("hero.careerSuccess")}</p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3 mb-5">
                            <a href="/events" className="group relative overflow-hidden">
                                <div className={`relative flex items-center gap-2 bg-gradient-to-r from-[#41bfb8] to-[#41bfb8] text-white px-5 py-2.5 rounded-md font-semibold work transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#26a69a]/30 text-sm ${bengaliClass}`}>
                                    <LuSparkles className="text-lg group-hover:rotate-12 transition-transform" />
                                    <span>{t("hero.joinSeminar")}</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                </div>
                            </a>

                            <Link href="/success-story" className="group">
                                <div className={`flex items-center gap-2 bg-white/50 border border-[#26a69a] text-[#00796b] px-5 py-2.5 rounded-md font-semibold work transition-all duration-300 hover:bg-[#e0f2f1] hover:shadow-lg text-sm ${bengaliClass}`}>
                                    <LuRocket className="text-lg group-hover:translate-x-1 transition-transform" />
                                    <span>{t("hero.successStories")}</span>
                                </div>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[
                                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                                    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
                                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
                                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
                                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
                                ].map((img, i) => (
                                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`Student ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className={`text-xs text-gray-500 work ${bengaliClass}`}>
                                <span className="text-gray-800 font-semibold">500+</span> {t("hero.enrolledThisMonth")}
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Video */}
                    <div className={`flex-1 w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="relative">
                            {/* Decorative Elements - Ice Blocks */}
                            <div className="absolute -top-3 -left-3 w-20 h-20 bg-[#b2dfdb]/30 rounded-lg -z-10 backdrop-blur-sm border border-white/20"></div>
                            <div className="absolute -top-3 -right-3 w-24 h-24 bg-[#ffccbc]/20 rounded-lg -z-10 backdrop-blur-sm border border-white/20"></div>

                            {/* Floating Badge - Moved to Bottom Right */}
                            <div className="absolute -bottom-4 -right-2 z-20 bg-white/90 backdrop-blur-md shadow-lg rounded-md px-3 py-2 border border-white/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-gradient-to-br from-[#F79952] to-[#f59e0b] rounded-md flex items-center justify-center">
                                        <FiAward className="text-white text-xs" />
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold text-gray-800 outfit ${bengaliClass}`}>{t("hero.topRated")}</p>
                                        <p className={`text-[9px] text-gray-500 work ${bengaliClass}`}>{t("hero.academy2024")}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Video Container */}
                            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#41bfb8]/10 via-transparent to-[#F79952]/10 rounded-lg"></div>

                                <div className="relative aspect-video m-[2px] rounded-lg overflow-hidden bg-gray-900">
                                    <iframe
                                        className="absolute border-none top-0 left-0 w-full h-full"
                                        src="https://www.youtube.com/embed/FtsFZkw2h-A?si=OcWlPICdVmdLQE14"
                                        title="BD Calling Academy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>

                            {/* Bottom Stats Badge */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-md shadow-lg rounded-md px-4 py-2 border border-white/50 flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#41bfb8] to-[#2dd4bf] rounded-md flex items-center justify-center">
                                        <HiOutlineAcademicCap className="text-white text-base" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 outfit">4.9/5</p>
                                        <p className={`text-[9px] text-gray-500 work ${bengaliClass}`}>{t("hero.rating")}</p>
                                    </div>
                                </div>
                                <div className="w-px h-6 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#F79952] to-[#f59e0b] rounded-md flex items-center justify-center">
                                        <LuGraduationCap className="text-white text-base" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 outfit">100%</p>
                                        <p className={`text-[9px] text-gray-500 work ${bengaliClass}`}>{t("hero.jobSupport")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
