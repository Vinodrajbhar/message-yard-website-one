"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

const TABS = [
  { id: "tab-data", num: "01 / Ingestion", title: "Data & Profiles" },
  { id: "tab-journeys", num: "02 / Automation", title: "Journey & Workflows" },
  { id: "tab-cpaas", num: "03 / Delivery", title: "CPaaS APIs" },
  {
    id: "tab-analytics",
    num: "04 / Intelligence",
    title: "Performance Intelligence",
  },
];

function PlatformVideoPlayer({
  driveId,
  r2Key,
  title,
  isActive = true,
}: {
  driveId?: string;
  r2Key: string;
  title: string;
  isActive?: boolean;
}) {
  const cdnBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
  const directCdnUrl = cdnBase ? `${cdnBase}/${encodeURIComponent(r2Key)}` : "";
  const r2StreamUrl = `/api/r2/video?key=${encodeURIComponent(r2Key)}`;
  const videoSrc = directCdnUrl || r2StreamUrl;

  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const drivePreviewUrl = driveId
    ? `https://drive.google.com/file/d/${driveId}/preview`
    : "";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <div className="pipeline-video-viewport">
      {!hasError ? (
        <video
          ref={videoRef}
          className="pipeline-video-element"
          src={videoSrc}
          autoPlay={isActive}
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setHasError(true)}
        />
      ) : drivePreviewUrl ? (
        <iframe
          src={drivePreviewUrl}
          className="pipeline-video-iframe"
          title={title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      ) : (
        <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
          Video stream unavailable
        </div>
      )}
    </div>
  );
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      className="console-copy-btn"
      onClick={handleCopy}
      title="Copy payload"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

export default function Platform() {
  const [activeTab, setActiveTab] = useState("tab-data");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: string }>;
      const targetTab = customEvent.detail?.tab;
      if (targetTab && TABS.some((t) => t.id === targetTab)) {
        setActiveTab(targetTab);
      }
    };
    window.addEventListener("switch-platform-tab", handleSwitchTab);

    try {
      const savedTab = sessionStorage.getItem("platform_active_tab");
      if (savedTab && TABS.some((t) => t.id === savedTab)) {
        sessionStorage.removeItem("platform_active_tab");
        setActiveTab(savedTab);
      }
    } catch {}

    return () =>
      window.removeEventListener("switch-platform-tab", handleSwitchTab);
  }, []);

  useEffect(() => {
    // Preload video streams into browser media cache immediately on page mount
    const videoKeys = [
      "Workflows.mov",
      "Channel Dashboard.mov",
      "Product Dashboard video.mov",
    ];
    videoKeys.forEach((key) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = `/api/r2/video?key=${encodeURIComponent(key)}`;
      document.head.appendChild(link);
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const tiltX = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3]);
  const panelMockupTranslateY = useTransform(
    scrollYProgress,
    [0, 1],
    [15, -15],
  );

  return (
    <section ref={sectionRef} className="how-it-works" id="platform">
      <div className="how-it-works-wrapper">
        <motion.span
          className="text-tag"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How it works
        </motion.span>

        <motion.h2
          style={{ marginBottom: "2.5rem" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          The MessageYard Platform Architecture
        </motion.h2>

        <div className="platform-nav-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`platform-tab-btn ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="step-num">{t.num}</span>
              <span className="step-title">{t.title}</span>
            </button>
          ))}
        </div>

        <div
          className="platform-tab-panels-container"
          style={{ position: "relative", minHeight: "480px" }}
        >
          {/* Background Hidden Preloader ensuring instant video buffering */}
          <div
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <video src="/api/r2/video?key=Workflows.mov" preload="auto" muted playsInline />
            <video src="/api/r2/video?key=Channel%20Dashboard.mov" preload="auto" muted playsInline />
            <video src="/api/r2/video?key=Product%20Dashboard%20video.mov" preload="auto" muted playsInline />
          </div>

          {/* TAB 1: DATA & PROFILES (INGESTION) */}
          <div
            key="tab-data"
            className={`platform-tab-panel ${activeTab === "tab-data" ? "active" : ""}`}
            id="tab-data"
          >
                <div className="panel-text">
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#2563eb",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Pipeline Stage 01 · Ingestion
                  </span>
                  <h3>Turn Every Campaign Into Actionable Intelligence</h3>
                  <p>
                    See beyond delivery reports. MessageYard brings Email, SMS,
                    WhatsApp and RCS engagement into one intelligent view to
                    reveal what’s working, where, and why.
                  </p>
                  <ul className="panel-bullets">
                    <li>
                      <strong>Unified Campaign Intelligence —</strong> Compare
                      engagement and conversions across channels.
                    </li>
                    <li>
                      <strong>Campaign & Channel Effectiveness —</strong> Know
                      which campaigns, messages and channels drive results.
                    </li>
                    <li>
                      <strong>Real-Time Performance Signals —</strong> Spot
                      winning campaigns, engagement drops and opportunities
                      instantly.
                    </li>
                    <li>
                      <strong>Next-Best Insights —</strong> Use engagement
                      intelligence to improve channel, timing and future
                      campaigns.
                    </li>
                  </ul>
                </div>

                <motion.div
                  className="pipeline-console-card"
                  style={{
                    perspective: 1000,
                    rotateX: tiltX,
                    y: panelMockupTranslateY,
                  }}
                >
                  <div className="pipeline-console-header">
                    <div className="pipeline-header-left">
                      <div className="pipeline-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>

                  <div className="pipeline-console-body">
                    {/* Visual Identity Graph Architecture */}
                    <div className="pipeline-identity-layout">
                      {/* Left: Sources */}
                      <div className="pipeline-sources-col">
                        <div className="pipeline-source-item">
                          <span className="pipeline-source-icon">🛍️</span>
                          <div className="pipeline-source-info">
                            <span className="pipeline-source-name">
                              Shopify Webhook
                            </span>
                            <span className="pipeline-source-detail">
                              order/created · $320.00
                            </span>
                          </div>
                        </div>
                        <div className="pipeline-source-item">
                          <span className="pipeline-source-icon">🗄️</span>
                          <div className="pipeline-source-info">
                            <span className="pipeline-source-name">
                              PostgreSQL Sync
                            </span>
                            <span className="pipeline-source-detail">
                              users.sync · Tier: VIP
                            </span>
                          </div>
                        </div>
                        <div className="pipeline-source-item">
                          <span className="pipeline-source-icon">📱</span>
                          <div className="pipeline-source-info">
                            <span className="pipeline-source-name">
                              Mobile App SDK
                            </span>
                            <span className="pipeline-source-detail">
                              push_token: valid
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Identity Hub */}
                      <div className="pipeline-engine-hub">
                        <div className="pipeline-hub-pulse">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                        </div>
                        <span className="pipeline-hub-label">
                          Stitching Core
                        </span>
                      </div>

                      {/* Right: Unified Profile Card */}
                      <div className="pipeline-profile-card">
                        <div className="pipeline-profile-header">
                          <div className="pipeline-profile-avatar">
                            <div className="pipeline-avatar-circle">AR</div>
                            <span className="pipeline-profile-name">
                              Alex Rivera
                            </span>
                          </div>
                          <span className="pipeline-vip-tag">VIP · $3,840</span>
                        </div>

                        <div className="pipeline-stitched-badges">
                          <span className="pipeline-stitch-pill active">
                            ✓ WhatsApp: wa_9281
                          </span>
                          <span className="pipeline-stitch-pill active">
                            ✓ SMS: +1 415 ••• 2100
                          </span>
                          <span className="pipeline-stitch-pill">
                            ✓ Email: Verified
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: "0.725rem",
                            color: "#64748b",
                            background: "#f8fafc",
                            padding: "0.35rem 0.5rem",
                            borderRadius: "4px",
                          }}
                        >
                          Dynamic Trait:{" "}
                          <strong style={{ color: "#0f172a" }}>
                            Cart Abandoned ($320)
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Live Telemetry Ticker */}
                    <div className="pipeline-terminal-ticker">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                          paddingBottom: "0.4rem",
                          marginBottom: "0.2rem",
                        }}
                      >
                        <span
                          style={{
                            color: "#94a3b8",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                          }}
                        >
                          EVENT STREAM TELEMETRY
                        </span>
                        <CopyButton
                          textToCopy={`[INBOUND] event: "checkout_completed" | id: "usr_99x"\n[RESOLVE] stitched phone: +1 (415) 890-2100 -> id: "usr_99x"\n[SEGMENT] user matched: "High-LTV VIPs" (Spend > $1,200)\n[STATUS] Latency: 1.4ms · Protocol: TLS 1.3 · Status: OK`}
                        />
                      </div>
                      <div>
                        <span style={{ color: "#60a5fa" }}>[INBOUND]</span>{" "}
                        event: "checkout_completed" | user_id: "usr_99x"
                      </div>
                      <div>
                        <span style={{ color: "#34d399" }}>[RESOLVE]</span>{" "}
                        stitched phone: +1 (415) 890-2100 &rarr; wa_id_9281
                      </div>
                      <div>
                        <span style={{ color: "#94a3b8" }}>[STATUS]</span>{" "}
                        Ingestion: 1.4ms · Deduplication: OK · Identity Mesh
                        Synced
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

            {/* TAB 2: JOURNEY & WORKFLOWS (AUTOMATION) */}
            <div
              key="tab-journeys"
              className={`platform-tab-panel ${activeTab === "tab-journeys" ? "active" : ""}`}
              id="tab-journeys"
            >
                <div className="panel-text">
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#2563eb",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Pipeline Stage 02 · Automation
                  </span>
                  <h3>Drag, drop, and branch across every channel.</h3>
                  <p>
                    Build customer journeys that react to real behavior in real
                    time, or deploy predefined workflows to reduce manual
                    efforts. Trigger a workflow off a purchase, a support
                    ticket, or an abandoned cart, and let it route across
                    WhatsApp, RCS, or voice automatically.
                  </p>
                  <ul className="panel-bullets">
                    <li>
                      <strong>Visual Branching Logic —</strong> Branch based on
                      user interaction, conditional tags, and custom time
                      delays.
                    </li>
                    <li>
                      <strong>Predefined Workflows —</strong> Out-of-the-box
                      automation templates to reduce manual efforts and launch
                      faster.
                    </li>
                    <li>
                      <strong>Send-Time Optimization —</strong> AI-powered
                      delivery windows tailored to each individual recipient.
                    </li>
                    <li>
                      <strong>Multivariate A/B Testing —</strong> Automated
                      traffic routing to winning message variations.
                    </li>
                  </ul>
                </div>

                <motion.div
                  className="pipeline-console-card"
                  style={{
                    perspective: 1000,
                    rotateX: tiltX,
                    y: panelMockupTranslateY,
                  }}
                >

                  <PlatformVideoPlayer
                    r2Key="Workflows.mov"
                    driveId="1wyQkKe0-sxS6gCt4Rw1M-9VTfGrcXtFw"
                    title="Journey & Workflows Automation Demonstration"
                    isActive={activeTab === "tab-journeys"}
                  />
                </motion.div>
              </div>

            {/* TAB 3: CPAAS APIS (DELIVERY) */}
            <div
              key="tab-cpaas"
              className={`platform-tab-panel ${activeTab === "tab-cpaas" ? "active" : ""}`}
              id="tab-cpaas"
            >
                <div className="panel-text">
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#2563eb",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Pipeline Stage 03 · Delivery Layer
                  </span>
                  <h3>Direct carrier connectivity. Zero middleman markup.</h3>
                  <p>
                    Every channel used by the Marketing Cloud console is
                    available directly as a REST API. When your developers need
                    custom in-app messaging or automated voice calling, the code
                    is already unified.
                  </p>
                  <ul className="panel-bullets">
                    <li>
                      <strong>Tier-1 Direct Carrier Routes —</strong> Direct
                      routes in 190+ countries for carrier-grade deliverability.
                    </li>
                    <li>
                      <strong>Sub-Second Global Latency —</strong> Real-time
                      edge routing with automatic zero-loss failover.
                    </li>
                    <li>
                      <strong>Programmable Webhooks —</strong> Event streams for
                      delivery receipts, clicks, and read states.
                    </li>
                  </ul>
                </div>

                <motion.div
                  className="pipeline-console-card"
                  style={{
                    perspective: 1000,
                    rotateX: tiltX,
                    y: panelMockupTranslateY,
                  }}
                >

                  <PlatformVideoPlayer
                    r2Key="Channel Dashboard.mov"
                    driveId="1JvC449D_8MUWziLfkPQCxng1zqCIluvn"
                    title="CPaaS APIs Channel Video Demonstration"
                    isActive={activeTab === "tab-cpaas"}
                  />
                </motion.div>
              </div>

            {/* TAB 4: PERFORMANCE INTELLIGENCE */}
            <div
              key="tab-analytics"
              className={`platform-tab-panel ${activeTab === "tab-analytics" ? "active" : ""}`}
              id="tab-analytics"
            >
                <div className="panel-text">
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#2563eb",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Pipeline Stage 04 · Performance Intelligence
                  </span>
                  <h3>See the complete impact of every campaign.</h3>
                  <p>
                    Understand how every campaign and channel performs—from
                    delivery and engagement to responses, conversions and
                    revenue. Compare Email, SMS, WhatsApp and RCS in one
                    intelligent view to uncover what works and what needs
                    improvement.
                  </p>
                  <ul className="panel-bullets">
                    <li>
                      Campaign-level delivery, engagement, response and
                      conversion insights
                    </li>
                    <li>
                      Channel-wise performance and cross-channel effectiveness
                      comparison
                    </li>
                    <li>
                      Track clicks, interactions, drop-offs, conversions and
                      revenue impact
                    </li>
                    <li>
                      Identify top-performing campaigns, channels and engagement
                      trends
                    </li>
                  </ul>
                </div>

                <motion.div
                  className="pipeline-console-card"
                  style={{
                    perspective: 1000,
                    rotateX: tiltX,
                    y: panelMockupTranslateY,
                  }}
                >

                  <PlatformVideoPlayer
                    r2Key="Product Dashboard video.mov"
                    driveId="11ZHWECERMDFvgn88l1dHqQVm6eNzcHuo"
                    title="Performance Intelligence Demonstration"
                    isActive={activeTab === "tab-analytics"}
                  />
                </motion.div>
              </div>
        </div>
      </div>
    </section>
  );
}
