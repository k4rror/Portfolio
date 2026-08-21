import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../i18n/LanguageContext";
import type { Content } from "../i18n/LanguageContext";
import { hoverArrow, hoverButton, COLORS } from "../lib/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ProjectItem = Content["projects"]["items"][number];
type ProjectsCopy = Content["projects"];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian focus-visible:ring-offset-2";

/**
 * Screenshot frame: clean full-color screenshot with a smooth scale-up on
 * hover (skipped under reduced motion) and a subtle scroll parallax.
 */
function MediaFrame({
  item,
  cta,
  frameClass,
  ringOffsetClass,
}: {
  item: ProjectItem;
  cta: string;
  frameClass: string;
  ringOffsetClass: string;
}) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener"
      aria-label={`${item.title} — ${cta}`}
      className={`pc-frame relative block overflow-hidden bg-pumice ${frameClass} ${FOCUS_RING} ${ringOffsetClass}`}
    >
      <div className="pc-parallax absolute inset-0">
        <img
          src={item.image}
          alt={`${item.title} — ${item.category}`}
          width={item.imageWidth}
          height={item.imageHeight}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.06]"
        />
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-ember text-obsidian opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-safe:translate-y-2 motion-safe:transition-all motion-safe:group-hover:translate-y-0"
      >
        <ArrowUpRight size={20} strokeWidth={2.5} />
      </span>
    </a>
  );
}

/** Project 01 — full-width hero card with a panoramic image and a 12-col text band. */
function HeroProject({ item, t }: { item: ProjectItem; t: ProjectsCopy }) {
  const handleCtaHover = (e: Element, isEnter: boolean) => {
    hoverButton(e, isEnter, COLORS.ember, COLORS.emberDark);
    hoverArrow(e, isEnter);
  };

  return (
    <article className="project-card group relative bg-limestone rounded-[40px] p-4 md:p-6 lg:p-8 overflow-hidden transition-[translate,box-shadow] duration-300 motion-safe:hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-28px_rgba(7,6,7,0.28)]">
      <MediaFrame
        item={item}
        cta={t.cta}
        frameClass="aspect-[16/9] md:aspect-[21/9] rounded-[24px] md:rounded-[16px]"
        ringOffsetClass="focus-visible:ring-offset-limestone"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-5 px-2 md:px-4 pt-6 md:pt-8 pb-2 md:pb-4">
        <div className="md:col-span-5">
          <span
            aria-hidden="true"
            className="pc-line block font-display text-[96px] lg:text-[140px] leading-[0.8] tracking-[0.02em] text-obsidian/10 select-none"
          >
            {item.id}
          </span>
          <div className="pc-line mt-4">
            <span className="inline-flex w-fit items-center px-3 py-1 bg-sulfur text-obsidian text-[12px] font-medium rounded-[800px]">
              {item.category}
            </span>
            <h3 className="font-display text-[40px] md:text-[48px] lg:text-[56px] leading-none tracking-[0.02em] text-obsidian mt-3 decoration-ember decoration-[3px] underline-offset-8 group-hover:underline">
              {item.title}
            </h3>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col justify-end gap-3">
          <p className="pc-line text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/70">
            {item.year} · {item.role} · {item.status}
          </p>
          <p className="pc-line text-[16px] leading-[1.55] text-obsidian/75">
            {item.description}
          </p>
        </div>

        <div className="md:col-span-3 flex flex-col md:items-end justify-end gap-5">
          <div className="pc-line md:text-right">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/70 mb-1">
              {t.stackLabel}
            </p>
            <p className="text-[14px] leading-[1.5] text-obsidian/70">
              {item.tech.join(" · ")}
            </p>
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener"
            aria-label={`${t.cta}: ${item.title}`}
            onMouseEnter={(e) => handleCtaHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleCtaHover(e.currentTarget, false)}
            className={`pc-line inline-flex w-fit items-center gap-2 px-6 py-3 bg-ember text-obsidian font-medium text-[16px] rounded-[800px] ${FOCUS_RING} focus-visible:ring-offset-limestone`}
          >
            {t.cta}
            <ArrowUpRight size={18} className="btn-arrow" />
          </a>
        </div>
      </div>
    </article>
  );
}

/** Project 02 — open composition (no card chrome), stepped left, with a dotted
 *  divider column carrying a rotated ghost numeral. */
function SatelliteProject({ item, t }: { item: ProjectItem; t: ProjectsCopy }) {
  const handleCtaHover = (e: Element, isEnter: boolean) => {
    hoverButton(e, isEnter, COLORS.ember, COLORS.emberDark);
    hoverArrow(e, isEnter);
  };

  return (
    <article className="project-card group relative md:ml-auto md:w-[85%]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-5 items-center">
        <div className="md:col-span-6">
          <MediaFrame
            item={item}
            cta={t.cta}
            frameClass="aspect-[3/2] rounded-[24px]"
            ringOffsetClass="focus-visible:ring-offset-pumice"
          />
        </div>

        <div aria-hidden="true" className="hidden md:block md:col-span-1 self-stretch">
          <div className="flex h-full items-center justify-center border-l-[1.5px] border-dotted border-obsidian/30">
            <span className="pc-line bg-pumice px-1 font-display text-[56px] leading-none tracking-[0.02em] text-obsidian/15 [writing-mode:vertical-rl] select-none">
              {item.id}
            </span>
          </div>
        </div>

        <div className="md:col-span-5">
          <span className="pc-line inline-flex w-fit items-center px-3 py-1 bg-sulfur text-obsidian text-[12px] font-medium rounded-[800px]">
            {item.category}
          </span>
          <h3 className="pc-line font-display text-[36px] md:text-[40px] leading-none tracking-[0.02em] text-obsidian mt-4 decoration-ember decoration-[3px] underline-offset-8 group-hover:underline">
            {item.title}
          </h3>
          <p className="pc-line text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/70 mt-4">
            {item.year} · {item.role} · {item.status}
          </p>
          <p className="pc-line text-[16px] leading-[1.55] text-obsidian/75 mt-3">
            {item.description}
          </p>

          <div className="pc-line mt-5">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/70 mb-1">
              {t.stackLabel}
            </p>
            <p className="text-[14px] leading-[1.5] text-obsidian/70">
              {item.tech.join(" · ")}
            </p>
          </div>

          <a
            href={item.link}
            target="_blank"
            rel="noopener"
            aria-label={`${t.cta}: ${item.title}`}
            onMouseEnter={(e) => handleCtaHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleCtaHover(e.currentTarget, false)}
            className={`pc-line mt-6 inline-flex w-fit items-center gap-2 px-6 py-3 bg-ember text-obsidian font-medium text-[16px] rounded-[800px] ${FOCUS_RING} focus-visible:ring-offset-pumice`}
          >
            {t.cta}
            <ArrowUpRight size={18} className="btn-arrow" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const t = useContent().projects;
  const containerRef = useRef<HTMLElement>(null);

  // EN/PL text swaps change card heights — recalc the parallax scrub triggers
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [t]);

  useGSAP(
    () => {
      const scope = containerRef.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".projects-header > *", {
          scrollTrigger: {
            trigger: ".projects-header",
            start: "top 85%",
          },
          y: 28,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power4.out",
        });

        const cards = gsap.utils.toArray<HTMLElement>(".project-card", scope);
        const frames = gsap.utils.toArray<HTMLElement>(".pc-frame", scope);

        // Entrance: clip-path reveal of the frame + staggered inner content
        cards.forEach((card) => {
          const frame = card.querySelector<HTMLElement>(".pc-frame");
          const lines = card.querySelectorAll(".pc-line");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 80%" },
          });
          if (frame) {
            tl.fromTo(
              frame,
              { clipPath: "inset(6% 3% 6% 3% round 24px)", scale: 1.04 },
              {
                clipPath: "inset(0% 0% 0% 0% round 24px)",
                scale: 1,
                duration: 1,
                ease: "power3.out",
                clearProps: "clipPath",
              },
              0
            );
          }
          if (lines.length) {
            tl.from(
              lines,
              { y: 22, opacity: 0, stagger: 0.06, duration: 0.6, ease: "power3.out" },
              0.3
            );
          }
        });

        // Subtle scroll parallax of the screenshot inside its frame
        frames.forEach((frame) => {
          const par = frame.querySelector<HTMLElement>(".pc-parallax");
          if (!par) return;
          gsap.set(par, { top: "-8%", bottom: "-8%" });
          gsap.fromTo(
            par,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="work"
      ref={containerRef}
      aria-labelledby="work-heading"
      className="relative bg-pumice pt-20 md:pt-24 pb-20 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 lg:px-24">
        <div className="projects-header mb-12 md:mb-16 lg:mb-20">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="uppercase tracking-[0.18em] text-obsidian/70 font-medium text-[12px] mb-4">
                {t.sectionLabel}
              </div>
              <h2
                id="work-heading"
                className="font-display text-[48px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-[0.02em] text-obsidian"
              >
                {t.title}
              </h2>
            </div>
            <p className="hidden md:block text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/70 pb-3">
              {t.count}
            </p>
          </div>
          <p className="mt-6 text-[16px] leading-[1.55] text-obsidian/75 max-w-2xl">
            {t.intro}
          </p>
          <hr className="dotted-h w-24 mt-8" />
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          <HeroProject item={t.items[0]} t={t} />
          {t.items[1] && <SatelliteProject item={t.items[1]} t={t} />}
        </div>
      </div>
    </section>
  );
}
