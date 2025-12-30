"use client";
import React from "react";
import Image from "next/image";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";

const seminars = [
  {
    id: 1,
    speaker: "Sakibul Hasan",
    title: "MERN Stack Career Roadmap",
    time: "15:30 PM",
    image: "https://i.ibb.co/XZ78JQ9f/Mern-card.jpg",
    type: "Seminar",
    location: "Offline",
    startsIn: "Start In A Week",
  },
  {
    id: 2,
    speaker: "Sheikh Sakibul",
    title: "Career Of Wordpress",
    time: "16:00 PM",
    image: "https://i.ibb.co/GvS6k4FJ/DM-caed.jpg",
    type: "Seminar",
    location: "Offline",
    startsIn: "Start In A Week",
  },
  {
    id: 3,
    speaker: "Ashraf Hossain",
    title: "Digital Marketing Trends 2025",
    time: "16:00 PM",
    image: "https://i.ibb.co/GvS6k4FJ/DM-caed.jpg",
    type: "Seminar",
    location: "Online",
    startsIn: "Start In A Week",
  },
  {
    id: 4,
    speaker: "Abu Sayeed",
    title: "Graphics Design With AI",
    time: "16:00 PM",
    image: "https://i.ibb.co/zWvWjS9X/GD-Card-1.jpg",
    type: "Seminar",
    location: "Offline",
    startsIn: "Start In A Week",
  },
];

const EventsPage = () => {
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const getLocationType = (location) => {
    if (language === "bn") {
      return location === "Online" ? t("eventsPage.online") : t("eventsPage.offline");
    }
    return location;
  };

  return (
    <div className="min-h-screen bg-[#ecfcfb]">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#e8f9f9] via-white to-[#fff8f0] overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(65,191,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(65,191,184,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-10 left-10 w-60 h-60 bg-[#41bfb8]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#F79952]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 lg:px-16 py-10 lg:py-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-[#F79952]/10 border border-[#F79952]/20 rounded-full">
              <HiOutlineCalendarDays className="text-[#F79952] text-base" />
              <span className={`text-xs font-medium text-gray-700 work ${bengaliClass}`}>{t("eventsPage.badge")}</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold outfit text-gray-800 mb-2 ${bengaliClass}`}>
              {t("eventsPage.title1")}<span className="text-[#41bfb8]">{t("eventsPage.title2")}</span>
            </h1>
            <p className={`text-gray-500 work text-sm leading-relaxed ${bengaliClass}`}>
              {t("eventsPage.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="container mx-auto px-4 lg:px-16 py-10">
        <div className="space-y-4">
          {seminars.map((event, index) => (
            <div
              key={event.id}
              className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#41bfb8]/10 transition-all duration-300"
            >
              {/* Left Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#41bfb8] to-[#F79952] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="flex flex-col md:flex-row items-stretch">
                {/* Left Section - Number & Image */}
                <div className="flex items-center gap-4 p-5 md:p-6 md:border-r border-gray-100">
                  {/* Number Badge */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#41bfb8]/10 to-[#41bfb8]/5 flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-[#41bfb8] outfit">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Live Indicator */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${event.location === "Online" ? "bg-green-500 animate-pulse" : "bg-[#F79952]"}`}></span>
                      <span className="text-[10px] font-medium text-gray-700">{event.location === "Online" ? "LIVE" : "VENUE"}</span>
                    </div>
                  </div>
                </div>

                {/* Middle Section - Info */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                  {/* Type & Location Badges */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md ${event.location === "Online"
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-[#F79952]/10 text-[#F79952] border border-[#F79952]/20"
                      } ${bengaliClass}`}>
                      {getLocationType(event.location)}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-[#41bfb8]/10 text-[#41bfb8] border border-[#41bfb8]/20 rounded-md ${bengaliClass}`}>
                      {language === "bn" ? t("eventsPage.seminar") : event.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 outfit group-hover:text-[#41bfb8] transition-colors mb-1">
                    {event.title}
                  </h3>

                  {/* Speaker with Avatar */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#41bfb8] to-[#F79952] flex items-center justify-center text-white text-[10px] font-bold">
                      {event.speaker.charAt(0)}
                    </div>
                    <p className="text-sm text-gray-500 work">
                      {event.speaker}
                    </p>
                  </div>
                </div>

                {/* Right Section - Time & CTA */}
                <div className="flex items-center gap-6 p-5 md:p-6 bg-gradient-to-r from-transparent to-gray-50/50 md:border-l border-gray-100">
                  {/* Time Block - Made smaller */}
                  <div className="text-center hidden md:block">
                    <div className="flex items-center gap-1 text-gray-400 mb-1">
                      <HiOutlineCalendarDays className="text-xs" />
                      <span className={`text-[10px] work ${bengaliClass}`}>
                        {language === "bn" ? t("eventsPage.startsIn") : event.startsIn}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-800 outfit">
                      {event.time}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-12 bg-gray-200"></div>

                  {/* Register Button */}
                  <a
                    href={`https://wa.me/8801321231802?text=${encodeURIComponent(
                      `আমি "${event.title}" সেমিনারটিতে যোগ দিতে চাই।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative overflow-hidden px-6 py-3 bg-gradient-to-r from-[#41bfb8] to-[#38a89d] text-white font-semibold text-sm rounded-lg shadow-md shadow-[#41bfb8]/20 hover:shadow-lg hover:shadow-[#41bfb8]/30 hover:-translate-y-0.5 transition-all duration-300 group/btn ${bengaliClass}`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {t("eventsPage.register")}
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
