"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  RiSparklingLine,
  RiShieldCheckLine,
  RiTeamLine,
  RiPulseLine,
  RiCloseLine,
  RiAlertLine,
} from "@remixicon/react"

/* ── Microsoft logo (4-colour squares) ── */
function MsLogo({ size = 20 }: { size?: number }) {
  const h = size / 2 - 1
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" fill="none">
      <rect x="1"  y="1"  width={h} height={h} fill="#F25022"/>
      <rect x={h + 2} y="1"  width={h} height={h} fill="#7FBA00"/>
      <rect x="1"  y={h + 2} width={h} height={h} fill="#00A4EF"/>
      <rect x={h + 2} y={h + 2} width={h} height={h} fill="#FFB900"/>
    </svg>
  )
}

/* ── Gradient X brand mark ── */
function XLogo({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="xg" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#5E6AD2"/>
          <stop offset="50%"  stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#EC4899"/>
        </linearGradient>
      </defs>
      <text
        x="4" y="46"
        fontFamily="'Inter Tight', system-ui, sans-serif"
        fontWeight="700"
        fontSize="52"
        fill="url(#xg)"
      >
        X
      </text>
    </svg>
  )
}

const FEATURES = [
  { icon: RiShieldCheckLine, label: "Secure access" },
  { icon: RiTeamLine,        label: "Team collaboration" },
  { icon: RiPulseLine,       label: "Real-time tracking" },
]

const STATS = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7",  label: "Ops coverage" },
  { value: "<2 min",label: "Alert MTTR" },
]

export default function LoginPage() {
  const router = useRouter()
  const [showExpired, setShowExpired] = useState(true)

  function handleSSO(provider: string) {
    sessionStorage.setItem("xs:auth:provider", provider)
    router.push("/organizations")
  }

  return (
    /* ── Viewport wrapper with animated gradient bg ── */
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Vibrant background gradient */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 90% 100% at 10% 60%, rgba(94,106,210,.55), transparent 55%),
            radial-gradient(ellipse 70%  90% at 90% 10%, rgba(168,85,247,.40), transparent 55%),
            radial-gradient(ellipse 60%  70% at 75% 85%, rgba(236,72,153,.30), transparent 55%),
            radial-gradient(ellipse 50%  50% at 50% 50%, rgba(8,9,10,1),       transparent 80%)
          `,
        }}
      />

      {/* ── Two-panel card ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: 960,
          width: "100%",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06)",
        }}
      >
        {/* ══ LEFT — hero / marketing ══ */}
        <div
          style={{
            background: "linear-gradient(160deg, rgba(18,19,22,.97) 0%, rgba(12,13,15,.99) 100%)",
            borderRight: "1px solid rgba(255,255,255,.06)",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,.07)",
              border: "1px solid rgba(255,255,255,.10)",
              width: "fit-content",
              marginBottom: 40,
            }}
          >
            <RiSparklingLine size={12} style={{ color: "var(--gold)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "var(--txt-2)",
              }}
            >
              Modern Service Management
            </span>
          </div>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <XLogo size={56} />
            <span
              style={{
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-.03em",
                color: "var(--txt)",
                lineHeight: 1,
              }}
            >
              SERVICE
            </span>
          </div>

          <p
            style={{
              fontSize: 18,
              fontStyle: "italic",
              color: "var(--txt-3)",
              margin: "0 0 28px",
              letterSpacing: "-.01em",
              fontWeight: 400,
            }}
          >
            IT Service Management
          </p>

          <p
            style={{
              fontSize: 13.5,
              color: "var(--txt-3)",
              lineHeight: 1.65,
              margin: "0 0 auto",
              maxWidth: 340,
            }}
          >
            Orchestrate incidents, changes, assets, and knowledge with a unified
            service desk built for modern teams.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: 32,
              marginTop: 48,
              paddingTop: 28,
              borderTop: "1px solid rgba(255,255,255,.07)",
            }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: "-.03em",
                    color: "var(--txt)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "var(--txt-4)",
                    marginTop: 5,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT — login form ══ */}
        <div
          style={{
            background: "rgba(23,24,28,.98)",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sub-header */}
          <p
            style={{
              fontSize: 13,
              color: "var(--txt-3)",
              margin: "0 0 24px",
              lineHeight: 1.55,
            }}
          >
            Sign in to manage and monitor your ITSM workflows.
          </p>

          {/* Session-expired alert */}
          {showExpired && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "11px 13px",
                borderRadius: 8,
                background: "rgba(242,153,74,.08)",
                border: "1px solid rgba(242,153,74,.28)",
                marginBottom: 20,
              }}
            >
              <RiAlertLine size={14} style={{ color: "var(--amber)", flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12.5, color: "var(--txt-2)", lineHeight: 1.55, flex: 1 }}>
                Your session has expired. Please sign in again to continue.
              </span>
              <button
                type="button"
                onClick={() => setShowExpired(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt-4)", padding: 0, flexShrink: 0 }}
              >
                <RiCloseLine size={14} />
              </button>
            </div>
          )}

          {/* Primary SSO — Microsoft */}
          <button
            type="button"
            onClick={() => handleSSO("microsoft")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              width: "100%",
              padding: "13px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.12)",
              color: "var(--txt)",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all .18s",
              letterSpacing: "-.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.10)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.06)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"
            }}
          >
            <MsLogo size={20} />
            Continue with Microsoft
          </button>

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
            {FEATURES.map((f) => (
              <div
                key={f.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "var(--bg-4)",
                  border: "1px solid var(--line-3)",
                  fontSize: 12,
                  color: "var(--txt-2)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--gold)",
                    boxShadow: "0 0 6px var(--gold)",
                    flexShrink: 0,
                  }}
                />
                {f.label}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 32,
              fontSize: 12.5,
              color: "var(--txt-3)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            No account yet?{" "}
            <a
              href="#"
              style={{
                color: "var(--gold)",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Request access
            </a>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 28px",
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: "var(--txt-4)",
          letterSpacing: ".06em",
        }}
      >
        <div>xService · Onyx &amp; Gold v1.0</div>
        <div style={{ display: "flex", gap: 18 }}>
          {["Status", "Security", "Terms", "Privacy"].map((l) => (
            <a key={l} href="#" style={{ color: "var(--txt-4)" }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
