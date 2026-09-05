"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function WhyMessageYard() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Gentle scroll parallax matching the original 20px delta
  const translateY = useTransform(scrollYProgress, [0, 1], [25, -25]);

  return (
    <section ref={sectionRef} className="centered-text" id="why-messageyard">
      <motion.div
        className="container"
        style={{ y: translateY }}
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          className="tag-label"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Two Products · One Platform
        </motion.span>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Built for marketers. Trusted by engineers.
        </motion.h3>
        <motion.p
          className="narrative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Most marketing clouds sit on top of someone else's messaging infrastructure — which means every deliverability
          issue, rate limit, and compliance question becomes a third-party ticket. MessageYard owns the CPaaS layer
          end-to-end. Marketers build in a visual, no-code console; engineers extend with real, documented APIs.
        </motion.p>
      </motion.div>
    </section>
  );
}
