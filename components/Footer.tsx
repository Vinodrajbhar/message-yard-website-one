"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const navigateToSection = (
    e: React.MouseEvent,
    sectionId: string,
    tabOrChannelId?: string,
  ) => {
    e.preventDefault();

    if (pathname === "/") {
      if (sectionId === "platform" && tabOrChannelId) {
        window.dispatchEvent(
          new CustomEvent("switch-platform-tab", {
            detail: { tab: tabOrChannelId },
          }),
        );
      } else if (sectionId === "channels" && tabOrChannelId) {
        window.dispatchEvent(
          new CustomEvent("highlight-channel", {
            detail: { channel: tabOrChannelId },
          }),
        );
      }

      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, 120);
      }
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } else {
      try {
        sessionStorage.setItem("scroll_to_section", sectionId);
        if (sectionId === "platform" && tabOrChannelId) {
          sessionStorage.setItem("platform_active_tab", tabOrChannelId);
        } else if (sectionId === "channels" && tabOrChannelId) {
          sessionStorage.setItem("channel_active_target", tabOrChannelId);
        }
      } catch {}
      router.push("/");
    }
  };

  return (
    <footer id="footer">
      <div className="top">
        <div className="left">
          <a
            href="/"
            className="logo"
            aria-label="MessageYard Home"
            style={{ display: "inline-block", marginBottom: "0.55rem" }}
          >
            <img
              src="/assets/messageyard-icon.png"
              alt="MessageYard"
              style={{
                width: "clamp(12.5rem, 17vw, 17rem)",
                height: "auto",
                maxHeight: "3.5rem",
                objectFit: "contain",
                display: "block",
              }}
            />
          </a>
          <p>
            The Marketing Cloud with real messaging infrastructure under the
            hood.
          </p>
        </div>

        <div className="right">
          <nav role="navigation" aria-label="Footer Navigation">
            <ul>
              <li>
                <span className="dd-label">Platform</span>
                <ul className="sub-menu">
                  <li>
                    <a
                      href="/"
                      onClick={(e) =>
                        navigateToSection(e, "platform", "tab-journeys")
                      }
                      className="nav-item"
                    >
                      Journey Builder
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={(e) =>
                        navigateToSection(e, "platform", "tab-campaigns")
                      }
                      className="nav-item"
                    >
                      Campaign Manager
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={(e) =>
                        navigateToSection(e, "platform", "tab-data")
                      }
                      className="nav-item"
                    >
                      Audience Segments
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={(e) =>
                        navigateToSection(e, "platform", "tab-analytics")
                      }
                      className="nav-item"
                    >
                      Attribution Engine
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <span className="dd-label">CPaaS APIs</span>
                <ul className="sub-menu">
                  <li>
                    <a
                      href="/"
                      onClick={(e) =>
                        navigateToSection(e, "channels", "sms-rcs")
                      }
                      className="nav-item"
                    >
                      SMS & RCS API
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={(e) =>
                        navigateToSection(e, "channels", "whatsapp")
                      }
                      className="nav-item"
                    >
                      WhatsApp API
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={(e) => navigateToSection(e, "channels", "voice")}
                      className="nav-item"
                    >
                      Voice API
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={(e) => navigateToSection(e, "channels", "ai")}
                      className="nav-item"
                    >
                      Conversational AI
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <span className="dd-label">Company</span>
                <ul className="sub-menu">
                  <li>
                    <a
                      href="/"
                      onClick={(e) => navigateToSection(e, "why-messageyard")}
                      className="nav-item"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="nav-item">
                      Customer Stories
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="nav-item">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="nav-item">
                      Contact Sales
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="bottom">
        <div className="left">
          <p className="xs">All rights reserved. 2026 © MessageYard</p>
          <nav role="navigation" aria-label="Legal Links">
            <ul>
              <li>
                <a href="/contact" className="nav-item">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/contact" className="nav-item">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="nav-item">
                  Security
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="right">
          <div className="compliance-badge">
            <span className="dot" />
            <span>SOC 2 Type II</span>
            <span className="sep">·</span>
            <span>HIPAA Ready</span>
            <span className="sep">·</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
