"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Lenis from 'lenis';

import { fetchCategories } from "@/redux/categorySlice";
import Hero from "@/components/Home/Hero";
import HomeCategory from "@/components/Home/HomeCategory";
import PopularCourse from "@/components/Home/PopularCourse";
import WhatWeProvide from "@/components/Home/WhatWeProvide";
import DigitalProducts from "@/components/Home/DigitalProducts";
import { fetchCoursesData } from "@/redux/CourseSlice";

// Component to handle mouse light - Hook safe
const MouseLight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const lightX = useSpring(mouseX, { stiffness: 50, damping: 30, mass: 0.5 });
  const lightY = useSpring(mouseY, { stiffness: 50, damping: 30, mass: 0.5 });

  const translateX = useTransform(lightX, (v) => v - 300);
  const translateY = useTransform(lightY, (v) => v - 300);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-teal-500/[0.04] dark:bg-teal-500/[0.06] blur-[150px] pointer-events-none z-[1] hidden lg:block"
      style={{
        x: translateX,
        y: translateY
      }}
    />
  );
};

// ScrollSection - Hook safe
const ScrollSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobileDevice(window.innerWidth < 1024);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress: rawSectionProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"]
  });

  const sectionProgress = useSpring(rawSectionProgress, {
    stiffness: 50,
    damping: 40,
    restDelta: 0.001
  });

  const scale = useTransform(sectionProgress, [0, 0.45, 0.55, 1], [0.95, 1, 1, 0.95]);
  const opacity = useTransform(sectionProgress, [0, 0.35, 0.65, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: isMobileDevice ? 1 : scale,
        opacity: isMobileDevice ? 1 : opacity,
        willChange: isMobileDevice ? "auto" : "transform, opacity"
      }}
      className={`w-full origin-center ${className}`}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 1024);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (mounted) {
      dispatch(fetchCoursesData());
      dispatch(fetchCategories());
    }
  }, [dispatch, mounted]);

  useEffect(() => {
    if (!mounted || isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [mounted, isMobile]);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroScale = useTransform(smoothProgress, [0, 0.15], [1, 0.85]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.15], [0, -100]);
  const heroFilter = useTransform(smoothProgress, [0, 0.15], ["blur(0px)", "blur(20px)"]);

  // Computed styles to avoid object literals in JSX which sometimes trigger deep comparison errors
  const heroStyleApplied = {
    scale: isMobile ? 1 : heroScale,
    opacity: isMobile ? 1 : heroOpacity,
    y: isMobile ? 0 : heroY,
    filter: isMobile ? "blur(0px)" : heroFilter
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-black selection:bg-teal-500 selection:text-black font-poppins antialiased">
      <MouseLight />

      {/* Scroll Progress Indicator */}
      <motion.div className="fixed top-0 left-0 w-full h-[3px] bg-teal-500/10 z-[10000]">
        <motion.div className="h-full bg-teal-500 origin-left" style={{ scaleX: scrollYProgress }} />
      </motion.div>

      <main className="relative">
        {/* Sticky Hero with Parallax Effect */}
        <section className={`${isMobile ? 'relative' : 'sticky top-0'} h-screen w-full overflow-hidden z-0 bg-white dark:bg-black`}>
          <motion.div
            style={heroStyleApplied}
            className="h-full w-full"
          >
            <Hero />
          </motion.div>
        </section>

        {/* Following Sections with Scroll Transitions */}
        <section className={`relative z-10 bg-white dark:bg-[#020202] ${isMobile ? '' : 'shadow-[0_-80px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_-80px_100px_rgba(0,0,0,0.6)] rounded-t-[50px] lg:rounded-t-[100px]'}`}>
          <ScrollSection>
            <HomeCategory />
          </ScrollSection>

          <ScrollSection>
            <PopularCourse />
          </ScrollSection>

          <ScrollSection>
            <DigitalProducts />
          </ScrollSection>

          <ScrollSection>
            <WhatWeProvide />
          </ScrollSection>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
