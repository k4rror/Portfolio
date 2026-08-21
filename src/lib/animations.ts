import { gsap } from "gsap";

export const COLORS = {
  ember: "#fc5000",
  emberDark: "#e04600",
  obsidian: "#070607",
  limestone: "#f7f6f2",
  sulfur: "#f5f28e",
} as const;

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scale + background swap for pill buttons. Reduced motion: color only. */
export function hoverButton(
  target: Element,
  isEnter: boolean,
  baseColor: string,
  hoverColor: string
) {
  gsap.to(target, {
    scale: prefersReducedMotion() ? 1 : isEnter ? 0.97 : 1,
    backgroundColor: isEnter ? hoverColor : baseColor,
    duration: 0.25,
    ease: "power2.out",
    overwrite: true,
    force3D: true,
  });
}

/** Diagonal nudge of an .btn-arrow icon inside the hovered element. */
export function hoverArrow(target: Element, isEnter: boolean) {
  if (prefersReducedMotion()) return;
  const arrow = target.querySelector(".btn-arrow");
  if (!arrow) return;
  gsap.to(arrow, {
    x: isEnter ? 3 : 0,
    y: isEnter ? -3 : 0,
    duration: 0.25,
    ease: "power2.out",
    overwrite: true,
  });
}

/** Skill pill background swap (sulfur → ember). */
export function hoverPill(target: Element, isEnter: boolean) {
  gsap.to(target, {
    backgroundColor: isEnter ? COLORS.ember : COLORS.sulfur,
    duration: 0.25,
    ease: "power2.out",
    overwrite: true,
    force3D: true,
  });
}

/** Service row: slide right + arrow accent. */
export function hoverServiceRow(target: Element, isEnter: boolean) {
  gsap.to(target, {
    x: prefersReducedMotion() ? 0 : isEnter ? 8 : 0,
    duration: 0.25,
    ease: "power2.out",
    overwrite: true,
  });
  const arrow = target.querySelector(".service-arrow");
  if (arrow) {
    gsap.to(arrow, {
      x: prefersReducedMotion() ? 0 : isEnter ? 4 : 0,
      color: isEnter ? COLORS.ember : COLORS.obsidian,
      duration: 0.25,
      ease: "power2.out",
      overwrite: true,
    });
  }
}

/** Contact detail row: background fill + arrow nudge. */
export function hoverDetailRow(target: Element, isEnter: boolean) {
  gsap.to(target, {
    backgroundColor: isEnter ? COLORS.ember : "rgba(252, 80, 0, 0)",
    duration: 0.25,
    ease: "power2.out",
    overwrite: true,
  });
  const arrow = target.querySelector(".detail-arrow");
  if (arrow) {
    gsap.to(arrow, {
      x: prefersReducedMotion() ? 0 : isEnter ? 3 : 0,
      y: prefersReducedMotion() ? 0 : isEnter ? -3 : 0,
      duration: 0.25,
      ease: "power2.out",
      overwrite: true,
    });
  }
}
