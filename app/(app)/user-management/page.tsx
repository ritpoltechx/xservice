"use client"

import { useState } from "react"
import {
  RiTeamLine,
  RiAddLine,
  RiSearchLine,
  RiCheckLine,
  RiCloseLine,
  RiUserAddLine,
  RiShieldUserLine,
  RiMailLine,
  RiDeleteBin7Line,
  RiUserSettingsLine,
  RiBuildingLine,
  RiCheckboxCircleLine,
  RiFolder3Line,
  RiEditLine,
  RiErrorWarningLine,
  RiGroupLine,
  RiTimeLine,
  RiArrowRightLine,
} from "@remixicon/react"

/* ── Types ── */
type Role = "Administrator" | "Supporter" | "Developer" | "End User"
type Status = "active" | "suspended" | "pending"
type OrgName = "SCB TechX" | "DataX" | "SCBx Group"
type RequestStatus = "pending" | "approved" | "denied"
type PageTab = "members" | "workspaces"

interface User {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  Organization: OrgName
  initials: string
  workspaces: string[]
  gold?: boolean
}

interface Workspace {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: string
  org: OrgName
}

interface PermissionRequest {
  id: string
  userId: string
  userName: string
  userInitials: string
  userEmail: string
  workspaceId: string
  workspaceName: string
  requestedAt: string
  status: RequestStatus
  note: string
}

/* ── Constants ── */
const ALL_AVAILABLE_WORKSPACES = ["FastEasy", "Zurich Project", "AutoX LOS", "xPlatform", "Access Request", "ITSM"]

const ROLE_COLOR: Record<Role, string> = {
  Administrator: "var(--gold)",
  Supporter:     "var(--blue)",
  Developer:     "var(--green)",
  "End User":    "var(--txt-3)",
}

const ORG_META: Record<OrgName, { color: string; bg: string; border: string }> = {
  "SCB TechX":  { color: "var(--gold)",  bg: "rgba(227,179,65,.10)", border: "rgba(227,179,65,.22)" },
  "DataX":      { color: "var(--blue)",  bg: "rgba(94,106,210,.10)", border: "rgba(94,106,210,.22)" },
  "SCBx Group": { color: "#a78bfa",      bg: "rgba(139,92,246,.10)", border: "rgba(139,92,246,.22)" },
}

/* ── Static data ── */
const INITIAL_USERS: User[] = [
  { id: "USR-001", name: "Maya Chen",   email: "maya.chen@scbtechx.com",  role: "Administrator", status: "active",    Organization: "SCB TechX",  initials: "MC", gold: true, workspaces: ["FastEasy","Zurich Project","AutoX LOS","xPlatform","Access Request","ITSM"] },
  { id: "USR-002", name: "Kai Tan",     email: "kai.tan@scbtechx.com",    role: "Supporter",     status: "active",    Organization: "SCB TechX",  initials: "KT",            workspaces: ["FastEasy","Zurich Project","AutoX LOS","xPlatform"] },
  { id: "USR-003", name: "Jordan T.",   email: "jordan.t@datax.com",      role: "Supporter",     status: "active",    Organization: "DataX",      initials: "JT",            workspaces: ["Zurich Project","AutoX LOS","ITSM"] },
  { id: "USR-004", name: "Riya V.",     email: "riya.v@scbxgroup.com",    role: "End User",      status: "active",    Organization: "SCBx Group", initials: "RV",            workspaces: ["Access Request"] },
  { id: "USR-005", name: "Henry L.",    email: "henry.l@scbtechx.com",    role: "Developer",     status: "active",    Organization: "SCB TechX",  initials: "HL",            workspaces: ["xPlatform","ITSM","Access Request"] },
  { id: "USR-006", name: "Sarah Obi",   email: "sarah.o@datax.com",       role: "End User",      status: "pending",   Organization: "DataX",      initials: "SO",            workspaces: ["FastEasy","Access Request"] },
  { id: "USR-007", name: "Daniel Klee", email: "daniel.k@scbtechx.com",   role: "Supporter",     status: "suspended", Organization: "SCB TechX",  initials: "DK",            workspaces: ["Zurich Project","ITSM"] },
]

const INITIAL_WORKSPACES: Workspace[] = [
  { id: "WS-001", name: "FastEasy",      description: "FastEasy onboarding and service desk flows.",         memberCount: 3, createdAt: "3mo ago", org: "SCB TechX"  },
  { id: "WS-002", name: "Zurich Project",description: "Zurich insurance platform ITSM integration.",        memberCount: 4, createdAt: "2mo ago", org: "SCB TechX"  },
  { id: "WS-003", name: "AutoX LOS",     description: "Loan origination system support and change mgmt.",   memberCount: 3, createdAt: "2mo ago", org: "DataX"      },
  { id: "WS-004", name: "xPlatform",     description: "Internal engineering platform tooling workspace.",   memberCount: 3, createdAt: "6w ago",  org: "SCB TechX"  },
  { id: "WS-005", name: "Access Request",description: "Centralized access and identity request queue.",     memberCount: 5, createdAt: "1mo ago", org: "SCBx Group" },
  { id: "WS-006", name: "ITSM",          description: "Core ITSM workspace for incidents and changes.",     memberCount: 4, createdAt: "1mo ago", org: "SCB TechX"  },
]

const INITIAL_REQUESTS: PermissionRequest[] = [
  { id: "REQ-A1", userId: "USR-004", userName: "Riya V.",    userInitials: "RV", userEmail: "riya.v@scbxgroup.com",  workspaceId: "WS-002", workspaceName: "Zurich Project", requestedAt: "2h ago",    status: "pending", note: "Need access to review SLA reports for the Zurich integration project." },
  { id: "REQ-A2", userId: "USR-006", userName: "Sarah Obi",  userInitials: "SO", userEmail: "sarah.o@datax.com",     workspaceId: "WS-003", workspaceName: "AutoX LOS",      requestedAt: "5h ago",    status: "pending", note: "Onboarding to support Q3 loan ops helpdesk tickets." },
  { id: "REQ-A3", userId: "USR-007", userName: "Daniel Klee",userInitials: "DK", userEmail: "daniel.k@scbtechx.com", workspaceId: "WS-004", workspaceName: "xPlatform",      requestedAt: "Yesterday", status: "pending", note: "Re-requesting access after suspension — awaiting manager sign-off." },
  { id: "REQ-A4", userId: "USR-003", userName: "Jordan T.",  userInitials: "JT", userEmail: "jordan.t@datax.com",    workspaceId: "WS-005", workspaceName: "Access Request",  requestedAt: "2d ago",    status: "approved",note: "Access needed to process hardware requests for Q3 sales hires." },
  { id: "REQ-A5", userId: "USR-002", userName: "Kai Tan",    userInitials: "KT", userEmail: "kai.tan@scbtechx.com",  workspaceId: "WS-006", workspaceName: "ITSM",           requestedAt: "3d ago",    status: "denied",  note: "Requested full admin access — limited to supporter role only." },
]

const MOCK_ACTIVITY: Record<string, { time: string; text: string }[]> = {
  "USR-001": [
    { time: "10m ago",   text: "Approved laptop request REQ-2204" },
    { time: "1h ago",    text: "Resolved system latency incident INC-4182" },
    { time: "Yesterday", text: "Configured Entra ID custom webhook integration" },
  ],
  "USR-002": [
    { time: "2h ago",    text: "Investigating Entra ID SSO 502 callback INC-4180" },
    { time: "Yesterday", text: "Assigned technical responder for Slack bot issue" },
  ],
  "USR-003": [
    { time: "1h ago",    text: "Provisioning laptop specs for Q3 sales hires" },
    { time: "2d ago",    text: "Updated ITAM inventory checklist logs" },
  ],
}

/* ── Sub-components ── */
function Av({ initials, gold, size = 28 }: { initials: string; gold?: boolean; size?: number }) {
  return (
    <span className={`av${gold ? " gold" : ""}`} style={{ width: size, height: size, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </span>
  )
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <span style={{
      fontSize: 10.5, fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: ".04em",
      padding: "3px 7px", borderRadius: 4,
      background: "var(--bg-3)", border: "1px solid var(--line-3)",
      color: ROLE_COLOR[role], whiteSpace: "nowrap",
    }}>{role}</span>
  )
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    active:    { label: "Active",    color: "var(--green)", bg: "rgba(76,183,130,.10)",  border: "rgba(76,183,130,.25)"  },
    pending:   { label: "Invited",   color: "var(--amber)", bg: "rgba(242,153,74,.08)",  border: "rgba(242,153,74,.20)"  },
    suspended: { label: "Suspended", color: "var(--txt-4)", bg: "rgba(87,87,87,.10)",    border: "rgba(87,87,87,.20)"    },
  }
  const m = map[status]
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 10.5, fontFamily: "var(--font-mono)", fontWeight: 600,
      padding: "3px 7px", borderRadius: 4,
      background: m.bg, color: m.color, border: `1px solid ${m.border}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: m.color, flexShrink: 0 }}/>
      {m.label}
    </span>
  )
}

function OrgChip({ org }: { org: OrgName }) {
  const m = ORG_META[org]
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 10.5, fontFamily: "var(--font-mono)", fontWeight: 600,
      padding: "2px 7px", borderRadius: 4,
      background: m.bg, color: m.color, border: `1px solid ${m.border}`,
      whiteSpace: "nowrap",
    }}>
      <RiBuildingLine size={9} />{org}
    </span>
  )
}

/* ── Page ── */
export default function UserManagementPage() {
  const [tab, setTab]                       = useState<PageTab>("members")
  const [users, setUsers]                   = useState<User[]>(INITIAL_USERS)
  const [workspaces, setWorkspaces]         = useState<Workspace[]>(INITIAL_WORKSPACES)
  const [requests, setRequests]             = useState<PermissionRequest[]>(INITIAL_REQUESTS)

  /* members tab */
  const [search, setSearch]                 = useState("")
  const [filterRole, setFilterRole]         = useState<Role | "ALL">("ALL")
  const [selectedId, setSelectedId]         = useState<string | null>("USR-001")

  /* workspaces tab */
  const [wsSearch, setWsSearch]             = useState("")
  const [selectedWsId, setSelectedWsId]     = useState<string | null>("WS-001")
  const [showNewWs, setShowNewWs]           = useState(false)
  const [newWsName, setNewWsName]           = useState("")
  const [newWsDesc, setNewWsDesc]           = useState("")
  const [newWsOrg, setNewWsOrg]             = useState<OrgName>("SCB TechX")
  const [deleteWsId, setDeleteWsId]         = useState<string | null>(null)

  /* invite modal */
  const [showInvite, setShowInvite]         = useState(false)
  const [invName, setInvName]               = useState("")
  const [invEmail, setInvEmail]             = useState("")
  const [invRole, setInvRole]               = useState<Role>("End User")
  const [invOrg, setInvOrg]                 = useState<OrgName>("SCB TechX")
  const [invWs, setInvWs]                   = useState<string[]>(["Access Request"])

  /* ── Actions ── */
  function handleInvite(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!invName.trim() || !invEmail.trim()) return
    const words = invName.trim().split(" ")
    const initials = words.map((w) => w[0]?.toUpperCase()).slice(0, 2).join("")
    const newUser: User = {
      id: `USR-${String(Math.floor(100 + Math.random() * 900))}`,
      name: invName, email: invEmail, role: invRole, status: "pending",
      Organization: invOrg, initials: initials || "UN", workspaces: invWs,
    }
    setUsers((p) => [newUser, ...p])
    setSelectedId(newUser.id)
    setShowInvite(false)
    setInvName(""); setInvEmail(""); setInvRole("End User"); setInvOrg("SCB TechX"); setInvWs(["Access Request"])
  }

  function toggleWorkspace(userId: string, ws: string) {
    setUsers((p) => p.map((u) => {
      if (u.id !== userId) return u
      const has = u.workspaces.includes(ws)
      return { ...u, workspaces: has ? u.workspaces.filter((w) => w !== ws) : [...u.workspaces, ws] }
    }))
  }

  function deleteUser(id: string) {
    setUsers((p) => p.filter((u) => u.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function updateUser(id: string, patch: Partial<User>) {
    setUsers((p) => p.map((u) => u.id === id ? { ...u, ...patch } : u))
  }

  function createWorkspace(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!newWsName.trim()) return
    const ws: Workspace = {
      id: `WS-${String(Math.floor(100 + Math.random() * 900))}`,
      name: newWsName, description: newWsDesc, memberCount: 0,
      createdAt: "just now", org: newWsOrg,
    }
    setWorkspaces((p) => [...p, ws])
    setSelectedWsId(ws.id)
    setShowNewWs(false)
    setNewWsName(""); setNewWsDesc(""); setNewWsOrg("SCB TechX")
  }

  function deleteWorkspace(id: string) {
    setWorkspaces((p) => p.filter((w) => w.id !== id))
    if (selectedWsId === id) setSelectedWsId(null)
    setDeleteWsId(null)
  }

  function resolveRequest(id: string, resolution: "approved" | "denied") {
    const req = requests.find((r) => r.id === id)
    if (!req) return
    setRequests((p) => p.map((r) => r.id === id ? { ...r, status: resolution } : r))
    if (resolution === "approved") {
      setUsers((p) => p.map((u) => {
        if (u.id !== req.userId) return u
        if (u.workspaces.includes(req.workspaceName)) return u
        return { ...u, workspaces: [...u.workspaces, req.workspaceName] }
      }))
    }
  }

  /* ── Derived ── */
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase()
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.Organization.toLowerCase().includes(q)) &&
           (filterRole === "ALL" || u.role === filterRole)
  })
  const selected = users.find((u) => u.id === selectedId)

  const filteredWs = workspaces.filter((w) =>
    w.name.toLowerCase().includes(wsSearch.toLowerCase()) ||
    w.description.toLowerCase().includes(wsSearch.toLowerCase())
  )
  const selectedWs = workspaces.find((w) => w.id === selectedWsId)
  const wsMembers = selectedWs ? users.filter((u) => u.workspaces.includes(selectedWs.name)) : []
  const wsPendingReqs = selectedWs ? requests.filter((r) => r.workspaceName === selectedWs.name && r.status === "pending") : []

  const pendingCount  = requests.filter((r) => r.status === "pending").length
  const totalUsers    = users.length
  const activeCount   = users.filter((u) => u.status === "active").length
  const adminCount    = users.filter((u) => u.role === "Administrator").length
  const invitedCount  = users.filter((u) => u.status === "pending").length

  return (
    <div style={{ display: "flex", flex: 1, minWidth: 0, flexDirection: "column" }}>

      {/* ── Top header (outside scroll) ── */}
      <div style={{ padding: "28px 32px 0", flexShrink: 0 }}>
        <nav className="crumb">
          <a href="#">Administration</a>
          <span className="sep">/</span>
          <span className="cur">User Management</span>
        </nav>

        <div className="title-row" style={{ marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1>User Management</h1>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(227,179,65,.08)", border: "1px solid rgba(227,179,65,.2)", display: "grid", placeItems: "center" }}>
                <RiTeamLine size={16} style={{ color: "var(--gold)" }} />
              </div>
            </div>
            <p className="sub">Manage identities, roles, workspaces, and permission requests.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}
              onClick={() => { setTab("workspaces"); setShowNewWs(true) }}>
              <RiFolder3Line size={13} />
              New Workspace
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setShowInvite(true)}
              style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <RiUserAddLine size={14} />
              Invite member
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats" style={{ marginBottom: 0 }}>
          {[
            { label: "Total members",   value: totalUsers,   icon: RiTeamLine,           color: "var(--txt)"   },
            { label: "Active",          value: activeCount,  icon: RiCheckboxCircleLine, color: "var(--green)" },
            { label: "Pending invites", value: invitedCount, icon: RiMailLine,           color: "var(--amber)" },
            { label: "Administrators",  value: adminCount,   icon: RiShieldUserLine,     color: "var(--gold)"  },
            { label: "Workspaces",      value: workspaces.length, icon: RiFolder3Line,   color: "var(--blue)"  },
            {
              label: "Access requests",
              value: pendingCount,
              icon: RiGroupLine,
              color: pendingCount > 0 ? "var(--red)" : "var(--txt-4)",
            },
          ].map((s) => (
            <div key={s.label} className="stat" style={{ cursor: s.label === "Access requests" && pendingCount > 0 ? "pointer" : undefined }}
              onClick={() => s.label === "Access requests" && pendingCount > 0 && setTab("workspaces")}>
              <div className="k"><s.icon size={12} style={{ color: s.color }} />{s.label}</div>
              <div className="v" style={{ color: s.label === "Administrators" ? "var(--gold)" : s.label === "Access requests" && pendingCount > 0 ? "var(--red)" : undefined }}>
                {s.value}
                {s.label === "Access requests" && pendingCount > 0 && (
                  <span style={{ marginLeft: 6, fontSize: 11, fontFamily: "var(--font-mono)", background: "rgba(235,87,87,.15)", color: "var(--red)", padding: "1px 5px", borderRadius: 4 }}>pending</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--line-2)", marginTop: 24 }}>
          {([
            { id: "members",    label: "Members",    count: users.length    },
            { id: "workspaces", label: "Workspaces", count: workspaces.length, badge: pendingCount > 0 ? pendingCount : undefined },
          ] as const).map((t) => (
            <button key={t.id} type="button"
              onClick={() => setTab(t.id)}
              style={{
                padding: "9px 18px", fontSize: 13, fontFamily: "inherit", cursor: "pointer",
                background: "none", border: "none",
                borderBottom: `2px solid ${tab === t.id ? "var(--gold)" : "transparent"}`,
                color: tab === t.id ? "var(--txt)" : "var(--txt-4)",
                fontWeight: tab === t.id ? 600 : 400,
                display: "flex", alignItems: "center", gap: 7,
                marginBottom: -1, transition: "color .12s",
              }}
            >
              {t.label}
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10.5,
                padding: "1px 6px", borderRadius: 4,
                background: tab === t.id ? "rgba(227,179,65,.12)" : "var(--bg-3)",
                color: tab === t.id ? "var(--gold)" : "var(--txt-5)",
                border: `1px solid ${tab === t.id ? "rgba(227,179,65,.2)" : "var(--line-3)"}`,
              }}>{t.count}</span>
              {"badge" in t && t.badge !== undefined && (
                <span style={{
                  width: 16, height: 16, borderRadius: "50%", fontSize: 9, fontWeight: 700,
                  background: "var(--red)", color: "#fff", display: "grid", placeItems: "center",
                }}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* ════════════ MEMBERS TAB ════════════ */}
        {tab === "members" && (
          <>
            <main style={{ flex: 1, padding: "20px 32px 48px", overflowY: "auto", minWidth: 0 }}>
              <div className="card">
                {/* Toolbar */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderBottom: "1px solid var(--line-2)", flexWrap: "wrap" }}>
                  <div className="search" style={{ maxWidth: 260 }}>
                    <RiSearchLine size={13} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, email, org…" style={{ fontSize: 13 }} />
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {(["ALL", "Administrator", "Supporter", "Developer", "End User"] as const).map((r) => (
                      <button key={r} type="button" onClick={() => setFilterRole(r)}
                        style={{
                          padding: "4px 10px", borderRadius: 999, fontSize: 11.5,
                          fontFamily: "inherit", cursor: "pointer",
                          background: filterRole === r ? "var(--bg-4)" : "transparent",
                          border: `1px solid ${filterRole === r ? "var(--line-4)" : "var(--line-2)"}`,
                          color: filterRole === r ? (r !== "ALL" ? ROLE_COLOR[r] : "var(--txt)") : "var(--txt-4)",
                          transition: "all .12s",
                        }}
                      >{r === "ALL" ? "All roles" : r}</button>
                    ))}
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--txt-4)", fontFamily: "var(--font-mono)" }}>
                    {filteredUsers.length} member{filteredUsers.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {filteredUsers.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--txt-4)", fontSize: 13 }}>No members match your search.</div>
                ) : (
                  <table className="tbl" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ width: 48, paddingLeft: 20 }}></th>
                        <th>Name &amp; Email</th>
                        <th style={{ width: 130 }}>Organization</th>
                        <th style={{ width: 120 }}>Role</th>
                        <th style={{ width: 100 }}>Status</th>
                        <th style={{ width: 200 }}>Workspaces</th>
                        <th style={{ width: 56, paddingRight: 20, textAlign: "right" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} onClick={() => setSelectedId(u.id)}
                          className={selectedId === u.id ? "selected" : ""}
                          style={{ cursor: "pointer", background: selectedId === u.id ? "linear-gradient(90deg,rgba(227,179,65,.08),rgba(227,179,65,.02) 40%,transparent)" : undefined }}>
                          <td style={{ paddingLeft: 20 }}><Av initials={u.initials} gold={u.gold} /></td>
                          <td>
                            <div className="ti">{u.name}</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--txt-4)", marginTop: 1 }}>{u.email}</div>
                          </td>
                          <td><OrgChip org={u.Organization} /></td>
                          <td><RoleBadge role={u.role} /></td>
                          <td><StatusPill status={u.status} /></td>
                          <td>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                              {u.workspaces.slice(0, 3).map((ws) => (
                                <span key={ws} style={{ fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: 3, background: "var(--bg-3)", border: "1px solid var(--line-3)", color: "var(--txt-4)", whiteSpace: "nowrap" }}>{ws}</span>
                              ))}
                              {u.workspaces.length > 3 && (
                                <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: 3, background: "var(--bg-3)", border: "1px solid var(--line-3)", color: "var(--txt-5)" }}>+{u.workspaces.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td style={{ paddingRight: 20 }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                              <button type="button" className="iconbtn" title="Remove" onClick={() => deleteUser(u.id)}
                                style={{ color: "var(--red)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.08)"; e.currentTarget.style.borderColor = "rgba(235,87,87,.2)" }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.borderColor = "var(--line-2)" }}>
                                <RiDeleteBin7Line size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </main>

            {/* Members rail */}
            {selected && (
              <aside className="rail" style={{ width: 320, flexShrink: 0, animation: "item-in .18s ease" }}>
                <div className="rail-hd">
                  <RiUserSettingsLine size={13} style={{ color: "var(--gold)" }} />
                  <span className="t-mono">{selected.id}</span>
                  <button type="button" className="close" onClick={() => setSelectedId(null)}><RiCloseLine size={14} /></button>
                </div>

                {/* Profile */}
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Av initials={selected.initials} gold={selected.gold} size={44} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em" }}>{selected.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--txt-4)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected.email}</div>
                    <div style={{ marginTop: 6, display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <OrgChip org={selected.Organization} />
                      <StatusPill status={selected.status} />
                    </div>
                  </div>
                </div>

                {/* Identity card */}
                <div style={{ borderRadius: 8, border: "1px solid var(--line-2)", overflow: "hidden" }}>
                  <div style={{ padding: "8px 14px", background: "var(--bg-3)", borderBottom: "1px solid var(--line-2)", display: "flex", alignItems: "center", gap: 7 }}>
                    <RiUserSettingsLine size={11} style={{ color: "var(--gold)" }} />
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--gold)", letterSpacing: ".08em", textTransform: "uppercase" }}>Identity &amp; Access</span>
                  </div>
                  <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="field" style={{ margin: 0 }}>
                      <label>Organization</label>
                      <div style={{ display: "flex", gap: 5 }}>
                        {(["SCB TechX","DataX","SCBx Group"] as OrgName[]).map((o) => {
                          const active = selected.Organization === o
                          const m = ORG_META[o]
                          return (
                            <button key={o} type="button" onClick={() => updateUser(selected.id, { Organization: o })}
                              style={{ flex: 1, padding: "6px 4px", borderRadius: 6, fontSize: 10.5, fontFamily: "inherit", cursor: "pointer", textAlign: "center", fontWeight: active ? 600 : 400, background: active ? m.bg : "var(--bg-3)", border: `1px solid ${active ? m.border : "var(--line-2)"}`, color: active ? m.color : "var(--txt-4)", transition: "all .12s" }}>
                              {o}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <label>System Role</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                        {(["End User","Developer","Supporter","Administrator"] as Role[]).map((r) => {
                          const active = selected.role === r
                          return (
                            <button key={r} type="button" onClick={() => updateUser(selected.id, { role: r })}
                              style={{ padding: "6px 8px", borderRadius: 6, fontSize: 11, fontFamily: "inherit", cursor: "pointer", textAlign: "left", fontWeight: active ? 600 : 400, background: active ? "var(--bg-4)" : "var(--bg-3)", border: `1px solid ${active ? "var(--line-4)" : "var(--line-2)"}`, color: active ? ROLE_COLOR[r] : "var(--txt-4)", transition: "all .12s", display: "flex", alignItems: "center", gap: 5 }}>
                              {active && <span style={{ width: 5, height: 5, borderRadius: "50%", background: ROLE_COLOR[r], flexShrink: 0 }}/>}
                              {r}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <label>Login Access</label>
                      <div style={{ display: "flex", gap: 5 }}>
                        {([
                          { v: "active"    as Status, l: "Active"    },
                          { v: "suspended" as Status, l: "Suspended" },
                          { v: "pending"   as Status, l: "Invited"   },
                        ]).map(({ v, l }) => {
                          const active = selected.status === v
                          const colors = { active: "var(--green)", suspended: "var(--txt-4)", pending: "var(--amber)" }
                          return (
                            <button key={v} type="button" onClick={() => updateUser(selected.id, { status: v })}
                              style={{ flex: 1, padding: "6px 4px", borderRadius: 6, fontSize: 10.5, fontFamily: "inherit", cursor: "pointer", textAlign: "center", fontWeight: active ? 600 : 400, background: active ? "var(--bg-4)" : "var(--bg-3)", border: `1px solid ${active ? "var(--line-4)" : "var(--line-2)"}`, color: active ? colors[v] : "var(--txt-4)", transition: "all .12s" }}>
                              {l}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workspace chips */}
                <div style={{ borderRadius: 8, border: "1px solid var(--line-2)", overflow: "hidden" }}>
                  <div style={{ padding: "8px 14px", background: "var(--bg-3)", borderBottom: "1px solid var(--line-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <RiFolder3Line size={11} style={{ color: "var(--txt-4)" }} />
                      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--txt-3)", letterSpacing: ".08em", textTransform: "uppercase" }}>Workspace Access</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--txt-4)" }}>{selected.workspaces.length}/{ALL_AVAILABLE_WORKSPACES.length}</span>
                  </div>
                  <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Active chips */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, minHeight: 28 }}>
                      {selected.workspaces.length === 0 && (
                        <span style={{ fontSize: 11.5, color: "var(--txt-5)", fontFamily: "var(--font-mono)" }}>No workspaces assigned</span>
                      )}
                      {selected.workspaces.map((ws) => (
                        <span key={ws} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 6px 3px 9px", borderRadius: 999, background: "rgba(227,179,65,.12)", border: "1px solid rgba(227,179,65,.28)", fontSize: 11.5, fontWeight: 500, color: "var(--gold)", whiteSpace: "nowrap" }}>
                          {ws}
                          <button type="button" onClick={() => toggleWorkspace(selected.id, ws)}
                            style={{ width: 14, height: 14, borderRadius: "50%", border: "none", background: "rgba(227,179,65,.2)", color: "var(--gold)", display: "grid", placeItems: "center", cursor: "pointer", padding: 0, flexShrink: 0, transition: "all .12s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.3)"; e.currentTarget.style.color = "var(--red)" }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(227,179,65,.2)"; e.currentTarget.style.color = "var(--gold)" }}>
                            <RiCloseLine size={9} />
                          </button>
                        </span>
                      ))}
                    </div>
                    {/* Available pills */}
                    {ALL_AVAILABLE_WORKSPACES.filter((w) => !selected.workspaces.includes(w)).length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingTop: 6, borderTop: "1px solid var(--line-2)" }}>
                        {ALL_AVAILABLE_WORKSPACES.filter((w) => !selected.workspaces.includes(w)).map((ws) => (
                          <button key={ws} type="button" onClick={() => toggleWorkspace(selected.id, ws)}
                            style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 999, background: "var(--bg-3)", border: "1px solid var(--line-3)", fontSize: 11, color: "var(--txt-4)", cursor: "pointer", fontFamily: "inherit", transition: "all .12s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(227,179,65,.3)"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.background = "rgba(227,179,65,.06)" }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line-3)"; e.currentTarget.style.color = "var(--txt-4)"; e.currentTarget.style.background = "var(--bg-3)" }}>
                            <RiAddLine size={10} />{ws}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <div className="rail-section-h">
                    <RiTimeLine size={11} style={{ color: "var(--txt-4)" }} />
                    Recent activity
                  </div>
                  <div className="timeline">
                    {(MOCK_ACTIVITY[selected.id] ?? [
                      { time: "Just now",  text: "Accessed User Management" },
                      { time: "Yesterday", text: "Workspace permissions synchronized" },
                    ]).map((a, i) => (
                      <div key={i} className="tli blue"><span className="w">{a.time}</span>{a.text}</div>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </>
        )}

        {/* ════════════ WORKSPACES TAB ════════════ */}
        {tab === "workspaces" && (
          <>
            <main style={{ flex: 1, padding: "20px 32px 48px", overflowY: "auto", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Workspace list card */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderBottom: "1px solid var(--line-2)" }}>
                  <div className="search" style={{ maxWidth: 260 }}>
                    <RiSearchLine size={13} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
                    <input value={wsSearch} onChange={(e) => setWsSearch(e.target.value)}
                      placeholder="Search workspaces…" style={{ fontSize: 13 }} />
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--txt-4)", fontFamily: "var(--font-mono)" }}>
                    {filteredWs.length} workspace{filteredWs.length !== 1 ? "s" : ""}
                  </div>
                  <button type="button" className="btn btn-primary btn-sm"
                    onClick={() => setShowNewWs(true)}
                    style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <RiAddLine size={13} />New workspace
                  </button>
                </div>

                <table className="tbl" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: 20 }}>Workspace</th>
                      <th style={{ width: 130 }}>Organization</th>
                      <th style={{ width: 80, textAlign: "center" }}>Members</th>
                      <th style={{ width: 90 }}>Created</th>
                      <th style={{ width: 80, paddingRight: 20, textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWs.map((ws) => {
                      const pendingForWs = requests.filter((r) => r.workspaceName === ws.name && r.status === "pending").length
                      return (
                        <tr key={ws.id}
                          onClick={() => setSelectedWsId(ws.id)}
                          className={selectedWsId === ws.id ? "selected" : ""}
                          style={{ cursor: "pointer", background: selectedWsId === ws.id ? "linear-gradient(90deg,rgba(227,179,65,.08),rgba(227,179,65,.02) 40%,transparent)" : undefined }}>
                          <td style={{ paddingLeft: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--bg-3)", border: "1px solid var(--line-3)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                                <RiFolder3Line size={14} style={{ color: "var(--txt-4)" }} />
                              </div>
                              <div>
                                <div className="ti" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                  {ws.name}
                                  {pendingForWs > 0 && (
                                    <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "rgba(235,87,87,.15)", color: "var(--red)", fontFamily: "var(--font-mono)" }}>
                                      {pendingForWs} pending
                                    </span>
                                  )}
                                </div>
                                <div className="sub" style={{ maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ws.description}</div>
                              </div>
                            </div>
                          </td>
                          <td><OrgChip org={ws.org} /></td>
                          <td style={{ textAlign: "center" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--txt-2)" }}>{ws.memberCount}</span>
                          </td>
                          <td>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--txt-4)" }}>{ws.createdAt}</span>
                          </td>
                          <td style={{ paddingRight: 20 }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                              <button type="button" className="iconbtn" title="Edit"><RiEditLine size={13} /></button>
                              <button type="button" className="iconbtn" title="Delete workspace"
                                onClick={() => setDeleteWsId(ws.id)}
                                style={{ color: "var(--red)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.08)"; e.currentTarget.style.borderColor = "rgba(235,87,87,.2)" }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.borderColor = "var(--line-2)" }}>
                                <RiDeleteBin7Line size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Permission requests */}
              <div>
                <div className="sect-h">
                  <h3>
                    Permission Requests
                    <span style={{ color: "var(--txt-4)", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>{requests.length}</span>
                    {pendingCount > 0 && (
                      <span style={{ marginLeft: 8, fontSize: 11, fontFamily: "var(--font-mono)", background: "rgba(235,87,87,.12)", color: "var(--red)", padding: "2px 7px", borderRadius: 4, border: "1px solid rgba(235,87,87,.2)" }}>
                        {pendingCount} pending action
                      </span>
                    )}
                  </h3>
                </div>

                <div className="card">
                  {requests.length === 0 ? (
                    <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--txt-4)", fontSize: 13 }}>No permission requests.</div>
                  ) : (
                    <table className="tbl" style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th style={{ paddingLeft: 20 }}>Requested by</th>
                          <th style={{ width: 160 }}>Workspace</th>
                          <th style={{ width: 200 }}>Note</th>
                          <th style={{ width: 90 }}>Requested</th>
                          <th style={{ width: 100 }}>Status</th>
                          <th style={{ width: 140, paddingRight: 20, textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req) => (
                          <tr key={req.id}>
                            <td style={{ paddingLeft: 20 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                <Av initials={req.userInitials} />
                                <div>
                                  <div className="ti">{req.userName}</div>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--txt-4)" }}>{req.userEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: "var(--txt-2)" }}>
                                <RiFolder3Line size={12} style={{ color: "var(--txt-4)" }} />
                                {req.workspaceName}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: 12, color: "var(--txt-4)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {req.note}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--txt-4)" }}>{req.requestedAt}</span>
                            </td>
                            <td>
                              {req.status === "pending" && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontFamily: "var(--font-mono)", padding: "3px 7px", borderRadius: 4, background: "rgba(242,153,74,.08)", color: "var(--amber)", border: "1px solid rgba(242,153,74,.2)" }}>
                                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--amber)" }}/>Pending
                                </span>
                              )}
                              {req.status === "approved" && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontFamily: "var(--font-mono)", padding: "3px 7px", borderRadius: 4, background: "rgba(76,183,130,.10)", color: "var(--green)", border: "1px solid rgba(76,183,130,.25)" }}>
                                  <RiCheckLine size={10} />Approved
                                </span>
                              )}
                              {req.status === "denied" && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontFamily: "var(--font-mono)", padding: "3px 7px", borderRadius: 4, background: "rgba(87,87,87,.10)", color: "var(--txt-4)", border: "1px solid rgba(87,87,87,.2)" }}>
                                  <RiCloseLine size={10} />Denied
                                </span>
                              )}
                            </td>
                            <td style={{ paddingRight: 20 }}>
                              {req.status === "pending" ? (
                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                  <button type="button"
                                    onClick={() => resolveRequest(req.id, "approved")}
                                    style={{
                                      display: "flex", alignItems: "center", gap: 5,
                                      padding: "5px 10px", borderRadius: 6, fontSize: 12,
                                      background: "rgba(76,183,130,.12)", border: "1px solid rgba(76,183,130,.28)",
                                      color: "var(--green)", cursor: "pointer", fontFamily: "inherit",
                                      transition: "all .12s",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(76,183,130,.2)" }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(76,183,130,.12)" }}>
                                    <RiCheckLine size={12} />Accept
                                  </button>
                                  <button type="button"
                                    onClick={() => resolveRequest(req.id, "denied")}
                                    style={{
                                      display: "flex", alignItems: "center", gap: 5,
                                      padding: "5px 10px", borderRadius: 6, fontSize: 12,
                                      background: "rgba(235,87,87,.08)", border: "1px solid rgba(235,87,87,.22)",
                                      color: "var(--red)", cursor: "pointer", fontFamily: "inherit",
                                      transition: "all .12s",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.16)" }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.08)" }}>
                                    <RiCloseLine size={12} />Deny
                                  </button>
                                </div>
                              ) : (
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                  <span style={{ fontSize: 11.5, color: "var(--txt-5)", fontFamily: "var(--font-mono)" }}>Resolved</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </main>

            {/* Workspace detail rail */}
            {selectedWs && (
              <aside className="rail" style={{ width: 320, flexShrink: 0, animation: "item-in .18s ease" }}>
                <div className="rail-hd">
                  <RiFolder3Line size={13} style={{ color: "var(--gold)" }} />
                  <span className="t-mono">{selectedWs.id}</span>
                  <button type="button" className="close" onClick={() => setSelectedWsId(null)}><RiCloseLine size={14} /></button>
                </div>

                {/* WS header */}
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-3)", border: "1px solid var(--line-3)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <RiFolder3Line size={20} style={{ color: "var(--txt-3)" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em" }}>{selectedWs.name}</div>
                    <div style={{ fontSize: 12, color: "var(--txt-4)", marginTop: 3, lineHeight: 1.5 }}>{selectedWs.description}</div>
                    <div style={{ marginTop: 6 }}><OrgChip org={selectedWs.org} /></div>
                  </div>
                </div>

                {/* Meta */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { k: "Members", v: String(wsMembers.length) },
                    { k: "Created", v: selectedWs.createdAt },
                    { k: "Pending requests", v: String(wsPendingReqs.length) },
                  ].map(({ k, v }) => (
                    <div key={k} style={{ padding: "10px 12px", borderRadius: 7, background: "var(--bg-2)", border: "1px solid var(--line-2)" }}>
                      <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--txt-5)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--txt)", fontVariantNumeric: "tabular-nums" }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Members in workspace */}
                <div>
                  <div className="rail-section-h">
                    <RiGroupLine size={11} style={{ color: "var(--txt-4)" }} />
                    Members · {wsMembers.length}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {wsMembers.length === 0 && (
                      <p style={{ fontSize: 12, color: "var(--txt-5)", margin: 0 }}>No members in this workspace.</p>
                    )}
                    {wsMembers.map((u) => (
                      <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 7, background: "var(--bg-2)", border: "1px solid var(--line-2)" }}>
                        <Av initials={u.initials} gold={u.gold} size={26} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--txt)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--txt-5)", marginTop: 1 }}>{u.role}</div>
                        </div>
                        <StatusPill status={u.status} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending requests for this workspace */}
                {wsPendingReqs.length > 0 && (
                  <div>
                    <div className="rail-section-h">
                      <RiArrowRightLine size={11} style={{ color: "var(--amber)" }} />
                      <span style={{ color: "var(--amber)" }}>Pending requests · {wsPendingReqs.length}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {wsPendingReqs.map((req) => (
                        <div key={req.id} style={{ padding: "10px 12px", borderRadius: 7, background: "rgba(242,153,74,.05)", border: "1px solid rgba(242,153,74,.18)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <Av initials={req.userInitials} size={24} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--txt)" }}>{req.userName}</div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--txt-5)" }}>{req.requestedAt}</div>
                            </div>
                          </div>
                          <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "var(--txt-3)", lineHeight: 1.5 }}>{req.note}</p>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button type="button" onClick={() => resolveRequest(req.id, "approved")}
                              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px", borderRadius: 6, fontSize: 12, background: "rgba(76,183,130,.12)", border: "1px solid rgba(76,183,130,.28)", color: "var(--green)", cursor: "pointer", fontFamily: "inherit", transition: "background .12s" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(76,183,130,.22)" }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(76,183,130,.12)" }}>
                              <RiCheckLine size={12} />Accept
                            </button>
                            <button type="button" onClick={() => resolveRequest(req.id, "denied")}
                              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px", borderRadius: 6, fontSize: 12, background: "rgba(235,87,87,.08)", border: "1px solid rgba(235,87,87,.22)", color: "var(--red)", cursor: "pointer", fontFamily: "inherit", transition: "background .12s" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.16)" }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.08)" }}>
                              <RiCloseLine size={12} />Deny
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delete workspace */}
                <button type="button" onClick={() => setDeleteWsId(selectedWs.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 7, fontSize: 12.5, background: "rgba(235,87,87,.06)", border: "1px solid rgba(235,87,87,.18)", color: "var(--red)", cursor: "pointer", fontFamily: "inherit", transition: "background .12s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.12)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(235,87,87,.06)" }}>
                  <RiDeleteBin7Line size={13} />Delete workspace
                </button>
              </aside>
            )}
          </>
        )}
      </div>

      {/* ── New workspace modal ── */}
      {showNewWs && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowNewWs(false)}>
          <form onSubmit={createWorkspace} onClick={(e) => e.stopPropagation()}
            className="card"
            style={{ width: 440, padding: "28px 28px 24px", boxShadow: "0 32px 64px -16px rgba(0,0,0,.8)", animation: "item-in .18s ease", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(94,106,210,.10)", border: "1px solid rgba(94,106,210,.22)", display: "grid", placeItems: "center" }}>
                <RiFolder3Line size={20} style={{ color: "var(--blue)" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--blue)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 2 }}>New workspace</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em" }}>Create Workspace</h3>
              </div>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Workspace name</label>
              <input type="text" required className="input" value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)} placeholder="e.g. Project Alpha" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Description <span style={{ color: "var(--txt-5)" }}>(optional)</span></label>
              <input type="text" className="input" value={newWsDesc}
                onChange={(e) => setNewWsDesc(e.target.value)} placeholder="Brief description of this workspace" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Organization</label>
              <select className="input" style={{ paddingRight: 8 }} value={newWsOrg} onChange={(e) => setNewWsOrg(e.target.value as OrgName)}>
                <option>SCB TechX</option><option>DataX</option><option>SCBx Group</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowNewWs(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RiAddLine size={13} />Create workspace
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Invite modal ── */}
      {showInvite && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowInvite(false)}>
          <form onSubmit={handleInvite} onClick={(e) => e.stopPropagation()}
            className="card"
            style={{ width: 480, padding: "28px 28px 24px", boxShadow: "0 32px 64px -16px rgba(0,0,0,.8)", animation: "item-in .18s ease", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(227,179,65,.08)", border: "1px solid rgba(227,179,65,.2)", display: "grid", placeItems: "center" }}>
                <RiUserAddLine size={20} style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--gold)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 2 }}>Provision identity</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em" }}>Invite new member</h3>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Full name</label>
                <input type="text" required className="input" value={invName} onChange={(e) => setInvName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Email address</label>
                <input type="email" required className="input" value={invEmail} onChange={(e) => setInvEmail(e.target.value)} placeholder="jane@scbtechx.com" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>System role</label>
                <select className="input" style={{ paddingRight: 8 }} value={invRole} onChange={(e) => setInvRole(e.target.value as Role)}>
                  <option>End User</option><option>Developer</option><option>Supporter</option><option>Administrator</option>
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Organization</label>
                <select className="input" style={{ paddingRight: 8 }} value={invOrg} onChange={(e) => setInvOrg(e.target.value as OrgName)}>
                  <option>SCB TechX</option><option>DataX</option><option>SCBx Group</option>
                </select>
              </div>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Workspace permissions</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
                {ALL_AVAILABLE_WORKSPACES.map((ws) => {
                  const checked = invWs.includes(ws)
                  return (
                    <label key={ws} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, cursor: "pointer", background: checked ? "var(--bg-3)" : "var(--bg-2)", border: `1px solid ${checked ? "var(--line-3)" : "var(--line-2)"}`, transition: "all .12s", textTransform: "none", fontFamily: "inherit" }}>
                      <input type="checkbox" checked={checked}
                        onChange={(e) => { if (e.target.checked) setInvWs((p) => [...p, ws]); else setInvWs((p) => p.filter((w) => w !== ws)) }}
                        style={{ accentColor: "var(--gold)", width: 13, height: 13 }} />
                      <span style={{ fontSize: 12.5, color: checked ? "var(--txt)" : "var(--txt-3)", fontWeight: checked ? 500 : 400 }}>{ws}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowInvite(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RiMailLine size={13} />Send invite
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Delete workspace confirm ── */}
      {deleteWsId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setDeleteWsId(null)}>
          <div onClick={(e) => e.stopPropagation()} className="card"
            style={{ width: 400, padding: "28px 28px 24px", boxShadow: "0 32px 64px -16px rgba(0,0,0,.8)", animation: "item-in .18s ease" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 16, background: "rgba(235,87,87,.10)", border: "1px solid rgba(235,87,87,.25)", display: "grid", placeItems: "center" }}>
              <RiErrorWarningLine size={20} style={{ color: "var(--red)" }} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em" }}>Delete workspace?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--txt-3)", lineHeight: 1.55 }}>
              This will remove the workspace and revoke access for all {workspaces.find((w) => w.id === deleteWsId)?.memberCount ?? 0} members. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDeleteWsId(null)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={() => deleteWorkspace(deleteWsId)}>Delete workspace</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes item-in {
          from { opacity: 0; transform: translateY(8px) scale(.98) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
        .rail-section-h { display: flex; align-items: center; gap: 6px; }
      `}</style>
    </div>
  )
}
