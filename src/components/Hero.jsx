import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  MapPin,
  Clock,
  Code2,
  Calendar,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import config from "./config.json";

gsap.registerPlugin(useGSAP);

const iconMap = {
  MapPin,
  Clock,
  Code2,
  Calendar,
  GraduationCap,
};
const LANG_KEY = "portfolio_lang";

export function getStoredLang(languages) {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored && languages.includes(stored) ? stored : languages[0];
  } catch {
    return languages[0];
  }
}

export function useLang(languages) {
  const [lang, setLang] = useState(() => getStoredLang(languages));

  useEffect(() => {
    const handler = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  return lang;
}
export default function HeroSection() {
  const languages = Object.keys(config);
  const lang = useLang(languages);
  const containerRef = useRef(null);
    
  // Global Language Sync
  useEffect(() => {
    const handleLangChange = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const t = config[lang].hero;

  useGSAP(
    () => {
      // Re-trigger animation on language change or mount
      gsap.fromTo(
        ".hero-element",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.06,
          ease: "power4.out",
          delay: 0.1,
        }
      );
    },
    { scope: containerRef, dependencies: [lang] }
  );

  // Tactile Micro-interactions (Light Mode Colors matching Nav)
  const handleButtonHover = (e, isEnter, isPrimary) => {
    gsap.to(e.currentTarget, {
      scale: isEnter ? 0.97 : 1,
      backgroundColor: isPrimary
        ? isEnter
          ? "#4f46e5" // indigo-600
          : "#6366f1" // indigo-500
        : isEnter
        ? "rgba(241, 245, 249, 1)" // slate-100
        : "transparent",
      duration: 0.3,
      ease: "power2.out",
      force3D: true,
    });
  };

  const handlePillHover = (e, isEnter) => {
    gsap.to(e.currentTarget, {
      y: isEnter ? -3 : 0,
      backgroundColor: isEnter ? "#0f172a" : "#ffffff", // slate-900 : white
      color: isEnter ? "#ffffff" : "#475569", // white : slate-600
      borderColor: isEnter ? "#0f172a" : "#e2e8f0", // slate-900 : slate-200
      duration: 0.3,
      ease: "back.out(1.5)",
      force3D: true,
    });
  };

  const handleServiceHover = (e, isEnter) => {
    const arrow = e.currentTarget.querySelector(".service-arrow");
    gsap.to(e.currentTarget, {
      x: isEnter ? 8 : 0,
      color: isEnter ? "#0f172a" : "#334155", // slate-900 : slate-700
      duration: 0.3,
      ease: "power2.out",
    });
    if (arrow) {
      gsap.to(arrow, {
        x: isEnter ? 4 : 0,
        color: isEnter ? "#4f46e5" : "#6366f1", // indigo-600 : indigo-500
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleStatHover = (e, isEnter) => {
    gsap.to(e.currentTarget, {
      y: isEnter ? -6 : 0,
      backgroundColor: isEnter ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
      borderColor: isEnter ? "rgba(99, 102, 241, 0.3)" : "rgba(226, 232, 240, 0.8)",
      boxShadow: isEnter
        ? "0 20px 40px -10px rgba(0,0,0,0.08)"
        : "0 0px 0px rgba(0,0,0,0)",
      duration: 0.4,
      ease: "power3.out",
      force3D: true,
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-slate-50 pt-36 pb-20 px-6 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden font-sans"
    >
      {/* Background Soft Glow (matches light mode Nav theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/30 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-16 lg:gap-24 relative z-10">
        
        {/* Top Header Label */}
        <div className="hero-element uppercase tracking-[0.2em] text-slate-500 font-bold text-xs md:text-sm">
          {t.sectionLabel}
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
          
          {/* Left Column: Intro & Details */}
          <div className="flex flex-col gap-8">
            <h1 className="hero-element text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              {t.greeting} <br />
              <span className="text-indigo-600">{t.name}</span>
            </h1>

            {/* Personal Info List */}
            <ul className="hero-element flex flex-col gap-4 mt-2">
              {t.personalInfo.map((item, i) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <li key={i} className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600">
                      {IconComponent && <IconComponent size={16} strokeWidth={2.5} />}
                    </div>
                    <span className="text-base font-medium">{item.text}</span>
                  </li>
                );
              })}
            </ul>

            {/* Bio */}
            <p className="hero-element text-slate-600 text-lg leading-relaxed max-w-lg mt-2">
              {t.bio}
            </p>

            {/* Actions */}
            <div className="hero-element flex flex-wrap items-center gap-4 mt-4">
              <button
                onMouseEnter={(e) => handleButtonHover(e, true, true)}
                onMouseLeave={(e) => handleButtonHover(e, false, true)}
                className="flex items-center gap-2 px-8 py-3.5 bg-indigo-500 text-white font-medium rounded-full shadow-[0_10px_30px_-10px_rgba(99,102,241,0.4)]"
              >
                <Sparkles size={16} />
                {t.buttons.primary}
              </button>
              
              <button
                onMouseEnter={(e) => handleButtonHover(e, true, false)}
                onMouseLeave={(e) => handleButtonHover(e, false, false)}
                className="flex items-center gap-2 px-8 py-3.5 border border-slate-300 text-slate-700 font-medium rounded-full transition-colors"
              >
                {t.buttons.secondary}
              </button>
            </div>
          </div>

          {/* Right Column: Skills & Services */}
          <div className="flex flex-col gap-14 lg:pl-12">
            
            {/* Skills */}
            <div className="flex flex-col gap-6">
              <h3 className="hero-element text-2xl font-bold text-slate-900">
                {t.skillsLabel}
              </h3>
              <div className="hero-element flex flex-wrap gap-3">
                {t.skills.map((skill) => (
                  <div
                    key={skill}
                    onMouseEnter={(e) => handlePillHover(e, true)}
                    onMouseLeave={(e) => handlePillHover(e, false)}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-full cursor-default"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="flex flex-col gap-6">
              <h3 className="hero-element text-2xl font-bold text-slate-900">
                {t.servicesLabel}
              </h3>
              <ul className="flex flex-col gap-4">
                {t.services.map((service, i) => (
                  <li
                    key={i}
                    onMouseEnter={(e) => handleServiceHover(e, true)}
                    onMouseLeave={(e) => handleServiceHover(e, false)}
                    className="hero-element flex items-center gap-3 text-slate-600 font-medium cursor-pointer"
                  >
                    <ArrowRight 
                      size={16} 
                      className="service-arrow text-indigo-500" 
                      strokeWidth={2.5} 
                    />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
          {t.stats.map((stat, i) => (
            <div
              key={i}
              onMouseEnter={(e) => handleStatHover(e, true)}
              onMouseLeave={(e) => handleStatHover(e, false)}
              className="hero-element flex flex-col justify-center p-6 md:p-8 bg-white/60 border border-slate-200/80 rounded-[20px] backdrop-blur-sm cursor-default transition-colors"
            >
              <div className="text-4xl md:text-5xl font-bold text-indigo-600 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-500 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}