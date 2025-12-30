"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { BiCategory } from "react-icons/bi";
import { FaStar, FaWhatsapp } from "react-icons/fa";
import { LuBookOpenCheck, LuClock, LuUsers } from "react-icons/lu";
import { HiOutlinePlayCircle } from "react-icons/hi2";

const CourseCard = ({ course }) => {
  const courseId = course.id || course._id;
  const { items: categories = [] } = useSelector((state) => state.categories);

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "General";
    // If it's already a string name, return it
    if (typeof categoryId === "string" && categoryId.length < 20) return categoryId;
    // Find category by _id
    const category = categories.find(cat => cat._id === categoryId || cat.id === categoryId);
    return category?.name || "General";
  };

  return (
    <div className="group relative w-full md:w-[360px]">
      {/* Card Container */}
      <div className="relative bg-white rounded-md border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-2 hover:border-transparent">

        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden">
          <Link href={`/courses/${courseId}`}>
            <Image
              width={400}
              height={250}
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </Link>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F79952] text-white text-xs font-medium rounded-md shadow-lg">
              {course.type}
            </span>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <HiOutlinePlayCircle className="w-8 h-8 text-[#41bfb8]" />
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-md shadow-lg">
            <FaStar className="text-[#F79952] text-sm" />
            <span className="text-sm font-semibold text-gray-800">{course.rating || 5}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category */}
          <div className="flex items-center gap-1.5 text-gray-500">
            <BiCategory className="text-[#41bfb8]" />
            <span className="text-xs work">{getCategoryName(course.category)}</span>
          </div>

          {/* Title */}
          <Link href={`/courses/${courseId}`}>
            <h3 className="text-lg font-bold text-gray-800 outfit-semibold line-clamp-2 group-hover:text-[#41bfb8] transition-colors duration-300 leading-tight min-h-[48px]">
              {course.title}
            </h3>
          </Link>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 work">
            <div className="flex items-center gap-1">
              <LuClock className="text-[#41bfb8]" />
              <span>3 Months</span>
            </div>
            <div className="flex items-center gap-1">
              <LuUsers className="text-[#41bfb8]" />
              <span>50+ Enrolled</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

          {/* Price & Rating Row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 work">Course Fee</span>
              <p className="text-xl font-bold text-[#41bfb8] outfit">{course.fee}</p>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${i < (course.rating || 5) ? "text-[#F79952]" : "text-gray-200"}`}
                />
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2 pt-2">
            <Link
              href={`/courses/${courseId}`}
              className="flex-1 flex items-center justify-center gap-2 bg-[#41bfb8] hover:bg-[#38a89d] text-white px-4 py-2.5 rounded-md font-medium text-sm work transition-all duration-300"
            >
              <LuBookOpenCheck className="text-lg" />
              <span>Details</span>
            </Link>
            <a
              href={`https://wa.me/8801321231802?text=${encodeURIComponent(
                `আমি "${course.title}" কোর্সটি করতে চাই।`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-gray-200 text-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] px-4 py-2.5 rounded-md font-medium text-sm work transition-all duration-300"
            >
              <FaWhatsapp className="text-lg" />
              <span>Enroll</span>
            </a>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-[#41bfb8] to-[#F79952] transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default CourseCard;
