"use client";

import React, { useState, useEffect, useRef } from "react";

interface R2VideoPlayerProps {
  /**
   * The object key path inside your Cloudflare R2 bucket (e.g. "videos/platform-demo.mp4")
   */
  videoKey: string;
  /**
   * Delivery mode:
   * - "signed-url": fetches a secure time-limited presigned URL from R2 (Recommended for private buckets)
   * - "stream": streams through the Next.js API route with HTTP Range byte-scrubbing
   */
  mode?: "signed-url" | "stream";
  /**
   * Optional poster image URL or path
   */
  posterUrl?: string;
  /**
   * Optional title banner displayed above the video
   */
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  className?: string;
}

export default function R2VideoPlayer({
  videoKey,
  mode = "signed-url",
  posterUrl,
  title,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  playsInline = true,
  className = "",
}: R2VideoPlayerProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(mode === "signed-url");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mode === "stream") {
      setVideoSrc(`/api/r2/video?key=${encodeURIComponent(videoKey)}`);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function fetchSignedUrl() {
      try {
        const res = await fetch(`/api/r2/signed-url?key=${encodeURIComponent(videoKey)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load video signed URL from Cloudflare R2.");
        }

        if (isMounted) {
          setVideoSrc(data.url);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Could not retrieve Cloudflare R2 video.");
          setLoading(false);
        }
      }
    }

    fetchSignedUrl();

    return () => {
      isMounted = false;
    };
  }, [videoKey, mode]);

  return (
    <div
      className={`r2-video-player-container ${className}`}
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#070b14",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 48px rgba(0, 0, 0, 0.35)",
        width: "100%",
        maxWidth: "960px",
        marginInline: "auto",
      }}
    >
      {/* Optional Title Bar */}
      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 1.25rem",
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#38bdf8",
                boxShadow: "0 0 8px #38bdf8",
              }}
            />
            <span
              style={{
                fontSize: "0.825rem",
                fontWeight: 600,
                color: "#e2e8f0",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </span>
          </div>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: "rgba(56, 189, 248, 0.12)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.25)",
            }}
          >
            Cloudflare R2 CDN
          </span>
        </div>
      )}

      {/* Video Content & States */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              backgroundColor: "#070b14",
              color: "#94a3b8",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                border: "3px solid rgba(56, 189, 248, 0.15)",
                borderTopColor: "#38bdf8",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
              Connecting to Cloudflare R2...
            </span>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              maxWidth: "480px",
              color: "#f87171",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              style={{ margin: "0 auto 0.75rem", display: "block" }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h4 style={{ color: "#f1f5f9", margin: "0 0 0.5rem", fontSize: "1rem" }}>
              Cloudflare R2 Configuration Notice
            </h4>
            <p style={{ fontSize: "0.825rem", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
              {error}
            </p>
            <div
              style={{
                marginTop: "1rem",
                padding: "0.5rem 0.75rem",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                borderRadius: "6px",
                fontSize: "0.75rem",
                color: "#64748b",
                fontFamily: "monospace",
              }}
            >
              Set CLOUDFLARE_R2_* credentials in .env.local
            </div>
          </div>
        )}

        {videoSrc && !error && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterUrl}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline={playsInline}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
      </div>
    </div>
  );
}
