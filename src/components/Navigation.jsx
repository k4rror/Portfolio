import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Code2,
  ArrowUpRight,
  Sparkles,
  Globe,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import config from "./config.json";

gsap.registerPlugin(useGSAP);

const LANG_KEY = "portfolio_lang";

const scrollToId = (href) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

function getInitialLang(languages) {
  const stored = localStorage.getItem(LANG_KEY);
  return stored && languages.includes(stored) ? stored : languages[0];
}

export default function FloatingNav() {
  const languages = Object.keys(config);

  const [lang, setLang] = useState(() => getInitialLang(languages));
  const[isScrolled, setIsScrolled] = useState(false);
  const[isLangOpen, setIsLangOpen] = useState(false);
  const[isMenuOpen, setIsMenuOpen] = useState(false);

  const containerRef = useRef(null);
  const starRef = useRef(null);
  const dropdownRef = useRef(null);

  const t = config[lang].nav;

  // ── Global language sync ───────────────────────────────────────────────────
  useEffect(() => {
    const handleLangChange = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  },[]);

  // ── Scroll tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  },[]);

  // ── Dropdown animation ─────────────────────────────────────────────────────
  useGSAP(() => {
    if (!dropdownRef.current) return;
    if (isLangOpen) {
      gsap.to(dropdownRef.current, {
        y: 0,
        scale: 1,
        opacity: 1,
        display: "flex",
        duration: 0.35,
        ease: "expo.out",
        overwrite: true,
      });
    } else {
      gsap.to(dropdownRef.current, {
        y: -8,
        scale: 0.96,
        opacity: 0,
        display: "none",
        duration: 0.2,
        ease: "power2.inOut",
        overwrite: true,
      });
    }
  }, [isLangOpen]);

  // ── Mount animation & Context Safe for Event Handlers ──────────────────────
  const { contextSafe } = useGSAP(() => {
    gsap.from(".nav-element", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.04,
      ease: "expo.out",
      delay: 0.1,
    });

    if (starRef.current) {
      gsap.to(starRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 4.5,
        ease: "none",
        force3D: true,
        transformOrigin: "50% 50%",
      });
    }
  }, { scope: containerRef });

  // ── Language switch ────────────────────────────────────────────────────────
  const switchLanguage = (newLang) => {
    setIsLangOpen(false);
    if (newLang === lang) return;
    localStorage.setItem(LANG_KEY, newLang);
    setLang(newLang);
    window.dispatchEvent(new CustomEvent("languageChange", { detail: newLang }));
  };

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    scrollToId(href);
  };

  // ── Micro-interactions (Fixed with overwrite: true & contextSafe) ──────────
  const handleNavHover = contextSafe((e, isEnter) => {
    gsap.to(e.currentTarget, {
      backgroundColor: isEnter ? "rgba(241,245,249,1)" : "rgba(241,245,249,0)",
      color: isEnter ? "#0f172a" : "#64748b",
      scale: isEnter ? 1.05 : 1,
      duration: isEnter ? 0.3 : 0.2,
      ease: isEnter ? "back.out(2)" : "power2.out",
      overwrite: true, // This explicitly kills conflicting tweens on rapid hover
    });
  });

  const handleLogoHover = contextSafe((e, isEnter) => {
    gsap.to(e.currentTarget, {
      scale: isEnter ? 1.04 : 1,
      duration: isEnter ? 0.3 : 0.2,
      ease: isEnter ? "back.out(2)" : "power2.out",
      overwrite: true,
    });
  });

  const handleButtonHover = contextSafe((e, isEnter) => {
    gsap.to(e.currentTarget, {
      scale: isEnter ? 0.96 : 1,
      duration: 0.3,
      ease: "expo.out",
      overwrite: true,
    });
    
    const arrow = e.currentTarget.querySelector(".btn-arrow");
    if (arrow) {
      gsap.to(arrow, {
        x: isEnter ? 4 : 0,
        y: isEnter ? -4 : 0,
        duration: 0.3,
        ease: "back.out(2)",
        overwrite: true,
      });
    }
  });

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
    >
      {/* Progressive-blur backdrop: masks page content scrolling under the bar */}
      <div
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 h-28 transition-opacity duration-500 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent)",
          maskImage: "linear-gradient(to bottom, black 45%, transparent)",
        }}
      />
      <div
        className={`pointer-events-auto w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? "max-w-4xl" : "max-w-7xl"
        }`}
      >
        <div
          className={`relative rounded-full p-[1.5px] transition-all duration-500 ease-out ${
            isScrolled
              ? "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] bg-slate-200/60"
              : "shadow-none bg-transparent"
          }`}
        >
          {/* Spinning conic border */}
          <div
            className={`absolute inset-0 overflow-hidden rounded-full transition-opacity duration-500 pointer-events-none ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              ref={starRef}
              className="absolute top-1/2 left-1/2 w-[1500px] h-[1500px] -translate-x-1/2 -translate-y-1/2 blur-[1px] opacity-90"
              style={{
                willChange: "transform",
                background:
                  "conic-gradient(from 0deg, transparent 50%, rgba(99,102,241,0.15) 75%, rgba(99,102,241,0.9) 95%, rgba(255,255,255,1) 100%)",
              }}
            />
          </div>

          {/* Inner nav */}
          <nav
            className={`relative flex items-center justify-between rounded-full transition-all duration-500 ease-out ${
              isScrolled
                ? "bg-white/95 backdrop-blur-xl px-3 py-2.5"
                : "bg-transparent px-2 py-2"
            }`}
          >
            {/* Logo */}
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, "#about")}
              className="nav-element flex items-center gap-2 group cursor-pointer px-2"
              onMouseEnter={(e) => handleLogoHover(e, true)}
              onMouseLeave={(e) => handleLogoHover(e, false)}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
                <Code2 size={20} strokeWidth={2.5} />
              </div>
              <span className="font-sans font-bold text-slate-900 tracking-tight text-lg">
                {t.logo}
              </span>
            </a>

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-1">
              {t.links.map((link) => (
                <li key={link.name} className="nav-element">
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="font-sans font-medium text-slate-500 text-sm tracking-wide block px-5 py-2.5 rounded-full"
                    onMouseEnter={(e) => handleNavHover(e, true)}
                    onMouseLeave={(e) => handleNavHover(e, false)}
                    style={{ transformOrigin: "center center" }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="nav-element flex items-center gap-3">
              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
                >
                  <Globe size={16} />
                  <span className="font-sans font-medium text-sm uppercase">{lang}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  ref={dropdownRef}
                  className="absolute top-full right-0 mt-3 hidden flex-col w-36 bg-white rounded-[20px] p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100/50 backdrop-blur-xl z-50 origin-top-right"
                >
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLanguage(l)}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                        lang === l
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{l.toUpperCase()}</span>
                      {lang === l && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA (desktop) */}
              <button
                onClick={() => scrollToId("#contact")}
                className="hidden md:flex items-center gap-2 bg-slate-900 text-white font-sans font-medium text-sm px-6 py-3 rounded-full shadow-[0_-5px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer"
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                style={{ transformOrigin: "center center" }}
              >
                <Sparkles size={14} className="text-indigo-400" />
                {t.hireMe}
                <ArrowUpRight size={16} className="btn-arrow text-slate-400" />
              </button>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden mt-3 origin-top transition-all duration-300 ${
            isMenuOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-1 bg-white/95 backdrop-blur-xl rounded-[24px] p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] border border-slate-100">
            {t.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-sans font-medium text-slate-600 text-base px-4 py-3 rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={(e) => handleLinkClick(e, "#contact")}
              className="mt-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-sans font-medium text-sm px-6 py-3.5 rounded-2xl"
            >
              <Sparkles size={14} className="text-indigo-400" />
              {t.hireMe}
              <ArrowUpRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}