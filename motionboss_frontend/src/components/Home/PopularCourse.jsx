"use client";

import React, { useEffect, useState } from 'react';
import PopularCourseCard from './PopularCourseCard';
import { HiOutlineAcademicCap } from 'react-icons/hi2';
import { LuSparkles } from 'react-icons/lu';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const PopularCourse = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className='relative bg-gradient-to-b from-white via-[#fafffe] to-white py-16 lg:py-20 overflow-hidden'>
      {/* Unique Hexagon Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2341bfb8' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#41bfb8]/10 via-transparent to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#F79952]/10 via-transparent to-transparent rounded-full blur-3xl"></div>

      {/* Floating Circles */}
      <div className="absolute top-20 left-[10%] w-20 h-20 border-2 border-[#41bfb8]/10 rounded-full"></div>
      <div className="absolute bottom-20 right-[15%] w-16 h-16 border-2 border-[#F79952]/10 rounded-full"></div>
      <div className="absolute top-1/2 right-[8%] w-12 h-12 bg-[#41bfb8]/5 rounded-full"></div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#41bfb8]/10 rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-[#F79952]/10 rounded-br-3xl"></div>

      {/* Diagonal Lines */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#41bfb8" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#F79952" strokeWidth="1" />
      </svg>

      <div className="container mx-auto px-4 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-[#41bfb8]/10 to-[#F79952]/10 border border-[#41bfb8]/20 rounded-full">
            <HiOutlineAcademicCap className="text-[#41bfb8] text-lg" />
            <span className={`text-sm font-medium text-gray-700 work ${bengaliClass}`}>{t("popularCourse.badge")}</span>
          </div>

          {/* Title */}
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold outfit ${bengaliClass}`}>
            <span className="text-gray-800">{t("popularCourse.title1")}</span>
            <span className="bg-gradient-to-r from-[#41bfb8] to-[#38a89d] bg-clip-text text-transparent">{t("popularCourse.title2")}</span>
          </h2>

          {/* Description */}
          <p className={`mt-4 text-gray-500 work text-sm sm:text-base max-w-3xl mx-auto leading-relaxed ${bengaliClass}`}>
            {t("popularCourse.description")}
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#41bfb8]/10 rounded-md flex items-center justify-center">
                <LuSparkles className="text-[#41bfb8] text-lg" />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-800 outfit">50+</p>
                <p className={`text-xs text-gray-500 work ${bengaliClass}`}>{t("popularCourse.courses")}</p>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#F79952]/10 rounded-md flex items-center justify-center">
                <HiOutlineAcademicCap className="text-[#F79952] text-lg" />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-800 outfit">4,200+</p>
                <p className={`text-xs text-gray-500 work ${bengaliClass}`}>{t("popularCourse.students")}</p>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#41bfb8]/10 rounded-md flex items-center justify-center">
                <span className="text-[#41bfb8] font-bold text-sm">92%</span>
              </div>
              <div className="text-left">
                <p className={`text-xl font-bold text-gray-800 outfit ${bengaliClass}`}>{t("popularCourse.success")}</p>
                <p className={`text-xs text-gray-500 work ${bengaliClass}`}>{t("popularCourse.placementRate")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Slider */}
        <PopularCourseCard />

        {/* Bottom CTA */}
        <div className={`text-center mt-14 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <Link
            href="/courses"
            className={`inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#41bfb8] to-[#38a89d] text-white rounded-md font-semibold work hover:shadow-xl hover:shadow-[#41bfb8]/30 transition-all duration-300 group ${bengaliClass}`}
          >
            <span>{t("popularCourse.viewAllCourses")}</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className={`mt-3 text-sm text-gray-400 work ${bengaliClass}`}>
            {t("popularCourse.joinThousands")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PopularCourse;