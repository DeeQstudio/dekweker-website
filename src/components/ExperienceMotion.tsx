"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const headings = gsap.utils.toArray<HTMLElement>("main h1, main h2");
      headings.forEach((heading) => {
        gsap.fromTo(heading, { clipPath: "inset(0 0 100% 0)", y: 32 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: .85, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 95%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".photo-print, .artist-record, .release-card").forEach((item, index) => {
        gsap.fromTo(item, { y: 45, rotate: index % 2 ? 1.4 : -1.4 }, { y: 0, rotate: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 98%", once: true } });
      });
      const hero = document.querySelector(".home-hero");
      if (hero) {
        gsap.to(".home-hero-title", { xPercent: -4, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .7 } });
      }
      gsap.fromTo(".footer-wordmark", { xPercent: -5 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".site-footer", start: "top bottom", end: "bottom bottom", scrub: .8 } });
    });
    return () => media.revert();
  }, [pathname]);
  return null;
}
