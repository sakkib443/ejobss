"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchCategories } from "@/redux/categorySlice";
import Hero from "@/components/Home/Hero";
import HomeCategory from "@/components/Home/HomeCategory";
import PopularCourse from "@/components/Home/PopularCourse";
import WhatWeProvide from "@/components/Home/WhatWeProvide";
import DigitalProducts from "@/components/Home/DigitalProducts";
import { fetchCoursesData } from "@/redux/CourseSlice";

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCoursesData());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      <Hero></Hero>
      <HomeCategory />
      <div
        className="container mx-auto rounded-2xl mb-20 bg-cover"
        style={{ backgroundImage: `url("/images/bg1.png")` }}
      >
        <PopularCourse />
      </div>
      <DigitalProducts />
      <WhatWeProvide />
    </div>
  );
};

export default HomePage;
