import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Code2, Terminal, Cpu, Database,
  Blocks, Wrench, X, ChevronRight,
} from "lucide-react";
import config from "./config.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ── Constants ─────────────────────────────────────────────────────────────────
const LANG_KEY    = "portfolio_lang";
const CONFIG_LANGS = Object.keys(config); // deklaracja na poziomie modułu — zawsze dostępna

const iconMap = { Code2, Terminal, Cpu, Database, Blocks, Wrench };

const PALETTE = {
  indigo:  { bg: "bg-indigo-500",  light: "bg-indigo-50",  text: "text-indigo-600"  },
  violet:  { bg: "bg-violet-500",  light: "bg-violet-50",  text: "text-violet-600"  },
  sky:     { bg: "bg-sky-500",     light: "bg-sky-50",     text: "text-sky-600"     },
  emerald: { bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600" },
  amber:   { bg: "bg-amber-500",   light: "bg-amber-50",   text: "text-amber-600"   },
  rose:    { bg: "bg-rose-500",    light: "bg-rose-50",    text: "text-rose-600"    },
};
const PALETTE_KEYS = Object.keys(PALETTE);

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStoredLang() {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored && CONFIG_LANGS.includes(stored) ? stored : CONFIG_LANGS[0];
  } catch {
    return CONFIG_LANGS[0];
  }
}

function withColor(items = []) {
  return items.map((item, i) => ({
    ...item,
    colorKey: PALETTE_KEYS[i % PALETTE_KEYS.length],
  }));
}

// ── useLang hook ──────────────────────────────────────────────────────────────
function useLang() {
  // Czyta z localStorage przy pierwszym renderze — działa po reloadzie
  const [lang, setLang] = useState(() => getStoredLang());

  useEffect(() => {
    // Fallback: nasłuchuje eventów gdyby inne komponenty emitowały zmianę bez reloadu
    const handler = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  return lang;
}

// ── Portal ────────────────────────────────────────────────────────────────────
function Portal({ children }) {
  const elRef = useRef(null);
  if (!elRef.current) elRef.current = document.createElement("div");

  useEffect(() => {
    const node = elRef.current;
    document.body.appendChild(node);
    return () => document.body.removeChild(node);
  }, []);

  return createPortal(children, elRef.current);
}

// ── ExpandedCard ──────────────────────────────────────────────────────────────
function ExpandedCard({ item, onClose }) {
  const overlayRef = useRef(null);
  const panelRef   = useRef(null);
  const closingRef = useRef(false);

  const color         = PALETTE[item.colorKey] ?? PALETTE.indigo;
  const IconComponent = iconMap[item.icon];

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" },
    );
    tl.fromTo(panelRef.current,
      { opacity: 0, y: 32, scale: 0.95 },
      { opacity: 1, y: 0,  scale: 1,   duration: 0.55, ease: "power4.out" },
      "<0.05",
    );
    tl.fromTo(".exp-tag",
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, stagger: 0.045, duration: 0.35, ease: "power3.out" },
      "-=0.2",
    );
    tl.fromTo(".exp-bar-fill",
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: "power3.out", transformOrigin: "left center" },
      "-=0.3",
    );
  }, { scope: overlayRef });

  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current,   { opacity: 0, y: 20, scale: 0.96, duration: 0.3,  ease: "power3.in" });
    tl.to(overlayRef.current, { opacity: 0,                      duration: 0.22, ease: "power2.in" }, "-=0.1");
  };

  return (
    <Portal>
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10"
        style={{
          backgroundColor: "rgba(15,23,42,0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div
          ref={panelRef}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white rounded-[28px] p-8 md:p-10 overflow-hidden"
          style={{ boxShadow: "0 40px 100px -20px rgba(0,0,0,0.22)" }}
        >
          <div className={`pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.06] ${color.bg}`} />

          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors duration-200"
          >
            <X size={15} strokeWidth={2.5} />
          </button>

          <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${color.light} ${color.text} mb-6`}>
            {IconComponent && <IconComponent size={26} strokeWidth={1.8} />}
          </div>

          <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">{item.name}</h3>
          <p className="text-slate-500 text-base leading-relaxed mb-8">{item.longDesc}</p>

          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {item.tags.map((tag) => (
                <span key={tag} className={`exp-tag px-3.5 py-1.5 text-sm font-medium rounded-full ${color.light} ${color.text}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {item.level != null && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Proficiency</span>
                <span className={`text-2xl font-black ${color.text}`}>{item.level}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`exp-bar-fill h-full rounded-full ${color.bg}`} style={{ width: `${item.level}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}

// ── TechCard ──────────────────────────────────────────────────────────────────
function TechCard({ item, onOpen }) {
  const cardRef       = useRef(null);
  const color         = PALETTE[item.colorKey] ?? PALETTE.indigo;
  const IconComponent = iconMap[item.icon];

  const enter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { y: -5, scale: 1.025, boxShadow: "0 22px 55px -10px rgba(0,0,0,0.11)", duration: 0.4, ease: "expo.out" });
    const icon  = cardRef.current.querySelector(".c-icon");
    const arrow = cardRef.current.querySelector(".c-arrow");
    if (icon)  gsap.to(icon,  { scale: 1.12, duration: 0.4,  ease: "back.out(2)"  });
    if (arrow) gsap.to(arrow, { x: 3, opacity: 1, duration: 0.28, ease: "power2.out" });
  };

  const leave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { y: 0, scale: 1, boxShadow: "0 4px 24px -4px rgba(0,0,0,0.05)", duration: 0.5, ease: "expo.out" });
    const icon  = cardRef.current.querySelector(".c-icon");
    const arrow = cardRef.current.querySelector(".c-arrow");
    if (icon)  gsap.to(icon,  { scale: 1, duration: 0.4, ease: "expo.out"   });
    if (arrow) gsap.to(arrow, { x: 0, opacity: 0.35, duration: 0.28, ease: "power2.out" });
  };

  const down = () => { if (cardRef.current) gsap.to(cardRef.current, { scale: 0.975, duration: 0.14, ease: "power2.out" }); };
  const up   = () => { if (cardRef.current) gsap.to(cardRef.current, { scale: 1.025, duration: 0.3,  ease: "back.out(2)" }); };

  return (
    <div
      ref={cardRef}
      className="tech-card relative bg-white border border-slate-100 rounded-[20px] p-6 cursor-pointer overflow-hidden select-none"
      style={{ boxShadow: "0 4px 24px -4px rgba(0,0,0,0.05)" }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onMouseDown={down}
      onMouseUp={up}
      onClick={() => onOpen(item)}
    >
      <div className={`pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.06] ${color.bg}`} />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className={`c-icon w-12 h-12 flex items-center justify-center rounded-2xl ${color.light} ${color.text}`}>
            {IconComponent && <IconComponent size={20} strokeWidth={1.8} />}
          </div>
          <div className="c-arrow opacity-35 text-slate-400 mt-0.5">
            <ChevronRight size={18} strokeWidth={2} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">{item.name}</h3>
          <p className="text-sm text-slate-500 leading-snug line-clamp-2">{item.shortDesc}</p>
        </div>

        {item.level != null && (
          <div className="flex items-center gap-3 mt-auto pt-1">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${color.bg} opacity-60`} style={{ width: `${item.level}%` }} />
            </div>
            <span className={`text-xs font-bold ${color.text}`}>{item.level}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── StackGroup ────────────────────────────────────────────────────────────────
function StackGroup({ label, items, onOpen }) {
  const groupRef = useRef(null);

  useGSAP(() => {
    if (!groupRef.current) return;
    const labelEl = groupRef.current.querySelector(".group-label");
    const cards   = groupRef.current.querySelectorAll(".tech-card");

    if (labelEl) {
      gsap.from(labelEl, {
        scrollTrigger: { trigger: groupRef.current, start: "top 88%", once: true },
        x: -14, opacity: 0, duration: 0.65, ease: "power3.out",
      });
    }
    if (cards.length) {
      gsap.from(cards, {
        scrollTrigger: { trigger: groupRef.current, start: "top 88%", once: true },
        y: 26, opacity: 0, stagger: 0.065, duration: 0.7, ease: "power3.out",
      });
    }
  }, { scope: groupRef });

  return (
    <div ref={groupRef}>
      <p className="group-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 px-1">
        {label}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {items.map((item) => (
          <TechCard key={item.id} item={item} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

// ── StackSection ──────────────────────────────────────────────────────────────
export default function StackSection() {
  // ✅ useLang() nie przyjmuje argumentów — CONFIG_LANGS jest na poziomie modułu
  const lang = useLang();

  const [activeItem, setActiveItem] = useState(null);
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);

  const t = config[lang]?.stack;

  // ✅ withColor wywołane po sprawdzeniu t
  const languages = withColor(t?.languages ?? []);
  const skills    = withColor(t?.skills    ?? []);

  useGSAP(() => {
    if (!headerRef.current) return;
    gsap.from(headerRef.current.children, {
      scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
      y: 28, opacity: 0, stagger: 0.12, duration: 0.85, ease: "power4.out",
    });
  }, { scope: sectionRef, dependencies: [lang] });

  if (!t) return null;

  return (
    <>
      <section
        id="skills"
        ref={sectionRef}
        className="relative bg-white rounded-t-[40px] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] -mt-4 z-40 pt-20 pb-32 font-sans scroll-mt-28"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">

          <div ref={headerRef} className="mb-16 md:mb-20 flex flex-col items-center text-center gap-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-[0.18em]">
              {t.sectionLabel}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              {t.title}
            </h2>
          </div>

          <div className="flex flex-col gap-16">
            <StackGroup label={t.languagesLabel} items={languages} onOpen={setActiveItem} />
            <StackGroup label={t.skillsLabel}    items={skills}    onOpen={setActiveItem} />
          </div>

        </div>
      </section>

      {activeItem && (
        <ExpandedCard item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </>
  );
}