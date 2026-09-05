"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigateToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setMobileOpen(false);

    if (pathname === "/") {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } else {
      try {
        sessionStorage.setItem("scroll_to_section", sectionId);
      } catch {}
      router.push("/");
    }
  };

  return (
    <header id="header">
      <div className="nav-bar">
        <a href="/" className="logo">
          <img
            src="/assets/messageyard-icon.png"
            alt="MessageYard Icon"
            style={{ width: "1.85rem", height: "1.85rem", objectFit: "contain", borderRadius: "4px" }}
          />
          MessageYard
        </a>

        <nav className="main-nav" aria-label="Main Navigation">
          <ul>
            <li className="has-children">
              <span className="dd-label">
                Platform
                <svg viewBox="0 0 10 6" fill="currentColor">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <ul className="sub-menu">
                <li>
                  <a href="/" onClick={(e) => navigateToSection(e, "platform")} className="nav-item">
                    Journey Builder
                  </a>
                </li>
                <li>
                  <a href="/" onClick={(e) => navigateToSection(e, "platform")} className="nav-item">
                    Campaign Manager
                  </a>
                </li>
                <li>
                  <a href="/" onClick={(e) => navigateToSection(e, "platform")} className="nav-item">
                    Audience Segmentation
                  </a>
                </li>
                <li>
                  <a href="/" onClick={(e) => navigateToSection(e, "platform")} className="nav-item">
                    Analytics & Attribution
                  </a>
                </li>
              </ul>
            </li>

            <li className="has-children">
              <span className="dd-label">
                CPaaS APIs
                <svg viewBox="0 0 10 6" fill="currentColor">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <ul className="sub-menu">
                <li>
                  <a href="/" onClick={(e) => navigateToSection(e, "channels")} className="nav-item">
                    SMS & RCS
                  </a>
                </li>
                <li>
                  <a href="/" onClick={(e) => navigateToSection(e, "channels")} className="nav-item">
                    WhatsApp Business
                  </a>
                </li>
                <li>
                  <a href="/" onClick={(e) => navigateToSection(e, "channels")} className="nav-item">
                    Voice API
                  </a>
                </li>
                <li>
                  <a href="/" onClick={(e) => navigateToSection(e, "channels")} className="nav-item">
                    Email API
                  </a>
                </li>
                <li>
                  <a href="/" onClick={(e) => navigateToSection(e, "channels")} className="nav-item">
                    Conversational AI
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <a href="/" onClick={(e) => navigateToSection(e, "why-messageyard")} className="nav-item">
                Why MessageYard
              </a>
            </li>
            <li>
              <a href="/" onClick={(e) => navigateToSection(e, "capabilities")} className="nav-item">
                Capabilities
              </a>
            </li>
            <li>
              <a href="/" onClick={(e) => navigateToSection(e, "resources")} className="nav-item">
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className={`mobile-menu-drawer ${mobileOpen ? "open" : ""}`} id="mobile-drawer">
        <ul>
          <li>
            <a href="/" onClick={(e) => navigateToSection(e, "why-messageyard")}>
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
              Architecture
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
