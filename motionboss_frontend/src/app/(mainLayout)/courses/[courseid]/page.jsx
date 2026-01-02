/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchCoursesData } from "@/redux/CourseSlice";
import { fetchMentorsData } from "@/redux/mentorSlice";
import { useLanguage } from "@/context/LanguageContext";
import { addToCart } from "@/redux/cartSlice";
import {
  LuDownload, LuExternalLink, LuClock, LuTrophy,
  LuLayoutGrid, LuEye, LuPackage, LuShieldCheck,
  LuSettings, LuFileCode, LuGlobe, LuCheck, LuSparkles, LuCode, LuZap, LuImage, LuX, LuBookOpen, LuMonitor, LuVideo, LuUsers
} from "react-icons/lu";
import { FaHeart, FaRegHeart, FaStar, FaArrowRight } from "react-icons/fa";
import { MdVerified, MdOutlineMenuBook, MdPlayCircleOutline } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Animated Counter - matching Website Details
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value === 0) { setCount(0); return; }
    const duration = 1200;
    const steps = 50;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };
  return <span className="tabular-nums">{formatNumber(count)}</span>;
};

const SingleCourse = () => {
  const { courseid: id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const { courses = [], loading } = useSelector((state) => state.courses || {});
  const { mentors = [] } = useSelector((state) => state.mentors || {});

  const [activeTab, setActiveTab] = useState("overview");
  const [currentCourse, setCurrentCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLiking, setIsLiking] = useState(false);

  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    dispatch(fetchCoursesData());
    dispatch(fetchMentorsData());
  }, [dispatch]);

  useEffect(() => {
    if (courses && courses.length > 0) {
      const foundCourse = courses.find((c) => c._id === id || c.id === id);
      if (foundCourse) {
        setCurrentCourse(foundCourse);
        setPopularCourses(courses.filter((c) => (c._id !== id && c.id !== id)).slice(0, 3));

        if (foundCourse.mentor && mentors.length > 0) {
          const foundMentor = mentors.find(m => m._id === foundCourse.mentor || m.id === foundCourse.mentor || (typeof foundCourse.mentor === 'object' && foundCourse.mentor._id === m._id));
          setInstructor(foundMentor);
        }
      }
    }
  }, [courses, mentors, id]);

  const handleAddToCart = () => {
    if (!currentCourse) return;
    dispatch(addToCart({
      id: currentCourse._id,
      title: currentCourse.title,
      price: currentCourse.price,
      image: currentCourse.thumbnail || currentCourse.image || "/images/placeholder.png",
      type: 'course'
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  // Loading State
  if (loading && !currentCourse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-teal-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400 text-sm font-medium tracking-wide poppins">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (!currentCourse && !loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mb-6">
          <LuBookOpen className="text-gray-300 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 outfit mb-2">Course Not Found</h3>
        <p className="text-gray-500 poppins text-sm mb-6 text-center max-w-sm">The course you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/courses')}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-md hover:bg-teal-600 transition-colors"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  const price = currentCourse.price || 0;
  const discountPrice = currentCourse.discountPrice;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero Section - 100% Mirror of Website Details */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f0fffe] via-[#e8f9f8] to-[#f5f5ff] pt-12 pb-28 lg:pt-16 lg:pb-36">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-400/10 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-400/8 rounded-full blur-3xl pointer-events-none"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:px-24 relative z-10">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-gray-500 mb-6 poppins"
            >
              <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/courses" className="hover:text-teal-600 transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-gray-700 font-medium truncate max-w-[200px]">{currentCourse.title}</span>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 mb-5"
            >
              <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded text-white text-[11px] font-bold uppercase tracking-wider poppins">
                {currentCourse.courseType || 'Recorded'}
              </span>
              <span className="px-3 py-1 bg-white/90 border border-gray-200 rounded text-gray-600 text-[11px] font-bold uppercase tracking-wider poppins">
                {currentCourse.level || 'Beginner'}
              </span>
              {currentCourse.isFeatured && (
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <LuSparkles size={10} /> Featured
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold outfit leading-[1.2] tracking-tight text-gray-900 mb-4"
            >
              {currentCourse.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[15px] lg:text-base text-gray-600 poppins leading-relaxed mb-6 max-w-2xl"
            >
              {currentCourse.shortDescription || currentCourse.description?.substring(0, 160)}...
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 mb-5"
            >
              {/* Rating */}
              <div className="flex items-center gap-2 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                <div className="flex text-amber-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <FaStar key={s} size={12} />)}
                </div>
                <span className="font-bold outfit text-gray-900">{currentCourse.averageRating || '5.0'}</span>
                <span className="text-gray-400 text-xs poppins">({currentCourse.reviewCount || 0})</span>
              </div>

              {/* Students */}
              <div className="flex items-center gap-3 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center">
                  <LuUsers className="text-emerald-600" size={14} />
                </div>
                <span className="text-gray-700 font-medium text-sm poppins">
                  <AnimatedCounter value={currentCourse.totalEnrollments || 0} />
                  <span className="text-gray-400 ml-1">students</span>
                </span>
              </div>

              {/* Lessons */}
              <div className="flex items-center gap-3 bg-white px-8 py-2.5 rounded-md border border-gray-200">
                <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center">
                  <LuMonitor className="text-blue-600" size={14} />
                </div>
                <span className="text-gray-700 font-medium text-sm poppins">
                  <AnimatedCounter value={currentCourse.totalLessons || currentCourse.lessons?.length || 0} />
                  <span className="text-gray-400 ml-1">lessons</span>
                </span>
              </div>
            </motion.div>

            {/* Instructor & Like mirroring style */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200">
                <span className="text-gray-400 text-sm poppins">Instructor</span>
                <span className="text-teal-600 font-semibold text-sm outfit underline underline-offset-4">{instructor?.name || 'Industry Expert'}</span>
                <MdVerified className="text-blue-500" size={16} />
              </div>

              <button
                className="flex items-center gap-2 px-3 py-2 rounded-md border transition-all bg-white border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-500"
              >
                <FaRegHeart size={14} />
                <span className="font-semibold text-sm poppins">Like</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 lg:px-24 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Mobile Pricing Card */}
            <div className="lg:hidden bg-white rounded-md border border-gray-200 overflow-hidden">
              <img src={currentCourse.thumbnail || currentCourse.image || "/images/placeholder.png"} alt={currentCourse.title} className="w-full aspect-video object-cover" />
              <div className="p-5">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900 outfit">৳{price.toLocaleString()}</span>
                  {discountPrice && <span className="text-gray-400 line-through text-sm">৳{(price + 2000).toLocaleString()}</span>}
                </div>
                <button onClick={handleBuyNow} className="w-full py-3 bg-teal-500 text-white font-semibold rounded-md active:scale-[0.98] transition-transform poppins">
                  Purchase Now
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-100 bg-gray-50/80">
                {[
                  { id: "overview", label: "Overview", icon: LuLayoutGrid },
                  { id: "curriculum", label: "Curriculum", icon: MdOutlineMenuBook },
                  { id: "whatyoulearn", label: "Learning", icon: LuZap },
                  { id: "instructor", label: "Instructor", icon: LuUsers },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 -mb-[1px] poppins ${activeTab === tab.id
                      ? "text-teal-600 border-teal-500 bg-white"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                      }`}
                  >
                    <tab.icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      {/* About */}
                      <div>
                        <h2 className="text-lg font-bold outfit text-gray-900 mb-4 flex items-center gap-2">
                          <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
                          Course Description
                        </h2>
                        <div className="text-gray-600 poppins text-[15px] leading-7 whitespace-pre-line">
                          {currentCourse.description || currentCourse.details}
                        </div>
                      </div>

                      {/* Course Features mirroring Tech Stack */}
                      {currentCourse.features?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold outfit text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
                            Key Features
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {currentCourse.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700 font-medium text-sm hover:border-teal-300 hover:bg-teal-50 transition-colors cursor-default poppins"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "curriculum" && (
                    <motion.div
                      key="curriculum"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <h2 className="text-lg font-bold outfit text-gray-900 mb-5 flex items-center gap-2">
                        <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
                        Learning Modules
                      </h2>
                      <div className="space-y-3">
                        {currentCourse.curriculum?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-md hover:border-teal-200 hover:bg-teal-50/30 transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-teal-600 shadow-sm font-bold text-xs outfit border border-teal-50">
                                {String(idx + 1).padStart(2, '0')}
                              </div>
                              <span className="font-semibold text-gray-800 poppins text-sm">{typeof item === 'string' ? item : item.title}</span>
                            </div>
                            <MdPlayCircleOutline className="text-gray-300 group-hover:text-teal-500 text-xl transition-colors cursor-pointer" />
                          </div>
                        ))}
                        {!currentCourse.curriculum?.length && <p className="text-gray-400 text-sm poppins py-10 text-center border border-dashed rounded-md">Curriculum details coming soon.</p>}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "whatyoulearn" && (
                    <motion.div
                      key="whatyoulearn"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-lg font-bold outfit text-gray-900 mb-5 flex items-center gap-2">
                        <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
                        What You Will Learn
                      </h2>

                      {currentCourse.whatYouWillLearn?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {currentCourse.whatYouWillLearn.map((topic, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-md hover:border-teal-200 hover:bg-teal-50/30 transition-colors"
                            >
                              <div className="w-8 h-8 rounded bg-teal-100 flex items-center justify-center flex-shrink-0">
                                <LuCheck className="text-teal-600" size={16} strokeWidth={3} />
                              </div>
                              <span className="text-gray-700 font-medium text-sm leading-relaxed pt-1 poppins">{topic}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-md border border-dashed border-gray-200">
                          <LuZap className="mx-auto text-2xl text-gray-300 mb-2" />
                          <p className="text-gray-400 text-sm poppins">Learning topics not listed yet</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "instructor" && (
                    <motion.div
                      key="instructor"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <h2 className="text-lg font-bold outfit text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
                        Meet Your Instructor
                      </h2>

                      {instructor ? (
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                          <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-teal-500 to-amber-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                              <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover transform transition-transform group-hover:scale-105 duration-500" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <h3 className="text-2xl font-bold outfit text-gray-900">{instructor.name}</h3>
                              <MdVerified className="text-blue-500 text-xl" />
                            </div>
                            <p className="text-teal-600 font-semibold poppins text-base">{instructor.designation} • {instructor.subject}</p>
                            <p className="text-gray-600 poppins text-sm leading-relaxed">
                              {instructor.details?.substring(0, 300)}...
                            </p>
                            <div className="flex gap-3 pt-2">
                              <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md hover:bg-teal-50 hover:border-teal-200 transition-colors text-gray-700 text-xs font-bold poppins">VIEW PROFILE</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-md border border-dashed border-gray-200">
                          <LuUsers className="mx-auto text-2xl text-gray-300 mb-2" />
                          <p className="text-gray-400 text-sm poppins">Instructor details coming soon</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Sidebar - 100% Mirror of Website Details */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 -mt-[28rem] space-y-5">
              {/* Pricing Card */}
              <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                {/* Image mirroring Website Gallery/Preview */}
                <div className="relative aspect-video group cursor-pointer overflow-hidden bg-gray-100">
                  <img
                    src={currentCourse.thumbnail || currentCourse.image || "/images/placeholder.png"}
                    alt={currentCourse.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <MdPlayCircleOutline className="text-white text-5xl" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900 outfit">৳{price.toLocaleString()}</span>
                      {discountPrice && (
                        <span className="text-gray-400 line-through text-sm">৳{(price + 2000).toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-teal-600 text-xs font-semibold uppercase tracking-wide mt-1 poppins">Full Lifetime Access</p>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2.5">
                    <button
                      onClick={handleBuyNow}
                      className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2 poppins"
                    >
                      Buy Now <FaArrowRight size={12} />
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-md hover:border-teal-400 hover:text-teal-600 transition-colors poppins"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/learn/${id}`}
                      className="w-full py-2.5 bg-gray-50 border border-gray-200 text-gray-600 font-medium rounded-md hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2 text-sm poppins"
                    >
                      <LuVideo size={14} /> Sample Lesson
                    </Link>
                  </div>

                  {/* What's Included mirroring Website style */}
                  <div className="pt-4 border-t border-gray-100">
                    <h5 className="text-sm font-bold text-gray-900 mb-3 outfit">Course Includes</h5>
                    <ul className="space-y-2.5">
                      {[
                        { icon: LuMonitor, text: `${currentCourse.totalLessons || 0}+ Video Lessons` },
                        { icon: LuClock, text: `${currentCourse.totalDuration || '12 Hours'} Duration` },
                        { icon: LuTrophy, text: 'Completion Certificate' },
                        { icon: LuShieldCheck, text: 'Lifetime Updates' },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-gray-600 text-sm poppins">
                          <item.icon className="text-teal-500" size={15} />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommended Courses Widget mirroring Website Popular Websites */}
              <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 outfit">Popular Courses</h3>
                <div className="space-y-4">
                  {popularCourses.map(item => (
                    <Link href={`/courses/${item._id}`} key={item._id} className="flex gap-3 group">
                      <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                        <img
                          src={item.thumbnail || item.image || "/images/placeholder.png"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1 outfit">{item.title}</h4>
                        <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                          <FaStar size={10} />
                          <span className="text-gray-600 text-xs font-medium poppins">{item.averageRating || '5.0'}</span>
                        </div>
                        <span className="text-teal-600 font-bold text-xs poppins">৳{item.price?.toLocaleString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/courses"
                  className="flex items-center justify-center w-full py-2.5 mt-4 text-teal-600 font-semibold text-sm border border-dashed border-teal-200 rounded-md hover:bg-teal-50 transition-colors poppins"
                >
                  View All Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleCourse;
