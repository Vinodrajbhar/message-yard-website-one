"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

const TABS = [
  { id: "tab-data", num: "01 / Ingestion", title: "Data & Profiles" },
  { id: "tab-journeys", num: "02 / Automation", title: "Journey Canvas" },
  { id: "tab-cpaas", num: "03 / Delivery", title: "CPaaS APIs" },
  { id: "tab-analytics", num: "04 / Intelligence", title: "Attribution" },
];

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
    <button className="console-copy-btn" onClick={handleCopy} title="Copy payload">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

export default function Platform() {
  const [activeTab, setActiveTab] = useState("tab-data");
  const [codeLang, setCodeLang] = useState<"curl" | "node" | "python">("curl");
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const tiltX = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3]);
  const panelMockupTranslateY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  const CODE_SNIPPETS = {
    curl: `curl -X POST https://api.messageyard.com/v1/messages/send \\
  -H "Authorization: Bearer my_live_token_77a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+14155550199",
    "channel": "whatsapp",
    "template": "vip_cart_recovery",
    "carrier_route": "tier_1_direct"
  }'`,
    node: `import { MessageYard } from "@messageyard/sdk";

const client = new MessageYard({ apiKey: process.env.MY_API_KEY });

await client.messages.dispatch({
  to: "+14155550199",
  channel: "whatsapp",
  template: "vip_cart_recovery",
  carrierRoute: "tier_1_direct",
  fallback: { channel: "rcs", timeoutMs: 3000 }
});`,
    python: `from messageyard import Client

client = Client(api_key="my_live_token_77a")

response = client.messages.dispatch(
    to="+14155550199",
    channel="whatsapp",
    template="vip_cart_recovery",
    carrier_route="tier_1_direct",
    webhook_tracking=True
)`,
  };

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

        <div className="platform-tab-panels-container" style={{ position: "relative", minHeight: "480px" }}>
          <AnimatePresence mode="wait">
            {/* TAB 1: DATA & PROFILES (INGESTION) */}
            {activeTab === "tab-data" && (
              <motion.div
                key="tab-data"
                className="platform-tab-panel active"
                id="tab-data"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="panel-text">
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Pipeline Stage 01 · Ingestion
                  </span>
                  <h3>Unify customer data without data silos.</h3>
                  <p>
                    Stream raw customer events from your product database, CRM, and Shopify store. MessageYard compiles a
                    persistent, real-time identity graph across email, phone numbers, and WhatsApp IDs.
                  </p>
                  <ul className="panel-bullets">
                    <li>Zero-latency event ingestion via HTTP streaming webhooks</li>
                    <li>Automatic duplicate resolution and cross-device identity stitching</li>
                    <li>Custom attributes with typed schemas and computed dynamic traits</li>
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
                        <span></span><span></span><span></span>
                      </div>
                      <span className="pipeline-header-path">mesh://identity-engine/graph-stitcher</span>
                    </div>
                    <div className="pipeline-live-badge">
                      <span className="pipeline-live-dot"></span>
                      <span>Streaming Active</span>
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
                            <span className="pipeline-source-name">Shopify Webhook</span>
                            <span className="pipeline-source-detail">order/created · $320.00</span>
                          </div>
                        </div>
                        <div className="pipeline-source-item">
                          <span className="pipeline-source-icon">🗄️</span>
                          <div className="pipeline-source-info">
                            <span className="pipeline-source-name">PostgreSQL Sync</span>
                            <span className="pipeline-source-detail">users.sync · Tier: VIP</span>
                          </div>
                        </div>
                        <div className="pipeline-source-item">
                          <span className="pipeline-source-icon">📱</span>
                          <div className="pipeline-source-info">
                            <span className="pipeline-source-name">Mobile App SDK</span>
                            <span className="pipeline-source-detail">push_token: valid</span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Identity Hub */}
                      <div className="pipeline-engine-hub">
                        <div className="pipeline-hub-pulse">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                        </div>
                        <span className="pipeline-hub-label">Stitching Core</span>
                      </div>

                      {/* Right: Unified Profile Card */}
                      <div className="pipeline-profile-card">
                        <div className="pipeline-profile-header">
                          <div className="pipeline-profile-avatar">
                            <div className="pipeline-avatar-circle">AR</div>
                            <span className="pipeline-profile-name">Alex Rivera</span>
                          </div>
                          <span className="pipeline-vip-tag">VIP · $3,840</span>
                        </div>

                        <div className="pipeline-stitched-badges">
                          <span className="pipeline-stitch-pill active">✓ WhatsApp: wa_9281</span>
                          <span className="pipeline-stitch-pill active">✓ SMS: +1 415 ••• 2100</span>
                          <span className="pipeline-stitch-pill">✓ Email: Verified</span>
                        </div>

                        <div style={{ fontSize: "0.725rem", color: "#64748b", background: "#f8fafc", padding: "0.35rem 0.5rem", borderRadius: "4px" }}>
                          Dynamic Trait: <strong style={{ color: "#0f172a" }}>Cart Abandoned ($320)</strong>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Live Telemetry Ticker */}
                    <div className="pipeline-terminal-ticker">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.4rem", marginBottom: "0.2rem" }}>
                        <span style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 600 }}>EVENT STREAM TELEMETRY</span>
                        <CopyButton textToCopy={`[INBOUND] event: "checkout_completed" | id: "usr_99x"\n[RESOLVE] stitched phone: +1 (415) 890-2100 -> id: "usr_99x"\n[SEGMENT] user matched: "High-LTV VIPs" (Spend > $1,200)\n[STATUS] Latency: 1.4ms · Protocol: TLS 1.3 · Status: OK`} />
                      </div>
                      <div><span style={{ color: "#60a5fa" }}>[INBOUND]</span> event: "checkout_completed" | user_id: "usr_99x"</div>
                      <div><span style={{ color: "#34d399" }}>[RESOLVE]</span> stitched phone: +1 (415) 890-2100 &rarr; wa_id_9281</div>
                      <div><span style={{ color: "#94a3b8" }}>[STATUS]</span> Ingestion: 1.4ms · Deduplication: OK · Identity Mesh Synced</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* TAB 2: JOURNEY CANVAS (AUTOMATION) */}
            {activeTab === "tab-journeys" && (
              <motion.div
                key="tab-journeys"
                className="platform-tab-panel active"
                id="tab-journeys"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="panel-text">
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Pipeline Stage 02 · Automation
                  </span>
                  <h3>Drag, drop, and branch across every channel.</h3>
                  <p>
                    Build customer journeys that react to real behavior in real time. Trigger a workflow off a purchase, a
                    support ticket, or an abandoned cart, and let it route across WhatsApp, RCS, or voice automatically.
                  </p>
                  <ul className="panel-bullets">
                    <li>Visual branching logic based on user interaction and time delays</li>
                    <li>Send-time AI optimization tailored to each individual recipient</li>
                    <li>Multivariate A/B testing with automated traffic winners</li>
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
                        <span></span><span></span><span></span>
                      </div>
                      <span className="pipeline-header-path">canvas://workflows/vip-cart-recovery.flow</span>
                    </div>
                    <div className="pipeline-live-badge">
                      <span className="pipeline-live-dot"></span>
                      <span>98.4% Completion</span>
                    </div>
                  </div>

                  <div className="pipeline-console-body">
                    {/* Visual Journey Node Tree */}
                    <div className="pipeline-workflow-layout">
                      {/* Step 1: Trigger */}
                      <div className="pipeline-flow-step">
                        <div className="pipeline-step-indicator">
                          <span className="pipeline-step-dot"></span>
                          <span className="pipeline-step-line"></span>
                        </div>
                        <div className="pipeline-node-box highlight">
                          <div className="pipeline-node-content">
                            <h5>⚡ TRIGGER: Cart Abandoned</h5>
                            <p>Condition: Cart Value &gt; $150 · Exit Intent Detected</p>
                          </div>
                          <span style={{ fontSize: "0.685rem", fontWeight: 600, color: "#2563eb" }}>0ms</span>
                        </div>
                      </div>

                      {/* Step 2: Delay Node */}
                      <div className="pipeline-flow-step">
                        <div className="pipeline-step-indicator">
                          <span className="pipeline-step-dot" style={{ background: "#6366f1" }}></span>
                          <span className="pipeline-step-line"></span>
                        </div>
                        <div className="pipeline-node-box">
                          <div className="pipeline-node-content">
                            <h5>⏳ DELAY: Wait 15 Minutes</h5>
                            <p>Verify checkout status === false</p>
                          </div>
                          <span style={{ fontSize: "0.685rem", fontWeight: 600, color: "#64748b" }}>15m</span>
                        </div>
                      </div>

                      {/* Step 3: Split Branches */}
                      <div className="pipeline-branch-split">
                        <div className="pipeline-branch-card whatsapp">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                            <strong style={{ color: "#16a34a" }}>Branch A (78%) · WhatsApp</strong>
                            <span style={{ fontSize: "0.65rem", background: "rgba(34,197,94,0.15)", color: "#15803d", padding: "1px 5px", borderRadius: "4px" }}>Delivered 0.8s</span>
                          </div>
                          <p style={{ margin: 0, color: "#334155" }}>"Hi Alex, your reserved items are holding for 1 hr. [Complete Order]"</p>
                        </div>

                        <div className="pipeline-branch-card sms">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                            <strong style={{ color: "#0284c7" }}>Branch B (22%) · RCS / SMS</strong>
                            <span style={{ fontSize: "0.65rem", background: "rgba(2,132,199,0.15)", color: "#0369a1", padding: "1px 5px", borderRadius: "4px" }}>Failover</span>
                          </div>
                          <p style={{ margin: 0, color: "#334155" }}>"Exclusive VIP 10% applied to your bag: msg.yd/cart"</p>
                        </div>
                      </div>

                      {/* Step 4: Conversion Goal */}
                      <div className="pipeline-flow-step" style={{ marginTop: "0.25rem" }}>
                        <div className="pipeline-step-indicator">
                          <span className="pipeline-step-dot" style={{ background: "#10b981" }}></span>
                        </div>
                        <div className="pipeline-node-box" style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.04)" }}>
                          <div className="pipeline-node-content">
                            <h5 style={{ color: "#059669" }}>🎉 GOAL CONVERTED: Checkout Completed</h5>
                            <p>Attributed Revenue: +$284.50 · Conversion Time: 3m 42s</p>
                          </div>
                          <span style={{ fontSize: "0.685rem", fontWeight: 700, color: "#059669" }}>SUCCESS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* TAB 3: CPAAS APIS (DELIVERY) */}
            {activeTab === "tab-cpaas" && (
              <motion.div
                key="tab-cpaas"
                className="platform-tab-panel active"
                id="tab-cpaas"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="panel-text">
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Pipeline Stage 03 · Delivery Layer
                  </span>
                  <h3>Direct carrier connectivity. Zero middleman markup.</h3>
                  <p>
                    Every channel used by the Marketing Cloud console is available directly as a REST API. When your developers
                    need custom in-app messaging or automated voice calling, the code is already unified.
                  </p>
                  <ul className="panel-bullets">
                    <li>Tier-1 direct carrier routes in 190+ countries</li>
                    <li>Sub-second global latency with automatic failover routing</li>
                    <li>Programmable webhooks for real-time delivery receipts</li>
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
                        <span></span><span></span><span></span>
                      </div>
                      <span className="pipeline-header-path">cpaas-mesh://carrier-routing/v1/dispatch</span>
                    </div>
                    <div className="pipeline-live-badge">
                      <span className="pipeline-live-dot"></span>
                      <span>8ms Edge Latency</span>
                    </div>
                  </div>

                  <div className="pipeline-console-body">
                    {/* Carrier Routing Matrix */}
                    <div className="pipeline-carrier-grid">
                      <div className="pipeline-carrier-pill">
                        <span className="pipeline-carrier-name">AT&T Tier-1</span>
                        <span className="pipeline-carrier-latency">● 3.2ms · Direct</span>
                      </div>
                      <div className="pipeline-carrier-pill">
                        <span className="pipeline-carrier-name">Verizon Wireless</span>
                        <span className="pipeline-carrier-latency">● 2.8ms · Direct</span>
                      </div>
                      <div className="pipeline-carrier-pill">
                        <span className="pipeline-carrier-name">Vodafone Global</span>
                        <span className="pipeline-carrier-latency">● 4.1ms · Direct</span>
                      </div>
                      <div className="pipeline-carrier-pill">
                        <span className="pipeline-carrier-name">Airtel International</span>
                        <span className="pipeline-carrier-latency">● 5.2ms · Direct</span>
                      </div>
                    </div>

                    {/* Interactive Code Switcher */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div className="pipeline-code-tabs">
                        <button
                          type="button"
                          className={`pipeline-code-tab ${codeLang === "curl" ? "active" : ""}`}
                          onClick={() => setCodeLang("curl")}
                        >
                          cURL
                        </button>
                        <button
                          type="button"
                          className={`pipeline-code-tab ${codeLang === "node" ? "active" : ""}`}
                          onClick={() => setCodeLang("node")}
                        >
                          Node.js / TS
                        </button>
                        <button
                          type="button"
                          className={`pipeline-code-tab ${codeLang === "python" ? "active" : ""}`}
                          onClick={() => setCodeLang("python")}
                        >
                          Python
                        </button>
                      </div>

                      <CopyButton textToCopy={CODE_SNIPPETS[codeLang]} />
                    </div>

                    {/* Syntax Code View */}
                    <div className="pipeline-terminal-ticker" style={{ minHeight: "150px" }}>
                      <pre style={{ margin: 0, overflowX: "auto", fontFamily: "inherit" }}>
                        <code>{CODE_SNIPPETS[codeLang]}</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* TAB 4: ATTRIBUTION (INTELLIGENCE) */}
            {activeTab === "tab-analytics" && (
              <motion.div
                key="tab-analytics"
                className="platform-tab-panel active"
                id="tab-analytics"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="panel-text">
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Pipeline Stage 04 · Closed-Loop ROI
                  </span>
                  <h3>Know exactly which message generated revenue.</h3>
                  <p>
                    Connect campaign sends directly to closed sales, pipeline velocity, and customer retention. View multi-touch
                    attribution reports across all channels in one executive dashboard.
                  </p>
                  <ul className="panel-bullets">
                    <li>Multi-touch first-click, last-click, and linear revenue models</li>
                    <li>Cohort analysis tracked against lifetime customer value (LTV)</li>
                    <li>Direct integration with Snowflake, BigQuery, and Databricks</li>
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
                        <span></span><span></span><span></span>
                      </div>
                      <span className="pipeline-header-path">bi-engine://attribution/revenue-cohorts</span>
                    </div>
                    <div className="pipeline-live-badge">
                      <span className="pipeline-live-dot"></span>
                      <span>Real-time ROI</span>
                    </div>
                  </div>

                  <div className="pipeline-console-body">
                    {/* 4 Metrics Grid */}
                    <div className="pipeline-analytics-grid">
                      <div className="pipeline-metric-stat">
                        <span className="pipeline-stat-title">
                          Delivery Rate
                          <span style={{ color: "#10b981", fontSize: "0.7rem", fontWeight: 700 }}>+0.04%</span>
                        </span>
                        <span className="pipeline-stat-value" style={{ color: "#059669" }}>99.98%</span>
                      </div>
                      <div className="pipeline-metric-stat">
                        <span className="pipeline-stat-title">
                          Avg Latency
                          <span style={{ color: "#2563eb", fontSize: "0.7rem", fontWeight: 700 }}>P99</span>
                        </span>
                        <span className="pipeline-stat-value" style={{ color: "#2563eb" }}>4.2ms</span>
                      </div>
                      <div className="pipeline-metric-stat">
                        <span className="pipeline-stat-title">
                          Annual Volume
                          <span style={{ color: "#64748b", fontSize: "0.7rem" }}>Global</span>
                        </span>
                        <span className="pipeline-stat-value">12.4B</span>
                      </div>
                      <div className="pipeline-metric-stat">
                        <span className="pipeline-stat-title">
                          Attributed Rev
                          <span style={{ color: "#10b981", fontSize: "0.7rem", fontWeight: 700 }}>+34% MoM</span>
                        </span>
                        <span className="pipeline-stat-value" style={{ color: "#0f172a" }}>$2.62M</span>
                      </div>
                    </div>

                    {/* Channel Revenue Attribution Progress Bars */}
                    <div className="pipeline-channel-bars">
                      <div className="pipeline-bar-row">
                        <div className="pipeline-bar-header">
                          <span>WhatsApp Business (39.2%)</span>
                          <span>$1,027,000</span>
                        </div>
                        <div className="pipeline-bar-track">
                          <div className="pipeline-bar-fill" style={{ width: "39.2%", background: "#25d366" }}></div>
                        </div>
                      </div>

                      <div className="pipeline-bar-row">
                        <div className="pipeline-bar-header">
                          <span>RCS Rich Messaging (28.4%)</span>
                          <span>$744,000</span>
                        </div>
                        <div className="pipeline-bar-track">
                          <div className="pipeline-bar-fill" style={{ width: "28.4%", background: "#38bdf8" }}></div>
                        </div>
                      </div>

                      <div className="pipeline-bar-row">
                        <div className="pipeline-bar-header">
                          <span>High-Priority SMS (21.6%)</span>
                          <span>$565,000</span>
                        </div>
                        <div className="pipeline-bar-track">
                          <div className="pipeline-bar-fill" style={{ width: "21.6%", background: "#2563eb" }}></div>
                        </div>
                      </div>

                      <div className="pipeline-bar-row">
                        <div className="pipeline-bar-header">
                          <span>Conversational Voice (10.8%)</span>
                          <span>$284,000</span>
                        </div>
                        <div className="pipeline-bar-track">
                          <div className="pipeline-bar-fill" style={{ width: "10.8%", background: "#8b5cf6" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
