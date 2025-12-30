"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiOutlineSparkles } from "react-icons/hi2";
import { LuMail, LuPhone, LuMapPin, LuSend, LuClock, LuArrowRight } from "react-icons/lu";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const ContactPage = () => {
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const [messageSent, setMessageSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageSent(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const contactInfo = [
    {
      icon: LuMail,
      titleKey: "emailUs",
      value: "info@bdcallingacademy.com",
      link: "mailto:info@bdcallingacademy.com",
      color: "#41bfb8",
    },
    {
      icon: LuPhone,
      titleKey: "callUs",
      value: "+88 01321231802",
      link: "tel:+8801321231802",
      color: "#F79952",
    },
    {
      icon: LuMapPin,
      titleKey: "visitUs",
      value: "Daisy Garden, House 14 (Level-5), Block A, Banasree, Dhaka",
      valueBn: "ডেইজি গার্ডেন, বাড়ি ১৪ (লেভেল-৫), ব্লক এ, বনশ্রী, ঢাকা",
      link: "#map",
      color: "#8B5CF6",
    },
    {
      icon: LuClock,
      titleKey: "officeHours",
      valueKey: "officeHoursValue",
      link: null,
      color: "#EC4899",
    },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com/bdcallingacademy.bd", label: "Facebook", color: "#1877F2" },
    { icon: FaYoutube, href: "https://www.youtube.com/@bdCalling", label: "YouTube", color: "#FF0000" },
    { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/bdcallingitltd", label: "LinkedIn", color: "#0A66C2" },
    { icon: FaWhatsapp, href: "https://wa.me/8801321231802", label: "WhatsApp", color: "#25D366" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Modal */}
      {messageSent && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setMessageSent(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuSend className="text-green-600 text-2xl" />
            </div>
            <h3 className={`text-xl font-bold text-gray-800 outfit mb-2 ${bengaliClass}`}>{t("contactPage.messageSent")}</h3>
            <p className={`text-gray-500 work mb-6 ${bengaliClass}`}>{t("contactPage.messageResponse")}</p>
            <button
              onClick={() => setMessageSent(false)}
              className={`px-6 py-2.5 bg-[#41bfb8] hover:bg-[#38a89d] text-white font-medium rounded-md transition-colors ${bengaliClass}`}
            >
              {t("contactPage.close")}
            </button>
          </div>
        </>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#e8f9f9] via-white to-[#fff8f0] border-b border-gray-200 py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <HiOutlineSparkles className="text-[#F79952] text-lg" />
              <span className={`text-sm font-medium text-gray-700 work ${bengaliClass}`}>{t("contactPage.badge")}</span>
            </div>
            <h1 className={`text-3xl lg:text-4xl font-bold outfit text-gray-800 mb-4 ${bengaliClass}`}>
              {t("contactPage.title1")}<span className="text-[#41bfb8]">{t("contactPage.title2")}</span>
            </h1>
            <p className={`text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed work ${bengaliClass}`}>
              {t("contactPage.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 lg:px-16 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white border border-gray-200 rounded-md p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-md flex items-center justify-center mb-4"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <item.icon className="text-xl" style={{ color: item.color }} />
              </div>
              <h3 className={`text-sm font-medium text-gray-500 work mb-1 ${bengaliClass}`}>{t(`contactPage.${item.titleKey}`)}</h3>
              {item.link ? (
                <a
                  href={item.link}
                  className={`text-gray-800 font-semibold outfit text-sm hover:text-[#41bfb8] transition-colors ${bengaliClass}`}
                >
                  {language === "bn" && item.valueBn ? item.valueBn : item.value}
                </a>
              ) : (
                <p className={`text-gray-800 font-semibold outfit text-sm ${bengaliClass}`}>
                  {item.valueKey ? t(`contactPage.${item.valueKey}`) : item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-md p-8 shadow-sm">
            <h2 className={`text-2xl font-bold text-gray-800 outfit mb-6 ${bengaliClass}`}>{t("contactPage.sendMessage")}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium text-gray-700 work mb-1.5 ${bengaliClass}`}>
                    {t("contactPage.yourName")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#41bfb8] focus:border-[#41bfb8] outline-none transition-all text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium text-gray-700 work mb-1.5 ${bengaliClass}`}>
                    {t("contactPage.emailAddress")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#41bfb8] focus:border-[#41bfb8] outline-none transition-all text-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className={`block text-sm font-medium text-gray-700 work mb-1.5 ${bengaliClass}`}>
                  {t("contactPage.subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#41bfb8] focus:border-[#41bfb8] outline-none transition-all text-sm ${bengaliClass}`}
                  placeholder={t("contactPage.howCanWeHelp")}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className={`block text-sm font-medium text-gray-700 work mb-1.5 ${bengaliClass}`}>
                  {t("contactPage.message")}
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#41bfb8] focus:border-[#41bfb8] outline-none transition-all text-sm resize-none ${bengaliClass}`}
                  placeholder={t("contactPage.yourMessageHere")}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#41bfb8] hover:bg-[#38a89d] text-white font-medium rounded-md transition-all hover:shadow-lg group ${bengaliClass}`}
              >
                <LuSend className="text-lg group-hover:translate-x-1 transition-transform" />
                <span>{t("contactPage.send")}</span>
              </button>
            </form>
          </div>

          {/* Map & Social */}
          <div className="space-y-6">
            {/* Map */}
            <div id="map" className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8662.770468055722!2d90.41722969357912!3d23.765697600000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c754583dd209%3A0xdd0c5fcc7d2d3836!2sbdCalling%20IT%20Ltd.%20-%20Corporate%20Office!5e1!3m2!1sen!2sbd!4v1744982086149!5m2!1sen!2sbd"
                width="100%"
                height="300"
                className="border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="BD Calling Academy Location"
              />
            </div>

            {/* Social Links */}
            <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
              <h3 className={`text-lg font-bold text-gray-800 outfit mb-4 ${bengaliClass}`}>{t("contactPage.followUs")}</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    target="_blank"
                    className="group w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    aria-label={item.label}
                  >
                    <item.icon className="text-lg text-gray-600 group-hover:text-gray-800" style={{ color: item.color }} />
                  </Link>
                ))}
              </div>
              <p className={`mt-4 text-sm text-gray-500 work ${bengaliClass}`}>
                {t("contactPage.socialDescription")}
              </p>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-[#41bfb8] to-[#38a89d] rounded-md p-6 text-white">
              <h3 className={`text-lg font-bold outfit mb-2 ${bengaliClass}`}>{t("contactPage.needQuickHelp")}</h3>
              <p className={`text-white/80 work text-sm mb-4 ${bengaliClass}`}>
                {t("contactPage.whatsappDescription")}
              </p>
              <a
                href="https://wa.me/8801321231802"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#41bfb8] font-medium rounded-md hover:shadow-lg transition-all group ${bengaliClass}`}
              >
                <FaWhatsapp className="text-lg" />
                <span>{t("contactPage.chatWhatsapp")}</span>
                <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
