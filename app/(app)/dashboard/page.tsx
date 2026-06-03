"use client"

import { useState } from "react"
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiCloseLine,
  RiSendPlaneLine,
  RiAttachmentLine,
  RiDownloadLine,
  RiFilterLine,
  RiAddLine,
} from "@remixicon/react"

/* ── Types ── */
type Priority = "p1" | "p2" | "p3" | "p4"
type Status = "mitigating" | "investigating" | "monitoring" | "resolved" | "pending"

interface Ticket {
  id: string
  priority: Priority
  live: boolean
  title: string
  sub: string
  status: Status
  assignee: { initials: string; name: string; gold?: boolean }
  sla: string
  slaClass?: "warn" | "crit"
  service: string
  age: string
}

/* ── Data ── */
const TICKETS: Ticket[] = [
  {
    id: "INC-4182", priority: "p1", live: true,
    title: "Checkout latency exceeding 2s on us-east-1",
    sub: "payments-api · 14 enterprise customers impacted",
    status: "mitigating",
    assignee: { initials: "MC", name: "Maya Chen", gold: true },
    sla: "breach in 12m", slaClass: "crit",
    service: "payments", age: "2m",
  },
  {
    id: "INC-4180", priority: "p2", live: false,
    title: "SSO provider returning 502 on /auth/callback",
    sub: "Microsoft Entra · partial outage",
    status: "investigating",
    assignee: { initials: "KT", name: "Kai Tan" },
    sla: "1h 42m", slaClass: "warn",
    service: "identity", age: "18m",
  },
  {
    id: "REQ-2204", priority: "p2", live: false,
    title: "New starter laptop provision · 4 units for Q3 sales hires",
    sub: "M3 Pro · 36GB · finance pre-approved",
    status: "pending",
    assignee: { initials: "JT", name: "Jordan T." },
    sla: "3h 12m",
    service: "itam", age: "36m",
  },
  {
    id: "INC-4178", priority: "p3", live: false,
    title: "Slack bot not posting deploy notifications in #deploys",
    sub: "webhook returning 429 since 14:10",
    status: "monitoring",
    assignee: { initials: "RV", name: "Riya V." },
    sla: "4h 10m",
    service: "integrations", age: "1h",
  },
  {
    id: "CHG-0918", priority: "p3", live: false,
    title: "Quarterly TLS certificate rotation · payments-edge",
    sub: "Window 02:00–04:00 UTC · CAB-approved",
    status: "pending",
    assignee: { initials: "HL", name: "Henry L." },
    sla: "3d",
    service: "security", age: "3h",
  },
  {
    id: "INC-4177", priority: "p3", live: false,
    title: "Payments webhook retries — resolved, monitoring for regression",
    sub: "root cause: pool exhaustion · post-mortem due",
    status: "resolved",
    assignee: { initials: "MC", name: "Maya Chen", gold: true },
    sla: "—",
    service: "payments", age: "3h",
  },
]

const RAIL_DATA: Record<string, {
  status: Status
  tags: string[]
  meta: Record<string, string>
  timeline: { color: string; time: string; text: string }[]
  stakeholders: { initials: string; name: string; role: string; status: string; gold?: boolean }[]
  related: { id: string; label: string; status: Status | "kb" }[]
}> = {
  "INC-4182": {
    status: "mitigating",
    tags: ["Mitigating", "payments", "us-east-1", "P1 · SEV-1"],
    meta: {
      Service: "payments-api",
      Region: "us-east-1",
      Started: "11:42 UTC",
      Commander: "@maya.chen",
      SLA: "breach in 12m",
    },
    timeline: [
      { color: "gold", time: "11:58 · NOW", text: "@maya.chen is rolling back to v3.18.2 via Argo. ETA 4m." },
      { color: "blue",  time: "11:54",       text: "Correlated to deploy #4481 — new RDS connection pool settings." },
      { color: "",      time: "11:48",       text: "Runbook rb-checkout-p1 opened by on-call." },
      { color: "red",   time: "11:42",       text: "Paged by Datadog monitor 9033 · p95 latency breached 2000ms." },
    ],
    stakeholders: [
      { initials: "MC", name: "Maya Chen",  role: "Commander · primary on-call", status: "live",  gold: true },
      { initials: "DK", name: "Daniel Klee",role: "Tech lead · investigating",   status: "investigating" },
      { initials: "PV", name: "Priya Vora", role: "CISO · informed",            status: "monitoring" },
    ],
    related: [
      { id: "INC-4180", label: "SSO provider returning 502 on /auth/callback", status: "investigating" },
      { id: "CHG-0915", label: "Deploy #4481 — connection pool tuning",        status: "monitoring" },
      { id: "KB-4471",  label: "Runbook · Roll back payments-api via Argo",    status: "kb" },
    ],
  },
  "INC-4180": {
    status: "investigating",
    tags: ["Investigating", "identity", "P2"],
    meta: {
      Service: "auth-proxy",
      Region: "global",
      Started: "11:22 UTC",
      Commander: "@kai.tan",
      SLA: "1h 42m",
    },
    timeline: [
      { color: "blue", time: "11:40 · NOW", text: "Kai.tan is correlating with Microsoft Entra status page — partial outage confirmed." },
      { color: "",     time: "11:28",       text: "Runbook rb-sso-502 opened." },
      { color: "red",  time: "11:22",       text: "Alert fired: /auth/callback 502 error rate > 15%." },
    ],
    stakeholders: [
      { initials: "KT", name: "Kai Tan",    role: "Tech lead · investigating",   status: "investigating" },
      { initials: "PV", name: "Priya Vora", role: "CISO · informed",            status: "monitoring" },
    ],
    related: [
      { id: "INC-4182", label: "Checkout latency exceeding 2s on us-east-1", status: "mitigating" },
    ],
  },
  "REQ-2204": {
    status: "pending",
    tags: ["Pending", "itam", "P2"],
    meta: {
      Type: "Hardware request",
      Requester: "@sarah.obi",
      Approved: "Finance · $12,400",
      SLA: "3h 12m",
      Items: "4× MacBook Pro M3 36GB",
    },
    timeline: [
      { color: "gold", time: "11:50 · NOW", text: "Finance approval confirmed. Awaiting IT provisioning queue." },
      { color: "",     time: "11:20",       text: "Request submitted by sarah.obi." },
    ],
    stakeholders: [
      { initials: "JT", name: "Jordan T.", role: "IT ops · assigned", status: "investigating" },
    ],
    related: [],
  },
  "INC-4178": {
    status: "monitoring",
    tags: ["Monitoring", "integrations", "P3"],
    meta: {
      Service: "slack-bot",
      Region: "us-east-1",
      Started: "14:10 UTC",
      SLA: "4h 10m",
    },
    timeline: [
      { color: "", time: "14:30 · NOW", text: "Webhook rate limit lifted — monitoring for normalization." },
      { color: "red", time: "14:10",   text: "Alert: webhook 429 error rate spike in #deploys." },
    ],
    stakeholders: [
      { initials: "RV", name: "Riya V.", role: "Integrations · assigned", status: "monitoring" },
    ],
    related: [],
  },
  "CHG-0918": {
    status: "pending",
    tags: ["Scheduled", "security", "CAB-approved", "P3"],
    meta: {
      Service: "payments-edge",
      Window: "02:00–04:00 UTC",
      Approver: "CAB · approved",
      SLA: "3d",
    },
    timeline: [
      { color: "gold", time: "Yesterday", text: "CAB approval granted. Change window confirmed." },
    ],
    stakeholders: [
      { initials: "HL", name: "Henry L.", role: "Security · owner", status: "monitoring" },
    ],
    related: [],
  },
  "INC-4177": {
    status: "resolved",
    tags: ["Resolved", "payments", "P3"],
    meta: {
      Service: "payments-webhook",
      Resolved: "3h ago",
      "Root cause": "pool exhaustion",
      "Post-mortem": "Due in 48h",
    },
    timeline: [
      { color: "green", time: "9:00",  text: "Resolved — connection pool settings corrected." },
      { color: "red",   time: "6:00",  text: "Webhook retry failures started." },
    ],
    stakeholders: [
      { initials: "MC", name: "Maya Chen", role: "Commander · resolved", status: "resolved", gold: true },
    ],
    related: [
      { id: "INC-4182", label: "Checkout latency exceeding 2s on us-east-1", status: "mitigating" },
    ],
  },
}

const ASSET_TILES = [
  { label: "Total assets",       value: "1,243",  delta: "+12 this week",   cls: ""    },
  { label: "Licenses expiring",  value: "17",     delta: "In next 30 days", cls: "gold" },
  { label: "Unassigned · risk",  value: "4",      delta: "P1 — orphaned",   cls: "red"  },
  { label: "Patch compliance",   value: "96%",    delta: "",                cls: "prog" },
]

const TABS = ["Active · 4", "Triage · 6", "Waiting · 2", "Done"]

/* ── Sub-components ── */
function PrioBadge({ p }: { p: Priority }) {
  return <span className={`prio ${p}`}>{p.toUpperCase()}</span>
}

function StatusPill({ status }: { status: Status }) {
  const labels: Record<Status, string> = {
    mitigating: "Mitigating",
    investigating: "Investigating",
    monitoring: "Monitoring",
    resolved: "Resolved",
    pending: "Pending",
  }
  return (
    <span className={`st ${status}`}>
      <span className="d" />
      {labels[status]}
    </span>
  )
}

function Av({ initials, gold }: { initials: string; gold?: boolean }) {
  return <span className={`av${gold ? " gold" : ""}`}>{initials}</span>
}

/* ── Page ── */
export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState<string>("INC-4182")
  const [activeTab, setActiveTab] = useState(0)
  const [updateText, setUpdateText] = useState(
    "Rolling back v3.18.3 → v3.18.2. ETA 4m. Will re-measure p95 on return."
  )

  const rail = RAIL_DATA[selectedId] ?? RAIL_DATA["INC-4182"]
  const selectedTicket = TICKETS.find((t) => t.id === selectedId)!

  return (
    <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
      {/* ── Main ── */}
      <main className="main" style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {/* Breadcrumb */}
        <nav className="crumb">
          <a href="#">Acme Cloud</a>
          <span className="sep">/</span>
          <a href="#">Service Desk</a>
          <span className="sep">/</span>
          <span className="cur">Inbox · Active</span>
        </nav>

        {/* Title row */}
        <div className="title-row">
          <div>
            <h1>
              Good evening, <span className="accent">Asha.</span>
            </h1>
            <p className="sub">
              Three tickets are breaching SLA in under an hour, and one P1 incident
              is in mitigation. The rest of your queue is steady.
            </p>
          </div>
          <div className="actions">
            <button className="btn btn-secondary">
              <RiDownloadLine size={13} />
              Export
            </button>
            <button className="btn btn-secondary">
              <RiFilterLine size={13} />
              Filter
            </button>
            <button className="btn btn-primary">
              <RiAddLine size={13} />
              New ticket <span className="kbd">C</span>
            </button>
          </div>
        </div>

        {/* KPI stats */}
        <div className="stats four" style={{ marginTop: 22 }}>
          <div className="stat hero">
            <div className="k"><span className="led" />Open tickets · P1/P2</div>
            <div className="v">12</div>
            <div className="d dn">
              <RiArrowUpLine size={11} /> 3 since 09:00
            </div>
          </div>
          <div className="stat">
            <div className="k">MTTR · 7d</div>
            <div className="v">47<small>m</small></div>
            <div className="d up">
              <RiArrowDownLine size={11} /> 8m vs last wk
            </div>
          </div>
          <div className="stat">
            <div className="k">SLA on track</div>
            <div className="v">94<small>%</small></div>
            <div className="prog" style={{ width: "94%" }}><i /></div>
          </div>
          <div className="stat">
            <div className="k">On-call</div>
            <div
              className="v"
              style={{
                fontSize: 20,
                fontFamily: "var(--font-mono)",
                color: "var(--gold)",
                marginTop: 10,
              }}
            >
              @maya.chen
            </div>
            <div className="d">Rotates in 2h 14m</div>
          </div>
        </div>

        {/* Assets strip */}
        <div className="sect-h">
          <h3>Assets · ITAM</h3>
          <span className="ek">Live · CMDB sync 2m ago</span>
          <span className="right">View catalog →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {ASSET_TILES.map((t) => (
            <div
              key={t.label}
              style={{
                padding: "14px 16px",
                border: "1px solid var(--line-2)",
                borderRadius: 8,
                background: "var(--bg-2)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--txt-4)" }}>
                {t.label}
              </div>
              <div
                style={{
                  fontSize: t.cls === "prog" ? 20 : 22,
                  fontWeight: 600,
                  letterSpacing: "-.02em",
                  fontVariantNumeric: "tabular-nums",
                  color: t.cls === "gold" ? "var(--gold)" : t.cls === "red" ? "var(--red)" : "var(--txt)",
                }}
              >
                {t.value}
              </div>
              {t.cls === "prog" ? (
                <div className="prog" style={{ width: "96%" }}><i /></div>
              ) : (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--txt-3)" }}>{t.delta}</div>
              )}
            </div>
          ))}
        </div>

        {/* Queue */}
        <div className="sect-h">
          <h3>
            Active queue{" "}
            <span style={{ color: "var(--txt-4)", fontWeight: 400, fontSize: 14, marginLeft: 6 }}>12</span>
          </h3>
          <div className="tabs" style={{ marginLeft: 14 }}>
            {TABS.map((t, i) => (
              <button
                key={t}
                type="button"
                className={`tab${activeTab === i ? " active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="right">Sort: SLA risk ↓</span>
        </div>

        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 48 }}></th>
                <th style={{ width: 90 }}>ID</th>
                <th>Title</th>
                <th style={{ width: 140 }}>Status</th>
                <th style={{ width: 140 }}>Assignee</th>
                <th style={{ width: 110, textAlign: "right" }}>SLA</th>
                <th style={{ width: 110 }}>Service</th>
                <th style={{ width: 70, textAlign: "right" }}>Age</th>
              </tr>
            </thead>
            <tbody>
              {TICKETS.map((t) => (
                <tr
                  key={t.id}
                  className={[
                    t.live ? "live" : "",
                    t.id === selectedId ? "selected" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => setSelectedId(t.id)}
                  style={
                    t.id === selectedId
                      ? { background: "linear-gradient(90deg,rgba(227,179,65,.08),rgba(227,179,65,.02) 40%,transparent)" }
                      : undefined
                  }
                >
                  <td><PrioBadge p={t.priority} /></td>
                  <td><span className="id">{t.id}</span></td>
                  <td>
                    <div className="ti">{t.title}</div>
                    <div className="sub">{t.sub}</div>
                  </td>
                  <td><StatusPill status={t.status} /></td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                      <Av initials={t.assignee.initials} gold={t.assignee.gold} />
                      <span style={{ fontSize: 12.5 }}>{t.assignee.name}</span>
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className={`sla${t.slaClass ? ` ${t.slaClass}` : ""}`}>{t.sla}</span>
                  </td>
                  <td>
                    <span className="tag">{t.service}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="sla">{t.age}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "14px 4px",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--txt-4)",
          }}
        >
          <span>Showing 6 of 12 · sorted by SLA risk</span>
          <span>auto-refresh · 30s</span>
        </div>
      </main>

      {/* ── Right rail ── */}
      <aside className="rail" style={{ width: 360, flexShrink: 0 }}>
        {/* Rail header */}
        <div className="rail-hd">
          {selectedTicket?.live && <span className="live-dot" />}
          <span className="t-mono">
            {selectedId}{selectedTicket?.live ? " · LIVE" : ""}
          </span>
          <button
            type="button"
            className="close"
            onClick={() => setSelectedId("INC-4182")}
          >
            <RiCloseLine size={14} />
          </button>
        </div>

        {/* Title */}
        <h2>{selectedTicket?.title}</h2>

        {/* Tags */}
        <div className="chips">
          {rail.tags.map((tag, i) => (
            <span key={tag} className={`chip${i === 0 ? " active" : ""}`}>{tag}</span>
          ))}
        </div>

        {/* Meta block */}
        <div className="meta-block">
          {Object.entries(rail.meta).map(([k, v]) => (
            <span key={k} style={{ display: "contents" }}>
              <span className="k">{k}</span>
              <span className={`v${k === "Commander" || k === "SLA" ? " g" : " mono"}`}>
                {v}
              </span>
            </span>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <div className="rail-section-h">Timeline · last events</div>
          <div className="timeline">
            {rail.timeline.map((ev, i) => (
              <div key={i} className={`tli${ev.color ? ` ${ev.color}` : ""}`}>
                <span className="w">{ev.time}</span>
                {ev.text}
              </div>
            ))}
          </div>
        </div>

        {/* Stakeholders */}
        {rail.stakeholders.length > 0 && (
          <div>
            <div className="rail-section-h">Stakeholders · {rail.stakeholders.length}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {rail.stakeholders.map((s) => (
                <div
                  key={s.name}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "7px 9px",
                    border: "1px solid var(--line-2)", borderRadius: 6,
                    background: "var(--bg-2)",
                  }}
                >
                  <Av initials={s.initials} gold={s.gold} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: "var(--txt)", fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--txt-4)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: 1 }}>
                      {s.role}
                    </div>
                  </div>
                  <StatusPill status={s.status as Status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {rail.related.length > 0 && (
          <div>
            <div className="rail-section-h">Related · {rail.related.length}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {rail.related.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => r.status !== "kb" && setSelectedId(r.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px",
                    border: "1px solid var(--line-2)", borderRadius: 6,
                    background: "var(--bg-2)", cursor: "pointer",
                    textAlign: "left", fontFamily: "inherit",
                    transition: "all .12s",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--txt-4)", letterSpacing: ".04em", flexShrink: 0 }}>
                    {r.id}
                  </span>
                  <span style={{ flex: 1, fontSize: 12, color: "var(--txt-2)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {r.label}
                  </span>
                  {r.status === "kb"
                    ? <span style={{ color: "var(--gold)", fontFamily: "var(--font-mono)", fontSize: 9.5 }}>↗</span>
                    : <StatusPill status={r.status as Status} />
                  }
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="composer">
          <textarea
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="Post an update for stakeholders…"
          />
          <div className="row">
            <button type="button" className="btn btn-primary btn-sm">
              <RiSendPlaneLine size={12} />
              Post update <span className="kbd">⌘↵</span>
            </button>
            <button type="button" className="btn btn-ghost btn-sm">
              <RiAttachmentLine size={12} />
              Attach runbook
            </button>
            <div className="ghost-info">
              for command{" "}
              <span className="kbd">⌘</span>
              <span className="kbd">K</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
