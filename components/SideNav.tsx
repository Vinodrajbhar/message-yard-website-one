"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

const SECTIONS = [
  { id: "hero", label: "Overview" },
  { id: "why-messageyard", label: "Why MessageYard" },
  { id: "capabilities", label: "Core Capabilities" },
  { id: "platform", label: "Platform Architecture" },
  { id: "channels", label: "Channels & APIs" },
  { id: "resources", label: "Knowledge Base" },
  { id: "sock", label: "Get Started" },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, docHeight - windowHeight);

      // Collect target trigger offsets for each section
      const offsets = SECTIONS.map((sec, i) => {
        if (i === 0) return 0;
        const el = document.getElementById(sec.id);
        if (!el) return (i / (SECTIONS.length - 1)) * maxScroll;
        // Section activates when its top edge is in the upper third of viewport
        return Math.max(0, el.offsetTop - windowHeight * 0.35);
      });

      // The final section activates when near bottom
      offsets[offsets.length - 1] = Math.min(
        offsets[offsets.length - 1],
        maxScroll - 80
      );

      // Find which section interval [i, i + 1] the current scroll falls into
      let currentIndex = 0;
      let fraction = 0;

      if (scrollY <= offsets[0]) {
        currentIndex = 0;
        fraction = 0;
      } else if (scrollY >= maxScroll - 5) {
        currentIndex = SECTIONS.length - 1;
        fraction = 0;
      } else {
        for (let i = 0; i < offsets.length - 1; i++) {
          const start = offsets[i];
          const end = offsets[i + 1];
          if (scrollY >= start && scrollY < end) {
            currentIndex = i;
            const span = Math.max(1, end - start);
            fraction = Math.min(1, Math.max(0, (scrollY - start) / span));
            break;
          }
        }
        if (scrollY >= offsets[offsets.length - 1]) {
          currentIndex = SECTIONS.length - 1;
          fraction = 0;
        }
      }

      // 6 intervals between 7 dots: continuous progress moves accurately between dots
      const totalIntervals = SECTIONS.length - 1;
      const continuousIndex = currentIndex + fraction;
      const progress = continuousIndex / totalIntervals;
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      // Active section switches halfway through the interval to next section
      const activeIdx = Math.min(
        SECTIONS.length - 1,
        fraction >= 0.5 ? currentIndex + 1 : currentIndex
      );
      setActiveSection(SECTIONS[activeIdx].id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  const handleDotClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <nav className="side-section-nav" id="side-nav" aria-label="Section Navigation">
      <div className="side-nav-track">
        <motion.div
          className="side-nav-progress"
          id="side-nav-progress"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>
      <ul className="side-nav-list">
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id;
          const isPassed = idx < activeIndex;

          return (
            <li key={sec.id}>
              <a
                href="/"
                data-section={sec.id}
                className={`side-nav-dot ${isActive ? "active" : ""} ${isPassed ? "passed" : ""}`}
                onClick={(e) => handleDotClick(e, sec.id)}
              >
                <span className="nav-tooltip">{sec.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
