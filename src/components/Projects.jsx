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

function ProjectCard({ item, index, cta, onCtaHover }) {
  const isFeatured = index === 0;
  const isReversed = index % 2 === 1;

  return (
    <article className="project-card bg-limestone rounded-[40px] p-6 md:p-10 overflow-hidden">
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center ${
          isReversed ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="lg:col-span-7">
          <div
            className={`relative aspect-[4/3] rounded-[40px] overflow-hidden ${
              isFeatured ? "halftone" : "bg-ember"
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover object-top mix-blend-luminosity opacity-80"
            />
            <div
              className={`absolute inset-0 ${
                isFeatured
                  ? "bg-gradient-to-tr from-plasma-violet/35 via-transparent to-ember/25"
                  : "bg-ember/20"
              }`}
            />
            <div className="absolute top-5 left-5 font-display text-[48px] md:text-[64px] leading-none tracking-[0.02em] text-chalk">
              {item.id}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center min-h-0">
          <span className="inline-flex w-fit items-center px-3 py-1 mb-5 bg-sulfur text-obsidian text-[12px] font-medium rounded-[800px]">
            {item.category}
          </span>

          <h3 className="font-display text-[32px] md:text-[48px] leading-none tracking-[0.64px] text-obsidian mb-5">
            {item.title}
          </h3>

          <p className="text-obsidian/75 text-[16px] leading-[1.55] mb-6">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {item.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-sulfur text-obsidian rounded-[800px] text-[12px] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={(e) => onCtaHover(e, true)}
            onMouseLeave={(e) => onCtaHover(e, false)}
            className="inline-flex w-fit items-center gap-2 px-6 py-3 bg-ember text-obsidian font-medium text-[16px] rounded-[800px]"
          >
            {cta}
            <ArrowUpRight size={18} className="btn-arrow" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const languages = Object.keys(config);
  const lang = useLang(languages);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleLangChange = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const t = config[lang].projects;
  const cta = lang === "pl" ? "Zobacz projekt" : "View Project";

  useGSAP(
    () => {
      gsap.from(".projects-header > *", {
        scrollTrigger: {
          trigger: ".projects-header",
          start: "top 85%",
          once: true,
        },
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
      });

      gsap.utils.toArray(".project-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            once: true,
          },
          y: 36,
          opacity: 0,
          duration: 0.85,
          delay: i * 0.06,
          ease: "power4.out",
        });
      });
    },
    { scope: containerRef, dependencies: [lang] }
  );

  const handleCtaHover = (e, isEnter) => {
    gsap.to(e.currentTarget, {
      scale: isEnter ? 0.97 : 1,
      backgroundColor: isEnter ? "#e04600" : "#fc5000",
      duration: 0.25,
      ease: "power2.out",
      force3D: true,
    });

    const arrow = e.currentTarget.querySelector(".btn-arrow");
    if (arrow) {
      gsap.to(arrow, {
        x: isEnter ? 3 : 0,
        y: isEnter ? -3 : 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative bg-pumice pt-20 md:pt-24 pb-20 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 lg:px-24">
        <div className="projects-header mb-12 md:mb-20">
          <div className="uppercase tracking-[0.18em] text-obsidian/50 font-medium text-[12px] mb-4">
            {t.sectionLabel}
          </div>
          <h2 className="font-display text-[48px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-[0.02em] text-obsidian">
            {t.title}
          </h2>
          <hr className="dotted-h w-24 mt-8" />
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          {t.items.map((item, index) => (
            <ProjectCard
              key={item.id}
              item={item}
              index={index}
              cta={cta}
              onCtaHover={handleCtaHover}
            />
          ))}
        </div>
      </div>
    </section>
  );
}