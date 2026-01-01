"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { fetchCoursesData } from "../../redux/CourseSlice";
import CourseCard from "../sheard/CourseCard";
import { LuLayoutGrid, LuList, LuArrowUpDown, LuLoader } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";

// Loading Skeleton
const CourseCardSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden h-[500px]">
      <div className="h-52 bg-slate-100"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-slate-100 rounded-full w-1/4"></div>
        <div className="h-8 bg-slate-100 rounded-2xl w-3/4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-slate-100 rounded-xl"></div>
          <div className="h-10 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="h-px bg-slate-50"></div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-10 bg-slate-100 rounded-xl w-24"></div>
          <div className="h-12 bg-slate-100 rounded-2xl w-32"></div>
        </div>
      </div>
    </div>
  </div>
);

const RightCoursesDetalis = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const { courses = [], loading = false } = useSelector((state) => state.courses || {});
  const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});

  const urlType = searchParams.get("type");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    dispatch(fetchCoursesData());
  }, [dispatch]);

  useEffect(() => {
    if (urlType && ["Online", "Offline", "Recorded"].includes(urlType)) {
      setSelectedType(urlType);
    } else {
      setSelectedType("All");
    }
  }, [urlType]);

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "";
    if (typeof categoryId === "object" && categoryId.name) return categoryId.name;
    if (typeof categoryId === "string" && categoryId.length < 20) return categoryId;
    const category = categories.find(cat => cat._id === categoryId || cat.id === categoryId);
    return category?.name || "";
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    if (!course) return false;

    // Type filter
    const cType = course?.courseType || course?.type || "Recorded";
    const typeMatch = selectedType === "All" || cType === selectedType;

    // Category filter
    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      const courseCategoryName = getCategoryName(course.category);
      categoryMatch = selectedCategories.includes(courseCategoryName);
    }

    // Search filter
    const q = (searchQuery || "").trim().toLowerCase();
    const searchMatch =
      q === "" ||
      (course.title && course.title.toLowerCase().includes(q)) ||
      (course.technology && course.technology.toLowerCase().includes(q)) ||
      getCategoryName(course.category).toLowerCase().includes(q);

    return typeMatch && categoryMatch && searchMatch;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aPrice = a.price || (parseInt(a.fee?.replace(/[^\d]/g, '') || 0));
    const bPrice = b.price || (parseInt(b.fee?.replace(/[^\d]/g, '') || 0));
    const aRating = a.averageRating || a.rating || 5;
    const bRating = b.averageRating || b.rating || 5;
    const aStudents = a.totalEnrollments || a.totalStudentsEnroll || 0;
    const bStudents = b.totalEnrollments || b.totalStudentsEnroll || 0;

    switch (sortBy) {
      case "rating":
        return bRating - aRating;
      case "price-low":
        return aPrice - bPrice;
      case "price-high":
        return bPrice - aPrice;
      case "students":
        return bStudents - aStudents;
      default:
        return 0;
    }
  });

  const typeButtons = ["All", "Online", "Offline", "Recorded"];

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
        {/* Left - Course Count & Type Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="flex items-center gap-3 px-4 py-2 bg-[#41bfb8]/10 rounded-xl">
            <HiOutlineSparkles className="text-[#41bfb8]" />
            <span className="text-slate-800 font-black outfit uppercase tracking-tight text-xs">
              {sortedCourses.length} <span className="text-slate-400 font-bold ml-1">Courses</span>
            </span>
          </div>

          {/* Type Buttons */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl overflow-x-auto w-full sm:w-auto no-scrollbar">
            {typeButtons.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedType === type
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Right - Sort & View Toggle */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
          {/* Sort Dropdown */}
          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-4 focus:ring-[#41bfb8]/10 focus:border-[#41bfb8] cursor-pointer transition-all"
            >
              <option value="default">Sort Options</option>
              <option value="rating">Top Rated</option>
              <option value="students">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <LuArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-50 rounded-2xl">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-2.5 rounded-xl transition-all ${isGridView ? 'bg-white text-[#41bfb8] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LuLayoutGrid size={18} />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-2.5 rounded-xl transition-all ${!isGridView ? 'bg-white text-[#41bfb8] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LuList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className={`grid gap-8 ${isGridView ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : sortedCourses.length > 0 ? (
        <div className={`grid gap-8 ${isGridView ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {sortedCourses.map((course) => (
            <CourseCard key={course?._id || course?.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineSparkles className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 outfit uppercase tracking-tight mb-2">No courses matching</h3>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default RightCoursesDetalis;
