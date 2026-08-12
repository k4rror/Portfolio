import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Code2, Terminal, Database, Blocks, Wrench } from "lucide-react";
import config from "./config.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LANG_KEY = "portfolio_lang";
const CONFIG_LANGS = Object.keys(config);
const iconMap = { Code2, Terminal, Database, Blocks, Wrench };

const USED_IN = {
  "lang-js": ["Malinowe Zdrowie", "Szybkie Jedzenie v2"],
  "lang-html-css": ["Malinowe Zdrowie", "Szybkie Jedzenie v2"],
  "lang-sql": ["Szybkie Jedzenie v2"],
  "skill-next": ["Malinowe Zdrowie", "Szybkie Jedzenie v2"],
  "skill-tail": ["Malinowe Zdrowie", "Szybkie Jedzenie v2"],
  "skill-db": ["Malinowe Zdrowie", "Szybkie Jedzenie v2"],
  "skill-ai": ["Malinowe Zdrowie", "Szybkie Jedzenie v2"],
};

const COPY = {
  en: {
    intro:
      "A practical stack I use to design, build and ship full-stack web apps on my own — interface, data and CMS included.",
    usedIn: "Used in",
    level: {
      core: "Core strength",
      strong: "Strong",
      proficient: "Proficient",
      working: "Working knowledge",
    },
  },
  pl: {
    intro:
      "Praktyczny stack, którym samodzielnie projektuję, buduję i wdrażam aplikacje full-stack — od interfejsu, przez dane, po CMS.",
    usedIn: "Używane w",
    level: {
      core: "Mocna strona",
      strong: "Solidnie",
      proficient: "Biegle",
      working: "W praktyce",
    },
  },
};

function getStoredLang() {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored && CONFIG_LANGS.includes(stored) ? stored : CONFIG_LANGS[0];
  } catch {
    return CONFIG_LANGS[0];
  }
}

function useLang() {
  const [lang, setLang] = useState(() => getStoredLang());

  useEffect(() => {
    const handler = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  return lang;
}

function getVariant(id) {
  if (id === "lang-js" || id === "skill-next") return "ember";
  if (id === "skill-tail") return "plasma";
  return "limestone";
}

function getLevelLabel(level, labels) {
  if (level >= 90) return labels.core;
  if (level >= 80) return labels.strong;
  if (level >= 70) return labels.proficient;
  return labels.working;
}

function TechCard({ item, usedInLabel, levelLabels }) {
  const IconComponent = iconMap[item.icon];
  const variant = getVariant(item.id);
  const usedIn = USED_IN[item.id] || [];
  const levelLabel = item.level != null ? getLevelLabel(item.level, levelLabels) : null;

  const surface =
    variant === "ember"
      ? "bg-ember text-chalk"
      : variant === "plasma"
      ? "halftone text-chalk"
      : "bg-limestone text-obsidian";

  const muted = variant === "limestone" ? "text-obsidian/70" : "text-chalk/85";
  const number = variant === "limestone" ? "text-ember" : "text-chalk";
  const iconWrap =
    variant === "limestone"
      ? "bg-ember text-obsidian"
      : "bg-obsidian text-chalk";
  const barTrack = variant === "limestone" ? "bg-pumice" : "bg-obsidian/20";
  const barFill = variant === "limestone" ? "bg-ember" : "bg-chalk";

  return (
    <article
      className={`tech-card relative rounded-[40px] p-8 md:p-10 overflow-hidden ${surface}`}
    >
      <div className="relative z-10 flex flex-col h-full min-h-[340px]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-[16px] ${iconWrap}`}
          >
            {IconComponent && <IconComponent size={20} strokeWidth={1.8} />}
          </div>

          {item.level != null && (
            <div className="text-right">
              <div
                className={`font-display text-[56px] md:text-[64px] leading-[1.1] tracking-[0.02em] ${number}`}
              >
                {item.level}%
              </div>
              <div
                className={`text-[12px] font-medium uppercase tracking-[0.14em] mt-1 ${muted}`}
              >
                {levelLabel}
              </div>
            </div>
          )}
        </div>

        <span className="inline-flex w-fit items-center px-3 py-1 mb-4 bg-sulfur text-obsidian text-[12px] font-medium rounded-[800px]">
          {item.shortDesc}
        </span>

        <h3 className="font-display text-[32px] md:text-[40px] leading-none tracking-[0.64px] mb-4">
          {item.name}
        </h3>

        <p className={`text-[16px] leading-[1.55] mb-6 ${muted}`}>
          {item.longDesc}
        </p>

        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[12px] font-medium rounded-[800px] bg-sulfur text-obsidian"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-4">
          {item.level != null && (
            <div className="w-full h-2 rounded-[800px] overflow-hidden">
              <div className={`w-full h-full ${barTrack}`}>
                <div
                  className={`h-full rounded-[800px] ${barFill}`}
                  style={{ width: `${item.level}%` }}
                />
              </div>
            </div>
          )}

          {usedIn.length > 0 && (
            <p className={`text-[12px] font-medium leading-[1.4] ${muted}`}>
              {usedInLabel}
              <span className={variant === "limestone" ? "text-obsidian" : "text-chalk"}>
                {" · "}
                {usedIn.join(" · ")}
              </span>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function StackGroup({ label, items, usedInLabel, levelLabels }) {
  const groupRef = useRef(null);

  useGSAP(() => {
    if (!groupRef.current) return;

    const labelEl = groupRef.current.querySelector(".group-label");
    const cards = groupRef.current.querySelectorAll(".tech-card");

    if (labelEl) {
      gsap.from(labelEl, {
        scrollTrigger: {
          trigger: groupRef.current,
          start: "top 88%",
          once: true,
        },
        y: 16,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    if (cards.length) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: groupRef.current,
          start: "top 84%",
          once: true,
        },
        y: 32,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power4.out",
      });
    }
  }, { scope: groupRef });

  return (
    <div ref={groupRef}>
      <div className="group-label flex items-center gap-4 mb-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/50">
          {label}
        </p>
        <hr className="dotted-h flex-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {items.map((item) => (
          <TechCard
            key={item.id}
            item={item}
            usedInLabel={usedInLabel}
            levelLabels={levelLabels}
          />
        ))}
      </div>
    </div>
  );
}

export default function StackSection() {
  const lang = useLang();
  const sectionRef = useRef(null);
  const t = config[lang]?.stack;
  const copy = COPY[lang] || COPY.en;

  useGSAP(
    () => {
      gsap.from(".stack-header > *", {
        scrollTrigger: {
          trigger: ".stack-header",
          start: "top 85%",
          once: true,
        },
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
      });
    },
    { scope: sectionRef, dependencies: [lang] }
  );

  if (!t) return null;

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative bg-pumice pt-20 md:pt-24 pb-20 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 lg:px-24">
        <div className="stack-header mb-12 md:mb-20 max-w-3xl">
          <div className="uppercase tracking-[0.18em] text-obsidian/50 font-medium text-[12px] mb-4">
            {t.sectionLabel}
          </div>
          <h2 className="font-display text-[48px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-[0.02em] text-obsidian">
            {t.title}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.55] text-obsidian/75">
            {copy.intro}
          </p>
          <hr className="dotted-h w-24 mt-8" />
        </div>

        <div className="flex flex-col gap-16 md:gap-20">
          <StackGroup
            label={t.languagesLabel}
            items={t.languages}
            usedInLabel={copy.usedIn}
            levelLabels={copy.level}
          />
          <StackGroup
            label={t.skillsLabel}
            items={t.skills}
            usedInLabel={copy.usedIn}
            levelLabels={copy.level}
          />
        </div>
      </div>
    </section>
  );
}