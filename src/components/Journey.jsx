import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Gamepad2, GraduationCap, Code2, Rocket } from "lucide-react";
import config from "./config.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const iconMap = { Gamepad2, GraduationCap, Code2, Rocket };
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

      mm.add("(min-width: 1024px)", () => {
        const slider = sliderRef.current;
        const container = containerRef.current;
        const getScrollAmount = () => -(slider.scrollWidth - window.innerWidth);

        gsap.to(slider, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${slider.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.from(".journey-header", {
          scrollTrigger: { trigger: container, start: "top 80%" },
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
        });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.from(".journey-header", {
          scrollTrigger: { trigger: containerRef.current, start: "top 85%" },
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });

        gsap.utils.toArray(".journey-card").forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            x: -28,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          });
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [lang, t] }
  );

  if (!t) return null;

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative bg-obsidian overflow-hidden flex flex-col justify-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        ref={sliderRef}
        className="flex flex-col lg:flex-row items-start pt-20 pb-24 lg:py-[18vh] px-6 md:px-12 lg:px-0 w-full lg:w-max will-change-transform"
      >
        <div className="journey-header flex flex-col justify-center w-full lg:w-[40vw] lg:pl-24 lg:pr-16 shrink-0 mb-16 lg:mb-0">
          <div className="uppercase tracking-[0.18em] text-chalk/50 font-medium text-[12px] mb-4">
            {t.sectionLabel}
          </div>
          <h2 className="font-display text-[48px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-[0.02em] text-chalk">
            {t.title}
          </h2>
          <hr className="dotted-h w-24 mt-8 border-chalk/40" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:pr-24 lg:pl-8">
          {t.items.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            const isFeatured = index === t.items.length - 1;

            return (
              <div
                key={item.id}
                className={`journey-card relative flex flex-col w-full lg:w-[400px] shrink-0 p-10 rounded-[40px] ${
                  isFeatured ? "bg-ember text-chalk" : "bg-limestone text-obsidian"
                }`}
              >
                {index !== t.items.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-0 border-t-[1.5px] border-dotted border-chalk/30 -translate-y-1/2" />
                )}

                <div className="flex items-center justify-between mb-8">
                  <div
                    className={`font-medium text-[12px] px-3 py-1 rounded-[800px] ${
                      isFeatured
                        ? "bg-obsidian text-chalk"
                        : "bg-sulfur text-obsidian"
                    }`}
                  >
                    {item.year}
                  </div>
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      isFeatured
                        ? "bg-obsidian text-chalk"
                        : "bg-ember text-obsidian"
                    }`}
                  >
                    {IconComponent && (
                      <IconComponent size={22} strokeWidth={2} />
                    )}
                  </div>
                </div>

                <h3 className="font-display text-[32px] leading-none tracking-[0.64px] mb-4">
                  {item.title}
                </h3>
                <p
                  className={`text-[16px] leading-[1.55] ${
                    isFeatured ? "text-chalk/90" : "text-obsidian/70"
                  }`}
                >
                  {item.description}
                </p>

                <div
                  className={`absolute bottom-6 right-8 font-display text-[80px] leading-none select-none pointer-events-none ${
                    isFeatured ? "text-obsidian/15" : "text-obsidian/8"
                  }`}
                >
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