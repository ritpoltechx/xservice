"use client"

import { useState } from "react"
import {
  RiLayoutLine,
  RiAddLine,
  RiSearchLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiFileCopyLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiDraftLine,
  RiTimeLine,
} from "@remixicon/react"

/* ── Types ── */
type FormStatus = "published" | "draft" | "archived"
type TicketType = "Incident" | "Service Request" | "Change Request" | "Problem" | "Work Tracker"

interface Form {
  id: number
  name: string
  description: string
  ticketType: TicketType
  status: FormStatus
  fields: number
  usedIn: number
  lastModified: string
  author: string
}

/* ── Data ── */
const INITIAL_FORMS: Form[] = [
  {
    id: 1,
    name: "General Incident Form",
    description: "Standard form for logging all IT incidents with severity and impact fields.",
    ticketType: "Incident", status: "published",
    fields: 14, usedIn: 3, lastModified: "1d ago", author: "RW",
  },
  {
    id: 2,
    name: "Access Request Form",
    description: "Collect user and system details for access provisioning requests.",
    ticketType: "Service Request", status: "published",
    fields: 11, usedIn: 5, lastModified: "2d ago", author: "MC",
  },
  {
    id: 3,
    name: "New Hire Onboarding",
    description: "End-to-end onboarding form capturing IT asset, account, and badge requirements.",
    ticketType: "Service Request", status: "published",
    fields: 18, usedIn: 2, lastModified: "5d ago", author: "RW",
  },
  {
    id: 4,
    name: "CAB Change Request",
    description: "Change advisory board submission form with risk and rollback plan sections.",
    ticketType: "Change Request", status: "published",
    fields: 22, usedIn: 1, lastModified: "1w ago", author: "HL",
  },
  {
    id: 5,
    name: "Root Cause Analysis",
    description: "Problem management form for documenting root cause, impact, and corrective actions.",
    ticketType: "Problem", status: "draft",
    fields: 16, usedIn: 0, lastModified: "1w ago", author: "RW",
  },
  {
    id: 6,
    name: "Software Installation Request",
    description: "Capture business justification and license details for software requests.",
    ticketType: "Service Request", status: "published",
    fields: 9, usedIn: 2, lastModified: "2w ago", author: "KT",
  },
  {
    id: 7,
    name: "Security Incident Report",
    description: "SOC intake form for phishing, malware, and data breach events.",
    ticketType: "Incident", status: "published",
    fields: 17, usedIn: 1, lastModified: "2w ago", author: "MC",
  },
  {
    id: 8,
    name: "Hardware Provision Form",
    description: "IT asset request form with device specs, delivery location, and manager approval.",
    ticketType: "Service Request", status: "draft",
    fields: 12, usedIn: 0, lastModified: "3w ago", author: "RW",
  },
  {
    id: 9,
    name: "VPN Remote Access",
    description: "Self-service form for requesting or extending remote access via corporate VPN.",
    ticketType: "Service Request", status: "archived",
    fields: 7, usedIn: 0, lastModified: "1mo ago", author: "JT",
  },
  {
    id: 10,
    name: "Emergency Change Form",
    description: "Fast-track change form for P1 emergency change requests bypassing standard CAB.",
    ticketType: "Change Request", status: "published",
    fields: 13, usedIn: 1, lastModified: "1mo ago", author: "HL",
  },
]

const TICKET_TYPES: TicketType[] = ["Incident", "Service Request", "Change Request", "Problem", "Work Tracker"]

const STATUS_STYLE: Record<FormStatus, { bg: string; color: string; border: string; label: string }> = {
  published: { bg: "rgba(76,183,130,.10)",  color: "var(--green)", border: "rgba(76,183,130,.25)", label: "Published" },
  draft:     { bg: "rgba(242,153,74,.08)",  color: "var(--amber)", border: "rgba(242,153,74,.20)", label: "Draft"     },
  archived:  { bg: "rgba(87,87,87,.10)",    color: "var(--txt-4)", border: "rgba(87,87,87,.20)",   label: "Archived"  },
}

const TYPE_COLOR: Record<TicketType, string> = {
  "Incident":        "var(--red)",
  "Service Request": "var(--blue)",
  "Change Request":  "var(--amber)",
  "Problem":         "#a78bfa",
  "Work Tracker":    "var(--green)",
}

const ROWS_OPTIONS = [10, 20, 50]

/* ── Sub-components ── */
function StatusBadge({ status }: { status: FormStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600,
      letterSpacing: ".04em", padding: "3px 8px", borderRadius: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0 }}/>
      {s.label}
    </span>
  )
}

function TypeTag({ type }: { type: TicketType }) {
  return (
    <span style={{
      fontSize: 11, fontFamily: "var(--font-mono)", color: TYPE_COLOR[type],
      background: "var(--bg-3)", border: "1px solid var(--line-3)",
      padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap",
    }}>{type}</span>
  )
}

function Av({ initials }: { initials: string }) {
  return (
    <span style={{
      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
      background: "var(--bg-4)", border: "1px solid var(--line-3)",
      color: "var(--txt-3)", fontSize: 9.5, fontFamily: "var(--font-mono)",
      fontWeight: 700, display: "grid", placeItems: "center", letterSpacing: ".04em",
    }}>{initials}</span>
  )
}

/* ── Page ── */
export default function FormsPage() {
  const [forms, setForms]               = useState<Form[]>(INITIAL_FORMS)
  const [search, setSearch]             = useState("")
  const [filterType, setFilterType]     = useState<TicketType | "ALL">("ALL")
  const [filterStatus, setFilterStatus] = useState<FormStatus | "ALL">("ALL")
  const [page, setPage]                 = useState(1)
  const [rowsPerPage, setRowsPerPage]   = useState(10)
  const [deleteId, setDeleteId]         = useState<number | null>(null)

  const filtered = forms.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                        f.description.toLowerCase().includes(search.toLowerCase())
    const matchType   = filterType === "ALL" || f.ticketType === filterType
    const matchStatus = filterStatus === "ALL" || f.status === filterStatus
    return matchSearch && matchType && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const publishedCount = forms.filter((f) => f.status === "published").length
  const draftCount     = forms.filter((f) => f.status === "draft").length
  const totalFields    = forms.reduce((a, f) => a + f.fields, 0)

  const stats = [
    { label: "Total forms",    value: String(forms.length), icon: RiLayoutLine,          color: "var(--txt)"   },
    { label: "Published",      value: String(publishedCount), icon: RiCheckboxCircleLine, color: "var(--green)" },
    { label: "Draft",          value: String(draftCount),   icon: RiDraftLine,           color: "var(--amber)" },
    { label: "Total fields",   value: String(totalFields),  icon: RiTimeLine,            color: "var(--gold)"  },
  ]

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
      <main style={{ flex: 1, padding: "28px 32px 48px", display: "flex", flexDirection: "column", gap: 0 }}>

        {/* Breadcrumb */}
        <nav className="crumb">
          <a href="#">Administration</a>
          <span className="sep">/</span>
          <a href="#">Customization</a>
          <span className="sep">/</span>
          <span className="cur">Forms</span>
        </nav>

        {/* Title */}
        <div className="title-row" style={{ marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>Forms</h1>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(94,106,210,.12)", border: "1px solid rgba(94,106,210,.24)",
                display: "grid", placeItems: "center",
              }}>
                <RiLayoutLine size={16} style={{ color: "#7c87e8" }} />
              </div>
            </div>
            <p className="sub">Design and manage intake forms for each ticket type.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <RiAddLine size={14} />
            New Form
          </button>
        </div>

        {/* Stats */}
        <div className="stats" style={{ marginBottom: 28 }}>
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <div className="k">
                <s.icon size={12} style={{ color: s.color }} />
                {s.label}
              </div>
              <div className="v" style={{ color: s.label === "Total fields" ? "var(--gold)" : undefined }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="card" style={{ flex: 1 }}>
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid var(--line-2)", flexWrap: "wrap" }}>
            <div className="search" style={{ maxWidth: 300 }}>
              <RiSearchLine size={13} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search forms…"
                style={{ fontSize: 13 }}
              />
            </div>

            {/* Type filter */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {(["ALL", ...TICKET_TYPES] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setFilterType(t); setPage(1) }}
                  style={{
                    padding: "4px 10px", borderRadius: 999, fontSize: 11.5,
                    fontFamily: "inherit", cursor: "pointer",
                    background: filterType === t ? "var(--bg-4)" : "transparent",
                    border: `1px solid ${filterType === t ? "var(--line-4)" : "var(--line-2)"}`,
                    color: filterType === t ? "var(--txt)" : "var(--txt-4)",
                    transition: "all .12s",
                  }}
                >{t === "ALL" ? "All types" : t}</button>
              ))}
            </div>

            {/* Status filter */}
            <div style={{ display: "flex", gap: 5, marginLeft: "auto" }}>
              {(["ALL", "published", "draft", "archived"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setFilterStatus(s); setPage(1) }}
                  style={{
                    padding: "4px 10px", borderRadius: 999, fontSize: 11.5,
                    fontFamily: "inherit", cursor: "pointer",
                    background: filterStatus === s ? "var(--bg-4)" : "transparent",
                    border: `1px solid ${filterStatus === s ? "var(--line-4)" : "var(--line-2)"}`,
                    color: filterStatus === s
                      ? (s === "published" ? "var(--green)" : s === "draft" ? "var(--amber)" : "var(--txt)")
                      : "var(--txt-4)",
                    transition: "all .12s",
                  }}
                >{s === "ALL" ? "All statuses" : STATUS_STYLE[s].label}</button>
              ))}
            </div>
          </div>

          {/* Table */}
          {paged.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--txt-4)", fontSize: 13 }}>
              No forms match your search.
            </div>
          ) : (
            <table className="tbl" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: 56, paddingLeft: 20 }}>ID</th>
                  <th>Name &amp; Description</th>
                  <th style={{ width: 160 }}>Ticket Type</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th style={{ width: 80, textAlign: "center" }}>Fields</th>
                  <th style={{ width: 80, textAlign: "center" }}>Used in</th>
                  <th style={{ width: 90 }}>Author</th>
                  <th style={{ width: 90 }}>Modified</th>
                  <th style={{ width: 120, paddingRight: 20, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((f) => (
                  <tr key={f.id}>
                    <td style={{ paddingLeft: 20 }}>
                      <span className="id" style={{ fontWeight: 600 }}>#{f.id}</span>
                    </td>
                    <td>
                      <div className="ti">{f.name}</div>
                      <div className="sub" style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {f.description}
                      </div>
                    </td>
                    <td><TypeTag type={f.ticketType} /></td>
                    <td><StatusBadge status={f.status} /></td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--txt-2)" }}>{f.fields}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: f.usedIn > 0 ? "var(--txt-2)" : "var(--txt-5)" }}>
                        {f.usedIn > 0 ? f.usedIn : "—"}
                      </span>
                    </td>
                    <td><Av initials={f.author} /></td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--txt-4)" }}>{f.lastModified}</span>
                    </td>
                    <td style={{ paddingRight: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
                        <button type="button" className="iconbtn" title="Preview"><RiEyeLine size={13} /></button>
                        <button type="button" className="iconbtn" title="Edit"><RiEditLine size={13} /></button>
                        <button type="button" className="iconbtn" title="Duplicate"><RiFileCopyLine size={13} /></button>
                        <button
                          type="button" className="iconbtn" title="Delete"
                          onClick={() => setDeleteId(f.id)}
                          style={{ color: "var(--red)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.08)"; e.currentTarget.style.borderColor = "rgba(235,87,87,.2)" }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.borderColor = "var(--line-2)" }}
                        >
                          <RiDeleteBinLine size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 20px", borderTop: "1px solid var(--line-2)", background: "var(--bg-1)",
          }}>
            <span style={{ fontSize: 12.5, color: "var(--txt-4)", fontFamily: "var(--font-mono)" }}>
              Showing {filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} forms
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                className="iconbtn" style={{ opacity: page <= 1 ? 0.4 : 1 }}>
                <RiArrowLeftSLine size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} type="button" onClick={() => setPage(p)}
                  className={p === page ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
                  style={{ minWidth: 30, height: 30, padding: 0, justifyContent: "center" }}>
                  {p}
                </button>
              ))}
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
                className="iconbtn" style={{ opacity: page >= totalPages ? 0.4 : 1 }}>
                <RiArrowRightSLine size={14} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--txt-4)" }}>
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1) }}
                style={{
                  appearance: "none", WebkitAppearance: "none",
                  padding: "4px 28px 4px 10px", borderRadius: 6,
                  border: "1px solid var(--line-2)", background: "var(--bg-2)",
                  color: "var(--txt-2)", fontFamily: "var(--font-mono)", fontSize: 12,
                  cursor: "pointer", outline: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23545863' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center",
                }}
              >
                {ROWS_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      </main>

      {/* Delete modal */}
      {deleteId !== null && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setDeleteId(null)}>
          <div onClick={(e) => e.stopPropagation()} className="card"
            style={{ width: 400, padding: "28px 28px 24px", boxShadow: "0 32px 64px -16px rgba(0,0,0,.8)", animation: "item-in .18s ease" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, marginBottom: 16,
              background: "rgba(235,87,87,.10)", border: "1px solid rgba(235,87,87,.25)",
              display: "grid", placeItems: "center",
            }}>
              <RiErrorWarningLine size={20} style={{ color: "var(--red)" }} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em" }}>
              Delete form #{deleteId}?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--txt-3)", lineHeight: 1.55 }}>
              This cannot be undone. Any tickets currently using this form will revert to the default layout.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setDeleteId(null)} className="btn btn-secondary">Cancel</button>
              <button type="button" onClick={() => { setForms((f) => f.filter((x) => x.id !== deleteId)); setDeleteId(null) }} className="btn btn-danger">
                Delete form
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes item-in {
          from { opacity: 0; transform: translateY(8px) scale(.98) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  )
}
