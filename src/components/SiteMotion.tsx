"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    header?.classList.remove("is-hidden");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let lastY = window.scrollY;
    let frame = 0;

    const depthNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-depth]"));

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, y / max))));

      if (header) {
        header.classList.toggle("is-scrolled", y > 24);
        if (y > 180 && y > lastY + 8 && !header.contains(document.activeElement)) header.classList.add("is-hidden");
        if (y < lastY - 8 || y < 120) header.classList.remove("is-hidden");
      }
      lastY = y;

      if (!reduce.matches && finePointer.matches) {
        for (const node of depthNodes) {
          const rect = node.getBoundingClientRect();
          if (rect.bottom < -120 || rect.top > window.innerHeight + 120) continue;
          const center = rect.top + rect.height / 2;
          const rel = Math.max(-1, Math.min(1, (center - window.innerHeight / 2) / Math.max(1, window.innerHeight)));
          const amount = Number(node.dataset.depth || 18);
          node.style.setProperty("--depth-y", `${(-rel * amount).toFixed(2)}px`);
          node.style.setProperty("--depth-r", `${(rel * amount * 0.08).toFixed(2)}deg`);
        }
      } else {
        for (const node of depthNodes) {
          node.style.removeProperty("--depth-y");
          node.style.removeProperty("--depth-r");
        }
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reduce.addEventListener("change", schedule);
    finePointer.addEventListener("change", schedule);
    update();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduce.removeEventListener("change", schedule);
      finePointer.removeEventListener("change", schedule);
      for (const node of depthNodes) {
        node.style.removeProperty("--depth-y");
        node.style.removeProperty("--depth-r");
      }
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden="true" />;
}
