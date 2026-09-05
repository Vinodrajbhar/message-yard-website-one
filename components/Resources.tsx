"use client";

import React from "react";
import { motion } from "motion/react";

const ARTICLES = [
  {
    date: "Aug 24, 2026",
    category: "Architecture",
    title: "Why Owning the CPaaS Layer Changes Email and SMS Deliverability",
    desc: "How direct carrier connections bypass reseller aggregation bottlenecks and eliminate support hops during peak flash sales.",
  },
  {
    date: "Aug 18, 2026",
    category: "Product",
    title: "RCS vs. WhatsApp vs. SMS: When to Use Each Channel in 2026",
    desc: "A tactical guide to conversion rates, carrier verification rules, and automated fallback routing across global markets.",
  },
  {
    date: "Aug 11, 2026",
    category: "Engineering",
    title: "Building Sub-Millisecond Multi-Touch Revenue Attribution",
    desc: "The technical blueprint behind streaming customer click events into real-time Snowflake and BigQuery data pipelines.",
  },
];

export default function Resources() {
  return (
    <section className="featured-articles" id="resources">
      <div className="articles-wrapper">
        <div className="articles-header">
          <motion.span
            className="text-tag"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Knowledge Base
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Engineering &amp; Marketing Perspectives
          </motion.h3>
        </div>

        <div className="articles-grid">
          {ARTICLES.map((art, idx) => (
            <motion.div
              key={art.title}
              className="article-card"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -4,
                boxShadow: "0 12px 28px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 },
              }}
            >
              <div>
                <div className="article-meta">
                  <span>{art.date}</span>
                  <span>·</span>
                  <span>{art.category}</span>
                </div>
                <h4>{art.title}</h4>
                <p>{art.desc}</p>
              </div>
              <span className="article-arrow">
                Read Article
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
