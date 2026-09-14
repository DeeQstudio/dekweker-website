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
    media.add("(prefers-reduced-motion: no-preference) and (min-width: 1101px) and (pointer: fine)", () => {
      const headings = gsap.utils.toArray<HTMLElement>("main h1, main h2");
      headings.forEach((heading) => {
        // Text stays readable before, during and after the entrance.
        gsap.fromTo(heading, { y: 12 }, { y: 0, clearProps: "transform", duration: .65, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 98%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".photo-print, .artist-record, .release-card").forEach((item) => {
        gsap.fromTo(item, { y: 20 }, { y: 0, clearProps: "transform", duration: .65, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 98%", once: true } });
      });
    });
    return () => media.revert();
  }, [pathname]);
  return null;
}
