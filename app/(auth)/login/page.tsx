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
      <text x="4" y="46" fontFamily="'Inter Tight', system-ui, sans-serif" fontWeight="700" fontSize="52" fill="url(#xg)">X</text>
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
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: "24px 20px",
      position: "relative",
      overflow: "hidden",
      background: "var(--bg)",
    }}>
      {/* Vibrant ambient gradient */}
      <div aria-hidden style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: `
          radial-gradient(ellipse 90% 100% at 10% 60%, rgba(94,106,210,.45), transparent 55%),
          radial-gradient(ellipse 70%  90% at 90% 10%, rgba(139,92,246,.32), transparent 55%),
          radial-gradient(ellipse 60%  70% at 75% 85%, rgba(236,72,153,.22), transparent 55%),
          radial-gradient(ellipse 50%  50% at 50% 50%, var(--bg),            transparent 80%)
        `,
      }}/>

      {/* Two-panel card */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        maxWidth: 940,
        width: "100%",
        borderRadius: "var(--radius-3xl)",
        overflow: "hidden",
        border: "1px solid var(--line-2)",
        boxShadow: "0 40px 80px -20px rgba(0,0,0,.8), 0 0 0 1px var(--line)",
      }}>

        {/* ── LEFT hero ── */}
        <div style={{
          background: "linear-gradient(160deg, var(--bg-1) 0%, var(--bg) 100%)",
          borderRight: "1px solid var(--line-2)",
          padding: "48px 44px",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 12px",
            borderRadius: "var(--radius-4xl)",
            background: "var(--bg-3)",
            border: "1px solid var(--line-3)",
            width: "fit-content",
            marginBottom: 40,
          }}>
            <RiSparklingLine size={12} style={{ color: "var(--gold)" }} />
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "var(--txt-3)",
            }}>Modern Service Management</span>
          </div>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
            <XLogo size={56} />
            <span style={{
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-.03em",
              color: "var(--txt)",
              lineHeight: 1,
            }}>SERVICE</span>
          </div>

          <p style={{
            fontSize: 17,
            fontStyle: "italic",
            color: "var(--txt-3)",
            margin: "0 0 28px",
            letterSpacing: "-.01em",
            fontWeight: 400,
          }}>IT Service Management</p>

          <p style={{
            fontSize: 13.5,
            color: "var(--txt-3)",
            lineHeight: 1.65,
            margin: "0 0 auto",
            maxWidth: 340,
          }}>
            Orchestrate incidents, changes, assets, and knowledge with a unified
            service desk built for modern teams.
          </p>

          {/* Stats strip */}
          <div style={{
            display: "flex",
            gap: 32,
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid var(--line-2)",
          }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div style={{
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "-.03em",
                  color: "var(--txt)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}>{s.value}</div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "var(--txt-4)",
                  marginTop: 5,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT form ── */}
        <div style={{
          background: "var(--bg-2)",
          padding: "48px 44px",
          display: "flex",
          flexDirection: "column",
        }}>
          <p style={{
            fontSize: 13,
            color: "var(--txt-3)",
            margin: "0 0 24px",
            lineHeight: 1.55,
          }}>Sign in to manage and monitor your ITSM workflows.</p>

          {/* Session-expired alert */}
          {showExpired && (
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "11px 13px",
              borderRadius: "var(--radius)",
              background: "rgba(242,153,74,.07)",
              border: "1px solid rgba(242,153,74,.22)",
              marginBottom: 20,
            }}>
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

          {/* Microsoft SSO */}
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
              borderRadius: "var(--radius)",
              background: "linear-gradient(180deg, var(--gold-3) 0%, var(--gold) 55%, var(--gold-2) 100%)",
              color: "var(--gold-ink)",
              border: "1px solid var(--gold-2)",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              letterSpacing: "-.01em",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.3)",
              transition: "box-shadow .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.3), 0 0 0 4px var(--gold-glow)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.3)"
            }}
          >
            <MsLogo size={20} />
            Continue with Microsoft
          </button>

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
            {FEATURES.map((f) => (
              <div key={f.label} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 12px",
                borderRadius: "var(--radius-4xl)",
                background: "var(--bg-3)",
                border: "1px solid var(--line-2)",
                fontSize: 12,
                color: "var(--txt-3)",
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--gold)",
                  boxShadow: "0 0 6px var(--gold-glow)",
                  flexShrink: 0,
                }}/>
                {f.label}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: "auto",
            paddingTop: 32,
            fontSize: 12.5,
            color: "var(--txt-4)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            No account yet?{" "}
            <a href="#" style={{ color: "var(--gold)", fontWeight: 500, textDecoration: "none" }}>
              Request access
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
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
        color: "var(--txt-5)",
        letterSpacing: ".06em",
      }}>
        <div>xService · Onyx &amp; Gold v1.0</div>
        <div style={{ display: "flex", gap: 18 }}>
          {["Status", "Security", "Terms", "Privacy"].map((l) => (
            <a key={l} href="#" style={{ color: "var(--txt-5)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
