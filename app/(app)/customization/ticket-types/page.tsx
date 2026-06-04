"use client"

import { useState } from "react"
import {
  RiTicket2Line,
  RiAddLine,
  RiSearchLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiErrorWarningLine,
  RiAlarmWarningLine,
  RiSettings4Line,
  RiComputerLine,
  RiHeadphoneLine,
  RiShieldCheckLine,
  RiFlowChart,
  RiCheckboxCircleLine,
  RiLockLine,
  RiArrowRightSLine,
  RiArrowDownSLine,
} from "@remixicon/react"
import type { RemixiconComponentType } from "@remixicon/react"

type IconComponent = RemixiconComponentType

/* ── Types ── */
type TicketStatus = "active" | "inactive"

interface TicketTypeItem {
  id: number
  name: string
  key: string
  description: string
  icon: RemixiconComponentType
  color: string
  status: TicketStatus
  system: boolean
  defaultWorkflow: string
  defaultForm: string
  slaDefault: string
  ticketCount: number
  fields: number
  lastModified: string
}

/* ── Data ── */
const INITIAL_TYPES: TicketTypeItem[] = [
  {
    id: 1, name: "Incident", key: "INC",
    description: "Unplanned interruption or degradation of an IT service. Routed to on-call engineers with SLA breach alerting.",
    icon: RiAlarmWarningLine, color: "var(--red)",
    status: "active", system: true,
    defaultWorkflow: "IC_General", defaultForm: "General Incident Form",
    slaDefault: "P1: 1h / P2: 4h", ticketCount: 4182, fields: 14, lastModified: "—",
  },
  {
    id: 2, name: "Service Request", key: "REQ",
    description: "Formal request for a predefined service item such as access provisioning, hardware, or software.",
    icon: RiHeadphoneLine, color: "var(--blue)",
    status: "active", system: true,
    defaultWorkflow: "SR_General", defaultForm: "Access Request Form",
    slaDefault: "Standard: 8h / Priority: 4h", ticketCount: 2204, fields: 11, lastModified: "—",
  },
  {
    id: 3, name: "Change Request", key: "CHG",
    description: "Controlled modification to the IT environment. Requires CAB approval and a rollback plan before implementation.",
    icon: RiSettings4Line, color: "var(--amber)",
    status: "active", system: true,
    defaultWorkflow: "CHG_general", defaultForm: "CAB Change Request",
    slaDefault: "Standard: 5d / Emergency: 4h", ticketCount: 918, fields: 22, lastModified: "—",
  },
  {
    id: 4, name: "Problem", key: "PRB",
    description: "Root cause investigation for recurring or high-impact incidents. Drives permanent fixes and known-error documentation.",
    icon: RiComputerLine, color: "#a78bfa",
    status: "active", system: true,
    defaultWorkflow: "PRB_RootCause", defaultForm: "Root Cause Analysis",
    slaDefault: "P1: 5d / P2: 15d", ticketCount: 312, fields: 16, lastModified: "—",
  },
  {
    id: 5, name: "Security Event", key: "SEC",
    description: "SOC-intake ticket for phishing, malware, data breach, or policy violation reports. Escalates to CISO on P1.",
    icon: RiShieldCheckLine, color: "var(--red)",
    status: "active", system: false,
    defaultWorkflow: "SOC_General", defaultForm: "Security Incident Report",
    slaDefault: "Critical: 1h / High: 4h", ticketCount: 76, fields: 17, lastModified: "2w ago",
  },
  {
    id: 6, name: "Work Tracker", key: "WRK",
    description: "Internal engineering task tracker for non-ITSM work items. Supports sprint planning with story points and backlog.",
    icon: RiFlowChart, color: "var(--green)",
    status: "active", system: false,
    defaultWorkflow: "QA_Workflow_For_YoYo", defaultForm: "—",
    slaDefault: "No SLA", ticketCount: 543, fields: 9, lastModified: "1mo ago",
  },
  {
    id: 7, name: "Access Review", key: "ACR",
    description: "Periodic access certification workflow for IAM compliance. Auto-created on quarterly schedule.",
    icon: RiCheckboxCircleLine, color: "var(--gold)",
    status: "inactive", system: false,
    defaultWorkflow: "SR_LineManagerApprove", defaultForm: "Access Request Form",
    slaDefault: "Certification: 14d", ticketCount: 0, fields: 8, lastModified: "3w ago",
  },
]

/* ── Sub-components ── */
function StatusBadge({ status }: { status: TicketStatus }) {
  const active = status === "active"
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: ".04em",
      padding: "3px 8px", borderRadius: 4,
      background: active ? "rgba(76,183,130,.10)" : "rgba(87,87,87,.10)",
      color: active ? "var(--green)" : "var(--txt-4)",
      border: `1px solid ${active ? "rgba(76,183,130,.25)" : "rgba(87,87,87,.2)"}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: active ? "var(--green)" : "var(--txt-5)", flexShrink: 0 }}/>
      {active ? "Active" : "Inactive"}
    </span>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={(e) => { e.stopPropagation(); onChange() }}
      style={{
        width: 36, height: 20, borderRadius: 10, border: "none",
        background: on ? "linear-gradient(135deg, var(--gold-2), var(--gold))" : "var(--bg-4)",
        position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s",
        boxShadow: on ? "0 0 0 1px var(--gold-glow)" : "0 0 0 1px var(--line-3)",
      }}>
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

/* ── Expanded detail panel ── */
function TypeDetailPanel({ type }: { type: TicketTypeItem }) {
  const Icon = type.icon
  return (
    <tr>
      <td colSpan={9} style={{ padding: 0, borderBottom: "1px solid var(--line-2)" }}>
        <div style={{
          padding: "20px 24px 20px 76px",
          background: "linear-gradient(90deg, rgba(255,255,255,.015) 0%, transparent 100%)",
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16,
        }}>
          {/* Config */}
          <div>
            <div style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--txt-5)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Configuration</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                { k: "Prefix key",        v: type.key },
                { k: "Default workflow",  v: type.defaultWorkflow },
                { k: "Default form",      v: type.defaultForm },
                { k: "SLA targets",       v: type.slaDefault },
              ].map(({ k, v }) => (
                <div key={k} style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 11.5, color: "var(--txt-4)", width: 130, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 11.5, color: "var(--txt-2)", fontFamily: "var(--font-mono)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <div style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--txt-5)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Usage</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { k: "Total tickets", v: type.ticketCount.toLocaleString() },
                { k: "Custom fields", v: String(type.fields) },
              ].map(({ k, v }) => (
                <div key={k} style={{ padding: "10px 12px", borderRadius: 7, background: "var(--bg-3)", border: "1px solid var(--line-2)" }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--txt-5)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--txt)", fontVariantNumeric: "tabular-nums" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-start" }}>
            <div style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--txt-5)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>Quick actions</div>
            {([
              { label: "Edit ticket type",     icon: RiEditLine        },
              { label: "Manage fields",         icon: RiTicket2Line     },
              { label: "Configure workflow",    icon: RiFlowChart       },
              { label: "View SLA policies",     icon: RiSettings4Line   },
            ] as { label: string; icon: IconComponent }[]).map(({ label, icon: BtnIcon }) => (
              <button key={label} type="button"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 10px", borderRadius: 6, fontSize: 12.5,
                  background: "var(--bg-3)", border: "1px solid var(--line-2)",
                  color: "var(--txt-2)", fontFamily: "inherit", cursor: "pointer",
                  transition: "background .12s, border-color .12s, color .12s", textAlign: "left",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-4)"; e.currentTarget.style.borderColor = "var(--line-3)"; e.currentTarget.style.color = "var(--txt)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.borderColor = "var(--line-2)"; e.currentTarget.style.color = "var(--txt-2)" }}
              >
                <BtnIcon size={13} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </td>
    </tr>
  )
}

/* ── Page ── */
export default function TicketTypesPage() {
  const [types, setTypes]             = useState<TicketTypeItem[]>(INITIAL_TYPES)
  const [search, setSearch]           = useState("")
  const [expandedId, setExpandedId]   = useState<number | null>(null)
  const [deleteId, setDeleteId]       = useState<number | null>(null)

  function toggleActive(id: number) {
    setTypes((t) => t.map((x) => x.id === id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x))
  }

  const filtered = types.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.key.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount   = types.filter((t) => t.status === "active").length
  const systemCount   = types.filter((t) => t.system).length
  const totalTickets  = types.reduce((a, t) => a + t.ticketCount, 0)

  const stats = [
    { label: "Ticket types",   value: String(types.length),              icon: RiTicket2Line,        color: "var(--txt)"   },
    { label: "Active",         value: String(activeCount),               icon: RiCheckboxCircleLine, color: "var(--green)" },
    { label: "System types",   value: String(systemCount),               icon: RiLockLine,           color: "var(--txt-3)" },
    { label: "Total tickets",  value: totalTickets.toLocaleString(),     icon: RiTicket2Line,        color: "var(--gold)"  },
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
          <span className="cur">Ticket Types</span>
        </nav>

        {/* Title */}
        <div className="title-row" style={{ marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>Ticket Types</h1>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(227,179,65,.10)", border: "1px solid rgba(227,179,65,.22)",
                display: "grid", placeItems: "center",
              }}>
                <RiTicket2Line size={16} style={{ color: "var(--gold)" }} />
              </div>
            </div>
            <p className="sub">Configure the ticket types available across your workspace — each with its own prefix, workflow, and SLA.</p>
          </div>
          <button type="button" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RiAddLine size={14} />
            New Ticket Type
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
              <div className="v" style={{ color: s.label === "Total tickets" ? "var(--gold)" : undefined }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="card" style={{ flex: 1 }}>
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid var(--line-2)" }}>
            <div className="search" style={{ maxWidth: 300 }}>
              <RiSearchLine size={13} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket types…"
                style={{ fontSize: 13 }}
              />
            </div>
            <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--txt-4)", fontFamily: "var(--font-mono)" }}>
              {filtered.length} type{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--txt-4)", fontSize: 13 }}>
              No ticket types match your search.
            </div>
          ) : (
            <table className="tbl" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: 36, paddingLeft: 20 }}/>
                  <th style={{ width: 48 }}>Key</th>
                  <th>Name &amp; Description</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th style={{ width: 80, textAlign: "center" }}>Active</th>
                  <th style={{ width: 100, textAlign: "right" }}>Tickets</th>
                  <th style={{ width: 80, textAlign: "center" }}>Fields</th>
                  <th style={{ width: 90 }}>Modified</th>
                  <th style={{ width: 100, paddingRight: 20, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const Icon = t.icon
                  const isExpanded = expandedId === t.id
                  return (
                    <>
                      <tr
                        key={t.id}
                        onClick={() => setExpandedId(isExpanded ? null : t.id)}
                        style={{ cursor: "pointer", background: isExpanded ? "rgba(255,255,255,.02)" : undefined }}
                      >
                        {/* Expand chevron */}
                        <td style={{ paddingLeft: 20 }}>
                          <span style={{ color: "var(--txt-5)", display: "flex", alignItems: "center" }}>
                            {isExpanded
                              ? <RiArrowDownSLine size={14} />
                              : <RiArrowRightSLine size={14} />
                            }
                          </span>
                        </td>

                        {/* Prefix key */}
                        <td>
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 34, height: 34, borderRadius: 8,
                            background: "var(--bg-3)", border: "1px solid var(--line-3)",
                          }}>
                            <Icon size={15} style={{ color: t.color }} />
                          </div>
                        </td>

                        {/* Name + description */}
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div className="ti">{t.name}</div>
                            <span style={{
                              fontFamily: "var(--font-mono)", fontSize: 9.5, padding: "1px 5px",
                              borderRadius: 3, background: "var(--bg-4)", border: "1px solid var(--line-3)",
                              color: "var(--txt-4)", letterSpacing: ".08em",
                            }}>{t.key}</span>
                            {t.system && (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 3,
                                fontSize: 9.5, fontFamily: "var(--font-mono)", padding: "1px 6px",
                                borderRadius: 3, background: "var(--bg-4)", border: "1px solid var(--line-3)",
                                color: "var(--txt-5)", letterSpacing: ".06em",
                              }}>
                                <RiLockLine size={9} />SYSTEM
                              </span>
                            )}
                          </div>
                          <div className="sub" style={{ maxWidth: 440, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {t.description}
                          </div>
                        </td>

                        {/* Status badge */}
                        <td><StatusBadge status={t.status} /></td>

                        {/* Toggle */}
                        <td style={{ textAlign: "center" }}>
                          <Toggle on={t.status === "active"} onChange={() => toggleActive(t.id)} />
                        </td>

                        {/* Ticket count */}
                        <td style={{ textAlign: "right" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--txt-2)", fontVariantNumeric: "tabular-nums" }}>
                            {t.ticketCount.toLocaleString()}
                          </span>
                        </td>

                        {/* Fields count */}
                        <td style={{ textAlign: "center" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--txt-3)" }}>{t.fields}</span>
                        </td>

                        {/* Modified */}
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--txt-4)" }}>{t.lastModified}</span>
                        </td>

                        {/* Actions */}
                        <td style={{ paddingRight: 20 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
                            <button type="button" className="iconbtn" title="View"><RiEyeLine size={13} /></button>
                            <button type="button" className="iconbtn" title="Edit" disabled={t.system} style={{ opacity: t.system ? 0.3 : 1 }}>
                              <RiEditLine size={13} />
                            </button>
                            <button
                              type="button" className="iconbtn" title={t.system ? "System types cannot be deleted" : "Delete"}
                              disabled={t.system}
                              onClick={() => !t.system && setDeleteId(t.id)}
                              style={{ color: t.system ? "var(--txt-5)" : "var(--red)", opacity: t.system ? 0.3 : 1 }}
                              onMouseEnter={(e) => { if (!t.system) { e.currentTarget.style.background = "rgba(235,87,87,.08)"; e.currentTarget.style.borderColor = "rgba(235,87,87,.2)" } }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.borderColor = "var(--line-2)" }}
                            >
                              <RiDeleteBinLine size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && <TypeDetailPanel type={t} />}
                    </>
                  )
                })}
              </tbody>
            </table>
          )}
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
            style={{ width: 420, padding: "28px 28px 24px", boxShadow: "0 32px 64px -16px rgba(0,0,0,.8)", animation: "item-in .18s ease" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, marginBottom: 16,
              background: "rgba(235,87,87,.10)", border: "1px solid rgba(235,87,87,.25)",
              display: "grid", placeItems: "center",
            }}>
              <RiErrorWarningLine size={20} style={{ color: "var(--red)" }} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em" }}>
              Delete ticket type?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--txt-3)", lineHeight: 1.55 }}>
              This cannot be undone. All existing tickets of this type will be preserved, but no new tickets can be created with it.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setDeleteId(null)} className="btn btn-secondary">Cancel</button>
              <button type="button"
                onClick={() => { setTypes((t) => t.filter((x) => x.id !== deleteId)); setDeleteId(null) }}
                className="btn btn-danger">
                Delete type
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
