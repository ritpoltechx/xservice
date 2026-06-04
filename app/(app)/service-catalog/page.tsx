"use client"

import { useState } from "react"
import {
  RiApps2Line,
  RiAddLine,
  RiSearchLine,
  RiArrowRightLine,
  RiTimeLine,
  RiTeamLine,
  RiShieldCheckLine,
  RiComputerLine,
  RiGlobalLine,
  RiServerLine,
  RiHeadphoneLine,
  RiKeyLine,
  RiWifiLine,
  RiPrinterLine,
  RiSmartphoneLine,
  RiDatabase2Line,
  RiCloudLine,
  RiMailLine,
  RiLockLine,
  RiUserAddLine,
  RiFileTextLine,
  RiToolsLine,
  RiCheckboxCircleLine,
} from "@remixicon/react"
import type { RemixiconComponentType } from "@remixicon/react"

/* ── Types ── */
type Category = "All" | "IT Support" | "Access & Identity" | "Hardware" | "Software" | "Infrastructure" | "Security"
type SlaLevel = "4h" | "8h" | "1d" | "3d" | "5d"

interface CatalogItem {
  id: string
  title: string
  description: string
  category: Exclude<Category, "All">
  icon: RemixiconComponentType
  sla: SlaLevel
  owner: string
  popular?: boolean
  new?: boolean
  requestCount: number
}

/* ── Data ── */
const ITEMS: CatalogItem[] = [
  {
    id: "SR-001", title: "IT Help & Support",
    description: "General IT support for hardware, software, and connectivity issues.",
    category: "IT Support", icon: RiHeadphoneLine, sla: "4h", owner: "IT Helpdesk",
    popular: true, requestCount: 342,
  },
  {
    id: "SR-002", title: "Software Installation",
    description: "Request installation or licensing of approved business software.",
    category: "Software", icon: RiComputerLine, sla: "8h", owner: "IT Helpdesk",
    popular: true, requestCount: 218,
  },
  {
    id: "SR-003", title: "New User Account",
    description: "Provision a new Active Directory and Microsoft 365 account for onboarding.",
    category: "Access & Identity", icon: RiUserAddLine, sla: "4h", owner: "IAM Team",
    popular: true, requestCount: 195,
  },
  {
    id: "SR-004", title: "Access Request",
    description: "Request access to systems, applications, shared drives, or distribution lists.",
    category: "Access & Identity", icon: RiKeyLine, sla: "8h", owner: "IAM Team",
    requestCount: 287,
  },
  {
    id: "SR-005", title: "VPN & Remote Access",
    description: "Set up or troubleshoot VPN connectivity for remote work.",
    category: "Access & Identity", icon: RiWifiLine, sla: "4h", owner: "Network Ops",
    requestCount: 134,
  },
  {
    id: "SR-006", title: "Laptop / Desktop Provision",
    description: "Request a new or replacement laptop or desktop for a team member.",
    category: "Hardware", icon: RiComputerLine, sla: "3d", owner: "IT Helpdesk",
    requestCount: 89,
  },
  {
    id: "SR-007", title: "Mobile Device Setup",
    description: "Enroll or configure a corporate mobile device including MDM and email profile.",
    category: "Hardware", icon: RiSmartphoneLine, sla: "1d", owner: "IT Helpdesk",
    requestCount: 67,
  },
  {
    id: "SR-008", title: "Printer & Peripherals",
    description: "Configure printers, monitors, keyboards, or other peripherals.",
    category: "Hardware", icon: RiPrinterLine, sla: "1d", owner: "IT Helpdesk",
    requestCount: 43,
  },
  {
    id: "SR-009", title: "Server Provisioning",
    description: "Request a new VM or physical server with specified specs in datacenter or cloud.",
    category: "Infrastructure", icon: RiServerLine, sla: "3d", owner: "Infra Team",
    requestCount: 31,
  },
  {
    id: "SR-010", title: "Database Access",
    description: "Request read/write access to a managed database instance.",
    category: "Infrastructure", icon: RiDatabase2Line, sla: "1d", owner: "DBA Team",
    requestCount: 55,
  },
  {
    id: "SR-011", title: "Cloud Resource Request",
    description: "Provision cloud resources (AWS, Azure, GCP) within approved policy limits.",
    category: "Infrastructure", icon: RiCloudLine, sla: "1d", owner: "Cloud Ops",
    new: true, requestCount: 28,
  },
  {
    id: "SR-012", title: "Email & Calendar",
    description: "Mailbox creation, distribution list management, or calendar sharing.",
    category: "Software", icon: RiMailLine, sla: "4h", owner: "IT Helpdesk",
    requestCount: 112,
  },
  {
    id: "SR-013", title: "Security Incident Report",
    description: "Report a suspected phishing, malware, data breach, or policy violation.",
    category: "Security", icon: RiShieldCheckLine, sla: "4h", owner: "SOC Team",
    requestCount: 76,
  },
  {
    id: "SR-014", title: "Password & MFA Reset",
    description: "Reset a forgotten password or re-enroll multi-factor authentication.",
    category: "Security", icon: RiLockLine, sla: "4h", owner: "IAM Team",
    popular: true, requestCount: 401,
  },
  {
    id: "SR-015", title: "Policy Exception Request",
    description: "Apply for a time-limited exception to an IT security or compliance policy.",
    category: "Security", icon: RiFileTextLine, sla: "3d", owner: "CISO Office",
    requestCount: 19,
  },
  {
    id: "SR-016", title: "Network & Firewall Change",
    description: "Request a firewall rule change, VLAN, or DNS configuration.",
    category: "Infrastructure", icon: RiGlobalLine, sla: "3d", owner: "Network Ops",
    requestCount: 24,
  },
  {
    id: "SR-017", title: "IT Equipment Repair",
    description: "Log a repair request for damaged or malfunctioning IT equipment.",
    category: "Hardware", icon: RiToolsLine, sla: "1d", owner: "IT Helpdesk",
    requestCount: 37,
  },
  {
    id: "SR-018", title: "Offboarding & Account Removal",
    description: "Deactivate accounts and recover assets for departing team members.",
    category: "Access & Identity", icon: RiTeamLine, sla: "4h", owner: "IAM Team",
    requestCount: 58,
  },
]

const CATEGORIES: Category[] = [
  "All", "IT Support", "Access & Identity", "Hardware", "Software", "Infrastructure", "Security",
]

const SLA_COLOR: Record<SlaLevel, string> = {
  "4h": "var(--green)",
  "8h": "var(--green)",
  "1d": "var(--gold)",
  "3d": "var(--amber)",
  "5d": "var(--txt-3)",
}

const CAT_ICON: Record<Exclude<Category, "All">, RemixiconComponentType> = {
  "IT Support":        RiHeadphoneLine,
  "Access & Identity": RiKeyLine,
  "Hardware":          RiComputerLine,
  "Software":          RiComputerLine,
  "Infrastructure":    RiServerLine,
  "Security":          RiShieldCheckLine,
}

const CAT_COLOR: Record<Exclude<Category, "All">, string> = {
  "IT Support":        "var(--blue)",
  "Access & Identity": "var(--gold)",
  "Hardware":          "var(--txt-3)",
  "Software":          "#8B5CF6",
  "Infrastructure":    "var(--green)",
  "Security":          "var(--red)",
}

/* ── Sub-components ── */
function SlaTag({ sla }: { sla: SlaLevel }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 10.5, fontFamily: "var(--font-mono)", fontWeight: 600,
      color: SLA_COLOR[sla], letterSpacing: ".04em",
    }}>
      <RiTimeLine size={10} />
      {sla}
    </span>
  )
}

function CatalogCard({ item, onRequest }: { item: CatalogItem; onRequest: (id: string) => void }) {
  const [hov, setHov] = useState(false)
  const Icon = item.icon

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column",
        padding: "20px", borderRadius: 10,
        background: hov ? "var(--bg-3)" : "var(--bg-2)",
        border: `1px solid ${hov ? "var(--line-3)" : "var(--line-2)"}`,
        transition: "background .15s, border-color .15s",
        cursor: "default", position: "relative",
      }}
    >
      {/* Badges */}
      <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 5 }}>
        {item.new && (
          <span style={{
            fontSize: 9.5, fontWeight: 700, fontFamily: "var(--font-mono)",
            letterSpacing: ".1em", padding: "2px 7px", borderRadius: 999,
            background: "rgba(94,106,210,.15)", color: "var(--blue)",
            border: "1px solid rgba(94,106,210,.3)", textTransform: "uppercase",
          }}>NEW</span>
        )}
        {item.popular && (
          <span style={{
            fontSize: 9.5, fontWeight: 700, fontFamily: "var(--font-mono)",
            letterSpacing: ".1em", padding: "2px 7px", borderRadius: 999,
            background: "rgba(227,179,65,.12)", color: "var(--gold)",
            border: "1px solid rgba(227,179,65,.25)", textTransform: "uppercase",
          }}>Popular</span>
        )}
      </div>

      {/* Icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 9, marginBottom: 14, flexShrink: 0,
        background: "var(--bg-4)", border: "1px solid var(--line-2)",
        display: "grid", placeItems: "center",
      }}>
        <Icon size={18} style={{ color: "var(--txt-3)" }} />
      </div>

      {/* Title + description */}
      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em", marginBottom: 5 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--txt-4)", lineHeight: 1.55, flex: 1, marginBottom: 16 }}>
        {item.description}
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SlaTag sla={item.sla} />
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--line-4)" }}/>
          <span style={{ fontSize: 11, color: "var(--txt-5)", fontFamily: "var(--font-mono)" }}>
            {item.requestCount} requests
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--txt-5)", fontFamily: "var(--font-mono)" }}>
          {item.owner}
        </span>
      </div>

      {/* Request button */}
      <button
        type="button"
        onClick={() => onRequest(item.id)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "8px", borderRadius: "var(--radius)",
          background: hov
            ? "linear-gradient(180deg, var(--gold-3) 0%, var(--gold) 55%, var(--gold-2) 100%)"
            : "var(--bg-4)",
          color: hov ? "var(--gold-ink)" : "var(--txt-3)",
          border: `1px solid ${hov ? "var(--gold-2)" : "var(--line-3)"}`,
          fontSize: 12.5, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
          boxShadow: hov ? "inset 0 1px 0 rgba(255,255,255,.3), 0 0 0 3px var(--gold-glow)" : "none",
          transition: "all .15s",
        }}
      >
        Request
        <RiArrowRightLine size={13} />
      </button>
    </div>
  )
}

/* ── Page ── */
export default function ServiceCatalogPage() {
  const [search, setSearch]         = useState("")
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  const [requestedId, setRequestedId]       = useState<string | null>(null)

  const filtered = ITEMS.filter((item) => {
    const matchCat    = activeCategory === "All" || item.category === activeCategory
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                        item.description.toLowerCase().includes(search.toLowerCase()) ||
                        item.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const popular = ITEMS.filter((i) => i.popular)

  const catCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === "All"
      ? ITEMS.length
      : ITEMS.filter((i) => i.category === cat).length
    return acc
  }, {})

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
      <main style={{ flex: 1, padding: "28px 36px 56px", display: "flex", flexDirection: "column" }}>

        {/* ── Breadcrumb ── */}
        <nav className="crumb">
          <a href="#">Service Desk</a>
          <span className="sep">/</span>
          <span className="cur">Service Catalog</span>
        </nav>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: 18, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.022em", margin: 0, color: "var(--txt)" }}>
                Service Catalog
              </h1>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(227,179,65,.10)", border: "1px solid rgba(227,179,65,.22)",
                display: "grid", placeItems: "center",
              }}>
                <RiApps2Line size={16} style={{ color: "var(--gold)" }} />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--txt-3)", lineHeight: 1.55 }}>
              Browse available services and submit a request — most requests are fulfilled within the SLA window shown.
            </p>
          </div>
          <button
            type="button"
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 16px", borderRadius: "var(--radius)",
              background: "linear-gradient(180deg, var(--gold-3) 0%, var(--gold) 55%, var(--gold-2) 100%)",
              color: "var(--gold-ink)", border: "1px solid var(--gold-2)",
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.25)",
              transition: "box-shadow .15s", whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.25), 0 0 0 3px var(--gold-glow)" }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.25)" }}
          >
            <RiAddLine size={14} />
            Suggest a service
          </button>
        </div>

        {/* ── Popular strip (only when no search/filter active) ── */}
        {search === "" && activeCategory === "All" && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--txt-3)", letterSpacing: ".04em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Most requested
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--line-2)" }}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {popular.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRequestedId(item.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 14px", borderRadius: 8, textAlign: "left",
                      background: "var(--bg-2)", border: "1px solid var(--line-2)",
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "background .12s, border-color .12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.borderColor = "var(--line-3)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.borderColor = "var(--line-2)" }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                      background: "var(--bg-4)", border: "1px solid var(--line-2)",
                      display: "grid", placeItems: "center",
                    }}>
                      <Icon size={15} style={{ color: "var(--txt-3)" }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--txt)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--txt-5)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                        SLA {item.sla}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Search + filter bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 360,
            background: "var(--bg-2)", border: "1px solid var(--line-2)",
            borderRadius: "var(--radius)", padding: "8px 13px",
            transition: "border-color .15s",
          }}
          onFocusCapture={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--gold-glow-soft)" }}
          onBlurCapture={(e) => { e.currentTarget.style.borderColor = "var(--line-2)"; e.currentTarget.style.boxShadow = "none" }}
          >
            <RiSearchLine size={13} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services…"
              style={{
                flex: 1, border: "none", background: "transparent",
                color: "var(--txt)", fontFamily: "inherit", fontSize: 13, outline: "none",
              }}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt-4)", padding: 0, lineHeight: 1 }}>
                ×
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              const CatIcon  = cat !== "All" ? CAT_ICON[cat] : RiApps2Line
              const catColor = cat !== "All" ? CAT_COLOR[cat] : "var(--txt-2)"
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 12px", borderRadius: 999, fontSize: 12.5,
                    fontFamily: "inherit", cursor: "pointer",
                    background: isActive ? "var(--bg-3)" : "transparent",
                    border: `1px solid ${isActive ? "var(--line-3)" : "transparent"}`,
                    color: isActive ? "var(--txt)" : "var(--txt-3)",
                    transition: "all .12s",
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = "var(--txt-2)"; e.currentTarget.style.borderColor = "var(--line-2)" } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = "var(--txt-3)"; e.currentTarget.style.borderColor = "transparent" } }}
                >
                  <CatIcon size={13} style={{ color: isActive && cat !== "All" ? catColor : undefined }} />
                  {cat}
                  <span style={{
                    fontSize: 10.5, fontFamily: "var(--font-mono)",
                    color: isActive ? "var(--txt-3)" : "var(--txt-5)",
                  }}>
                    {catCounts[cat]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Section label ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--txt-4)", letterSpacing: ".04em" }}>
            {filtered.length} service{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` · ${activeCategory}` : ""}
            {search ? ` matching "${search}"` : ""}
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--line-2)" }}/>
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 12, padding: "64px 0", color: "var(--txt-4)",
          }}>
            <RiApps2Line size={32} style={{ opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: 13.5 }}>No services match your search.</p>
            <button type="button" onClick={() => { setSearch(""); setActiveCategory("All") }}
              style={{ fontSize: 12.5, color: "var(--gold)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(268px, 1fr))",
            gap: 12,
          }}>
            {filtered.map((item) => (
              <CatalogCard key={item.id} item={item} onRequest={setRequestedId} />
            ))}
          </div>
        )}
      </main>

      {/* ── Request modal ── */}
      {requestedId && (() => {
        const item = ITEMS.find((i) => i.id === requestedId)!
        const Icon = item.icon
        return (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setRequestedId(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 480, background: "var(--bg-2)", border: "1px solid var(--line-2)",
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 32px 64px -16px rgba(0,0,0,.8), 0 0 0 1px var(--line)",
                animation: "modal-in .18s ease",
              }}
            >
              {/* Modal header */}
              <div style={{ padding: "20px 24px 18px", borderBottom: "1px solid var(--line-2)", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: "var(--bg-3)", border: "1px solid var(--line-2)",
                  display: "grid", placeItems: "center",
                }}>
                  <Icon size={20} style={{ color: "var(--txt-3)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--txt)", letterSpacing: "-.01em" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "var(--txt-4)", marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-mono)" }}>{item.id}</span>
                    <span>·</span>
                    <span>{item.category}</span>
                    <span>·</span>
                    <SlaTag sla={item.sla} />
                  </div>
                </div>
                <button type="button" onClick={() => setRequestedId(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt-4)", padding: 4, lineHeight: 1, fontSize: 18 }}>×</button>
              </div>

              {/* Modal body */}
              <div style={{ padding: "20px 24px" }}>
                <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "var(--txt-3)", lineHeight: 1.6 }}>
                  {item.description}
                </p>

                {/* Meta grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Fulfilled by", value: item.owner },
                    { label: "SLA target",   value: item.sla },
                    { label: "Past requests",value: `${item.requestCount}` },
                    { label: "Priority",     value: "Standard" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ padding: "10px 14px", borderRadius: 8, background: "var(--bg-3)", border: "1px solid var(--line-2)" }}>
                      <div style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--txt-5)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--txt)" }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Notes field */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12.5, color: "var(--txt-3)", display: "block", marginBottom: 6 }}>
                    Additional notes <span style={{ color: "var(--txt-5)" }}>(optional)</span>
                  </label>
                  <textarea
                    placeholder="Describe your request in more detail…"
                    rows={3}
                    style={{
                      width: "100%", resize: "vertical", borderRadius: 8, boxSizing: "border-box",
                      border: "1px solid var(--line-2)", background: "var(--bg-3)",
                      color: "var(--txt)", fontFamily: "inherit", fontSize: 13,
                      padding: "10px 12px", outline: "none", lineHeight: 1.5,
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--gold-glow-soft)" }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line-2)"; e.currentTarget.style.boxShadow = "none" }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setRequestedId(null)}
                    style={{
                      padding: "9px 16px", borderRadius: "var(--radius)",
                      border: "1px solid var(--line-2)", background: "var(--bg-3)",
                      color: "var(--txt-2)", fontSize: 13, fontFamily: "inherit", cursor: "pointer",
                      transition: "background .12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-4)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-3)" }}
                  >Cancel</button>
                  <button type="button"
                    onClick={() => setRequestedId(null)}
                    style={{
                      padding: "9px 18px", borderRadius: "var(--radius)",
                      background: "linear-gradient(180deg, var(--gold-3) 0%, var(--gold) 55%, var(--gold-2) 100%)",
                      color: "var(--gold-ink)", border: "1px solid var(--gold-2)",
                      fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15)",
                      display: "flex", alignItems: "center", gap: 6,
                      transition: "box-shadow .15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 0 0 3px var(--gold-glow)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15)" }}
                  >
                    <RiCheckboxCircleLine size={14} />
                    Submit request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(10px) scale(.97) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  )
}
