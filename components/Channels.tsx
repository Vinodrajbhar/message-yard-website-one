"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  restAlpha: number;
  activeAlpha: number;
  currentAlpha: number;
  noiseOffset: number;
}

interface HighlightItem {
  label: string;
  sub: string;
}

interface ChannelCardProps {
  channel: string;
  badge: string;
  title: string;
  desc: string;
  actionText: string;
  svgIcon: React.ReactNode;
  svgString: string;
  featured?: boolean;
  highlights?: HighlightItem[];
}

function ChannelCard({
  channel,
  badge,
  title,
  desc,
  actionText,
  svgIcon,
  svgString,
  featured,
  highlights,
}: ChannelCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = card.offsetWidth || 380;
    let height = card.offsetHeight || 260;
    let particles: Particle[] = [];
    let isHovered = false;
    let isVisible = false;
    let animId: number | null = null;
    let mouseX = -9999;
    let mouseY = -9999;
    let cachedRestCanvas: HTMLCanvasElement | null = null;

    const resize = () => {
      width = card.offsetWidth || 380;
      height = card.offsetHeight || 260;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();

    const createRestCache = () => {
      if (!particles.length) return;
      cachedRestCanvas = document.createElement("canvas");
      cachedRestCanvas.width = width * dpr;
      cachedRestCanvas.height = height * dpr;
      const cCtx = cachedRestCanvas.getContext("2d");
      if (!cCtx) return;
      cCtx.scale(dpr, dpr);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        cCtx.fillStyle = p.color;
        cCtx.globalAlpha = p.restAlpha;
        cCtx.beginPath();
        cCtx.arc(p.originX, p.originY, p.size, 0, Math.PI * 2);
        cCtx.fill();
      }
    };

    const drawRestState = () => {
      ctx.clearRect(0, 0, width, height);
      if (cachedRestCanvas) {
        ctx.drawImage(cachedRestCanvas, 0, 0, width, height);
      }
    };

    const wake = () => {
      if (!isVisible) return;
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    // Sample particles from the SVG string
    const sampleParticles = () => {
      const sampleSize = 160;
      const offscreen = document.createElement("canvas");
      offscreen.width = sampleSize;
      offscreen.height = sampleSize;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        offCtx.clearRect(0, 0, sampleSize, sampleSize);
        offCtx.drawImage(img, 0, 0, sampleSize, sampleSize);
        URL.revokeObjectURL(blobURL);

        let imgData: ImageData;
        try {
          imgData = offCtx.getImageData(0, 0, sampleSize, sampleSize);
        } catch {
          return;
        }
        const data = imgData.data;

        particles = [];
        const offsetX = width - sampleSize - 20;
        const offsetY = height - sampleSize - 10;
        const step = 3.5;

        for (let y = 0; y < sampleSize; y += step) {
          for (let x = 0; x < sampleSize; x += step) {
            const px = Math.floor(x);
            const py = Math.floor(y);
            const idx = (py * sampleSize + px) * 4;
            const alpha = data[idx + 3];

            if (alpha > 40) {
              const posX = offsetX + x + (Math.random() - 0.5) * 2;
              const posY = offsetY + y + (Math.random() - 0.5) * 2;

              let color = "#38bdf8";
              const normX = x / sampleSize;
              const normY = y / sampleSize;
              if (normX < 0.3) color = "#38bdf8";
              else if (normX < 0.65) color = "#60a5fa";
              else if (normY > 0.5) color = "#c084fc";
              else color = "#818cf8";

              particles.push({
                originX: posX,
                originY: posY,
                x: posX,
                y: posY,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 0.35 + 0.85,
                color,
                restAlpha: 0.14,
                activeAlpha: 0.68,
                currentAlpha: 0.14,
                noiseOffset: Math.random() * 100,
              });
            }
          }
        }

        createRestCache();
        drawRestState();
      };

      img.src = blobURL;
    };

    sampleParticles();

    // Render loop with Hooke's law spring physics
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const time = performance.now() * 0.002;
      let maxVelocity = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cursor repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseRadius = 90;
        const mousePower = 2.8;

        if (dist < mouseRadius && dist > 0) {
          const force = Math.pow(1 - dist / mouseRadius, 1.5) * mousePower;
          const angle = Math.atan2(dy, dx);
          p.vx -= Math.cos(angle) * force;
          p.vy -= Math.sin(angle) * force;
        }

        // Ambient hover levitation
        if (isHovered) {
          p.vx += Math.sin(time + p.noiseOffset) * 0.12;
          p.vy += Math.cos(time + p.noiseOffset) * 0.12;
        }

        // Spring return force
        const homeX = p.originX - p.x;
        const homeY = p.originY - p.y;
        p.vx += homeX * 0.045;
        p.vy += homeY * 0.045;

        // Damping
        p.vx *= 0.885;
        p.vy *= 0.885;

        p.x += p.vx;
        p.y += p.vy;

        const vel = Math.abs(p.vx) + Math.abs(p.vy);
        if (vel > maxVelocity) maxVelocity = vel;

        const targetAlpha = isHovered ? p.activeAlpha : p.restAlpha;
        p.currentAlpha += (targetAlpha - p.currentAlpha) * 0.08;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.currentAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (!isHovered && maxVelocity < 0.025) {
        animId = null;
        drawRestState();
        return;
      }

      animId = requestAnimationFrame(render);
    };

    // Event listeners
    const handleMouseEnter = () => {
      isHovered = true;
      particles.forEach((p) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.8;
        p.vx += Math.cos(angle) * speed;
        p.vy += Math.sin(angle) * speed;
      });
      wake();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      wake();
    };

    const handleMouseLeave = () => {
      isHovered = false;
      mouseX = -9999;
      mouseY = -9999;
      wake();
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
          if (isVisible) drawRestState();
        });
      },
      { rootMargin: "100px" }
    );
    observer.observe(card);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, [svgString]);

  return (
    <div
      ref={cardRef}
      className={`channel-box ${featured ? "channel-box-featured" : ""}`}
      data-channel={channel}
      id={`channel-${channel}`}
    >
      <canvas
        ref={canvasRef}
        className="channel-particle-canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {svgIcon}
      <div className={`channel-content ${featured ? "featured-content" : ""}`} style={{ position: "relative", zIndex: 2 }}>
        {featured ? (
          <div className="featured-layout-split">
            <div className="featured-main-info">
              <div>
                <span className="channel-badge">{badge}</span>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
              <span className="channel-action">
                {actionText}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            {highlights && highlights.length > 0 && (
              <div className="featured-caps-grid">
                {highlights.map((h, i) => (
                  <div key={i} className="featured-cap-card">
                    <span className="cap-dot" />
                    <div className="cap-body">
                      <div className="cap-label">{h.label}</div>
                      <div className="cap-sub">{h.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <span className="channel-badge">{badge}</span>
            <h4>{title}</h4>
            <p>{desc}</p>
            <span className="channel-action">
              {actionText}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </>
        )}
      </div>
    </div>
  );
}

const CHANNELS_DATA = [
  {
    channel: "sms-rcs",
    badge: "Carrier Protocol",
    title: "SMS & RCS",
    desc: "Global high-throughput delivery with automatic universal RCS upgrade for rich carousels, action buttons, and verified badges.",
    actionText: "Explore RCS Spec",
    svgIcon: (
      <svg className="particle-source-svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
  {
    channel: "whatsapp",
    badge: "Meta Verified",
    title: "WhatsApp Business",
    desc: "Verified brand profiles, structured interactive catalog messages, session automation, and direct customer support handoffs.",
    actionText: "View WhatsApp API",
    svgIcon: (
      <svg className="particle-source-svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  },
  {
    channel: "voice",
    badge: "SIP Trunking",
    title: "Programmable Voice",
    desc: "Global inbound and outbound SIP trunking, interactive IVR trees, low-latency call recording, and real-time speech transcription.",
    actionText: "Voice Endpoints",
    svgIcon: (
      <svg className="particle-source-svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  },
  {
    channel: "email",
    badge: "Dedicated SMTP",
    title: "Email API",
    desc: "Dedicated sending IPs, automated warmup, DMARC/DKIM authentication, and inbox placement optimization on one unified pipe.",
    actionText: "Email Deliverability",
    svgIcon: (
      <svg className="particle-source-svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  },
  {
    channel: "ai",
    badge: "Autonomous Agent",
    title: "Conversational AI",
    desc: "Autonomous LLM-powered agents that pick up any conversation on any channel, answer complex questions, and resolve orders.",
    actionText: "AI Copilot Docs",
    featured: true,
    highlights: [
      {
        label: "Sub-200ms Streaming",
        sub: "Real-time voice & text turns with zero perceived latency.",
      },
      {
        label: "Deep Tool Calling",
        sub: "Executes refunds, bookings, and live CRM actions autonomously.",
      },
      {
        label: "Enterprise RAG Memory",
        sub: "Grounded in private knowledge bases & vector catalogs.",
      },
      {
        label: "Omnichannel Handoff",
        sub: "Frictionless escalation to human agents with full conversation context.",
      },
    ],
    svgIcon: (
      <svg className="particle-source-svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
    svgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
  },
];

export default function Channels() {
  useEffect(() => {
    const handleHighlight = (e: Event) => {
      const customEvent = e as CustomEvent<{ channel: string }>;
      const ch = customEvent.detail?.channel;
      if (ch) {
        const el = document.getElementById(`channel-${ch}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("channel-box-highlight");
          setTimeout(() => el.classList.remove("channel-box-highlight"), 2500);
        }
      }
    };
    window.addEventListener("highlight-channel", handleHighlight);

    try {
      const savedTarget = sessionStorage.getItem("channel_active_target");
      if (savedTarget) {
        sessionStorage.removeItem("channel_active_target");
        setTimeout(() => {
          const el = document.getElementById(`channel-${savedTarget}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("channel-box-highlight");
            setTimeout(() => el.classList.remove("channel-box-highlight"), 2500);
          }
        }, 300);
      }
    } catch {}

    return () => window.removeEventListener("highlight-channel", handleHighlight);
  }, []);

  return (
    <section className="link-grid" id="channels">
      <div className="link-grid-wrapper">
        <div className="link-grid-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-tag">Delivery Layer</span>
            <h3>When Marketing Cloud isn't enough, the API is right there.</h3>
          </motion.div>
          {/* Explore Developer Docs button hidden for now */}
          {/* <motion.a
            href="/contact"
            className="btn-luxury secondary"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Explore Developer Docs
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a> */}
        </div>

        <div className="channel-grid">
          {CHANNELS_DATA.map((ch, idx) => (
            <motion.div
              key={ch.channel}
              className={`channel-grid-item ${ch.featured ? "featured" : ""}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChannelCard
                channel={ch.channel}
                badge={ch.badge}
                title={ch.title}
                desc={ch.desc}
                actionText={ch.actionText}
                svgIcon={ch.svgIcon}
                svgString={ch.svgString}
                featured={ch.featured}
                highlights={ch.highlights}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
