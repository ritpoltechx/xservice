"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiLogoutBoxRLine } from "@remixicon/react"

const STYLES = `
  @keyframes preloader-bg-in {
    from { opacity: 0 }
    to   { opacity: 1 }
  }
  @keyframes logo-draw {
    from { stroke-dashoffset: 400; opacity: 0 }
    to   { stroke-dashoffset: 0;   opacity: 1 }
  }
  @keyframes logo-fill {
    from { fill-opacity: 0 }
    to   { fill-opacity: 1 }
  }
  @keyframes logo-pulse {
    0%, 100% { transform: scale(1);    filter: drop-shadow(0 0  8px rgba(227,179,65,.4)) }
    50%       { transform: scale(1.08); filter: drop-shadow(0 0 20px rgba(227,179,65,.7)) }
  }
  @keyframes preloader-out {
    0%   { opacity: 1; transform: scale(1) }
    80%  { opacity: 1; transform: scale(1.03) }
    100% { opacity: 0; transform: scale(1.05); pointer-events: none }
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(16px) scale(.98) }
    to   { opacity: 1; transform: translateY(0)    scale(1) }
  }
  @keyframes item-in {
    from { opacity: 0; transform: translateY(8px) }
    to   { opacity: 1; transform: translateY(0) }
  }
  @keyframes progress-fill {
    from { width: 0% }
    to   { width: 100% }
  }
`

function XLogo({ size = 72, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none"
      style={animated ? { animation: "logo-pulse .9s ease-in-out 1.1s 2" } : undefined}>
      <defs>
        <linearGradient id="xg-pre" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#5E6AD2"/>
          <stop offset="50%"  stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#EC4899"/>
        </linearGradient>
      </defs>
      {animated ? (
        <text x="4" y="46" fontFamily="'Inter Tight', system-ui, sans-serif" fontWeight="700" fontSize="52"
          fill="url(#xg-pre)" stroke="url(#xg-pre)" strokeWidth="1" strokeDasharray="400"
          style={{ animation: "logo-draw .55s cubic-bezier(.4,0,.2,1) .2s both, logo-fill .35s ease .72s both" }}
        >X</text>
      ) : (
        <text x="4" y="46" fontFamily="'Inter Tight', system-ui, sans-serif" fontWeight="700" fontSize="52"
          fill="url(#xg-pre)"
        >X</text>
      )}
    </svg>
  )
}

const ORGS = [
  { value: "scbtechx",  label: "SCB TechX" },
  { value: "datax",     label: "DataX" },
  { value: "scbxgroup", label: "SCBx Group" },
]

const PRELOAD_MS = 2600

export default function OrganizationsPage() {
  const router = useRouter()
  const [selected, setSelected]     = useState("scbtechx")
  const [preloading, setPreloading] = useState(true)
  const [exiting, setExiting]       = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), PRELOAD_MS - 400)
    const doneTimer = setTimeout(() => setPreloading(false), PRELOAD_MS)
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer) }
  }, [])

  function confirm() {
    sessionStorage.setItem("xs:workspace", selected)
    router.push("/dashboard")
  }

  return (
    <>
      <style>{STYLES}</style>

      <div style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg)",
      }}>
        {/* Ambient gradient — same palette as login, slightly softer */}
        <div aria-hidden style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 90% 100% at 10% 60%, rgba(94,106,210,.40), transparent 55%),
            radial-gradient(ellipse 70%  90% at 90% 10%, rgba(139,92,246,.28), transparent 55%),
            radial-gradient(ellipse 60%  70% at 75% 85%, rgba(236,72,153,.18), transparent 55%),
            radial-gradient(ellipse 50%  50% at 50% 50%, var(--bg),            transparent 80%)
          `,
        }}/>

        {/* ── Preloader ── */}
        {preloading && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            background: "var(--bg)",
            animation: exiting
              ? "preloader-out .42s cubic-bezier(.4,0,1,1) forwards"
              : "preloader-bg-in .3s ease forwards",
          }}>
            <div aria-hidden style={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(227,179,65,.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}/>

            <XLogo size={72} animated />

            {/* Loading bar */}
            <div style={{
              width: 120,
              height: 2,
              borderRadius: 999,
              background: "var(--line-2)",
              overflow: "hidden",
              marginTop: 8,
            }}>
              <div style={{
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, var(--blue), #8B5CF6, var(--gold))",
                animation: `progress-fill ${PRELOAD_MS - 400}ms cubic-bezier(.4,0,.6,1) .3s forwards`,
              }}/>
            </div>

            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "var(--txt-5)",
              animation: "item-in .4s ease .5s both",
            }}>xService</span>
          </div>
        )}

        {/* ── Card ── */}
        <div style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 360,
          background: "var(--bg-2)",
          border: "1px solid var(--line-2)",
          borderRadius: "var(--radius-lg)",
          padding: "36px 32px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 32px 64px -16px rgba(0,0,0,.6), 0 0 0 1px var(--line)",
          animation: preloading ? "none" : "card-in .45s cubic-bezier(.2,0,0,1) forwards",
          opacity: preloading ? 0 : undefined,
        }}>
          {/* Brand */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 24,
            animation: preloading ? "none" : "item-in .4s ease .05s both",
          }}>
            <XLogo size={28} />
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--txt-3)",
              fontWeight: 500,
            }}>SERVICE</span>
          </div>

          {/* Full name */}
          <p style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-.01em",
            color: "var(--txt)",
            margin: "0 0 4px",
            textAlign: "center",
            animation: preloading ? "none" : "item-in .4s ease .10s both",
          }}>Ritpol Wongtaweesinkha</p>

          {/* Prompt */}
          <p style={{
            fontSize: 13,
            color: "var(--txt-3)",
            margin: "0 0 22px",
            textAlign: "center",
            lineHeight: 1.5,
            animation: preloading ? "none" : "item-in .4s ease .16s both",
          }}>Select your organization to continue</p>

          {/* Dropdown */}
          <div style={{
            position: "relative",
            width: "100%",
            marginBottom: 12,
            animation: preloading ? "none" : "item-in .4s ease .22s both",
          }}>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                width: "100%",
                font: "500 13.5px 'Inter Tight', sans-serif",
                padding: "11px 36px 11px 13px",
                border: "1px solid var(--line-2)",
                background: "var(--bg-3)",
                color: "var(--txt)",
                borderRadius: "var(--radius)",
                outline: "none",
                cursor: "pointer",
                transition: "border-color .15s, box-shadow .15s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)"
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--gold-glow-soft)"
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--line-2)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              {ORGS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "var(--bg-3)" }}>
                  {o.label}
                </option>
              ))}
            </select>
            <svg
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--txt-4)", pointerEvents: "none" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          {/* Confirm — gold CTA matching Onyx system */}
          <button
            type="button"
            onClick={confirm}
            style={{
              width: "100%",
              font: "600 13.5px 'Inter Tight', sans-serif",
              padding: "11px",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              background: "linear-gradient(180deg, var(--gold-3) 0%, var(--gold) 55%, var(--gold-2) 100%)",
              color: "var(--gold-ink)",
              border: "1px solid var(--gold-2)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.3)",
              marginBottom: 8,
              transition: "box-shadow .15s",
              animation: preloading ? "none" : "item-in .4s ease .28s both",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.3), 0 0 0 4px var(--gold-glow)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.3)"
            }}
          >
            Confirm
          </button>

          {/* Sign out */}
          <button
            type="button"
            onClick={() => router.push("/login")}
            style={{
              width: "100%",
              font: "500 13px 'Inter Tight', sans-serif",
              padding: "10px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--line-2)",
              background: "transparent",
              color: "var(--txt-4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              transition: "background .15s, border-color .15s, color .15s",
              animation: preloading ? "none" : "item-in .4s ease .32s both",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-3)"
              e.currentTarget.style.borderColor = "var(--line-3)"
              e.currentTarget.style.color = "var(--txt)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.borderColor = "var(--line-2)"
              e.currentTarget.style.color = "var(--txt-4)"
            }}
          >
            <RiLogoutBoxRLine size={13} />
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}
