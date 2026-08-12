import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

const config = {
  en: {
    nav: {
      logo: "KMalina.",
      links: [
        { name: "Work", href: "#work" },
        { name: "Stack", href: "#stack" },
        { name: "Journey", href: "#journey" },
        { name: "Contact", href: "#contact" },
      ],
      hireMe: "Hire Me",
    },
  },
  pl: {
    nav: {
      logo: "KMalina.",
      links: [
        { name: "Projekty", href: "#work" },
        { name: "Stack", href: "#stack" },
        { name: "Historia", href: "#journey" },
        { name: "Kontakt", href: "#contact" },
      ],
      hireMe: "Zatrudnij",
    },
  },
};

const LANG_KEY = "portfolio_lang";

function getInitialLang(languages) {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored && languages.includes(stored) ? stored : languages[0];
  } catch {
    return languages[0];
  }
}

export default function FloatingNav() {
  const languages = Object.keys(config);
  const [lang, setLang] = useState(() => getInitialLang(languages));
  const [isScrolled, setIsScrolled] = useState(false);

  const containerRef = useRef(null);
  const t = config[lang].nav;

  useEffect(() => {
    const handleLangChange = (e) => setLang(e.detail);
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      gsap.from(".nav-element", {
        y: -16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: "power4.out",
        delay: 0.08,
      });
    },
    { scope: containerRef }
  );

  const switchLanguage = (newLang) => {
    if (newLang === lang) return;
    localStorage.setItem(LANG_KEY, newLang);
    gsap.to("body", {
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => window.location.reload(),
    });
  };

  const handleNavHover = contextSafe((e, isEnter) => {
    gsap.to(e.currentTarget, {
      color: isEnter ? "#fc5000" : "#070607",
      duration: 0.22,
      ease: "power2.out",
      overwrite: true,
    });
  });

  const handleButtonHover = contextSafe((e, isEnter) => {
    gsap.to(e.currentTarget, {
      scale: isEnter ? 0.97 : 1,
      backgroundColor: isEnter ? "#e04600" : "#fc5000",
      duration: 0.25,
      ease: "power2.out",
      overwrite: true,
    });
    const arrow = e.currentTarget.querySelector(".btn-arrow");
    if (arrow) {
      gsap.to(arrow, {
        x: isEnter ? 3 : 0,
        y: isEnter ? -3 : 0,
        duration: 0.25,
        ease: "power2.out",
        overwrite: true,
      });
    }
  });

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
    >
      <div
        className={`pointer-events-auto w-full transition-all duration-500 ${
          isScrolled ? "max-w-4xl" : "max-w-[1280px]"
        }`}
      >
        <nav
          className={`relative flex items-center justify-between rounded-[800px] transition-all duration-500 ${
            isScrolled
              ? "bg-limestone px-4 py-2.5 md:px-5"
              : "bg-transparent px-2 py-2"
          }`}
        >
          <a
            href="/"
            className="nav-element flex items-center gap-2.5 px-2 group"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-ember text-obsidian font-display text-lg leading-none">
              K
            </span>
            <span className="font-display text-[26px] leading-none tracking-[0.02em] text-obsidian">
              {t.logo}
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-[9px]">
            {t.links.map((link) => (
              <li key={link.name} className="nav-element">
                <a
                  href={link.href}
                  className="font-body font-medium text-[16px] text-obsidian block px-3 py-2"
                  onMouseEnter={(e) => handleNavHover(e, true)}
                  onMouseLeave={(e) => handleNavHover(e, false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-element flex items-center gap-3">
            <div className="flex items-center p-1 rounded-[800px] bg-limestone">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLanguage(l)}
                  className={`min-w-[44px] px-3 py-1.5 rounded-[800px] text-[12px] font-medium uppercase tracking-[0.06em] transition-colors duration-200 ${
                    lang === l
                      ? "bg-obsidian text-chalk"
                      : "bg-transparent text-obsidian/50 hover:text-obsidian"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <a
              href="#contact"
              className="flex items-center gap-2 bg-ember text-obsidian font-body font-medium text-[16px] px-6 py-3 rounded-[800px]"
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              {t.hireMe}
              <ArrowUpRight size={16} className="btn-arrow" />
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}