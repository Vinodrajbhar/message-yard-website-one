"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const CARDS_DATA = [
  {
    id: "marketing",
    tag: "For Marketing Teams",
    badgeBg: "var(--clr-celadon-100)",
    badgeBorder: "var(--clr-celadon-200)",
    telemetry: (
      <>
        <span className="micro-dot cyan"></span> 12.4B Events/yr
      </>
    ),
    title: "Journey Builder",
    desc: "Visual, drag-and-drop customer journeys that react to real-time behavior rather than rigid send schedules.",
    pills: [
      "Conditional Branching Canvas",
      "A/B Multivariate Testing",
      "Send-Time AI Optimization",
      "Unified Multichannel Calendar",
    ],
    spreadDir: -1,
  },
  {
    id: "engineering",
    tag: "For Engineering Teams",
    badgeBg: "var(--clr-mist-100)",
    badgeBorder: "var(--clr-mist-200)",
    telemetry: (
      <>
        <span className="micro-dot green"></span> 99.999% SLA
      </>
    ),
    title: "Omnichannel CPaaS",
    desc: "The exact same global infrastructure exposed as high-throughput, programmable APIs with 99.999% uptime.",
    pills: [
      "SMS & RCS Auto-Upgrade",
      "WhatsApp Business Verified API",
      "Programmable Voice & Webhooks",
      "Transactional & Marketing Email",
    ],
    spreadDir: 0,
  },
  {
    id: "analytics",
    tag: "Enterprise Analytics",
    badgeBg: "var(--clr-parchment-100)",
    badgeBorder: "var(--clr-parchment-200)",
    telemetry: (
      <>
        <span className="micro-dot purple"></span> Multi-Touch BI
      </>
    ),
    title: "Customer Intelligence",
    desc: "Unify behavioral, transactional, and profile data into a single view with multi-touch revenue attribution.",
    pills: [
      "No-SQL Real-Time Segmentation",
      "1:1 Dynamic Product Blocks",
      "Cohort & Lifetime-Value Attribution",
      "Data Warehouse & BI Streaming Sync",
    ],
    spreadDir: 1,
  },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const cardScrollY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="cards" id="capabilities">
      <div className="cards-grid">
        {CARDS_DATA.map((card, idx) => {
          // Dynamic spread based on scroll progress
          const cardSpreadX = isMobile ? 0 : card.spreadDir * 40;

          return (
            <motion.div
              key={card.id}
              className="card-item"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                y: cardScrollY,
                x: useTransform(
                  scrollYProgress,
                  [0.2, 0.8],
                  [cardSpreadX * -0.5, cardSpreadX * 0.5]
                ),
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div className="card-top">
                <div className="card-header-flex">
                  <span
                    className="card-tag"
                    style={
                      {
                        "--card-badge-bg": card.badgeBg,
                        "--card-badge-border": card.badgeBorder,
                      } as React.CSSProperties
                    }
                  >
                    {card.tag}
                  </span>
                  <div className="micro-telemetry">{card.telemetry}</div>
                </div>
                <h4>{card.title}</h4>
                <p className="card-desc">{card.desc}</p>
              </div>
              <ul className="card-pills-list">
                {card.pills.map((pillText, pIdx) => (
                  <li key={pIdx}>
                    <svg className="pill-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {pillText}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
