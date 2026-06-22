import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import config from "./config.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);
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
export default function ProjectsSection() {
  const languages = Object.keys(config);
  const lang = useLang(languages);
  const [activeProject, setActiveProject] = useState(0);
  
  const containerRef = useRef(null);
  const desktopPanelsRef = useRef([]);

  const t = config[lang].projects;

  // Responsive GSAP Animations using MatchMedia
  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      // --- DESKTOP ANIMATIONS (>= 1024px) ---
      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray(".desktop-panel");
        const images = gsap.utils.toArray(".desktop-image");

        // Initial state
        gsap.set(panels, { opacity: 0.2, scale: 0.95 });
        if (panels[0]) gsap.set(panels[0], { opacity: 1, scale: 1 });

        // ScrollTrigger for Text Panels
        panels.forEach((panel, i) => {
          ScrollTrigger.create({
            trigger: panel,
            start: "top 50%",
            end: "bottom 50%",
            onToggle: (self) => {
              if (self.isActive) {
                setActiveProject(i);
                gsap.to(panel, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              } else {
                gsap.to(panel, {
                  opacity: 0.2,
                  scale: 0.95,
                  duration: 0.6,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              }
            },
          });
        });

        // Watch activeProject to crossfade images
        images.forEach((img, i) => {
          if (i === activeProject) {
            gsap.to(img, {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "expo.out",
              zIndex: 10,
              overwrite: "auto",
            });
          } else {
            gsap.to(img, {
              opacity: 0,
              scale: 1.05,
              duration: 0.8,
              ease: "expo.out",
              zIndex: 1,
              overwrite: "auto",
            });
          }
        });
      });

      // --- MOBILE ANIMATIONS (< 1024px) ---
      mm.add("(max-width: 1023px)", () => {
        const mobileCards = gsap.utils.toArray(".mobile-card");
        
        mobileCards.forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power4.out",
          });
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [lang, activeProject] }
  );

  // Micro-interactions
  const handleButtonHover = (e, isEnter) => {
    gsap.to(e.currentTarget, {
      scale: isEnter ? 0.97 : 1,
      backgroundColor: isEnter ? "#1e293b" : "#0f172a",
      duration: 0.3,
      ease: "power2.out",
      force3D: true,
    });
    
    const arrow = e.currentTarget.querySelector(".btn-arrow");
    if (arrow) {
      gsap.to(arrow, {
        x: isEnter ? 3 : 0,
        y: isEnter ? -3 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleTagHover = (e, isEnter) => {
    gsap.to(e.currentTarget, {
      y: isEnter ? -2 : 0,
      backgroundColor: isEnter ? "#e0e7ff" : "#f1f5f9",
      color: isEnter ? "#4f46e5" : "#475569",
      duration: 0.3,
      ease: "back.out(2)",
    });
  };

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative bg-white rounded-t-[40px] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] -mt-4 z-20 pt-16 md:pt-24 pb-20 md:pb-32 font-sans overflow-visible scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-12 lg:px-24">
        
        {/* Section Header */}
        <div className="mb-10 md:mb-20">
          <div className="uppercase tracking-[0.2em] text-slate-400 font-bold text-[10px] md:text-xs mb-3 md:mb-4">
            {t.sectionLabel}
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
            {t.title}
          </h2>
        </div>

        {/* =========================================
            DESKTOP LAYOUT (Sticky Image + Scroll Text)
            ========================================= */}
        <div className="hidden lg:flex flex-row gap-24 relative items-start">
          {/* Left Column: Locked/Sticky Image */}
          <div className="w-1/2 sticky top-32 z-30">
            <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] bg-slate-100">
              {t.items.map((item, i) => (
                <div
                  key={i}
                  className="desktop-image absolute inset-0 w-full h-full will-change-transform"
                  style={{ opacity: i === 0 ? 1 : 0, transform: "scale(1.05)" }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Scrolling Text Panels */}
          <div className="w-1/2 flex flex-col pt-[10vh] pb-[30vh]">
            {t.items.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => (desktopPanelsRef.current[i] = el)}
                className="desktop-panel min-h-[70vh] flex flex-col justify-center will-change-transform opacity-20"
              >
                <div className="flex items-center gap-3 text-indigo-600 font-bold tracking-widest text-sm mb-6">
                  <span className="text-slate-300 font-black">{item.id}</span>
                  <span className="w-8 h-[2px] bg-indigo-200" />
                  <span className="uppercase">{item.category}</span>
                </div>

                <h3 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-slate-500 text-xl leading-relaxed mb-8 max-w-lg">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2.5 mb-10">
                  {item.tech.map((tech) => (
                    <span
                      key={tech}
                      onMouseEnter={(e) => handleTagHover(e, true)}
                      onMouseLeave={(e) => handleTagHover(e, false)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium cursor-default border border-slate-200/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={item.link}
                    onMouseEnter={(e) => handleButtonHover(e, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false)}
                    className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-medium rounded-full shadow-[0_5px_20px_rgba(0,0,0,0.1)] transition-colors"
                  >
                    View Project
                    <ArrowUpRight size={18} className="btn-arrow text-slate-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            MOBILE LAYOUT (Stacked Cards)
            ========================================= */}
        <div className="flex flex-col gap-16 lg:hidden">
          {t.items.map((item, i) => (
            <div key={item.id} className="mobile-card flex flex-col w-full">
              
              {/* Card Image */}
              <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] mb-6 bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
              </div>

              {/* Card Content */}
              <div className="flex flex-col px-1">
                <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-widest text-[10px] md:text-xs mb-3">
                  <span className="text-slate-300 font-black">{item.id}</span>
                  <span className="w-6 h-[2px] bg-indigo-200" />
                  <span className="uppercase">{item.category}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {item.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-3">
                  <a
                    href={item.link}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium text-sm rounded-full shadow-[0_5px_20px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-transform"
                  >
                    View Project
                    <ArrowUpRight size={16} className="text-slate-400" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}