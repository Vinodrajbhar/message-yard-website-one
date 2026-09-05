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
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }

      // Determine active section by vertical proximity
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {SECTIONS.map((sec) => (
          <li key={sec.id}>
            <a
              href="/"
              data-section={sec.id}
              className={`side-nav-dot ${activeSection === sec.id ? "active" : ""}`}
              onClick={(e) => handleDotClick(e, sec.id)}
            >
              <span className="nav-tooltip">{sec.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
