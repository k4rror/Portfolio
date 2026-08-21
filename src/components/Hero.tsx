import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  MapPin,
  Code2,
  Calendar,
  ArrowRight,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { useContent } from "../i18n/LanguageContext";
import {
  hoverButton,
  hoverPill,
  hoverServiceRow,
  COLORS,
} from "../lib/animations";

gsap.registerPlugin(useGSAP);

const iconMap: Record<string, LucideIcon> = { MapPin, Code2, Calendar, GraduationCap };

export default function HeroSection() {
  const t = useContent().hero;
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".hero-element",
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.06,
            ease: "power4.out",
            delay: 0.28,
          }
        );
      });
    },
    { scope: containerRef }
  );

  const handleButtonHover = (e: Element, isEnter: boolean, isPrimary: boolean) => {
    hoverButton(
      e,
      isEnter,
      // fully transparent base colors so GSAP doesn't tween through dark rgba(0,0,0,0)
      isPrimary ? COLORS.ember : "rgba(247, 246, 242, 0)",
      isPrimary ? COLORS.emberDark : COLORS.limestone
    );
  };

  return (
    <section
      id="about"
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative min-h-screen bg-pumice pt-36 pb-20 px-5 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-16 lg:gap-20 relative z-10">
        <div className="hero-element uppercase tracking-[0.18em] text-obsidian/70 font-medium text-[12px]">
          {t.sectionLabel}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <h1
              id="hero-heading"
              className="hero-element font-display text-[64px] md:text-[96px] lg:text-[140px] xl:text-[189px] leading-[0.94] tracking-[0.02em] text-obsidian"
            >
              {t.greeting}
              <br />
              <span className="text-ember">{t.name}</span>
            </h1>

            <ul className="hero-element flex flex-col gap-3 mt-1">
              {t.personalInfo.map((item) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <li key={item.text} className="flex items-center gap-4 text-obsidian">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-limestone text-ember">
                      {IconComponent && <IconComponent size={16} strokeWidth={2.5} />}
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
                onMouseEnter={(e) => handleButtonHover(e.currentTarget, true, true)}
                onMouseLeave={(e) => handleButtonHover(e.currentTarget, false, true)}
                className="flex items-center gap-2 px-6 py-3 bg-ember text-obsidian font-medium text-[16px] rounded-[800px]"
              >
                {t.buttons.primary}
              </a>
              <a
                href="#work"
                onMouseEnter={(e) => handleButtonHover(e.currentTarget, true, false)}
                onMouseLeave={(e) => handleButtonHover(e.currentTarget, false, false)}
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
                    onMouseEnter={(e) => hoverPill(e.currentTarget, true)}
                    onMouseLeave={(e) => hoverPill(e.currentTarget, false)}
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
                {t.services.map((service) => (
                  <li
                    key={service}
                    onMouseEnter={(e) => hoverServiceRow(e.currentTarget, true)}
                    onMouseLeave={(e) => hoverServiceRow(e.currentTarget, false)}
                    className="hero-element flex items-center gap-3 text-obsidian font-medium text-[16px]"
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
          {t.stats.map((stat) => (
            <div
              key={stat.label}
              className="hero-element flex flex-col justify-between p-6 md:p-10 bg-ember rounded-[40px] min-h-[180px]"
            >
              <div className="text-[14px] font-medium text-obsidian/80 leading-[1.2]">
                {stat.label}
              </div>
              <div className="font-display text-[40px] md:text-[64px] lg:text-[80px] leading-[1.1] tracking-[0.02em] text-chalk">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
