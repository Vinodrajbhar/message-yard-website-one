"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigateToSection = (
    e: React.MouseEvent,
    sectionId: string,
    tabOrChannelId?: string,
  ) => {
    e.preventDefault();
    setMobileOpen(false);

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
    <header id="header">
      <div className="nav-bar">
        <a href="/" className="logo" aria-label="MessageYard Home">
          <img
            src="/assets/messageyard-icon.png"
            alt="MessageYard"
            style={{
              width: "clamp(11.5rem, 15vw, 15.5rem)",
              height: "auto",
              maxHeight: "3.25rem",
              objectFit: "contain",
              display: "block",
            }}
          />
        </a>

        <nav className="main-nav" aria-label="Main Navigation">
          <ul>
            <li className="has-children">
              <span className="dd-label">
                Platform
                <svg viewBox="0 0 10 6" fill="currentColor">
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
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
                    Audience Segmentation
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
                    Analytics & Attribution
                  </a>
                </li>
              </ul>
            </li>

            <li className="has-children">
              <span className="dd-label">
                CPaaS APIs
                <svg viewBox="0 0 10 6" fill="currentColor">
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <ul className="sub-menu">
                <li>
                  <a
                    href="/"
                    onClick={(e) => navigateToSection(e, "channels", "sms-rcs")}
                    className="nav-item"
                  >
                    SMS & RCS
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
                    WhatsApp Business
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
                    onClick={(e) => navigateToSection(e, "channels", "email")}
                    className="nav-item"
                  >
                    Email API
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
              <a
                href="/"
                onClick={(e) => navigateToSection(e, "why-messageyard")}
                className="nav-item"
              >
                Why MessageYard
              </a>
            </li>
            <li>
              <a
                href="/"
                onClick={(e) => navigateToSection(e, "capabilities")}
                className="nav-item"
              >
                Capabilities
              </a>
            </li>
            <li>
              <a
                href="/"
                onClick={(e) => navigateToSection(e, "resources")}
                className="nav-item"
              >
                Resources
              </a>
            </li>
          </ul>
        </nav>

        <div className="actions">
          <ul>
            <li>
              <a href="/contact" className="btn-primary">
                Book a Demo
              </a>
            </li>
          </ul>
        </div>

        <button
          className="mobile-toggle"
          id="mobile-toggle"
          aria-label="Toggle Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div
        className={`mobile-menu-drawer ${mobileOpen ? "open" : ""}`}
        id="mobile-drawer"
      >
        <ul>
          <li>
            <a
              href="/"
              onClick={(e) => navigateToSection(e, "why-messageyard")}
            >
              Why MessageYard
            </a>
          </li>
          <li>
            <a href="/" onClick={(e) => navigateToSection(e, "capabilities")}>
              Platform Capabilities
            </a>
          </li>
          <li>
            <a href="/" onClick={(e) => navigateToSection(e, "platform")}>
              Platform Architecture
            </a>
          </li>
          <li style={{ paddingLeft: "1rem", opacity: 0.85 }}>
            <a
              href="/"
              onClick={(e) => navigateToSection(e, "platform", "tab-journeys")}
            >
              ↳ Journey Builder
            </a>
          </li>
          <li style={{ paddingLeft: "1rem", opacity: 0.85 }}>
            <a
              href="/"
              onClick={(e) => navigateToSection(e, "platform", "tab-campaigns")}
            >
              ↳ Campaign Manager
            </a>
          </li>
          <li style={{ paddingLeft: "1rem", opacity: 0.85 }}>
            <a
              href="/"
              onClick={(e) => navigateToSection(e, "platform", "tab-data")}
            >
              ↳ Audience Segmentation
            </a>
          </li>
          <li style={{ paddingLeft: "1rem", opacity: 0.85 }}>
            <a
              href="/"
              onClick={(e) => navigateToSection(e, "platform", "tab-analytics")}
            >
              ↳ Analytics & Attribution
            </a>
          </li>
          <li>
            <a href="/" onClick={(e) => navigateToSection(e, "channels")}>
              CPaaS Channels
            </a>
          </li>
          <li>
            <a href="/" onClick={(e) => navigateToSection(e, "resources")}>
              Resources
            </a>
          </li>
        </ul>
        <div className="mobile-actions">
          <a href="/contact" className="btn-primary">
            Book a Demo
          </a>
        </div>
      </div>
    </header>
  );
}
