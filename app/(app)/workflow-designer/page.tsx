"use client"

import { useState } from "react"
import Link from "next/link"
import {
  RiFlowChart,
  RiAddLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiSettings4Line,
} from "@remixicon/react"

/* ── Types ── */
type WfType =
  | "SERVICE_REQUEST"
  | "INCIDENT"
  | "WORK_TRACKER"
  | "CHANGE_REQUEST"
  | "IMPLEMENT_TRACKER"
  | "SOC_REQUEST"
  | "PROBLEM"

interface Workflow {
  id: number
  type: WfType
  name: string
  description: string
  version: string
  active: boolean
  steps: number
  lastModified: string
}

/* ── Static data ── */
const INITIAL_WORKFLOWS: Workflow[] = [
  { id: 1, type: "SERVICE_REQUEST",   name: "SR_General",           description: "Service Request (General): OPEN → WAIT → APPROVE → RESOLVE", version: "v1", active: true,  steps: 6,  lastModified: "2d ago" },
  { id: 2, type: "SERVICE_REQUEST",   name: "SR_LineManagerApprove", description: "Service Request (Line Manager Approve): OPEN → WAIT…",       version: "v1", active: true,  steps: 8,  lastModified: "2d ago" },
  { id: 3, type: "INCIDENT",          name: "IC_General",           description: "General Incident Workflow: ASSIGNED → INVESTIGATE → RESOLVE",  version: "v1", active: true,  steps: 5,  lastModified: "5d ago" },
  { id: 4, type: "WORK_TRACKER",      name: "QA_Workflow_For_YoYo", description: "Automated resolution process.",                                version: "v2", active: true,  steps: 4,  lastModified: "1w ago" },
  { id: 5, type: "CHANGE_REQUEST",    name: "CHG_general",          description: "Change request",                                               version: "v1", active: true,  steps: 7,  lastModified: "1w ago" },
  { id: 6, type: "IMPLEMENT_TRACKER", name: "IMPL_general",         description: "implement tracker (General): OPEN → WAIT → IN_PROGRESS…",      version: "v1", active: false, steps: 9,  lastModified: "2w ago" },
  { id: 7, type: "SOC_REQUEST",       name: "SOC_General",          description: "Security Incident (SOC_General): NEW → TRIAGE → CONTAIN…",     version: "v3", active: true,  steps: 11, lastModified: "3w ago" },
  { id: 8, type: "PROBLEM",           name: "PRB_RootCause",        description: "Problem management: OPEN → ANALYSE → RFC → CLOSE",             version: "v1", active: false, steps: 6,  lastModified: "1mo ago" },
]

const TYPE_COLOR: Record<WfType, { bg: string; color: string; border: string }> = {
  SERVICE_REQUEST:   { bg: "rgba(94,106,210,.12)",  color: "#7c87e8", border: "rgba(94,106,210,.28)"  },
  INCIDENT:          { bg: "rgba(235,87,87,.10)",   color: "#eb7070", border: "rgba(235,87,87,.25)"   },
  WORK_TRACKER:      { bg: "rgba(76,183,130,.10)",  color: "#4cb782", border: "rgba(76,183,130,.25)"  },
  CHANGE_REQUEST:    { bg: "rgba(242,153,74,.10)",  color: "#f2994a", border: "rgba(242,153,74,.25)"  },
  IMPLEMENT_TRACKER: { bg: "rgba(139,92,246,.10)",  color: "#a78bfa", border: "rgba(139,92,246,.25)"  },
  SOC_REQUEST:       { bg: "rgba(235,87,87,.08)",   color: "#f87171", border: "rgba(235,87,87,.20)"   },
  PROBLEM:           { bg: "rgba(242,153,74,.08)",  color: "#fbbf24", border: "rgba(242,153,74,.20)"  },
}

const ROWS_OPTIONS = [10, 20, 50]

/* ── Toggle component ── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange() }}
      style={{
        width: 36, height: 20, borderRadius: 10, border: "none",
        background: on
          ? "linear-gradient(135deg, var(--gold-2), var(--gold))"
          : "var(--bg-4)",
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background .2s",
        boxShadow: on ? "0 0 0 1px var(--gold-glow)" : "0 0 0 1px var(--line-3)",
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: on ? 18 : 3,
        width: 14, height: 14, borderRadius: "50%",
        background: on ? "#fff" : "var(--txt-5)",
        transition: "left .18s cubic-bezier(.4,0,.2,1), background .2s",
        boxShadow: "0 1px 3px rgba(0,0,0,.35)",
      }}/>
    </button>
  )
}

/* ── Type badge ── */
function TypeBadge({ type }: { type: WfType }) {
  const c = TYPE_COLOR[type]
  return (
    <span style={{
      fontSize: 10.5, fontFamily: "var(--font-mono)", fontWeight: 600,
      letterSpacing: ".06em", padding: "3px 8px", borderRadius: 4,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>{type}</span>
  )
}

/* ── Page ── */
export default function WorkflowDesignerPage() {
  const [workflows, setWorkflows]   = useState<Workflow[]>(INITIAL_WORKFLOWS)
  const [search, setSearch]         = useState("")
  const [filterType, setFilterType] = useState<WfType | "ALL">("ALL")
  const [page, setPage]             = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [deleteId, setDeleteId]     = useState<number | null>(null)

  function toggleActive(id: number) {
    setWorkflows((wf) => wf.map((w) => w.id === id ? { ...w, active: !w.active } : w))
  }

  const allTypes = Array.from(new Set(INITIAL_WORKFLOWS.map((w) => w.type))) as WfType[]

  const filtered = workflows.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
                        w.description.toLowerCase().includes(search.toLowerCase())
    const matchType   = filterType === "ALL" || w.type === filterType
    return matchSearch && matchType
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const activeCount   = workflows.filter((w) => w.active).length
  const inactiveCount = workflows.length - activeCount
  const avgSteps      = (workflows.reduce((a, w) => a + w.steps, 0) / workflows.length).toFixed(1)

  const liveStats = [
    { label: "Total workflows",   value: String(workflows.length), icon: RiFlowChart,          color: "var(--txt)"   },
    { label: "Active",            value: String(activeCount),      icon: RiCheckboxCircleLine, color: "var(--green)" },
    { label: "Inactive",          value: String(inactiveCount),    icon: RiTimeLine,           color: "var(--txt-3)" },
    { label: "Avg. steps",        value: avgSteps,                 icon: RiSettings4Line,      color: "var(--gold)"  },
  ]

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
      <main style={{ flex: 1, padding: "28px 32px 48px", display: "flex", flexDirection: "column", gap: 0 }}>

        {/* ── Breadcrumb ── */}
        <nav className="crumb">
          <a href="#">Administration</a>
          <span className="sep">/</span>
          <a href="#">Process Settings</a>
          <span className="sep">/</span>
          <span className="cur">Workflow Designer</span>
        </nav>

        {/* ── Title row ── */}
        <div className="title-row" style={{ marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ color: "var(--txt)" }}>Workflow Designer</h1>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(94,106,210,.12)", border: "1px solid rgba(94,106,210,.24)",
                display: "grid", placeItems: "center",
              }}>
                <RiFlowChart size={16} style={{ color: "#7c87e8" }} />
              </div>
            </div>
            <p className="sub">
              Browse and manage all configured temporal workflow flows.
            </p>
          </div>

          {/* Create workflow button */}
          <Link
            href="/workflow-designer/create"
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <RiAddLine size={14} />
            Create Workflow
          </Link>
        </div>

        {/* ── Stat cards ── */}
        <div className="stats" style={{ marginBottom: 28 }}>
          {liveStats.map((s) => (
            <div key={s.label} className="stat">
              <div className="k">
                <s.icon size={12} style={{ color: s.color }} />
                {s.label}
              </div>
              <div className="v" style={s.label === "Avg. steps" ? { color: "var(--gold)" } : undefined}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Table card ── */}
        <div className="card" style={{ flex: 1 }}>
          {/* Table toolbar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            borderBottom: "1px solid var(--line-2)",
          }}>
            {/* Search */}
            <div className="search" style={{ maxWidth: 320 }}>
              <RiSearchLine size={13} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search workflows…"
                style={{ fontSize: 13 }}
              />
            </div>

            {/* Type filter */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                className={filterType === "ALL" ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
                onClick={() => { setFilterType("ALL"); setPage(1) }}
                style={{ padding: "5px 12px", borderRadius: 999 }}
              >
                All
              </button>
              {allTypes.map((t) => {
                const c = TYPE_COLOR[t]
                const active = filterType === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setFilterType(t); setPage(1) }}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      letterSpacing: ".04em",
                      cursor: "pointer",
                      border: `1px solid ${active ? c.color : "var(--line-3)"}`,
                      background: active ? c.bg : "transparent",
                      color: active ? c.color : "var(--txt-4)",
                      transition: "all .12s",
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>

            <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--txt-4)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
              {filtered.length} workflow{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table */}
          {paged.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--txt-4)", fontSize: 13 }}>
              No workflows match your search.
            </div>
          ) : (
            <table className="tbl" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: 64, paddingLeft: 20 }}>ID</th>
                  <th style={{ width: 180 }}>Type</th>
                  <th>Name &amp; Description</th>
                  <th style={{ width: 100 }}>Version</th>
                  <th style={{ width: 100 }}>Active</th>
                  <th style={{ width: 140, paddingRight: 20, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((wf) => (
                  <tr key={wf.id} style={{ cursor: "default" }}>
                    {/* ID */}
                    <td style={{ paddingLeft: 20 }}>
                      <span className="id" style={{ fontWeight: 600 }}>#{wf.id}</span>
                    </td>

                    {/* Type badge */}
                    <td>
                      <TypeBadge type={wf.type} />
                    </td>

                    {/* Name + description */}
                    <td>
                      <div className="ti">{wf.name}</div>
                      <div className="sub" style={{ maxWidth: 460, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {wf.description}
                      </div>
                    </td>

                    {/* Version */}
                    <td>
                      <span className="tag" style={{ fontWeight: 600 }}>{wf.version}</span>
                    </td>

                    {/* Active toggle */}
                    <td>
                      <Toggle on={wf.active} onChange={() => toggleActive(wf.id)} />
                    </td>

                    {/* Actions */}
                    <td style={{ paddingRight: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="iconbtn"
                          title="View"
                        >
                          <RiEyeLine size={13} />
                        </button>
                        <button
                          type="button"
                          className="iconbtn"
                          title="Edit"
                        >
                          <RiEditLine size={13} />
                        </button>
                        <button
                          type="button"
                          className="iconbtn"
                          title="Delete"
                          onClick={() => setDeleteId(wf.id)}
                          style={{
                            color: "var(--red)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(235,87,87,.08)"
                            e.currentTarget.style.borderColor = "rgba(235,87,87,.2)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "var(--bg-2)"
                            e.currentTarget.style.borderColor = "var(--line-2)"
                          }}
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

          {/* ── Pagination footer ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderTop: "1px solid var(--line-2)",
            background: "var(--bg-1)",
          }}>
            {/* Left: count */}
            <span style={{ fontSize: 12.5, color: "var(--txt-4)", fontFamily: "var(--font-mono)" }}>
              Showing {filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} workflows
            </span>

            {/* Center: page controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="iconbtn"
                style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? "default" : "pointer" }}
              >
                <RiArrowLeftSLine size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={p === page ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
                  style={{
                    minWidth: 30,
                    height: 30,
                    padding: 0,
                    justifyContent: "center",
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="iconbtn"
                style={{ opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? "default" : "pointer" }}
              >
                <RiArrowRightSLine size={14} />
              </button>
            </div>

            {/* Right: rows per page */}
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
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                }}
              >
                {ROWS_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      </main>

      {/* ── Delete confirm modal ── */}
      {deleteId !== null && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onClick={() => setDeleteId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              width: 400,
              padding: "28px 28px 24px",
              boxShadow: "0 32px 64px -16px rgba(0,0,0,.8), 0 0 0 1px var(--line)",
              animation: "item-in .18s ease",
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10, marginBottom: 16,
              background: "rgba(235,87,87,.10)", border: "1px solid rgba(235,87,87,.25)",
              display: "grid", placeItems: "center",
            }}>
              <RiErrorWarningLine size={20} style={{ color: "var(--red)" }} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em" }}>
              Delete workflow #{deleteId}?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--txt-3)", lineHeight: 1.55 }}>
              This action cannot be undone. The workflow will be permanently removed and any tickets using it will revert to the default flow.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setWorkflows((wf) => wf.filter((w) => w.id !== deleteId))
                  setDeleteId(null)
                }}
                className="btn btn-danger"
              >
                Delete workflow
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
