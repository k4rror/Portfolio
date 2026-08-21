import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight,
  Blocks,
  Code2,
  Database,
  Terminal,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useContent } from "../i18n/LanguageContext";
import type { Content } from "../i18n/LanguageContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type StackItem = Content["stack"]["languages"][number];
type LevelLabels = Content["stack"]["levelLabels"];

const iconMap: Record<string, LucideIcon> = { Code2, Terminal, Database, Blocks, Wrench };

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian focus-visible:ring-offset-2";

/** Bento placement per tier: md steps to 2 columns, lg unfolds the 6-column grid. */
const SPAN: Record<NonNullable<StackItem["span"]>, string> = {
  featured: "md:col-span-2 lg:col-span-3 lg:row-span-2",
  medium: "md:col-span-1 lg:col-span-3",
  band: "md:col-span-2 lg:col-span-6",
  tall: "md:col-span-2 lg:col-span-2 lg:row-span-2",
  wide: "md:col-span-2 lg:col-span-4",
  small: "md:col-span-1 lg:col-span-2",
};

const HOVER_LIFT =
  "transition-[translate,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(7,6,7,0.25)]";

function getLevelLabel(level: number, labels: LevelLabels): string {
  if (level >= 90) return labels.core;
  if (level >= 80) return labels.strong;
  if (level >= 70) return labels.proficient;
  return labels.working;
}

function IconChip({ icon, wrap }: { icon: string; wrap: string }) {
  const IconComponent = iconMap[icon];
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] transition-transform duration-300 motion-safe:group-hover:scale-105 motion-safe:group-hover:-rotate-6 ${wrap}`}
    >
      {IconComponent && <IconComponent size={20} strokeWidth={1.8} />}
    </div>
  );
}

/** Level readout: the numeral counts up while the bar fills (one shared tween). */
function Meter({
  level,
  label,
  muted,
  barTrack,
  barFill,
}: {
  level: number;
  label: string;
  muted: string;
  barTrack: string;
  barFill: string;
}) {
  return (
    <div className="tc-line">
      <div className="flex items-baseline gap-2.5">
        <span className="font-display text-[32px] md:text-[36px] leading-none tracking-[0.02em]">
          <span className="tc-count" data-level={level}>
            {level}
          </span>
          <span className="text-[18px]">%</span>
        </span>
        <span className={`text-[12px] font-medium uppercase tracking-[0.14em] ${muted}`}>
          {label}
        </span>
      </div>
      <div className={`mt-2.5 h-1.5 w-full rounded-[800px] ${barTrack}`}>
        <div className={`tc-bar-fill h-full w-full origin-left rounded-[800px] ${barFill}`} />
      </div>
    </div>
  );
}

/** Linked "used in" proof row — the verifiable counterpart of the self-assessed %. */
function UsedInRow({
  item,
  usedInLabel,
  muted,
  ringOffset,
}: {
  item: StackItem;
  usedInLabel: string;
  muted: string;
  ringOffset: string;
}) {
  if (!item.usedIn?.length) return null;
  return (
    <div className="tc-line flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className={`text-[12px] font-medium uppercase tracking-[0.18em] ${muted}`}>
        {usedInLabel}:
      </span>
      {item.usedIn.map((project) => (
        <a
          key={project.name}
          href={project.href}
          target="_blank"
          rel="noopener"
          className={`group/link inline-flex items-center gap-0.5 text-[13px] font-medium text-obsidian underline-offset-4 decoration-ember hover:underline ${FOCUS_RING} ${ringOffset} focus-visible:rounded-full`}
        >
          {project.name}
          <ArrowUpRight
            size={13}
            strokeWidth={2.5}
            aria-hidden="true"
            className="transition-transform duration-200 motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5"
          />
        </a>
      ))}
    </div>
  );
}

function TechCard({
  item,
  isTopRated,
  usedInLabel,
  levelLabels,
}: {
  item: StackItem;
  isTopRated: boolean;
  usedInLabel: string;
  levelLabels: LevelLabels;
}) {
  const span = SPAN[item.span ?? "medium"];
  const isBand = item.span === "band";
  const isLarge = item.span === "featured" || item.span === "wide" || item.span === "tall";

  // Surface: the top-rated item of each group earns the ember card
  const surface = isTopRated ? "bg-ember" : "bg-limestone";
  const muted = isTopRated ? "text-obsidian/80" : "text-obsidian/70";
  const iconWrap = isTopRated ? "bg-obsidian text-chalk" : "bg-ember text-obsidian";
  const barTrack = isTopRated ? "bg-obsidian/20" : "bg-pumice";
  const barFill = isTopRated ? "bg-obsidian" : "bg-ember";
  const ringOffset = isTopRated
    ? "focus-visible:ring-offset-ember"
    : "focus-visible:ring-offset-limestone";
  const nameSize = isBand
    ? "text-[28px] md:text-[32px]"
    : isLarge
      ? "text-[38px] md:text-[48px]"
      : "text-[32px] md:text-[36px]";
  const ghostTone = isTopRated ? "text-obsidian/10" : "text-obsidian/[0.07]";

  const meter =
    item.level != null ? (
      <Meter
        level={item.level}
        label={getLevelLabel(item.level, levelLabels)}
        muted={muted}
        barTrack={barTrack}
        barFill={barFill}
      />
    ) : null;

  // Band tier: one horizontal strip — identity, description and meter side by side
  if (isBand) {
    return (
      <article
        className={`tech-card group relative flex flex-col gap-y-5 overflow-hidden rounded-[40px] p-7 md:p-8 ${surface} lg:flex-row lg:items-center lg:gap-x-10 ${span} ${HOVER_LIFT}`}
      >
        <div className="tc-line flex items-center gap-4 lg:w-[300px] lg:shrink-0">
          <IconChip icon={item.icon} wrap={iconWrap} />
          <div>
            <p className={`text-[12px] font-medium uppercase tracking-[0.18em] ${muted}`}>
              {item.shortDesc}
            </p>
            <h3 className={`font-display ${nameSize} leading-none tracking-[0.02em] mt-1.5`}>
              {item.name}
            </h3>
          </div>
        </div>

        <div className="tc-line lg:flex-1">
          <p className={`text-[15px] leading-[1.55] ${muted}`}>{item.longDesc}</p>
          {item.tags?.length > 0 && (
            <p className={`text-[13px] leading-[1.5] mt-2 ${muted}`}>{item.tags.join(" · ")}</p>
          )}
        </div>

        <div className="tc-line flex flex-col gap-4 lg:w-[280px] lg:shrink-0">
          {meter}
          <UsedInRow item={item} usedInLabel={usedInLabel} muted={muted} ringOffset={ringOffset} />
        </div>
      </article>
    );
  }

  return (
    <article
      className={`tech-card group relative flex flex-col overflow-hidden rounded-[40px] p-7 md:p-9 ${surface} ${span} ${HOVER_LIFT}`}
    >
      {isLarge && item.level != null && (
        <span
          aria-hidden="true"
          className={`pointer-events-none select-none absolute -bottom-8 -right-3 font-display text-[160px] md:text-[200px] leading-none tracking-[0.02em] ${ghostTone}`}
        >
          {item.level}
        </span>
      )}

      <div className="tc-line flex items-center justify-between gap-4">
        <IconChip icon={item.icon} wrap={iconWrap} />
        <p className={`text-right text-[12px] font-medium uppercase tracking-[0.18em] ${muted}`}>
          {item.shortDesc}
        </p>
      </div>

      <h3 className={`tc-line font-display ${nameSize} leading-none tracking-[0.02em] mt-6`}>
        {item.name}
      </h3>
      <p className={`tc-line text-[15px] md:text-[16px] leading-[1.55] mt-3.5 ${muted}`}>
        {item.longDesc}
      </p>
      {item.tags?.length > 0 && (
        <p className={`tc-line text-[13px] leading-[1.5] mt-3 ${muted}`}>{item.tags.join(" · ")}</p>
      )}

      <div className="relative mt-auto flex flex-col gap-4 pt-7">
        {meter}
        <UsedInRow item={item} usedInLabel={usedInLabel} muted={muted} ringOffset={ringOffset} />
      </div>
    </article>
  );
}

function StackGroup({
  label,
  items,
  usedInLabel,
  levelLabels,
}: {
  label: string;
  items: StackItem[];
  usedInLabel: string;
  levelLabels: LevelLabels;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const topLevel = Math.max(...items.map((i) => i.level ?? 0));

  useGSAP(
    () => {
      const scope = groupRef.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Group header: label rises, dotted rule draws in
        const labelEl = scope.querySelector(".group-label");
        const rule = scope.querySelector(".group-rule");
        if (labelEl) {
          gsap.from(labelEl, {
            scrollTrigger: { trigger: scope, start: "top 88%" },
            y: 16,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          });
        }
        if (rule) {
          gsap.from(rule, {
            scrollTrigger: { trigger: scope, start: "top 88%" },
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.9,
            ease: "power3.inOut",
          });
        }

        // Per-card entrance (not per-group — cards animate as each one arrives);
        // the meter (bar fill + count-up) runs inside the same timeline.
        gsap.utils.toArray<HTMLElement>(".tech-card", scope).forEach((card) => {
          const lines = card.querySelectorAll(".tc-line");
          const fill = card.querySelector<HTMLElement>(".tc-bar-fill");
          const counter = card.querySelector<HTMLElement>(".tc-count");
          const target = Number(counter?.dataset.level ?? 0);

          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 84%" },
          });

          if (lines.length) {
            tl.from(lines, {
              y: 22,
              opacity: 0,
              stagger: 0.05,
              duration: 0.55,
              ease: "power3.out",
            });
          }

          if (fill) {
            tl.fromTo(
              fill,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
              0.2
            );
          }
          if (counter && target > 0) {
            // Count from ~30 points below the target so digits never jump width bands
            const proxy = { v: Math.max(10, target - 30) };
            tl.fromTo(
              proxy,
              { v: Math.max(10, target - 30) },
              {
                v: target,
                duration: 0.9,
                ease: "power3.inOut",
                onUpdate: () => {
                  counter.textContent = String(Math.round(proxy.v));
                },
              },
              0.2
            );
          }
        });
      });
    },
    { scope: groupRef }
  );

  return (
    <div ref={groupRef}>
      <div className="group-label flex items-center gap-4 mb-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-obsidian/70">
          {label}
        </p>
        <hr className="group-rule dotted-h flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
        {items.map((item) => (
          <TechCard
            key={item.id}
            item={item}
            isTopRated={item.level === topLevel}
            usedInLabel={usedInLabel}
            levelLabels={levelLabels}
          />
        ))}
      </div>
    </div>
  );
}

export default function StackSection() {
  const t = useContent().stack;
  const sectionRef = useRef<HTMLElement>(null);

  // EN/PL text swaps change card heights — recalc the scroll triggers
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [t]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".stack-header > *", {
          scrollTrigger: {
            trigger: ".stack-header",
            start: "top 85%",
          },
          y: 28,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power4.out",
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="stack"
      ref={sectionRef}
      aria-labelledby="stack-heading"
      className="relative bg-pumice pt-20 md:pt-24 pb-20 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 lg:px-24">
        <div className="stack-header mb-12 md:mb-20 max-w-3xl">
          <div className="uppercase tracking-[0.18em] text-obsidian/70 font-medium text-[12px] mb-4">
            {t.sectionLabel}
          </div>
          <h2
            id="stack-heading"
            className="font-display text-[48px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-[0.02em] text-obsidian"
          >
            {t.title}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.55] text-obsidian/75">{t.intro}</p>
          <hr className="dotted-h w-24 mt-8" />
        </div>

        <div className="flex flex-col gap-16 md:gap-20">
          <StackGroup
            label={t.languagesLabel}
            items={t.languages}
            usedInLabel={t.usedIn}
            levelLabels={t.levelLabels}
          />
          <StackGroup
            label={t.skillsLabel}
            items={t.skills}
            usedInLabel={t.usedIn}
            levelLabels={t.levelLabels}
          />
        </div>
      </div>
    </section>
  );
}
