"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const navigateToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();

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
    <footer id="footer">
      <div className="top">
        <div className="left">
          <a href="/" className="logo">
            <img
              src="/assets/messageyard-icon.png"
              alt="MessageYard Icon"
              style={{
                width: "2rem",
                height: "2rem",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
            MessageYard
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
                      Audience Segments
                    </a>
                  </li>
                  <li>
                    <a href="/" onClick={(e) => navigateToSection(e, "platform")} className="nav-item">
                      Attribution Engine
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <span className="dd-label">CPaaS APIs</span>
                <ul className="sub-menu">
                  <li>
                    <a href="/" onClick={(e) => navigateToSection(e, "channels")} className="nav-item">
                      SMS & RCS API
                    </a>
                  </li>
                  <li>
                    <a href="/" onClick={(e) => navigateToSection(e, "channels")} className="nav-item">
                      WhatsApp API
                    </a>
                  </li>
                  <li>
                    <a href="/" onClick={(e) => navigateToSection(e, "channels")} className="nav-item">
                      Voice API
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
                <span className="dd-label">Company</span>
                <ul className="sub-menu">
                  <li>
                    <a href="/" onClick={(e) => navigateToSection(e, "why-messageyard")} className="nav-item">
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
