import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  MapPin,
  Code2,
  Calendar,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import config from "./config.json";

gsap.registerPlugin(useGSAP);

const iconMap = { MapPin, Code2, Calendar, GraduationCap };
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

  useEffect(() => {
    const handleLangChange = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const t = config[lang].hero;

  useGSAP(
    () => {
      gsap.fromTo(
        ".hero-element",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.06,
          ease: "power4.out",
          delay: 0.08,
        }
      );
    },
    { scope: containerRef, dependencies: [lang] }
  );

  const handleButtonHover = (e, isEnter, isPrimary) => {
    gsap.to(e.currentTarget, {
      scale: isEnter ? 0.97 : 1,
      backgroundColor: isPrimary
        ? isEnter
          ? "#e04600"
          : "#fc5000"
        : isEnter
        ? "#f7f6f2"
        : "transparent",
      duration: 0.25,
      ease: "power2.out",
      force3D: true,
    });
  };

  const handlePillHover = (e, isEnter) => {
    gsap.to(e.currentTarget, {
      backgroundColor: isEnter ? "#fc5000" : "#f5f28e",
      duration: 0.25,
      ease: "power2.out",
      force3D: true,
    });
  };

  const handleServiceHover = (e, isEnter) => {
    const arrow = e.currentTarget.querySelector(".service-arrow");
    gsap.to(e.currentTarget, {
      x: isEnter ? 8 : 0,
      duration: 0.25,
      ease: "power2.out",
    });
    if (arrow) {
      gsap.to(arrow, {
        x: isEnter ? 4 : 0,
        color: isEnter ? "#fc5000" : "#070607",
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen bg-pumice pt-36 pb-20 px-6 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-16 lg:gap-20 relative z-10">
        <div className="hero-element uppercase tracking-[0.18em] text-obsidian/50 font-medium text-[12px]">
          {t.sectionLabel}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <h1 className="hero-element font-display text-[64px] md:text-[96px] lg:text-[140px] xl:text-[189px] leading-[0.94] tracking-[0.02em] text-obsidian">
              {t.greeting}
              <br />
              <span className="text-ember">{t.name}</span>
            </h1>

            <ul className="hero-element flex flex-col gap-3 mt-1">
              {t.personalInfo.map((item, i) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <li key={i} className="flex items-center gap-4 text-obsidian">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-limestone text-ember">
                      {IconComponent && (
                        <IconComponent size={16} strokeWidth={2.5} />
                      )}
                    </div>
                    <span className="text-[16px] font-medium leading-[1.55]">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="hero-element text-obsidian/80 text-[16px] leading-[1.55] max-w-lg">
              {t.bio}
            </p>

            <div className="hero-element flex flex-wrap items-center gap-4 mt-2">
              <a
                href="#contact"
                onMouseEnter={(e) => handleButtonHover(e, true, true)}
                onMouseLeave={(e) => handleButtonHover(e, false, true)}
                className="flex items-center gap-2 px-6 py-3 bg-ember text-obsidian font-medium text-[16px] rounded-[800px]"
              >
                {t.buttons.primary}
              </a>
              <a
                href="#work"
                onMouseEnter={(e) => handleButtonHover(e, true, false)}
                onMouseLeave={(e) => handleButtonHover(e, false, false)}
                className="flex items-center gap-2 px-4 py-4 border-[1.5px] border-obsidian text-obsidian font-medium text-[16px] rounded-[40px]"
              >
                {t.buttons.secondary}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <h3 className="hero-element font-display text-[32px] leading-none tracking-[0.02em] text-obsidian">
                {t.skillsLabel}
              </h3>
              <div className="hero-element flex flex-wrap gap-2">
                {t.skills.map((skill) => (
                  <div
                    key={skill}
                    onMouseEnter={(e) => handlePillHover(e, true)}
                    onMouseLeave={(e) => handlePillHover(e, false)}
                    className="px-3 py-1 bg-sulfur text-obsidian text-[12px] font-medium rounded-[800px] cursor-default"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="hero-element font-display text-[32px] leading-none tracking-[0.02em] text-obsidian">
                {t.servicesLabel}
              </h3>
              <ul className="flex flex-col gap-3">
                {t.services.map((service, i) => (
                  <li
                    key={i}
                    onMouseEnter={(e) => handleServiceHover(e, true)}
                    onMouseLeave={(e) => handleServiceHover(e, false)}
                    className="hero-element flex items-center gap-3 text-obsidian font-medium text-[16px] cursor-pointer"
                  >
                    <ArrowRight
                      size={16}
                      className="service-arrow text-obsidian"
                      strokeWidth={2.5}
                    />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {t.stats.map((stat, i) => (
            <div
              key={i}
              className="hero-element flex flex-col justify-between p-10 bg-ember rounded-[40px] min-h-[180px]"
            >
              <div className="text-[14px] font-medium text-chalk/90 leading-[1.2]">
                {stat.label}
              </div>
              <div className="font-display text-[56px] md:text-[64px] lg:text-[80px] leading-[1.1] tracking-[0.02em] text-chalk">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}