'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiBook,
  FiUsers,
  FiMessageSquare,
  FiImage,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiArrowLeft,
  FiGlobe,
  FiShoppingBag,
  FiAward,
  FiBarChart2,
  FiSettings,
  FiLayers,
  FiCode,
  FiPlay,
  FiStar,
  FiCreditCard,
  FiUserCheck,
  FiDownload,
  FiGrid,
  FiFileText,
  FiClipboard,
  FiBell,
  FiLock,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState([]);
  const pathname = usePathname();
  const { isDark } = useTheme();

  // Exact match for active state
  const isActive = (href) => pathname === href;

  // Check if any child of a submenu is active (for parent highlight and auto-expand)
  const hasActiveChild = (submenu) => submenu?.some((s) => pathname === s.href);

  // Auto-expand parent menu when a child route is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.submenu && hasActiveChild(item.submenu)) {
        setOpenMenus(prev => prev.includes(item.title) ? prev : [...prev, item.title]);
      }
    });
  }, [pathname]);

  const toggleMenu = (menu) => {
    setOpenMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

  const isMenuOpen = (menu) => openMenus.includes(menu);

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/admin',
      icon: FiHome,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'LMS',
      icon: FiBook,
      gradient: 'from-amber-500 to-orange-500',
      submenu: [
        { title: 'All Courses', href: '/dashboard/admin/course', icon: FiBook },
        { title: 'Create Course', href: '/dashboard/admin/course/create', icon: FiFileText },
        { title: 'All Modules', href: '/dashboard/admin/module', icon: FiLayers },
        { title: 'Create Module', href: '/dashboard/admin/module/create', icon: FiFileText },
        { title: 'All Lessons', href: '/dashboard/admin/lesson', icon: FiPlay },
        { title: 'Create Lesson', href: '/dashboard/admin/lesson/create', icon: FiFileText },
        { title: 'Enrollments', href: '/dashboard/admin/enrollment', icon: FiUserCheck },
      ],
    },
    {
      title: 'Marketplace',
      icon: FiGlobe,
      gradient: 'from-emerald-500 to-teal-500',
      submenu: [
        { title: 'All Websites', href: '/dashboard/admin/website', icon: FiGlobe },
        { title: 'Create Website', href: '/dashboard/admin/website/create', icon: FiFileText },
        { title: 'All Software', href: '/dashboard/admin/software', icon: FiCode },
        { title: 'Create Software', href: '/dashboard/admin/software/create', icon: FiFileText },
      ],
    },
    {
      title: 'Categories',
      icon: FiLayers,
      gradient: 'from-violet-500 to-purple-500',
      submenu: [
        { title: 'All Categories', href: '/dashboard/admin/category', icon: FiLayers },
        { title: 'Create Category', href: '/dashboard/admin/category/create', icon: FiFileText },
      ],
    },
    {
      title: 'Users',
      icon: FiUsers,
      gradient: 'from-blue-500 to-cyan-500',
      submenu: [
        { title: 'All Users', href: '/dashboard/admin/user', icon: FiUsers },
        { title: 'Create User', href: '/dashboard/admin/user/create', icon: FiFileText },
      ],
    },
    {
      title: 'Orders',
      href: '/dashboard/admin/orders',
      icon: FiShoppingBag,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Reviews',
      href: '/dashboard/admin/reviews',
      icon: FiStar,
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      title: 'Downloads',
      href: '/dashboard/admin/downloads',
      icon: FiDownload,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Analytics',
      href: '/dashboard/admin/analytics',
      icon: FiBarChart2,
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Settings',
      icon: FiSettings,
      gradient: 'from-slate-500 to-slate-700',
      submenu: [
        { title: 'General', href: '/dashboard/admin/settings?tab=general', icon: FiSettings },
        { title: 'Notifications', href: '/dashboard/admin/settings?tab=notifications', icon: FiBell },
        { title: 'Security', href: '/dashboard/admin/settings?tab=security', icon: FiLock },
        { title: 'Payment', href: '/dashboard/admin/settings?tab=payment', icon: FiCreditCard },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40
        ${isOpen ? 'w-72' : 'w-0 lg:w-72'} overflow-hidden
        ${isDark
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-r border-slate-200'
          }`}
      >
        {/* Decorative Elements */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-gradient-to-br from-indigo-500/10 to-transparent' : 'bg-gradient-to-br from-indigo-500/5 to-transparent'
          }`} />
        <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-gradient-to-tr from-purple-500/10 to-transparent' : 'bg-gradient-to-tr from-purple-500/5 to-transparent'
          }`} />

        {/* Logo */}
        <div className={`relative px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
              MB
            </div>
            <div>
              <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Motion<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Boss</span>
              </h1>
              <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Back to Website */}
        <div className={`px-4 py-3 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/5'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
            <span className="text-sm font-medium">Back to Website</span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="relative px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <p className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Main Menu</p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            /* SUBMENU */
            if (item.submenu) {
              const activeSub = hasActiveChild(item.submenu);
              const menuOpen = isMenuOpen(item.title);

              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all
                    ${activeSub
                        ? isDark
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white'
                          : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-slate-800'
                        : isDark
                          ? 'text-slate-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${activeSub
                        ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                        : isDark
                          ? 'bg-slate-800 group-hover:bg-slate-700'
                          : 'bg-slate-200 group-hover:bg-slate-300'
                        } transition-all`}>
                        <Icon size={18} className={activeSub ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                      </div>
                      <span className="text-sm font-medium">{item.title}</span>
                    </span>
                    <FiChevronDown
                      className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                      size={16}
                    />
                  </button>

                  {/* Submenu Items */}
                  <div className={`overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 mt-1' : 'max-h-0'}`}>
                    <div className={`ml-6 pl-4 border-l-2 space-y-1 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                      {item.submenu.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = isActive(sub.href);
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all
                            ${isSubActive
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30'
                                : isDark
                                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                              }`}
                          >
                            <SubIcon size={15} className={isSubActive ? 'text-white' : ''} />
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            /* NORMAL MENU */
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                ${isActive(item.href)
                    ? isDark
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white'
                      : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-slate-800'
                    : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive(item.href)
                  ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                  : isDark
                    ? 'bg-slate-800 group-hover:bg-slate-700'
                    : 'bg-slate-200 group-hover:bg-slate-300'
                  } transition-all`}>
                  <Icon size={18} className={isActive(item.href) ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                </div>
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom - Logout Only */}
        <div className={`absolute bottom-0 left-0 w-full p-3 border-t backdrop-blur-sm ${isDark ? 'border-white/5 bg-slate-900/95' : 'border-slate-200 bg-white/95'
          }`}>
          <button
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <FiLogOut size={16} />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
