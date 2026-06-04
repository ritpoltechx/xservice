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
  RiComputerLine,
  RiBuildingLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
} from "@remixicon/react"

/* ── Types & Interfaces ── */
type Role = "Administrator" | "Supporter" | "Developer" | "End User"
type Status = "active" | "suspended" | "pending"

interface User {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  department: string
  initials: string
  workspaces: string[]
  gold?: boolean
}

const ALL_AVAILABLE_WORKSPACES = [
  "FastEasy",
  "Zurich Project",
  "AutoX LOS",
  "xPlatform",
  "Access Request",
  "ITSM",
]

/* ── Static initial users data ── */
const INITIAL_USERS: User[] = [
  {
    id: "USR-001",
    name: "Maya Chen",
    email: "maya.chen@scbtechx.com",
    role: "Administrator",
    status: "active",
    department: "SCB TechX",
    initials: "MC",
    workspaces: ["FastEasy", "Zurich Project", "AutoX LOS", "xPlatform", "Access Request", "ITSM"],
    gold: true,
  },
  {
    id: "USR-002",
    name: "Kai Tan",
    email: "kai.tan@scbtechx.com",
    role: "Supporter",
    status: "active",
    department: "SCB TechX",
    initials: "KT",
    workspaces: ["FastEasy", "Zurich Project", "AutoX LOS", "xPlatform"],
  },
  {
    id: "USR-003",
    name: "Jordan T.",
    email: "jordan.t@datax.com",
    role: "Supporter",
    status: "active",
    department: "DataX",
    initials: "JT",
    workspaces: ["Zurich Project", "AutoX LOS", "ITSM"],
  },
  {
    id: "USR-004",
    name: "Riya V.",
    email: "riya.v@scbxgroup.com",
    role: "End User",
    status: "active",
    department: "SCBx Group",
    initials: "RV",
    workspaces: ["Access Request"],
  },
  {
    id: "USR-005",
    name: "Henry L.",
    email: "henry.l@scbtechx.com",
    role: "Developer",
    status: "active",
    department: "SCB TechX",
    initials: "HL",
    workspaces: ["xPlatform", "ITSM", "Access Request"],
  },
  {
    id: "USR-006",
    name: "Sarah Obi",
    email: "sarah.o@datax.com",
    role: "End User",
    status: "pending",
    department: "DataX",
    initials: "SO",
    workspaces: ["FastEasy", "Access Request"],
  },
  {
    id: "USR-007",
    name: "Daniel Klee",
    email: "daniel.k@scbtechx.com",
    role: "Supporter",
    status: "suspended",
    department: "SCB TechX",
    initials: "DK",
    workspaces: ["Zurich Project", "ITSM"],
  },
]

// Mock User Activity data based on User ID
const MOCK_ACTIVITY: Record<string, { time: string; text: string }[]> = {
  "USR-001": [
    { time: "10m ago", text: "Approved laptop request REQ-2204" },
    { time: "1h ago", text: "Resolved system latency incident INC-4182" },
    { time: "Yesterday", text: "Configured Entra ID custom webhook integration" },
  ],
  "USR-002": [
    { time: "2h ago", text: "Investigating Entra ID SSO 502 callback error INC-4180" },
    { time: "Yesterday", text: "Assigned technical responder for Slack bot issue" },
  ],
  "USR-003": [
    { time: "1h ago", text: "Provisioning laptop specs for Q3 sales hires" },
    { time: "2d ago", text: "Updated ITAM inventory checklist logs" },
  ],
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState<Role | "ALL">("ALL")
  const [selectedUserId, setSelectedUserId] = useState<string | null>("USR-001")
  
  // Invite Member Modal states
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("End User")
  const [inviteDept, setInviteDept] = useState("SCB TechX")
  const [inviteWorkspaces, setInviteWorkspaces] = useState<string[]>(["Access Request"])

  // Handle Invitation Submit
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return

    const words = inviteName.trim().split(" ")
    const initials = words.map(w => w[0]?.toUpperCase()).slice(0, 2).join("")

    const newUser: User = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      department: inviteDept,
      initials: initials || "UN",
      workspaces: inviteWorkspaces,
    }

    setUsers(prev => [newUser, ...prev])
    setSelectedUserId(newUser.id)
    setShowInviteModal(false)

    // Clear inputs
    setInviteName("")
    setInviteEmail("")
    setInviteRole("End User")
    setInviteDept("SCB TechX")
    setInviteWorkspaces(["Access Request"])
  }

  // Toggle user status between active and suspended
  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          status: u.status === "active" ? "suspended" : "active",
        }
      }
      return u
    }))
  }

  // Edit user role
  const handleRoleChange = (id: string, newRole: Role) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
  }

  // Edit user status directly
  const handleStatusChange = (id: string, newStatus: Status) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u))
  }

  // Edit user department
  const handleDeptChange = (id: string, newDept: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, department: newDept } : u))
  }

  // Toggle single workspace access for a user
  const handleToggleWorkspace = (id: string, wsName: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const hasAccess = u.workspaces.includes(wsName)
        const updated = hasAccess 
          ? u.workspaces.filter(w => w !== wsName)
          : [...u.workspaces, wsName]
        return { ...u, workspaces: updated }
      }
      return u
    }))
  }

  // Delete User
  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    if (selectedUserId === id) {
      setSelectedUserId(null)
    }
  }

  // Filtered Users list
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.department.toLowerCase().includes(search.toLowerCase())
    const matchesRole = filterRole === "ALL" || u.role === filterRole
    return matchesSearch && matchesRole
  })

  // Selected User resolution
  const selectedUser = users.find(u => u.id === selectedUserId)

  // KPI Computations
  const totalUsers = users.length
  const activeCount = users.filter(u => u.status === "active").length
  const pendingCount = users.filter(u => u.status === "pending").length
  const adminCount = users.filter(u => u.role === "Administrator").length

  // Truncate function for displaying top 3 workspaces in table list
  const formatWorkspacesList = (userWs: string[]) => {
    if (userWs.length === 0) return "No workspaces"
    if (userWs.length <= 3) return userWs.join(", ")
    return `${userWs.slice(0, 3).join(", ")} (+${userWs.length - 3})`
  }

  return (
    <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
      {/* ── Main Panel ── */}
      <main style={{ flex: 1, padding: "28px 32px 48px", display: "flex", flexDirection: "column", gap: 0, overflowY: "auto", minWidth: 0 }}>
        
        {/* Breadcrumb */}
        <nav className="crumb">
          <a href="/dashboard">Administration</a>
          <span className="sep">/</span>
          <span className="cur">User Management</span>
        </nav>

        {/* Title Row */}
        <div className="title-row" style={{ marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ color: "var(--txt)" }}>User Management</h1>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(227,179,65,.08)", border: "1px solid rgba(227,179,65,.2)",
                display: "grid", placeItems: "center",
              }}>
                <RiTeamLine size={16} style={{ color: "var(--gold)" }} />
              </div>
            </div>
            <p className="sub">
              Manage identities, provision SaaS support groups, assign access controls, and monitor active user sessions.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowInviteModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <RiUserAddLine size={14} />
            Invite Member
          </button>
        </div>

        {/* KPI Stats Panel */}
        <div className="stats" style={{ marginBottom: 28 }}>
          {[
            { label: "Total Members", value: String(totalUsers), icon: RiTeamLine, color: "var(--txt)" },
            { label: "Active Sessions", value: String(activeCount), icon: RiCheckLine, color: "var(--green)" },
            { label: "Pending Invites", value: String(pendingCount), icon: RiMailLine, color: "var(--amber)" },
            { label: "Administrators", value: String(adminCount), icon: RiShieldUserLine, color: "var(--gold)" },
          ].map(s => (
            <div key={s.label} className="stat">
              <div className="k">
                <s.icon size={12} style={{ color: s.color }} />
                {s.label}
              </div>
              <div className="v" style={s.label === "Administrators" ? { color: "var(--gold)" } : undefined}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Users Table Card */}
        <div className="card" style={{ flex: 1 }}>
          {/* Table Toolbar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            borderBottom: "1px solid var(--line-2)",
          }}>
            {/* Search */}
            <div className="search" style={{ maxWidth: 280 }}>
              <RiSearchLine size={13} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, department…"
                style={{ fontSize: 13 }}
              />
            </div>

            {/* Role Filter Tabs */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                className={filterRole === "ALL" ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
                onClick={() => setFilterRole("ALL")}
                style={{ padding: "5px 12px", borderRadius: 999 }}
              >
                All
              </button>
              {(["Administrator", "Supporter", "Developer", "End User"] as Role[]).map(r => (
                <button
                  key={r}
                  type="button"
                  className={filterRole === r ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
                  onClick={() => setFilterRole(r)}
                  style={{ padding: "5px 12px", borderRadius: 999 }}
                >
                  {r}
                </button>
              ))}
            </div>

            <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--txt-4)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
              {filteredUsers.length} member{filteredUsers.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table list */}
          {filteredUsers.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--txt-4)", fontSize: 13 }}>
              No members found matching the search criteria.
            </div>
          ) : (
            <table className="tbl" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: 48, paddingLeft: 20 }}></th>
                  <th>Name &amp; Email</th>
                  <th style={{ width: 130 }}>Department</th>
                  <th style={{ width: 220 }}>Workspace Permissions (Top 3)</th>
                  <th style={{ width: 130 }}>Role</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th style={{ width: 90, paddingRight: 20, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={selectedUserId === user.id ? "selected" : ""}
                    style={
                      selectedUserId === user.id
                        ? { background: "linear-gradient(90deg,rgba(227,179,65,.08),rgba(227,179,65,.02) 40%,transparent)" }
                        : undefined
                    }
                  >
                    {/* Initials Avatar */}
                    <td style={{ paddingLeft: 20 }}>
                      <span className={`av${user.gold ? " gold" : ""}`} style={{ width: 26, height: 26, fontSize: 9 }}>
                        {user.initials}
                      </span>
                    </td>

                    {/* Name & Email */}
                    <td>
                      <div className="ti">{user.name}</div>
                      <div className="sub" style={{ textTransform: "none", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                        {user.email}
                      </div>
                    </td>

                    {/* Department */}
                    <td>
                      <span style={{ fontSize: 12.5, color: "var(--txt-2)", fontWeight: 500 }}>
                        {user.department}
                      </span>
                    </td>

                    {/* Workspace list display (top 3, truncated count) */}
                    <td>
                      <span style={{ fontSize: 12.5, color: "var(--txt-3)", lineHeight: 1.4 }}>
                        {formatWorkspacesList(user.workspaces)}
                      </span>
                    </td>

                    {/* Role tag */}
                    <td>
                      <span className="tag" style={{
                        fontSize: 10.5,
                        color: user.role === "Administrator" ? "var(--gold)" : user.role === "Supporter" ? "var(--blue)" : user.role === "Developer" ? "var(--green)" : "var(--txt-3)",
                        borderColor: user.role === "Administrator" ? "rgba(227,179,65,.25)" : "var(--line-2)"
                      }}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td>
                      <span className={`st ${user.status}`} style={{ fontSize: 9, padding: "2px 6px" }}>
                        <span className="d" />
                        {user.status === "active" ? "Active" : user.status === "pending" ? "Invited" : "Suspended"}
                      </span>
                    </td>

                    {/* Delete action button */}
                    <td style={{ paddingRight: 20 }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="iconbtn"
                          title="Delete Member"
                          onClick={() => handleDeleteUser(user.id)}
                          style={{ color: "var(--red)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(235,87,87,.08)"
                            e.currentTarget.style.borderColor = "rgba(235,87,87,.2)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "var(--bg-2)"
                            e.currentTarget.style.borderColor = "var(--line-2)"
                          }}
                        >
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

      {/* ── Right Rail Profile Detail Sidebar ── */}
      {selectedUser && (
        <aside className="rail" style={{ width: 360, flexShrink: 0, animation: "item-in .2s ease-out" }}>
          {/* Header */}
          <div className="rail-hd">
            <RiUserSettingsLine size={13} style={{ color: "var(--gold)" }} />
            <span className="t-mono">MEMBER DETAILS</span>
            <button
              type="button"
              className="close"
              onClick={() => setSelectedUserId(null)}
            >
              <RiCloseLine size={14} />
            </button>
          </div>

          {/* Profile Card Header */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span className={`av${selectedUser.gold ? " gold" : ""}`} style={{ width: 48, height: 48, fontSize: 16 }}>
              {selectedUser.initials}
            </span>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--txt)", margin: 0 }}>
                {selectedUser.name}
              </h2>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--txt-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                {selectedUser.email}
              </div>
            </div>
          </div>

          {/* User Settings Edit Panel */}
          <div className="card" style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--gold)", letterSpacing: ".05em" }}>
              IDENTITY SETTINGS
            </div>
            
            {/* Department */}
            <div className="field">
              <label>Department / Segment</label>
              <select
                className="input"
                value={selectedUser.department}
                onChange={(e) => handleDeptChange(selectedUser.id, e.target.value)}
                style={{ padding: "8px 10px", fontSize: 12.5 }}
              >
                <option value="SCB TechX">SCB TechX</option>
                <option value="DataX">DataX</option>
                <option value="SCBx Group">SCBx Group</option>
              </select>
            </div>

            {/* Role */}
            <div className="field">
              <label>Authorized System Role</label>
              <select
                className="input"
                value={selectedUser.role}
                onChange={(e) => handleRoleChange(selectedUser.id, e.target.value as Role)}
                style={{ padding: "8px 10px", fontSize: 12.5 }}
              >
                <option value="End User">End User</option>
                <option value="Developer">Developer</option>
                <option value="Supporter">Supporter</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            {/* Status */}
            <div className="field">
              <label>Workspace Login Access</label>
              <select
                className="input"
                value={selectedUser.status}
                onChange={(e) => handleStatusChange(selectedUser.id, e.target.value as Status)}
                style={{ padding: "8px 10px", fontSize: 12.5 }}
              >
                <option value="active">Active (Granted)</option>
                <option value="suspended">Suspended (Blocked)</option>
                <option value="pending">Invited (Awaiting registration)</option>
              </select>
            </div>
          </div>

          {/* All Workspace Permissions (Toggleable) */}
          <div>
            <div className="rail-section-h" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Workspace Access ({selectedUser.workspaces.length})</span>
            </div>
            <p style={{ fontSize: 11.5, color: "var(--txt-4)", margin: "0 0 10px", lineHeight: 1.4 }}>
              Toggle switches to grant or revoke sandbox environment permissions.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ALL_AVAILABLE_WORKSPACES.map(ws => {
                const hasAccess = selectedUser.workspaces.includes(ws)
                return (
                  <div
                    key={ws}
                    style={{
                      display: "flex", alignItems: "center",
                      padding: "8px 10px", border: "1px solid var(--line-2)",
                      borderRadius: 6, background: "var(--bg-2)",
                      justifyContent: "space-between"
                    }}
                  >
                    <span style={{ fontSize: 12.5, color: hasAccess ? "var(--txt)" : "var(--txt-3)", fontWeight: 500 }}>
                      {ws}
                    </span>

                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={() => handleToggleWorkspace(selectedUser.id, ws)}
                      style={{
                        width: 32, height: 18, borderRadius: 9, border: "none",
                        background: hasAccess ? "linear-gradient(135deg, var(--gold-2), var(--gold))" : "var(--bg-4)",
                        position: "relative", cursor: "pointer", flexShrink: 0,
                        transition: "background .15s",
                        boxShadow: hasAccess ? "0 0 0 1px var(--gold-glow)" : "0 0 0 1px var(--line-3)",
                      }}
                    >
                      <span style={{
                        position: "absolute", top: 2, left: hasAccess ? 16 : 2,
                        width: 14, height: 14, borderRadius: "50%",
                        background: hasAccess ? "#fff" : "var(--txt-5)",
                        transition: "left .15s cubic-bezier(.4,0,.2,1), background .15s",
                      }}/>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* User History Logs */}
          <div>
            <div className="rail-section-h">Recent Activity Logs</div>
            <div className="timeline" style={{ paddingLeft: 18, marginTop: 10 }}>
              {(MOCK_ACTIVITY[selectedUser.id] || [
                { time: "Just now", text: "Logged into User Management console" },
                { time: "Yesterday", text: "Workspace permission records synchronized" }
              ]).map((act, idx) => (
                <div key={idx} className="tli blue" style={{ padding: "0 0 16px" }}>
                  <span className="w">{act.time}</span>
                  <span style={{ fontSize: 12.5, color: "var(--txt-2)" }}>{act.text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* ── Invite User Modal ── */}
      {showInviteModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onClick={() => setShowInviteModal(false)}
        >
          <form
            onSubmit={handleInviteSubmit}
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              width: 480,
              padding: "28px 28px 24px",
              boxShadow: "0 32px 64px -16px rgba(0,0,0,.8), 0 0 0 1px var(--line)",
              animation: "item-in .18s ease",
              display: "flex", flexDirection: "column", gap: 16,
            }}
          >
            {/* Header info */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(227,179,65,.08)", border: "1px solid rgba(227,179,65,.2)",
                display: "grid", placeItems: "center", color: "var(--gold)"
              }}>
                <RiUserAddLine size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600 }}>Provision Identity</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--txt)" }}>
                  Invite New Workspace Member
                </h3>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 13, color: "var(--txt-3)", lineHeight: 1.55 }}>
              Enter the details of the team member to send an automated system access invite.
            </p>

            {/* Fields */}
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                required
                className="input"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                required
                className="input"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="e.g. jane.doe@scbtechx.com"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="field">
                <label>System Role</label>
                <select
                  className="input"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                >
                  <option value="End User">End User</option>
                  <option value="Developer">Developer</option>
                  <option value="Supporter">Supporter</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div className="field">
                <label>Department</label>
                <select
                  className="input"
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                >
                  <option value="SCB TechX">SCB TechX</option>
                  <option value="DataX">DataX</option>
                  <option value="SCBx Group">SCBx Group</option>
                </select>
              </div>
            </div>

            {/* Workspace checklist */}
            <div className="field">
              <label>Grant Workspace Permissions</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                {ALL_AVAILABLE_WORKSPACES.map(ws => (
                  <label key={ws} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--txt-2)", cursor: "pointer", textTransform: "none", fontFamily: "inherit" }}>
                    <input
                      type="checkbox"
                      checked={inviteWorkspaces.includes(ws)}
                      onChange={(e) => {
                        if (e.target.checked) setInviteWorkspaces(prev => [...prev, ws])
                        else setInviteWorkspaces(prev => prev.filter(w => w !== ws))
                      }}
                      style={{ accentColor: "var(--gold)", width: 14, height: 14 }}
                    />
                    {ws}
                  </label>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Send Invite
              </button>
            </div>
          </form>
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
