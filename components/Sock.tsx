"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseAlpha: number;
  pulseOffset: number;
}

export default function Sock() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll parallax on the centered content
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = section.offsetWidth || window.innerWidth;
    let height = section.offsetHeight || window.innerHeight;
    let particles: Particle[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let isVisible = false;
    let animId: number | null = null;
    const numParticles = 85;
    const maxConnectDist = 120;
    const mouseRadius = 150;

    const resize = () => {
      width = section.offsetWidth || window.innerWidth;
      height = section.offsetHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Create particles
    particles = [];
    const colors = ["#38bdf8", "#60a5fa", "#818cf8", "#c084fc"];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.45 + 0.35,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    section.addEventListener("mousemove", handleMouseMove, { passive: true });
    section.addEventListener("mouseleave", handleMouseLeave);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animId = requestAnimationFrame(animate);
          }
        });
      },
      { rootMargin: "100px" }
    );
    observer.observe(section);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const time = performance.now() * 0.002;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        const pulse = Math.sin(time + p.pulseOffset) * 0.15;
        const currentAlpha = Math.max(0.1, Math.min(1, p.baseAlpha + pulse));

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Mouse interaction
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * 0.6;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }

        // Particle connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < maxConnectDist) {
            const lineAlpha = (1 - cdist / maxConnectDist) * 0.18;
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Mouse connection line
        if (dist < mouseRadius) {
          const mouseLineAlpha = (1 - dist / mouseRadius) * 0.35;
          ctx.strokeStyle = "#60a5fa";
          ctx.globalAlpha = mouseLineAlpha;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
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
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="sock" id="sock">
      <canvas id="sock-particles" ref={canvasRef} className="sock-particle-canvas" />
      <motion.div
        className="sock-content"
        style={{ y: contentY }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Ready to run your next campaign on real infrastructure?
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Start free, launch your first customer journey today, and scale into programmable CPaaS APIs whenever you need
          to.
        </motion.p>
        <motion.button
          className="btn-sock-cta"
          onClick={() => {
            window.location.href = "/contact";
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
        >
          Start Free Trial
        </motion.button>
      </motion.div>
    </section>
  );
}
