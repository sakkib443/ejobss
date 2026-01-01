"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { BiCategory } from "react-icons/bi";
import { FaStar, FaArrowRight } from "react-icons/fa";
import { LuBookOpenCheck, LuClock, LuUsers, LuPlay } from "react-icons/lu";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";

const CourseCard = ({ course }) => {
  const { isDark } = useTheme();
  const courseId = course._id || course.id;
  const { items: categories = [] } = useSelector((state) => state.categories);
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  // Get category name from ID or object
  const getCategoryName = (categoryData) => {
    if (!categoryData) return t("coursesPage.category") || "General";
    if (typeof categoryData === "object" && categoryData.name) return categoryData.name;
    const category = categories.find(cat => cat._id === categoryData || cat.id === categoryData);
    return category?.name || categoryData || "General";
  };

  // Field mapping with fallbacks (support both old and new data structures during migration)
  const title = course.title || "Untitled Course";
  const thumbnail = course.thumbnail || course.image || "/placeholder-course.jpg";
  const price = course.price !== undefined ? course.price : (parseInt(course.fee?.replace(/[^\d]/g, '') || 0));
  const discountPrice = course.discountPrice;
  const type = course.courseType || course.type || "Recorded";
  const duration = course.totalDuration ? `${course.totalDuration} Min` : "3 Months";
  const students = course.totalEnrollments !== undefined ? `${course.totalEnrollments}+` : "50+";
  const rating = course.averageRating || course.rating || 5;

  return (
    <div className="group relative w-full h-full flex flex-col">
      {/* Card Container */}
      <div className={`relative h-full bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2 flex flex-col ${isDark ? 'bg-slate-800 border-white/5' : ''}`}>

        {/* Image Container */}
        <div className="relative h-52 w-full overflow-hidden shrink-0">
          <Link href={`/courses/${courseId}`}>
            <Image
              width={400}
              height={250}
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </Link>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#41bfb8] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#41bfb8]/20">
              {type}
            </span>
          </div>

          <div className="absolute top-4 right-4 h-9 px-3 bg-white/95 backdrop-blur-md rounded-xl flex items-center gap-1.5 shadow-xl">
            <FaStar className="text-amber-500 text-xs" />
            <span className="text-xs font-black text-slate-800">{rating}</span>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <Link href={`/courses/${courseId}`} className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-all duration-500 hover:scale-110">
              <LuPlay className="w-6 h-6 text-white fill-white ml-1" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Category */}
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-[#41bfb8]/10 rounded-lg">
              <HiOutlineAcademicCap className="text-[#41bfb8] text-sm" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest text-slate-500 ${bengaliClass}`}>
              {getCategoryName(course.category)}
            </span>
          </div>

          {/* Title */}
          <Link href={`/courses/${courseId}`} className="mb-4 block">
            <h3 className={`text-lg font-bold text-slate-800 line-clamp-2 group-hover:text-[#41bfb8] transition-colors duration-300 leading-snug outfit-semibold h-12 ${bengaliClass}`}>
              {title}
            </h3>
          </Link>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <LuClock className="text-[#41bfb8] text-sm" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{duration}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <LuUsers className="text-[#41bfb8] text-sm" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{students}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 w-full mb-6"></div>

          {/* Footer: Price & Link */}
          <div className="mt-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              {discountPrice && (
                <span className="text-[10px] text-slate-400 line-through font-bold">৳{price}</span>
              )}
              <span className="text-xl font-black text-[#41bfb8] outfit">
                ৳{(discountPrice || price).toLocaleString()}
              </span>
            </div>

            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#41bfb8] hover:shadow-xl hover:shadow-[#41bfb8]/20 transition-all active:scale-95 group/btn"
            >
              Details <FaArrowRight className="text-[8px] group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-[#41bfb8] to-[#F79952] transition-all duration-700"></div>
      </div>
    </div>
  );
};

export default CourseCard;
