"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Ambient Luminous Canvas for the Contact page
 * Renders drifting stardust particles and subtle cosmic connection lines
 * with zero-idle CPU IntersectionObserver pausing.
 */
function ContactAmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width =
      (canvas.parentElement?.offsetWidth || window.innerWidth) * dpr);
    let height = (canvas.height =
      (canvas.parentElement?.offsetHeight || 900) * dpr);
    ctx.scale(dpr, dpr);

    let animId: number | null = null;
    let isVisible = true;
    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth * dpr;
      height = canvas.height = canvas.parentElement.offsetHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
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

    // Particle nodes
    const particleCount = 28;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      baseAlpha: number;
      hue: number;
    }[] = [];

    const effectiveWidth = width / dpr;
    const effectiveHeight = height / dpr;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * effectiveWidth,
        y: Math.random() * effectiveHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.2,
        hue: Math.random() > 0.6 ? 215 : 195, // Soft azure / electric sky
      });
    }

    const animate = () => {
      const w = width / dpr;
      const h = height / dpr;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Mouse gentle repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }

        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with delicate faint webs
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cDist < 100) {
            ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - cDist / 100) * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

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

  return <canvas ref={canvasRef} className="contact-ambient-canvas" />;
}

export default function ContactPage() {
  const [formMode, setFormMode] = useState<"demo" | "sales">("demo");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "SMS & RCS",
    "WhatsApp",
  ]);
  const [volume, setVolume] = useState("1M - 10M");
  const [timeline, setTimeline] = useState("This Week");
  const [duration, setDuration] = useState("30 Min Tech Deep Dive");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: "",
  });

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formMode,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          volume,
          channels: selectedChannels,
          duration,
          timeline,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const channelOptions = [
    { id: "sms", name: "SMS & RCS" },
    { id: "whatsapp", name: "WhatsApp" },
    { id: "voice", name: "Voice API" },
    { id: "email", name: "Email API" },
    { id: "ai", name: "Conversational AI" },
  ];

  return (
    <>
      <Header />

      <main className="contact-page-wrap" style={{ position: "relative" }}>
        <ContactAmbientCanvas />
        <div className="contact-bg-glow" aria-hidden="true" />

        <div className="contact-container" style={{ position: "relative" }}>

          {/* Animated Header Bar */}
          <motion.div
            className="contact-header-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* <motion.div
              className="contact-badge-pill"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="contact-pulse-dot" />
              Direct Solutions Architecture &amp; Enterprise Sales
            </motion.div> */}

            <motion.h1
              className="contact-main-title"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {formMode === "demo"
                ? "See the messaging mesh in action."
                : "Let's talk enterprise scale."}
            </motion.h1>

            <motion.p
              className="contact-main-subtitle"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {formMode === "demo"
                ? "Book an engineer-led walkthrough tailored to your traffic volume, routing topology, and customer journeys."
                : "Looking to migrate 10M+ monthly messages, need custom SLAs, or require direct carrier trunking? Let's connect."}
            </motion.p>
          </motion.div>

          {/* Centered Interactive Form Panel */}
          <motion.div
            className="contact-form-panel"
            initial={{ opacity: 0, y: 25, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Fluid Apple-like Animated Mode Switcher */}
            <div className="contact-mode-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={formMode === "demo"}
                className={`contact-tab-btn ${formMode === "demo" ? "active" : ""}`}
                onClick={() => setFormMode("demo")}
              >
                {formMode === "demo" && (
                  <motion.span
                    layoutId="contactActiveTab"
                    className="contact-tab-pill-active"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ position: "relative", zIndex: 3 }}
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span style={{ position: "relative", zIndex: 3 }}>
                  Book a Demo
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={formMode === "sales"}
                className={`contact-tab-btn ${formMode === "sales" ? "active" : ""}`}
                onClick={() => setFormMode("sales")}
              >
                {formMode === "sales" && (
                  <motion.span
                    layoutId="contactActiveTab"
                    className="contact-tab-pill-active"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ position: "relative", zIndex: 3 }}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span style={{ position: "relative", zIndex: 3 }}>
                  Contact Sales
                </span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success-card"
                  className="contact-success-state"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    className="success-icon-ring"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: 0.1,
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.25,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                  </motion.div>

                  <h3>Request received!</h3>
                  <p>
                    Thank you, <strong>{formData.name || "there"}</strong>. Our
                    Solutions Architecture team has received your details for{" "}
                    <strong>{formData.company || "your team"}</strong>.
                  </p>

                  <motion.div
                    className="success-summary-box"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div>
                      <span>Requested Mode:</span>
                      <strong>
                        {formMode === "demo"
                          ? "Live Architecture Demo"
                          : "Enterprise Sales Consultation"}
                      </strong>
                    </div>
                    <div>
                      <span>Monthly Volume:</span>
                      <strong>{volume}</strong>
                    </div>
                    <div>
                      <span>Selected Channels:</span>
                      <strong>
                        {selectedChannels.join(", ") || "General Messaging"}
                      </strong>
                    </div>
                    <div>
                      <span>Expected Timeline:</span>
                      <strong>{timeline}</strong>
                    </div>
                  </motion.div>

                  <p className="success-subtext">
                    A calendar invitation and direct sandbox access link has
                    been dispatched to <em>{formData.email || "your email"}</em>
                    .
                  </p>

                  <motion.button
                    type="button"
                    className="btn-luxury secondary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        phone: "",
                        notes: "",
                      });
                    }}
                  >
                    Submit Another Inquiry
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  className="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Name & Email */}
                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="c-name">Full Name *</label>
                      <input
                        id="c-name"
                        type="text"
                        required
                        placeholder="Satya Nadella"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="c-email">Work Email *</label>
                      <input
                        id="c-email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Company & Phone */}
                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="c-company">Company Name *</label>
                      <input
                        id="c-company"
                        type="text"
                        required
                        placeholder="Acme Enterprises"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="c-phone">Phone Number</label>
                      <input
                        id="c-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Volume Selector */}
                  <div className="form-field">
                    <label htmlFor="c-volume">
                      Estimated Monthly Message Volume
                    </label>
                    <div className="volume-radio-row">
                      {["< 1M", "1M - 10M", "10M - 50M", "50M+"].map((v) => (
                        <motion.button
                          key={v}
                          type="button"
                          className={`volume-pill-btn ${volume === v ? "active" : ""}`}
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setVolume(v)}
                        >
                          {v}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Channel Interest Pills */}
                  <div className="form-field">
                    <label>Channels of Interest</label>
                    <div className="channel-chip-row">
                      {channelOptions.map((ch) => {
                        const isSelected = selectedChannels.includes(ch.name);
                        return (
                          <motion.button
                            key={ch.id}
                            type="button"
                            className={`channel-chip ${isSelected ? "selected" : ""}`}
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleChannel(ch.name)}
                          >
                            <span className="chip-check">
                              {isSelected ? "✓" : "+"}
                            </span>
                            {ch.name}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Demo Specific: Duration & Timeline */}
                  {formMode === "demo" && (
                    <motion.div
                      className="form-row-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="form-field">
                        <label>Preferred Session Duration</label>
                        <select
                          className="contact-select"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                        >
                          <option value="15 Min High-Level Tour">
                            15 Min High-Level Tour
                          </option>
                          <option value="30 Min Tech Deep Dive">
                            30 Min Tech Deep Dive
                          </option>
                          <option value="45 Min Architecture Pairing">
                            45 Min Architecture Pairing
                          </option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label>Target Timeline</label>
                        <select
                          className="contact-select"
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                        >
                          <option value="This Week">This Week</option>
                          <option value="Next Week">Next Week</option>
                          <option value="Within 30 Days">Within 30 Days</option>
                          <option value="General Exploration">
                            General Exploration
                          </option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Requirements Note */}
                  <div className="form-field">
                    <label htmlFor="c-notes">
                      {formMode === "demo"
                        ? "What would you like to see?"
                        : "Project Requirements & Notes"}
                    </label>
                    <textarea
                      id="c-notes"
                      rows={3}
                      placeholder={
                        formMode === "demo"
                          ? "e.g., WhatsApp Business catalog automation and low-latency SMS failover..."
                          : "e.g., Current provider throughput bottlenecks, desired SLA, custom webhook integration..."
                      }
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>

                  {errorMessage && (
                    <motion.div
                      style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        color: "#dc2626",
                        fontSize: "0.85rem",
                      }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="btn-luxury primary full-width"
                    style={{
                      justifyContent: "center",
                      marginTop: "0.75rem",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.015 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.985 }}
                  >
                    {isSubmitting ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          style={{ animation: "spin 0.8s linear infinite" }}
                        >
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Sending Inquiry...
                      </span>
                    ) : formMode === "demo" ? (
                      "Confirm & Book Engineering Walkthrough"
                    ) : (
                      "Request Enterprise Consultation"
                    )}
                  </motion.button>

                  <p className="form-disclaimer">
                    By submitting, you agree to MessageYard's{" "}
                    <a href="/contact">Privacy Policy</a> and{" "}
                    <a href="/contact">Terms of Service</a>. We never sell or
                    share contact telemetry.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
