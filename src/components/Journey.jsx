import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Gamepad2, GraduationCap, Code2, Rocket } from "lucide-react";
import config from "./config.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const iconMap = {
  Gamepad2,
  GraduationCap,
  Code2,
  Rocket,
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
export default function JourneySection() {
  const languages = Object.keys(config);
  const lang = useLang(languages);
  
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  // Global Language Sync
  useEffect(() => {
    const handleLangChange = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const t = config[lang]?.journey;

  useGSAP(
    () => {
      if (!t) return;
      let mm = gsap.matchMedia();

      // --- DESKTOP: Horizontal Scroll Pin ---
      mm.add("(min-width: 1024px)", () => {
        const slider = sliderRef.current;
        const container = containerRef.current;

        // Calculate total scroll distance based on content width vs window width
        const getScrollAmount = () => -(slider.scrollWidth - window.innerWidth);

        const tween = gsap.to(slider, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${slider.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1, // smooth scrubbing
            invalidateOnRefresh: true, // recalculate on resize
          },
        });

        // Intro animation for the header
        gsap.from(".journey-header", {
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        });
      });

      // --- MOBILE: Vertical Stack Fade Reveal ---
      mm.add("(max-width: 1023px)", () => {
        gsap.from(".journey-header", {
          scrollTrigger: { trigger: containerRef.current, start: "top 85%" },
          y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
        });

        const cards = gsap.utils.toArray(".journey-card");
        cards.forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            x: -40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [lang, t] }
  );

  // Micro-interactions for Cards
  const handleCardHover = (e, isEnter) => {
    gsap.to(e.currentTarget, {
      y: isEnter ? -10 : 0,
      backgroundColor: isEnter ? "rgba(30, 41, 59, 1)" : "rgba(15, 23, 42, 1)", // slate-800 : slate-900
      borderColor: isEnter ? "rgba(99, 102, 241, 0.4)" : "rgba(30, 41, 59, 1)", // indigo-500/40 : slate-800
      boxShadow: isEnter
        ? "0 20px 40px -10px rgba(0,0,0,0.5)"
        : "0 10px 30px -10px rgba(0,0,0,0)",
      duration: 0.4,
      ease: "power3.out",
      force3D: true,
    });

    const iconBox = e.currentTarget.querySelector(".icon-box");
    if (iconBox) {
      gsap.to(iconBox, {
        scale: isEnter ? 1.1 : 1,
        backgroundColor: isEnter ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)",
        color: isEnter ? "#818cf8" : "#6366f1", // indigo-400 : indigo-500
        duration: 0.4,
        ease: "back.out(2)",
      });
    }
  };

  if (!t) return null;

  return (
    <section
      ref={containerRef}
      /* App-like Layering: Dark background overlapping the previous light section */
      className="relative bg-slate-950 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] -mt-4 z-30 overflow-hidden font-sans flex flex-col justify-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Background Soft Ambient Light */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

      {/* 
        The slider container. 
        On desktop: flex row, very wide, animated leftward via GSAP.
        On mobile: block layout, standard vertical scrolling.
      */}
      <div
        ref={sliderRef}
        className="flex flex-col lg:flex-row items-start pt-20 pb-24 lg:py-[20vh] px-6 md:px-12 lg:px-0 w-full lg:w-max will-change-transform"
      >
        
        {/* Header Block (Acts as the first slide on desktop) */}
        <div className="journey-header flex flex-col justify-center w-full lg:w-[40vw] lg:pl-24 lg:pr-16 shrink-0 mb-16 lg:mb-0">
          <div className="uppercase tracking-[0.2em] text-indigo-400 font-bold text-xs md:text-sm mb-4">
            {t.sectionLabel}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-100 tracking-tight leading-[1.1]">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-indigo-600 mt-8 rounded-full opacity-50" />
        </div>

        {/* Timeline Cards */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:pr-24 lg:pl-8">
          {t.items.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            
            return (
              <div
                key={item.id}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
                className="journey-card relative flex flex-col w-full lg:w-[400px] shrink-0 p-8 md:p-10 bg-slate-900 border border-slate-800 rounded-[20px] cursor-default group"
              >
                {/* Connecting Line (Desktop Only) */}
                {index !== t.items.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-12 w-12 h-[2px] bg-slate-800 -translate-y-1/2 z-0" />
                )}

                {/* Top Section: Year Pill & Icon */}
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-indigo-500/10 text-indigo-400 font-bold text-sm px-5 py-2 rounded-full border border-indigo-500/20">
                    {item.year}
                  </div>
                  <div className="icon-box flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 transition-colors">
                    {IconComponent && <IconComponent size={24} strokeWidth={2} />}
                  </div>
                </div>

                {/* Content Section */}
                <h3 className="text-2xl font-bold text-slate-100 mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  {item.description}
                </p>

                {/* Decorative ID Number */}
                <div className="absolute bottom-6 right-8 text-6xl font-black text-slate-800/30 select-none pointer-events-none">
                  {item.id}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}