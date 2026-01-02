"use client";

import React, { useEffect, useState } from 'react';
import PopularCourseCard from './PopularCourseCard';
import { LuGraduationCap, LuUsers, LuTrendingUp, LuPlay } from 'react-icons/lu';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const PopularCourse = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState(null);
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/stats/dashboard`);
        const data = await res.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statsData = [
    {
      icon: LuGraduationCap,
      value: stats?.breakdown?.courses || 0,
      label: language === 'bn' ? 'কোর্স সমূহ' : 'Courses',
      suffix: '+',
      color: 'teal'
    },
    {
      icon: LuUsers,
      value: stats?.activeUsers || 0,
      label: language === 'bn' ? 'শিক্ষার্থী' : 'Students',
      suffix: '+',
      color: 'orange'
    },
    {
      icon: LuTrendingUp,
      value: '95',
      label: language === 'bn' ? 'সফলতার হার' : 'Success Rate',
      suffix: '%',
      color: 'teal'
    }
  ];

  return (
    <section className='relative bg-white py-20 lg:py-28 overflow-hidden'>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Blurs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#41bfb8]/8 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#F79952]/8 via-transparent to-transparent rounded-full blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(65,191,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(65,191,184,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-[5%] w-20 h-20 border border-[#41bfb8]/10 rounded-2xl rotate-12"></div>
        <div className="absolute top-40 right-[10%] w-16 h-16 border border-[#F79952]/10 rounded-full"></div>
        <div className="absolute bottom-32 left-[15%] w-12 h-12 bg-[#41bfb8]/5 rounded-xl rotate-45"></div>
        <div className="absolute bottom-20 right-[8%] w-24 h-24 border border-[#41bfb8]/5 rounded-3xl -rotate-12"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>

          {/* Left Side - Title & Description */}
          <div className="lg:max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#41bfb8]/10 rounded-full">
              <LuPlay className="text-[#41bfb8]" size={14} />
              <span className={`text-sm font-semibold text-[#41bfb8] ${bengaliClass}`}>
                {language === 'bn' ? 'জনপ্রিয় কোর্স' : 'Popular Courses'}
              </span>
            </div>

            {/* Title */}
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight ${bengaliClass}`}>
              {language === 'bn' ? (
                <>আমাদের <span className="text-[#41bfb8]">সেরা কোর্স</span> সমূহ</>
              ) : (
                <>Explore Our <span className="text-[#41bfb8]">Top Courses</span></>
              )}
            </h2>

            {/* Description */}
            <p className={`text-gray-500 text-base lg:text-lg leading-relaxed ${bengaliClass}`}>
              {language === 'bn'
                ? 'বিশেষজ্ঞ মেন্টরদের দ্বারা তৈরি প্রিমিয়াম কোর্স যা আপনাকে সাফল্যের পথে নিয়ে যাবে। প্র্যাক্টিক্যাল প্রজেক্ট এবং রিয়েল-ওয়ার্ল্ড অভিজ্ঞতা।'
                : 'Premium courses crafted by industry experts to help you succeed. Real-world projects, practical skills, and career-focused learning paths.'
              }
            </p>
          </div>

          {/* Right Side - Stats */}
          <div className="flex flex-wrap gap-6 lg:gap-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'teal' ? 'bg-[#41bfb8]/10' : 'bg-[#F79952]/10'}`}>
                    <Icon size={22} className={stat.color === 'teal' ? 'text-[#41bfb8]' : 'text-[#F79952]'} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}{stat.suffix}
                    </p>
                    <p className={`text-sm text-gray-500 ${bengaliClass}`}>{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courses Slider */}
        <PopularCourseCard />

        {/* Bottom CTA */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-14 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <Link
            href="/courses"
            className={`inline-flex items-center gap-2 px-8 py-3.5 bg-[#41bfb8] text-white rounded-xl font-semibold hover:bg-[#38a89d] hover:shadow-lg hover:shadow-[#41bfb8]/20 transition-all duration-300 group ${bengaliClass}`}
          >
            <span>{language === 'bn' ? 'সব কোর্স দেখুন' : 'View All Courses'}</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <p className={`text-sm text-gray-400 ${bengaliClass}`}>
            {language === 'bn'
              ? 'হাজার হাজার শিক্ষার্থী ইতিমধ্যে যোগ দিয়েছেন'
              : 'Join thousands of learners today'
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default PopularCourse;