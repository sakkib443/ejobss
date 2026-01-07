"use client";

import React, { useEffect, useState } from 'react';
import PopularCourseCard from './PopularCourseCard';
import { LuGraduationCap, LuUsers, LuTrendingUp, LuPlay, LuArrowRight } from 'react-icons/lu';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://motionboss-backend.vercel.app/api';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PopularCourse = () => {
  const [stats, setStats] = useState(null);
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/stats/dashboard`);
        const data = await res.json();
        if (data.success && data.data) setStats(data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statsData = [
    { icon: LuGraduationCap, value: stats?.breakdown?.courses || 0, label: language === 'bn' ? 'কোর্স সমূহ' : 'Courses', suffix: '+', color: 'teal' },
    { icon: LuUsers, value: stats?.activeUsers || 0, label: language === 'bn' ? 'শিক্ষার্থী' : 'Students', suffix: '+', color: 'orange' },
    { icon: LuTrendingUp, value: '95', label: language === 'bn' ? 'সফলতার হার' : 'Success Rate', suffix: '%', color: 'teal' }
  ];

  const getColorClasses = (color) => color === 'teal'
    ? { gradient: 'from-[#41bfb8] to-[#2dd4bf]', light: 'bg-[#41bfb8]/10', text: 'text-[#41bfb8]' }
    : { gradient: 'from-[#F79952] to-[#fb923c]', light: 'bg-[#F79952]/10', text: 'text-[#F79952]' };

  return (
    <section className='relative py-24 overflow-hidden'>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-[#41bfb8]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-gradient-to-br from-[#F79952]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-16 relative z-10">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <motion.div className="inline-flex items-center gap-3 mb-5 px-5 py-2.5 rounded-full bg-white dark:bg-black/50 border border-teal-500/30 shadow-sm" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
              <LuPlay className="text-[#41bfb8]" size={14} />
            </div>
            <span className={`text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-[0.2em] ${bengaliClass}`}>
              {language === 'bn' ? 'জনপ্রিয় কোর্স' : 'Popular Courses'}
            </span>
          </motion.div>
          <motion.h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-5 ${bengaliClass}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            {language === 'bn' ? <>আমাদের <span className="text-primary">সেরা কোর্স</span> সমূহ</> : <>Explore Our <span className="text-primary">Top Courses</span></>}
          </motion.h2>
          <motion.p className={`text-gray-500 dark:text-gray-400 text-base lg:text-lg max-w-2xl mx-auto ${bengaliClass}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
            {language === 'bn' ? 'বিশেষজ্ঞ মেন্টরদের দ্বারা তৈরি প্রিমিয়াম কোর্স।' : 'Premium courses crafted by industry experts.'}
          </motion.p>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-14" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            return (
              <motion.div key={index} variants={cardVariants} className="group relative bg-white dark:bg-[#0d0d0d] rounded-md px-8 py-6 border border-gray-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-2 transition-all">
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${colors.gradient} opacity-5`} />
                <div className="relative z-10 flex items-center gap-5">
                  <div className={`w-14 h-14 ${colors.light} rounded-2xl flex items-center justify-center`}>
                    <Icon size={26} className={colors.text} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</span>
                      <span className={`text-xl font-black ${colors.text}`}>{stat.suffix}</span>
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-widest text-gray-400 mt-1 ${bengaliClass}`}>{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
          <PopularCourseCard />
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}>
          <Link href="/courses" className={`group relative bg-white dark:bg-[#0d0d0d] rounded-2xl px-8 py-4 border border-gray-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg flex items-center gap-4 transition-all ${bengaliClass}`}>
            <span className="font-bold text-gray-900 dark:text-white">{language === 'bn' ? 'সব কোর্স দেখুন' : 'View All Courses'}</span>
            <div className="w-10 h-10 rounded-xl bg-[#41bfb8]/10 flex items-center justify-center group-hover:bg-[#41bfb8]">
              <LuArrowRight size={18} className="text-[#41bfb8] group-hover:text-white" />
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-black bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className={`text-sm font-medium text-gray-500 ${bengaliClass}`}>
              {language === 'bn' ? 'হাজার হাজার শিক্ষার্থী যোগ দিয়েছেন' : 'Thousands of learners joined'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCourse;