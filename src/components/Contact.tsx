import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import config from "./config.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LANG_KEY = "portfolio_lang";
const CONFIG_LANGS = Object.keys(config);

const CONTACT = {
  email: "karolmalina6@gmail.com",
  phone: "+48 518 835 200",
  phoneHref: "+48518835200",
  github: "github.com/k4rror",
  githubHref: "https://github.com/k4rror",
};

const COPY = {
  en: {
    sectionLabel: "Contact",
    title: "Let's work",
    intro:
      "Fresh graduate. Certified IT technician. I design, build and ship Next.js apps on my own — and I am looking for my first junior frontend / full-stack role.",
    badge: "Open to work",
    lookingForLabel: "Looking for",
    lookingFor: "Junior Frontend / Full-Stack",
    locationLabel: "Based in",
    location: "Wadowice, Poland · Remote-friendly",
    replyLabel: "Typical reply",
    replyValue: "24h",
    replyHint: "I read every message.",
    detailsLabel: "Details",
    emailLabel: "Email",
    phoneLabel: "Phone",
    githubLabel: "GitHub",
    cta: "Write to me",
  },
  pl: {
    sectionLabel: "Kontakt",
    title: "Do współpracy",
    intro:
      "Świeży absolwent. Dyplomowany technik informatyk. Samodzielnie projektuję, buduję i wdrażam aplikacje w Next.js — szukam pierwszej roli junior frontend / full-stack.",
    badge: "Gotowy do pracy",
    lookingForLabel: "Szukam",
    lookingFor: "Junior Frontend / Full-Stack",
    locationLabel: "Lokalizacja",
    location: "Wadowice, Polska · praca zdalna mile widziana",
    replyLabel: "Odpowiedź",
    replyValue: "24h",
    replyHint: "Czytam każdą wiadomość.",
    detailsLabel: "Dane",
    emailLabel: "Email",
    phoneLabel: "Telefon",
    githubLabel: "GitHub",
    cta: "Napisz do mnie",
  },
} as const;

type Lang = keyof typeof COPY;

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </svg>
  );
}

function getStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored && CONFIG_LANGS.includes(stored)
      ? (stored as Lang)
      : (CONFIG_LANGS[0] as Lang);
  } catch {
    return CONFIG_LANGS[0] as Lang;
  }
}

function useLang(): Lang {
  const [lang, setLang] = useState<Lang>(() => getStoredLang());

  useEffect(() => {
    const handler = (e: Event) => setLang((e as CustomEvent<Lang>).detail);
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  return lang;
}

type DetailIcon = typeof Mail | typeof GithubIcon;

type DetailItem = {
  label: string;
  value: string;
  href: string;
  icon: DetailIcon;
  external?: boolean;
};

function DetailRow({ item }: { item: DetailItem }) {
  const Icon = item.icon;

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>, isEnter: boolean) => {
    gsap.to(e.currentTarget, {
      backgroundColor: isEnter ? "#fc5000" : "transparent",
      duration: 0.25,
      ease: "power2.out",
    });

    const arrow = e.currentTarget.querySelector(".detail-arrow");
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
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      onMouseEnter={(e) => handleHover(e, true)}
      onMouseLeave={(e) => handleHover(e, false)}
      className="group flex items-center justify-between gap-4 rounded-[40px] px-4 py-4 md:px-5 md:py-5"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-[16px] bg-ember text-obsidian shrink-0">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/50 mb-1">
            {item.label}
          </p>
          <p className="font-display text-[26px] md:text-[32px] leading-none tracking-[0.02em] text-obsidian truncate">
            {item.value}
          </p>
        </div>
      </div>
      <ArrowUpRight
        size={20}
        className="detail-arrow text-obsidian shrink-0"
        strokeWidth={2}
      />
    </a>
  );
}

export default function ContactSection() {
  const lang = useLang();
  const t = COPY[lang] ?? COPY.en;
  const sectionRef = useRef<HTMLElement | null>(null);

  const details: DetailItem[] = [
    {
      label: t.emailLabel,
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      icon: Mail,
    },
    {
      label: t.phoneLabel,
      value: CONTACT.phone,
      href: `tel:${CONTACT.phoneHref}`,
      icon: Phone,
    },
    {
      label: t.githubLabel,
      value: CONTACT.github,
      href: CONTACT.githubHref,
      icon: GithubIcon,
      external: true,
    },
  ];

  useGSAP(
    () => {
      gsap.from(".contact-header > *", {
        scrollTrigger: {
          trigger: ".contact-header",
          start: "top 85%",
          once: true,
        },
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
      });

      gsap.from(".contact-card", {
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 82%",
          once: true,
        },
        y: 32,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
      });
    },
    { scope: sectionRef, dependencies: [lang] }
  );

  const handleCtaHover = (
    e: React.MouseEvent<HTMLAnchorElement>,
    isEnter: boolean
  ) => {
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
      id="contact"
      ref={sectionRef}
      className="relative bg-pumice pt-20 md:pt-24 pb-20 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 lg:px-24">
        <div className="contact-header mb-12 md:mb-20 max-w-3xl">
          <div className="uppercase tracking-[0.18em] text-obsidian/50 font-medium text-[12px] mb-4">
            {t.sectionLabel}
          </div>
          <h2 className="font-display text-[48px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-[0.02em] text-obsidian">
            {t.title}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.55] text-obsidian/75">
            {t.intro}
          </p>
          <hr className="dotted-h w-24 mt-8" />
        </div>

        <div className="contact-grid grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
            <article className="contact-card bg-limestone rounded-[40px] p-8 md:p-10 flex flex-col gap-8 h-full">
              <span className="inline-flex w-fit items-center px-3 py-1 bg-sulfur text-obsidian text-[12px] font-medium rounded-[800px]">
                {t.badge}
              </span>

              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/50 mb-2">
                  {t.lookingForLabel}
                </p>
                <h3 className="font-display text-[32px] md:text-[40px] leading-none tracking-[0.64px] text-obsidian">
                  {t.lookingFor}
                </h3>
              </div>

              <div className="flex items-start gap-4 mt-auto">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ember text-obsidian shrink-0">
                  <MapPin size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-obsidian/50 mb-1">
                    {t.locationLabel}
                  </p>
                  <p className="text-[16px] leading-[1.55] text-obsidian">
                    {t.location}
                  </p>
                </div>
              </div>
            </article>

            <article className="contact-card bg-ember rounded-[40px] p-8 md:p-10 flex flex-col justify-between min-h-[180px]">
              <p className="text-[14px] font-medium text-chalk/90 leading-[1.2]">
                {t.replyLabel}
              </p>
              <div>
                <div className="font-display text-[64px] md:text-[80px] leading-[1.1] tracking-[0.02em] text-chalk">
                  {t.replyValue}
                </div>
                <p className="text-[14px] font-medium text-chalk/85 mt-2">
                  {t.replyHint}
                </p>
              </div>
            </article>
          </div>

          <article className="contact-card lg:col-span-7 bg-limestone rounded-[40px] p-6 md:p-10 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-6 px-1">
              <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/50">
                {t.detailsLabel}
              </p>
              <hr className="dotted-h flex-1" />
            </div>

            <div className="flex flex-col">
              {details.map((item, index) => (
                <div key={item.label}>
                  <DetailRow item={item} />
                  {index < details.length - 1 && (
                    <hr className="dotted-h mx-4" />
                  )}
                </div>
              ))}
            </div>

            <a
              href={`mailto:${CONTACT.email}`}
              onMouseEnter={(e) => handleCtaHover(e, true)}
              onMouseLeave={(e) => handleCtaHover(e, false)}
              className="mt-8 inline-flex w-fit items-center gap-2 px-6 py-3 bg-ember text-obsidian font-medium text-[16px] rounded-[800px]"
            >
              {t.cta}
              <ArrowUpRight size={18} className="btn-arrow" />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}