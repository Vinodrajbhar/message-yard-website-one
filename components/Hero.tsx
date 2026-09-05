"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion/react";

const FG_PILL_ITEMS = [
  {
    id: "whatsapp",
    className: "pill pill-whatsapp saas-card",
    title: "WhatsApp Business Verified API",
    deltaX: -160,
    deltaY: -70,
    depth: 1.4,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.37c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.55 3.7-8.25 8.25-8.25 2.2 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.56-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08s.89 2.41 1.01 2.58c.12.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
      </svg>
    ),
    content: (
      <div className="text">
        <div className="saas-card-title">
          WhatsApp Business
          <span className="verified-dot">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2.5 6 4.5 8.5 9.5 3.5"></polyline>
            </svg>
          </span>
        </div>
        <div className="saas-card-sub">
          Order #8491 delivered
          <span className="read-receipt">
            <svg
              viewBox="0 0 16 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1.5 6 4.5 9 10.5 3"></polyline>
              <polyline points="6.5 9 9.5 12 15.5 6"></polyline>
            </svg>
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "rcs",
    className: "pill pill-rcs saas-card",
    title: "Universal RCS Upgrade",
    deltaX: 170,
    deltaY: -60,
    depth: 1.5,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
        <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
        <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
      </svg>
    ),
    content: (
      <div className="text">
        <div className="saas-card-title">RCS Verified Sender</div>
        <div className="saas-card-chips">
          <span className="chip">Track Order</span>
          <span className="chip">Support</span>
        </div>
      </div>
    ),
  },
  {
    id: "journey",
    className: "pill pill-journey saas-card",
    title: "Visual Customer Journey Canvas",
    deltaX: -180,
    deltaY: 55,
    depth: 1.1,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="12" r="3"></circle>
        <line x1="8.5" y1="7.5" x2="15.5" y2="10.5"></line>
        <line x1="8.5" y1="16.5" x2="15.5" y2="13.5"></line>
      </svg>
    ),
    content: (
      <div className="text">
        <div className="saas-card-title">Dynamic Journeys</div>
        <div className="saas-card-sub">
          Flow: <span className="flow-pill">Cart → WhatsApp</span> 98.4%
        </div>
      </div>
    ),
  },
  {
    id: "cpaas",
    className: "pill pill-cpaas saas-card",
    title: "Direct Carrier CPaaS Infrastructure",
    deltaX: 185,
    deltaY: 65,
    depth: 1.3,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
        <line x1="14" y1="4" x2="10" y2="20"></line>
      </svg>
    ),
    content: (
      <div className="text">
        <div className="saas-card-title">Programmable APIs</div>
        <div className="saas-card-sub code-sub">
          <code>POST /v1/messages</code> • 200 OK
        </div>
      </div>
    ),
  },
  {
    id: "agent",
    className: "pill pill-agent saas-card",
    title: "Autonomous Conversational AI Agents",
    deltaX: -110,
    deltaY: 130,
    depth: 1.0,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
      </svg>
    ),
    content: (
      <div className="text">
        <div className="saas-card-title">AI Copilot Assist</div>
        <div className="saas-card-sub">
          "Slot confirmed for Friday, 3:00 PM"
        </div>
      </div>
    ),
  },
  {
    id: "uptime",
    className: "pill pill-uptime saas-card",
    title: "Carrier-Grade 99.999% SLA",
    deltaX: 125,
    deltaY: 135,
    depth: 1.2,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
      </svg>
    ),
    content: (
      <div className="text">
        <div className="saas-card-title">99.999% SLA Uptime</div>
        <div className="saas-card-sub live-stat">
          <span className="pulse-green"></span> 12ms Latency • Tier 1
        </div>
      </div>
    ),
  },
];

const BG_PILL_CONFIGS = [
  { deltaX: -110, deltaY: -50, depth: 0.6 },
  { deltaX: 120, deltaY: -45, depth: 0.7 },
  { deltaX: -130, deltaY: 70, depth: 0.5 },
  { deltaX: 140, deltaY: 80, depth: 0.65 },
  { deltaX: 0, deltaY: 110, depth: 0.55 },
];

function HeroMeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = canvas.offsetHeight || 140;
    let animId: number | null = null;
    let isVisible = true;
    let mouseX = 0;
    let targetMouseX = 0;

    const resize = () => {
      width = window.innerWidth;
      height = canvas.offsetHeight || 140;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
          if (isVisible && !animId) {
            animId = requestAnimationFrame(animate);
          }
        });
      },
      { rootMargin: "100px" },
    );
    observer.observe(canvas);

    const drawWaveRibbon = (opt: {
      time: number;
      speed: number;
      freq: number;
      amp: number;
      baseY: number;
      mouseOffset: number;
      gradColors: string[];
      strokeColor: string;
      lineWidth: number;
    }) => {
      const step = 8;
      const points: { x: number; y: number }[] = [];

      for (let x = 0; x <= width + step; x += step) {
        const y =
          opt.baseY +
          Math.sin(opt.time + x * opt.freq) * opt.amp +
          Math.cos(opt.time * 0.7 + x * opt.freq * 0.8) * (opt.amp * 0.6) +
          opt.mouseOffset * Math.sin((x / width) * Math.PI);
        points.push({ x, y });
      }

      const fillGrad = ctx.createLinearGradient(0, 0, width, height);
      fillGrad.addColorStop(0, opt.gradColors[0]);
      fillGrad.addColorStop(0.5, opt.gradColors[1]);
      fillGrad.addColorStop(1, opt.gradColors[2]);

      ctx.fillStyle = fillGrad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = opt.strokeColor;
      ctx.lineWidth = opt.lineWidth;
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(points[i].x, points[i].y);
        else ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      mouseX += (targetMouseX - mouseX) * 0.04;

      const time = performance.now() * 0.0012;
      const baseY = height * 0.65;

      // Layer 1: Deep Violet-Blue Ambient Wave Ribbon
      drawWaveRibbon({
        time: time * 0.8,
        speed: 0.004,
        freq: 0.003,
        amp: 22,
        baseY: baseY + 10,
        mouseOffset: mouseX * 12,
        gradColors: [
          "rgba(56, 189, 248, 0.12)",
          "rgba(37, 99, 235, 0.18)",
          "rgba(124, 58, 237, 0.14)",
        ],
        strokeColor: "rgba(56, 189, 248, 0.35)",
        lineWidth: 1.2,
      });

      // Layer 2: Electric Cyan-Azure Harmonic Wave Ribbon
      drawWaveRibbon({
        time: time * 1.1 + 2,
        speed: 0.006,
        freq: 0.0045,
        amp: 18,
        baseY: baseY - 6,
        mouseOffset: mouseX * -10,
        gradColors: [
          "rgba(124, 58, 237, 0.1)",
          "rgba(56, 189, 248, 0.22)",
          "rgba(37, 99, 235, 0.12)",
        ],
        strokeColor: "rgba(37, 99, 235, 0.45)",
        lineWidth: 1.4,
      });

      // Layer 3: Foreground Delicate Luminous Crest
      drawWaveRibbon({
        time: time * 1.3 + 4,
        speed: 0.008,
        freq: 0.006,
        amp: 14,
        baseY: baseY + 4,
        mouseOffset: mouseX * 8,
        gradColors: [
          "rgba(56, 189, 248, 0.06)",
          "rgba(147, 197, 253, 0.15)",
          "rgba(56, 189, 248, 0.04)",
        ],
        strokeColor: "rgba(56, 189, 248, 0.55)",
        lineWidth: 1.6,
      });

      // Stardust nodes
      const nodeCount = 12;
      for (let i = 0; i <= nodeCount; i++) {
        const x = (i / nodeCount) * width;
        const waveY =
          baseY +
          Math.sin(time + x * 0.005) * 16 +
          Math.cos(time * 0.8 + x * 0.003) * 10;
        const alpha = 0.3 + Math.sin(time * 2 + i) * 0.25;

        ctx.fillStyle = "#38bdf8";
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.beginPath();
        ctx.arc(x, waveY, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (!isVisible) {
        animId = null;
        return;
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-mesh" className="hero-bottom-mesh" />;
}

function BgPillItem({
  cfg,
  smoothMouseX,
  smoothMouseY,
  pillScrollProgress,
}: {
  cfg: (typeof BG_PILL_CONFIGS)[0];
  smoothMouseX: any;
  smoothMouseY: any;
  pillScrollProgress: any;
}) {
  const x = useTransform(
    [smoothMouseX, pillScrollProgress],
    ([mx, sy]: number[]) => mx * cfg.depth * 5 + cfg.deltaX * sy,
  );
  const y = useTransform(
    [smoothMouseY, pillScrollProgress],
    ([my, sy]: number[]) => my * cfg.depth * 5 + cfg.deltaY * sy,
  );
  const opacity = useTransform(pillScrollProgress, [0, 0.5], [0.5, 0]);
  const scale = useTransform(pillScrollProgress, [0, 0.6], [1, 0.8]);

  return (
    <motion.div
      className="pill"
      style={{
        x,
        y,
        opacity,
        scale,
      }}
    />
  );
}

function FgPillItem({
  item,
  smoothMouseX,
  smoothMouseY,
  pillScrollProgress,
}: {
  item: (typeof FG_PILL_ITEMS)[0];
  smoothMouseX: any;
  smoothMouseY: any;
  pillScrollProgress: any;
}) {
  const x = useTransform(
    [smoothMouseX, pillScrollProgress],
    ([mx, sy]: number[]) => mx * item.depth * 8 + item.deltaX * sy * 1.2,
  );
  const y = useTransform(
    [smoothMouseY, pillScrollProgress],
    ([my, sy]: number[]) => my * item.depth * 8 + item.deltaY * sy * 1.2,
  );
  const opacity = useTransform(pillScrollProgress, [0, 0.45], [1, 0]);
  const scale = useTransform(pillScrollProgress, [0, 0.5], [1, 0.85]);

  return (
    <motion.div
      className={item.className}
      title={item.title}
      style={{
        x,
        y,
        opacity,
        scale,
      }}
    >
      <div className="card-pill-header">
        <div className="icon">{item.icon}</div>
        {item.content}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse coordinates mapped from -1 to 1
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 22 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 22 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / innerHeight - 0.5) * 2);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  // Scroll parallax for Hero elements using direct window scroll
  const { scrollY } = useScroll();
  const heroContentY = useTransform(scrollY, [0, 600], [0, 60]);
  const heroContentOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const heroContentScale = useTransform(scrollY, [0, 450], [1, 0.95]);

  const pillScrollProgress = useTransform(scrollY, [0, 500], [0, 1]);

  return (
    <section ref={sectionRef} className="page-header home" id="hero">
      {/* Floating interactive pills */}
      <div className="pills" aria-hidden="true">
        {/* Background soft pills */}
        <div className="bg">
          {BG_PILL_CONFIGS.map((cfg, i) => (
            <BgPillItem
              key={i}
              cfg={cfg}
              smoothMouseX={smoothMouseX}
              smoothMouseY={smoothMouseY}
              pillScrollProgress={pillScrollProgress}
            />
          ))}
        </div>

        {/* Foreground feature cards */}
        <div className="fg">
          {FG_PILL_ITEMS.map((item) => (
            <FgPillItem
              key={item.id}
              item={item}
              smoothMouseX={smoothMouseX}
              smoothMouseY={smoothMouseY}
              pillScrollProgress={pillScrollProgress}
            />
          ))}
        </div>
      </div>

      {/* Main hero typography & CTAs */}
      <motion.div
        className="content"
        style={{
          y: heroContentY,
          opacity: heroContentOpacity,
          scale: heroContentScale,
        }}
      >
        {/* <div className="eyebrow-badge">
          <span className="dot"></span>
          Marketing Cloud + Native CPaaS
        </div> */}

        <h1>The Marketing Cloud with real infrastructure underneath.</h1>

        <p className="hero-desc">
          Plan campaigns, build customer journeys, and segment your audience —
          then send it all through the same messaging infrastructure that powers
          12 billion conversations a year.
        </p>

        <div className="hero-cta-group">
          <a href="/contact" className="btn-luxury primary">
            Start Free Trial
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="/contact" className="btn-luxury secondary">
            Book a Demo
          </a>
        </div>

        {/* <div className="hero-trust-line">
          <span>No credit card required</span>
          <span className="sep">·</span>
          <span>99.999% uptime SLA</span>
          <span className="sep">·</span>
          <span>SOC 2 Type II certified</span>
        </div> */}
      </motion.div>

      {/* Luminous bottom wave ribbon */}
      <HeroMeshCanvas />
    </section>
  );
}
