"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiCategory, BiMenu, BiX } from "react-icons/bi";
import {
  LuBookOpenCheck, LuChevronDown, LuLogOut,
  LuLayoutDashboard, LuShoppingCart, LuSearch,
  LuSparkles, LuUser, LuArrowRight, LuSun, LuMoon, LuChevronRight,
  LuCode, LuGlobe, LuBookOpen, LuLayers, LuPalette, LuCpu, LuDatabase, LuSmartphone
} from "react-icons/lu";
import { HiOutlineSparkles, HiOutlineUserCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://motionboss-backend.vercel.app/api';

// Category icons mapping
const categoryIcons = {
  'web-development': LuGlobe,
  'programming': LuCode,
  'design': LuPalette,
  'database': LuDatabase,
  'mobile': LuSmartphone,
  'software': LuCpu,
  'default': LuLayers
};

// Category Mega Menu Component
const CategoryMegaMenu = ({ closeMobileMenu, language, bengaliClass }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeParent, setActiveParent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data.success) {
          // Organize categories into parent and child structure
          const allCategories = data.data || [];
          const parentCategories = allCategories.filter(cat => !cat.parentCategory);
          const organized = parentCategories.map(parent => ({
            ...parent,
            children: allCategories.filter(cat =>
              cat.parentCategory &&
              (cat.parentCategory._id === parent._id || cat.parentCategory === parent._id)
            )
          }));
          setCategories(organized);
          if (organized.length > 0) {
            setActiveParent(organized[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug, type) => {
    closeMobileMenu();
    if (type === 'course') {
      router.push(`/courses?category=${slug}`);
    } else if (type === 'website') {
      router.push(`/website?category=${slug}`);
    } else if (type === 'software') {
      router.push(`/software?category=${slug}`);
    } else {
      router.push(`/courses?category=${slug}`);
    }
  };

  const getIcon = (slug) => {
    const IconComponent = categoryIcons[slug] || categoryIcons['default'];
    return IconComponent;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className={bengaliClass}>{language === 'bn' ? 'কোনো ক্যাটাগরি পাওয়া যায়নি' : 'No categories found'}</p>
      </div>
    );
  }

  const activeCategory = categories.find(cat => cat._id === activeParent);

  return (
    <div className="flex">
      {/* Left Side - Parent Categories */}
      <div className="w-[220px] bg-gray-50 dark:bg-[#0a0a0a] p-3 border-r border-gray-100 dark:border-white/5">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-3">
          {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
        </p>
        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = getIcon(category.slug);
            const isActive = activeParent === category._id;
            return (
              <button
                key={category._id}
                onMouseEnter={() => setActiveParent(category._id)}
                onClick={() => handleCategoryClick(category.slug, category.type)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                  ? 'bg-white dark:bg-white/10 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                    }`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[13px] font-semibold ${bengaliClass}`}>
                    {language === 'bn' && category.nameBn ? category.nameBn : category.name}
                  </span>
                </div>
                {category.children && category.children.length > 0 && (
                  <LuChevronRight size={14} className={`transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Side - Child Categories */}
      <div className="flex-1 p-4">
        {activeCategory && (
          <>
            {/* Active Parent Header */}
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 dark:border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                {(() => {
                  const Icon = getIcon(activeCategory.slug);
                  return <Icon size={20} />;
                })()}
              </div>
              <div>
                <h4 className={`text-base font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                  {language === 'bn' && activeCategory.nameBn ? activeCategory.nameBn : activeCategory.name}
                </h4>
                <p className={`text-xs text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                  {activeCategory.children?.length || 0} {language === 'bn' ? 'টি সাব-ক্যাটাগরি' : 'subcategories'}
                </p>
              </div>
            </div>

            {/* Child Categories Grid */}
            {activeCategory.children && activeCategory.children.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {activeCategory.children.map((child) => (
                  <button
                    key={child._id}
                    onClick={() => handleCategoryClick(child.slug, child.type)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left hover:bg-teal-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <div className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-125 transition-transform"></div>
                    <span className={`text-[13px] font-medium text-gray-600 dark:text-gray-300 group-hover:text-teal-700 dark:group-hover:text-teal-400 ${bengaliClass}`}>
                      {language === 'bn' && child.nameBn ? child.nameBn : child.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                  <LuLayers className="text-gray-400" size={24} />
                </div>
                <p className={`text-sm text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                  {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো সাব-ক্যাটাগরি নেই' : 'No subcategories in this category'}
                </p>
                <button
                  onClick={() => handleCategoryClick(activeCategory.slug, activeCategory.type)}
                  className={`mt-3 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline ${bengaliClass}`}
                >
                  {language === 'bn' ? 'সব দেখুন →' : 'View all →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { items = [] } = useSelector((state) => state.cart || {});
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dark mode toggle handler
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
          setIsDarkMode(true);
          document.documentElement.classList.add("dark");
        }
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    try {
      if (typeof window !== 'undefined') {
        if (!isDarkMode) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setTimeout(() => setUser(JSON.parse(storedUser)), 0);
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setUser(null);
    closeMobileMenu();
    router.replace("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const courseTypes = [
    { key: "Online", label: t("navbar.onlineCourse"), icon: "🌐" },
    { key: "Offline", label: t("navbar.offlineCourse"), icon: "🏫" },
    { key: "Recorded", label: t("navbar.recordedCourse"), icon: "📹" },
  ];

  const handleCourseTypeClick = (courseType) => {
    closeMobileMenu();
    router.push(`/courses?type=${courseType}`);
  };

  const menu = [
    { href: "/", label: t("navbar.home") },
    { href: "/courses", label: t("navbar.courses") },
    { href: "/software", label: t("navbar.software") },
    { href: "/website", label: t("navbar.website") },
    { href: "/about", label: t("navbar.about") },
    { href: "/contact", label: t("navbar.contact") },
  ];

  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Mobile Menu Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:hidden top-0 left-0 w-[85%] max-w-[360px] h-full bg-white z-[70] shadow-2xl flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <Link href="/" onClick={closeMobileMenu}>
                  <img className="w-32" src="/images/ejobsitlogo.png" alt="eJobsIT" />
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <BiX className="text-2xl" />
                </button>
              </div>

              {/* Mobile Scroll Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Language for Mobile */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">Select Language</p>
                  <LanguageSwitcher variant="compact" />
                </div>

                {/* Dark Mode Toggle for Mobile */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">Theme</p>
                  <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <LuMoon size={20} className="text-amber-400" />
                      ) : (
                        <LuSun size={20} className="text-amber-500" />
                      )}
                      <span className="text-sm font-semibold text-gray-700">
                        {isDarkMode ? "Dark Mode" : "Light Mode"}
                      </span>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} relative`}>
                      <motion.div
                        animate={{ x: isDarkMode ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`absolute top-1 w-4 h-4 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-white shadow-sm'}`}
                      />
                    </div>
                  </button>
                </div>

                {/* Main Navigation */}
                <nav className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">Main Menu</p>
                  {menu.map(({ href, label }, index) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMobileMenu}
                      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${pathname === href
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <span className={`text-base ${bengaliClass}`}>{label}</span>
                      <LuArrowRight className={`text-teal-500 transition-all ${pathname === href ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                    </Link>
                  ))}
                </nav>

                {/* User Section Mobile */}
                <div className="pt-6 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-amber-500/5">
                        <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-[#41bfb8]">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                              {(user.name || user.gmail || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name || user.gmail?.split('@')[0]}</p>
                          <p className="text-xs text-teal-600 font-medium uppercase tracking-tighter">{user.role || 'Member'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href={user.role === 'admin' ? "/dashboard/admin" : user.role === 'mentor' ? "/dashboard/mentor" : "/dashboard/user"}
                          onClick={closeMobileMenu}
                          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-700"
                        >
                          <LuLayoutDashboard size={20} />
                          <span className="text-[11px] font-bold uppercase">Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600"
                        >
                          <LuLogOut size={20} />
                          <span className="text-[11px] font-bold uppercase">Logout</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/login" onClick={closeMobileMenu} className="block w-full text-center py-4 rounded-2xl bg-gray-900 text-white font-bold shadow-xl shadow-gray-200">
                        Sign In
                      </Link>
                      <Link href="/register" onClick={closeMobileMenu} className="block w-full text-center py-4 rounded-2xl bg-teal-500 text-white font-bold shadow-xl shadow-teal-100">
                        Join Platform
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${isSticky
          ? "bg-white/90 dark:bg-[#020202] backdrop-blur-xl dark:backdrop-blur-0 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] py-2 border-b border-gray-200/50 dark:border-white/5"
          : "bg-white dark:bg-[#020202] py-4"
          }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between gap-4">

            {/* Left: Logo & Categories */}
            <div className="flex items-center gap-8 xl:gap-12">
              <Link href="/" className="relative flex-shrink-0">
                <img
                  className={`transition-all duration-300 ${isSticky ? "w-32" : "w-36 lg:w-30"}`}
                  src="/images/ejobsitlogo.png"
                  alt="eJobsIT"
                />
              </Link>

              {/* Category Dropdown - Desktop */}
              <div className="hidden lg:block relative group">
                <button className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gray-50/70 dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-100 hover:bg-white dark:hover:bg-[#151515] transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                    <BiCategory size={18} />
                  </div>
                  <span className={`text-[14px] font-bold tracking-tight ${language === 'bn' ? 'hind-siliguri' : ''}`}>
                    {t("navbar.category")}
                  </span>
                  <LuChevronDown className="text-gray-400 dark:text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Categories Mega Menu */}
                <div className="absolute top-full left-0 mt-4 w-[600px] bg-white dark:bg-[#0d0d0d] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-4 transition-all duration-500 z-50 overflow-hidden">
                  <CategoryMegaMenu closeMobileMenu={closeMobileMenu} language={language} bengaliClass={bengaliClass} />
                </div>
              </div>
            </div>

            {/* Center: Navigation Links - Desktop */}
            <div className="hidden xl:flex items-center bg-gray-50/70 dark:bg-[#0d0d0d] p-1.5 rounded-full border border-gray-100 dark:border-white/10">
              {menu.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-5 py-2 rounded-full text-[14px] font-outfit transition-all duration-300 ${pathname === href
                    ? "bg-white dark:bg-white/20 text-teal-600 dark:text-white shadow-sm font-bold"
                    : "text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-white font-semibold"
                    } ${language === 'bn' ? 'hind-siliguri' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* 1. Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300 group"
                aria-label="Toggle dark mode"
              >
                {mounted && (
                  <motion.div
                    animate={{ rotate: isDarkMode ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative"
                  >
                    {isDarkMode ? (
                      <LuMoon size={18} className="text-amber-400" />
                    ) : (
                      <LuSun size={18} className="text-amber-500 group-hover:rotate-12 transition-transform" />
                    )}
                  </motion.div>
                )}
              </button>

              {/* 2. Language Switcher */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* 3. Cart */}
              <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-all group">
                <LuShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                {mounted && items.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* 4. Profile with Name & Dropdown */}
              {mounted && user ? (
                <div className="profile-dropdown-container relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-teal-500/30 overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                          {(user.name || "U").charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-semibold text-gray-700 max-w-[100px] truncate ${bengaliClass}`}>
                      {user.name || user.gmail?.split('@')[0] || 'User'}
                    </span>
                    <LuChevronDown className={`text-gray-400 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        {/* User Info Header */}
                        <div className="p-4 bg-gradient-to-br from-teal-500/10 to-amber-500/5 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-teal-500">
                              {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                                  {(user.name || "U").charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className={`font-bold text-gray-900 text-sm ${bengaliClass}`}>{user.name || user.gmail?.split('@')[0]}</p>
                              <p className="text-[10px] text-teal-600 font-semibold uppercase tracking-wide">{user.role || 'Member'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href={user.role === 'admin' ? "/dashboard/admin" : user.role === 'mentor' ? "/dashboard/mentor" : "/dashboard/user"}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-all group"
                          >
                            <LuLayoutDashboard size={18} className="text-gray-400 group-hover:text-teal-600" />
                            <span className={`text-sm font-semibold ${bengaliClass}`}>Dashboard</span>
                          </Link>
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all group"
                          >
                            <LuLogOut size={18} className="text-rose-400 group-hover:text-rose-600" />
                            <span className="text-sm font-semibold">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : mounted ? (
                <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-all shadow-md shadow-teal-500/20">
                  <LuUser size={16} />
                  <span>Login</span>
                </Link>
              ) : null}

              {/* Mobile Toggle */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 transition-all"
                onClick={toggleMobileMenu}
              >
                <BiMenu size={22} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Adding custom animation styles */}
      <style jsx global>{`
        .outfit { font-family: 'Outfit', sans-serif; }
        .hind-siliguri { font-family: 'Hind Siliguri', sans-serif; }
      `}</style>
    </>
  );
};

export default Navbar;
