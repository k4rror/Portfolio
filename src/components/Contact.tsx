import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { ComponentType } from "react";
import { useContent } from "../i18n/LanguageContext";
import { GithubIcon } from "./icons";
import { hoverArrow, hoverButton, hoverDetailRow, COLORS } from "../lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CONTACT = {
  email: "karolmalina6@gmail.com",
  phone: "+48 518 835 200",
  phoneHref: "+48518835200",
  github: "github.com/k4rror",
  githubHref: "https://github.com/k4rror",
};

type DetailIcon = ComponentType<{ size?: number }>;

type DetailItem = {
  label: string;
  value: string;
  href: string;
  icon: DetailIcon;
  external?: boolean;
};

function DetailRow({ item }: { item: DetailItem }) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      onMouseEnter={(e) => hoverDetailRow(e.currentTarget, true)}
      onMouseLeave={(e) => hoverDetailRow(e.currentTarget, false)}
      className="group flex items-center justify-between gap-4 rounded-[40px] px-4 py-4 md:px-5 md:py-5"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-[16px] bg-ember text-obsidian shrink-0">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/70 mb-1">
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
  const t = useContent().contact;
  const sectionRef = useRef<HTMLElement>(null);

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
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".contact-header > *", {
          scrollTrigger: {
            trigger: ".contact-header",
            start: "top 85%",
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
          },
          y: 32,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power4.out",
        });
      });
    },
    { scope: sectionRef }
  );

  const handleCtaHover = (e: Element, isEnter: boolean) => {
    hoverButton(e, isEnter, COLORS.ember, COLORS.emberDark);
    hoverArrow(e, isEnter);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative bg-pumice pt-20 md:pt-24 pb-20 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 lg:px-24">
        <div className="contact-header mb-12 md:mb-20 max-w-3xl">
          <div className="uppercase tracking-[0.18em] text-obsidian/70 font-medium text-[12px] mb-4">
            {t.sectionLabel}
          </div>
          <h2
            id="contact-heading"
            className="font-display text-[48px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-[0.02em] text-obsidian"
          >
            {t.title}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.55] text-obsidian/75">{t.intro}</p>
          <hr className="dotted-h w-24 mt-8" />
        </div>

        <div className="contact-grid grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
            <article className="contact-card bg-limestone rounded-[40px] p-8 md:p-10 flex flex-col gap-8 h-full">
              <span className="inline-flex w-fit items-center px-3 py-1 bg-sulfur text-obsidian text-[12px] font-medium rounded-[800px]">
                {t.badge}
              </span>

              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/70 mb-2">
                  {t.lookingForLabel}
                </p>
                <h3 className="font-display text-[32px] md:text-[40px] leading-none tracking-[0.02em] text-obsidian">
                  {t.lookingFor}
                </h3>
              </div>

              <div className="flex items-start gap-4 mt-auto">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ember text-obsidian shrink-0">
                  <MapPin size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-obsidian/70 mb-1">
                    {t.locationLabel}
                  </p>
                  <p className="text-[16px] leading-[1.55] text-obsidian">{t.location}</p>
                </div>
              </div>
            </article>

            <article className="contact-card bg-ember rounded-[40px] p-8 md:p-10 flex flex-col justify-between min-h-[180px]">
              <p className="text-[14px] font-medium text-obsidian/80 leading-[1.2]">
                {t.replyLabel}
              </p>
              <div>
                <div className="font-display text-[64px] md:text-[80px] leading-[1.1] tracking-[0.02em] text-chalk">
                  {t.replyValue}
                </div>
                <p className="text-[14px] font-medium text-obsidian/80 mt-2">
                  {t.replyHint}
                </p>
              </div>
            </article>
          </div>

          <article className="contact-card lg:col-span-7 bg-limestone rounded-[40px] p-6 md:p-10 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-6 px-1">
              <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/70">
                {t.detailsLabel}
              </p>
              <hr className="dotted-h flex-1" />
            </div>

            <div className="flex flex-col">
              {details.map((item, index) => (
                <div key={item.label}>
                  <DetailRow item={item} />
                  {index < details.length - 1 && <hr className="dotted-h mx-4" />}
                </div>
              ))}
            </div>

            <a
              href={`mailto:${CONTACT.email}`}
              onMouseEnter={(e) => handleCtaHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleCtaHover(e.currentTarget, false)}
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
