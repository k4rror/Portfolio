import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useContent, useLanguage, type Lang } from "../i18n/LanguageContext";
import { hoverArrow, hoverButton, COLORS } from "../lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LANGS: Lang[] = ["en", "pl"];
const SECTION_IDS = ["about", "work", "stack", "journey", "contact"] as const;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian focus-visible:ring-offset-2";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Shared EN/PL toggle: one obsidian indicator slides between the two slots. */
function LangSwitcher({ onAfterChange }: { onAfterChange?: () => void }) {
  const { lang, setLang } = useLanguage();
  const label = lang === "pl" ? "Język" : "Language";
  return (
    <div
      role="group"
      aria-label={label}
      className="relative flex items-center p-1 rounded-[800px] bg-limestone"
    >
      <span
        aria-hidden="true"
        className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] rounded-[800px] bg-obsidian motion-safe:transition-transform motion-safe:duration-300 ${EASE}`}
        style={{ transform: lang === "pl" ? "translateX(100%)" : "translateX(0%)" }}
      />
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => {
            if (l === lang) return;
            setLang(l);
            onAfterChange?.();
          }}
          aria-pressed={lang === l}
          aria-label={l === "en" ? "English" : "Polski"}
          className={`relative z-10 min-w-[44px] px-3 py-2 rounded-[800px] text-[12px] font-medium uppercase tracking-[0.06em] transition-colors duration-200 ${FOCUS_RING} ${
            lang === l ? "text-chalk" : "text-obsidian/70 hover:text-obsidian"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function FloatingNav() {
  const { lang } = useLanguage();
  const t = useContent().nav;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Scroll morph with hysteresis: collapse past 80px, expand back before 24px,
  // so the threshold never flip-flops while parked near the top
  useEffect(() => {
    const handleScroll = () => setIsScrolled((prev) => window.scrollY > (prev ? 24 : 80));
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: the last section whose top crossed the nav line wins; re-run on
  // ScrollTrigger.refresh so Journey's pin-spacer offset changes are picked up
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current: string | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
        else break;
      }
      // Short viewports: pin the last section once the page bottom is reached
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = SECTION_IDS[SECTION_IDS.length - 1];
      }
      setActiveSection((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive:  true });
    ScrollTrigger.addEventListener("refresh", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ScrollTrigger.removeEventListener("refresh", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Menu a11y: scroll lock, initial focus, focus trap (burger included as the
  // first stop), Escape returns focus to the burger
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (e.key === "Tab") {
        const focusables = [
          burgerRef.current,
          ...(menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []),
        ].filter((el): el is HTMLElement => Boolean(el));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".nav-element", {
          y: -16,
          opacity: 0,
          duration: 0.7,
          stagger: 0.05,
          ease: "power4.out",
          delay: 0.08,
        });
      });
    },
    { scope: containerRef }
  );

  // Menu entrance choreography (entrance-only; closing stays instant)
  useGSAP(
    () => {
      if (!isMenuOpen) return;
      const menu = menuRef.current;
      if (!menu) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(menu, { opacity: 0, duration: 0.25, ease: "power2.out" });
        gsap.from(".mm-link", {
          y: 26,
          opacity: 0,
          duration: 0.45,
          stagger: 0.06,
          delay: 0.08,
          ease: "power3.out",
        });
        gsap.from(".mm-footer", { y: 16, opacity: 0, duration: 0.4, delay: 0.28, ease: "power3.out" });
      });
    },
    { scope: containerRef, dependencies: [isMenuOpen] }
  );

  const { contextSafe } = useGSAP(
    () => {},
    { scope: containerRef }
  );

  const handleButtonHover = contextSafe((e: Element, isEnter: boolean) => {
    hoverButton(e, isEnter, COLORS.ember, COLORS.emberDark);
    hoverArrow(e, isEnter);
  });

  return (
    <header
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-5 md:px-12 lg:px-24 pointer-events-none"
    >
      <div
        className={`pointer-events-auto relative z-50 w-full max-w-[1280px] motion-safe:transition-[max-width] motion-safe:duration-300 ${EASE} ${
          isScrolled ? "lg:max-w-[1088px]" : ""
        }`}
      >
        <nav
          aria-label={lang === "pl" ? "Nawigacja główna" : "Main navigation"}
          className={`relative flex items-center justify-between rounded-[800px] py-2 motion-safe:transition-[padding,background-color,box-shadow] motion-safe:duration-300 ${EASE} ${
            isScrolled && !isMenuOpen
              ? "bg-limestone px-4 shadow-[0_12px_32px_-18px_rgba(7,6,7,0.30)]"
              : "bg-transparent px-3"
          }`}
        >
          <a
            href="#about"
            aria-label={t.logoLabel}
            className={`nav-element flex items-center gap-2.5 px-2 rounded-full ${FOCUS_RING}`}
          >
            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-ember text-obsidian font-display text-lg leading-none">
              K
            </span>
            <span
              className={`font-display text-[22px] sm:text-[26px] leading-none tracking-[0.02em] transition-colors duration-300 ${
                isMenuOpen ? "text-chalk" : "text-obsidian"
              }`}
            >
              {t.logo}
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-2">
            {t.links.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.name} className="nav-element">
                  <a
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`block rounded-[800px] px-3 py-2.5 font-body font-medium text-[16px] text-obsidian transition-colors duration-200 hover:bg-sulfur focus-visible:bg-sulfur ${FOCUS_RING} ${
                      isActive ? "bg-sulfur" : ""
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="nav-element flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex">
              <LangSwitcher />
            </div>

            <a
              href="#contact"
              className={`hidden lg:flex items-center gap-2 bg-ember text-obsidian font-body font-medium text-[16px] px-6 py-3 rounded-[800px] ${FOCUS_RING}`}
              onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
            >
              {t.hireMe}
              <ArrowUpRight size={16} className="btn-arrow" />
            </a>

            <button
              type="button"
              ref={burgerRef}
              className={`flex lg:hidden h-11 w-11 items-center justify-center rounded-full bg-limestone text-obsidian transition-colors duration-200 hover:bg-sulfur ${FOCUS_RING}`}
              aria-expanded={isMenuOpen}
              aria-label={t.menuLabel}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span aria-hidden="true" className="relative block h-5 w-5">
                <Menu
                  size={20}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  } motion-safe:transition-[opacity,transform] motion-safe:duration-300 ${
                    isMenuOpen ? "motion-safe:-rotate-90" : "motion-safe:rotate-0"
                  }`}
                />
                <X
                  size={20}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-100" : "opacity-0"
                  } motion-safe:transition-[opacity,transform] motion-safe:duration-300 ${
                    isMenuOpen ? "motion-safe:rotate-0" : "motion-safe:rotate-90"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.menuLabel}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMenuOpen(false);
          }}
          className="pointer-events-auto fixed inset-0 z-40 flex flex-col bg-obsidian lg:hidden"
        >
          <div
            className="flex flex-1 flex-col justify-center px-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsMenuOpen(false);
            }}
          >
            <ul className="flex flex-col">
              {t.links.map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="mm-link group flex items-baseline gap-4 rounded-[16px] px-2 py-2.5 focus-visible:outline-none focus-visible:bg-sulfur"
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-[18px] tracking-[0.06em] text-ember"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[52px] sm:text-[64px] leading-[0.95] tracking-[0.02em] text-chalk transition-colors duration-200 group-hover:text-sulfur group-active:text-sulfur group-focus-visible:text-obsidian">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mm-footer px-6 pb-8 pt-4">
            <div className="border-t-[1.5px] border-dotted border-chalk/25" />
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
              <LangSwitcher onAfterChange={() => setIsMenuOpen(false)} />
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 bg-ember text-obsidian font-body font-medium text-[16px] px-6 py-3 rounded-[800px] ${FOCUS_RING}`}
              >
                {t.hireMe}
                <ArrowUpRight size={16} className="btn-arrow" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
