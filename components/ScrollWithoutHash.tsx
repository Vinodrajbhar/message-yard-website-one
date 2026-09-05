"use client";

import { useEffect } from "react";

export default function ScrollWithoutHash() {
  useEffect(() => {
    // 1. Check if we have a pending section from page-to-page navigation
    try {
      const pendingSection = sessionStorage.getItem("scroll_to_section");
      if (pendingSection) {
        sessionStorage.removeItem("scroll_to_section");
        const target = document.getElementById(pendingSection);
        if (target) {
          setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 200);
        }
      }
    } catch {}

    // 2. Clean up any existing hash in the URL on mount or hashchange
    const cleanHash = () => {
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        if (targetId) {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            setTimeout(() => {
              targetEl.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }
        }
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };

    cleanHash();
    window.addEventListener("hashchange", cleanHash);

    // 3. Intercept click on any anchor element with # or /#
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") || (href.startsWith("/#") && window.location.pathname === "/")) {
        e.preventDefault();
        const hashIdx = href.indexOf("#");
        const targetId = href.substring(hashIdx + 1);

        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });

    return () => {
      window.removeEventListener("hashchange", cleanHash);
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  return null;
}
