"use client"

import { useState, useEffect } from "react"
import {
  RiInputMethodLine,
  RiAddLine,
  RiSearchLine,
  RiEditLine,
  RiDeleteBinLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiToggleLine,
  RiListCheck2,
  RiCalendarLine,
  RiHashtag,
  RiText,
  RiLink,
  RiUser3Line,
  RiFileCopyLine,
  RiLockLine,
  RiCloseLine,
  RiSettings4Line,
  RiInformationLine,
  RiCodeBoxLine,
  RiArrowDownSLine,
  RiAlignLeft,
  RiCheckboxLine,
  RiCheckboxBlankCircleLine,
  RiArrowDownCircleLine,
} from "@remixicon/react"

/* ── Types ── */
type FieldType = "text" | "textarea" | "number" | "select" | "multiselect" | "date" | "boolean" | "url" | "user" | "reference"
type FieldScope = "Global" | "Incident" | "Service Request" | "Change Request" | "Problem" | "Work Tracker"

interface Field {
  id: number
  name: string
  apiKey: string
  description: string
  type: FieldType
  scope: FieldScope
  required: boolean
  system: boolean
  usedIn: number
  lastModified: string
}

/* ── Data ── */
const INITIAL_FIELDS: Field[] = [
  { id: 1,  name: "Title",            apiKey: "title",           description: "Short summary of the ticket.",                  type: "text",        scope: "Global",          required: true,  system: true,  usedIn: 10, lastModified: "—"      },
  { id: 2,  name: "Description",      apiKey: "description",     description: "Full description of the issue or request.",     type: "textarea",    scope: "Global",          required: true,  system: true,  usedIn: 10, lastModified: "—"      },
  { id: 3,  name: "Priority",         apiKey: "priority",        description: "P1–P4 priority classification.",               type: "select",      scope: "Global",          required: true,  system: true,  usedIn: 10, lastModified: "—"      },
  { id: 4,  name: "Assignee",         apiKey: "assignee",        description: "Agent or team assigned to this ticket.",       type: "user",        scope: "Global",          required: false, system: true,  usedIn: 10, lastModified: "—"      },
  { id: 5,  name: "Status",           apiKey: "status",          description: "Current lifecycle state of the ticket.",       type: "select",      scope: "Global",          required: true,  system: true,  usedIn: 10, lastModified: "—"      },
  { id: 6,  name: "Impact",           apiKey: "impact",          description: "Business impact level: Low / Medium / High.",  type: "select",      scope: "Incident",        required: true,  system: false, usedIn: 3,  lastModified: "2d ago" },
  { id: 7,  name: "Root Cause",       apiKey: "root_cause",      description: "Identified root cause of the incident.",       type: "textarea",    scope: "Incident",        required: false, system: false, usedIn: 2,  lastModified: "5d ago" },
  { id: 8,  name: "Affected Systems", apiKey: "affected_systems",description: "List of impacted systems or services.",        type: "multiselect", scope: "Incident",        required: false, system: false, usedIn: 3,  lastModified: "5d ago" },
  { id: 9,  name: "Requester",        apiKey: "requester",       description: "User who submitted the service request.",      type: "user",        scope: "Service Request", required: true,  system: false, usedIn: 5,  lastModified: "1w ago" },
  { id: 10, name: "Approval Status",  apiKey: "approval_status", description: "Tracks approval gate: Pending / Approved / Rejected.", type: "select", scope: "Service Request", required: false, system: false, usedIn: 4, lastModified: "1w ago" },
  { id: 11, name: "Due Date",         apiKey: "due_date",        description: "Target completion date for the request.",      type: "date",        scope: "Service Request", required: false, system: false, usedIn: 4,  lastModified: "2w ago" },
  { id: 12, name: "Risk Level",       apiKey: "risk_level",      description: "CAB-assessed risk: Low / Medium / High / Critical.", type: "select", scope: "Change Request",  required: true,  system: false, usedIn: 2, lastModified: "2w ago" },
  { id: 13, name: "Rollback Plan",    apiKey: "rollback_plan",   description: "Steps to revert the change if it fails.",      type: "textarea",    scope: "Change Request",  required: true,  system: false, usedIn: 2,  lastModified: "2w ago" },
  { id: 14, name: "Change Window",    apiKey: "change_window",   description: "Approved maintenance window date and time.",   type: "date",        scope: "Change Request",  required: true,  system: false, usedIn: 2,  lastModified: "3w ago" },
  { id: 15, name: "Story Points",     apiKey: "story_points",    description: "Effort estimate in story points.",             type: "number",      scope: "Work Tracker",    required: false, system: false, usedIn: 1,  lastModified: "1mo ago"},
  { id: 16, name: "Related KB",       apiKey: "related_kb",      description: "Link to the relevant knowledge base article.", type: "url",         scope: "Global",          required: false, system: false, usedIn: 6,  lastModified: "1mo ago"},
]

const SCOPES: FieldScope[] = ["Global", "Incident", "Service Request", "Change Request", "Problem", "Work Tracker"]

const FIELD_TYPE_META: Record<FieldType, { icon: React.ElementType; label: string; color: string }> = {
  text:        { icon: RiText,              label: "Text",        color: "var(--txt-3)"  },
  textarea:    { icon: RiText,              label: "Long text",   color: "var(--txt-3)"  },
  number:      { icon: RiHashtag,           label: "Number",      color: "var(--blue)"   },
  select:      { icon: RiListCheck2,        label: "Select",      color: "var(--gold)"   },
  multiselect: { icon: RiListCheck2,        label: "Multi-select",color: "var(--gold)"   },
  date:        { icon: RiCalendarLine,      label: "Date",        color: "#a78bfa"       },
  boolean:     { icon: RiToggleLine,        label: "Boolean",     color: "var(--green)"  },
  url:         { icon: RiLink,              label: "URL",         color: "var(--blue)"   },
  user:        { icon: RiUser3Line,         label: "User",        color: "var(--amber)"  },
  reference:   { icon: RiInputMethodLine,   label: "Reference",   color: "var(--txt-3)"  },
}

const SCOPE_COLOR: Record<FieldScope, string> = {
  "Global":          "var(--txt-3)",
  "Incident":        "var(--red)",
  "Service Request": "var(--blue)",
  "Change Request":  "var(--amber)",
  "Problem":         "#a78bfa",
  "Work Tracker":    "var(--green)",
}

type DropdownItem =
  | { type: "divider"; group: number }
  | { value: FieldType; label: string; icon: React.ElementType; group: number }

const DROPDOWN_ITEMS: DropdownItem[] = [
  { value: "text", label: "Short answer", icon: RiText, group: 1 },
  { value: "textarea", label: "Paragraph", icon: RiAlignLeft, group: 1 },
  { type: "divider", group: 1.5 },
  { value: "boolean", label: "Multiple choice", icon: RiCheckboxBlankCircleLine, group: 2 },
  { value: "multiselect", label: "Checkboxes", icon: RiCheckboxLine, group: 2 },
  { value: "select", label: "Dropdown", icon: RiArrowDownCircleLine, group: 2 },
  { type: "divider", group: 2.5 },
  { value: "date", label: "Date", icon: RiCalendarLine, group: 3 },
  { type: "divider", group: 3.5 },
  { value: "number", label: "Number", icon: RiHashtag, group: 4 },
  { value: "url", label: "URL Link", icon: RiLink, group: 4 },
  { value: "user", label: "User selector", icon: RiUser3Line, group: 4 },
  { value: "reference", label: "Reference relation", icon: RiInputMethodLine, group: 4 },
]

const ROWS_OPTIONS = [10, 20, 50]

/* ── Sub-components ── */
function FieldTypeBadge({ type }: { type: FieldType }) {
  const meta = FIELD_TYPE_META[type]
  const Icon = meta.icon
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontFamily: "var(--font-mono)",
      padding: "3px 8px", borderRadius: 4,
      background: "var(--bg-3)", border: "1px solid var(--line-3)",
      color: meta.color, whiteSpace: "nowrap",
    }}>
      <Icon size={11} />
      {meta.label}
    </span>
  )
}

function ScopeBadge({ scope }: { scope: FieldScope }) {
  return (
    <span style={{
      fontSize: 11, fontFamily: "var(--font-mono)",
      color: SCOPE_COLOR[scope],
      background: "var(--bg-3)", border: "1px solid var(--line-3)",
      padding: "3px 7px", borderRadius: 4, whiteSpace: "nowrap",
    }}>{scope}</span>
  )
}

/* ── Page ── */
export default function FieldsPage() {
  const [fields, setFields]           = useState<Field[]>(INITIAL_FIELDS)
  const [search, setSearch]           = useState("")
  const [filterScope, setFilterScope] = useState<FieldScope | "ALL">("ALL")
  const [filterType, setFilterType]   = useState<FieldType | "ALL">("ALL")
  const [page, setPage]               = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [deleteId, setDeleteId]       = useState<number | null>(null)
  
  // Drawer / Detail state
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(1)

  // Form Modal state
  const [showFormModal, setShowFormModal] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formFieldId, setFormFieldId] = useState<number | null>(null)
  const [formName, setFormName] = useState("")
  const [formApiKey, setFormApiKey] = useState("")
  const [formType, setFormType] = useState<FieldType>("text")
  const [formScope, setFormScope] = useState<FieldScope>("Global")
  const [formDesc, setFormDesc] = useState("")
  const [formRequired, setFormRequired] = useState(false)
  const [isApiKeyCustom, setIsApiKeyCustom] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Automatically slugify name to API Key when typing in create mode
  useEffect(() => {
    if (formMode === "create" && !isApiKeyCustom) {
      const slugified = formName
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g, "")
        .replace(/\s+/g, "_")
      setFormApiKey(slugified)
    }
  }, [formName, formMode, isApiKeyCustom])

  const allTypes = Array.from(new Set(INITIAL_FIELDS.map((f) => f.type))) as FieldType[]

  const filtered = fields.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                        f.apiKey.toLowerCase().includes(search.toLowerCase()) ||
                        f.description.toLowerCase().includes(search.toLowerCase())
    const matchScope  = filterScope === "ALL" || f.scope === filterScope
    const matchType   = filterType === "ALL" || f.type === filterType
    return matchSearch && matchScope && matchType
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const systemCount  = fields.filter((f) => f.system).length
  const customCount  = fields.length - systemCount
  const requiredCount = fields.filter((f) => f.required).length

  const stats = [
    { label: "Total fields",   value: String(fields.length), icon: RiInputMethodLine,    color: "var(--txt)"   },
    { label: "System fields",  value: String(systemCount),   icon: RiLockLine,           color: "var(--txt-3)" },
    { label: "Custom fields",  value: String(customCount),   icon: RiCheckboxCircleLine, color: "var(--green)" },
    { label: "Required",       value: String(requiredCount), icon: RiCheckboxCircleLine, color: "var(--gold)"  },
  ]

  // Open Form modal for creation
  const handleOpenCreate = () => {
    setFormMode("create")
    setFormFieldId(null)
    setFormName("")
    setFormApiKey("")
    setFormType("text")
    setFormScope("Global")
    setFormDesc("")
    setFormRequired(false)
    setIsApiKeyCustom(false)
    setDropdownOpen(false)
    setShowFormModal(true)
  }

  // Open Form modal for editing
  const handleOpenEdit = (e: React.MouseEvent, field: Field) => {
    e.stopPropagation()
    setFormMode("edit")
    setFormFieldId(field.id)
    setFormName(field.name)
    setFormApiKey(field.apiKey)
    setFormType(field.type)
    setFormScope(field.scope)
    setFormDesc(field.description)
    setFormRequired(field.required)
    setDropdownOpen(false)
    setShowFormModal(true)
  }

  // Handle Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formApiKey.trim()) return

    if (formMode === "create") {
      const newId = Math.max(...fields.map(f => f.id)) + 1
      const newField: Field = {
        id: newId,
        name: formName,
        apiKey: formApiKey,
        description: formDesc,
        type: formType,
        scope: formScope,
        required: formRequired,
        system: false,
        usedIn: 0,
        lastModified: "Just now",
      }
      setFields(prev => [...prev, newField])
      setSelectedFieldId(newField.id)
    } else {
      setFields(prev => prev.map(f => {
        if (f.id === formFieldId) {
          return {
            ...f,
            name: formName,
            apiKey: formApiKey,
            description: formDesc,
            type: formType,
            scope: formScope,
            required: formRequired,
            lastModified: "Just now",
          }
        }
        return f
      }))
    }
    setShowFormModal(false)
  }

  // Handle Duplication
  const handleDuplicate = (e: React.MouseEvent, field: Field) => {
    e.stopPropagation()
    const newId = Math.max(...fields.map(f => f.id)) + 1
    const duplicated: Field = {
      ...field,
      id: newId,
      name: `${field.name} (Copy)`,
      apiKey: `${field.apiKey}_copy`,
      system: false,
      usedIn: 0,
      lastModified: "Just now",
    }
    setFields(prev => [...prev, duplicated])
    setSelectedFieldId(duplicated.id)
  }

  // Handle Deletion Confirmation
  const handleDeleteConfirm = () => {
    if (deleteId === null) return
    setFields(prev => prev.filter(f => f.id !== deleteId))
    if (selectedFieldId === deleteId) {
      setSelectedFieldId(null)
    }
    setDeleteId(null)
  }

  // Selected Field resolution
  const selectedField = fields.find(f => f.id === selectedFieldId)

  // Render a live input preview based on field type
  const renderPreviewInput = (type: FieldType) => {
    switch (type) {
      case "text":
        return <input type="text" className="input" placeholder="Type text..." style={{ padding: "8px 10px", fontSize: 13 }} />
      case "textarea":
        return <textarea className="input" placeholder="Type multi-line description..." rows={2} style={{ padding: "8px 10px", fontSize: 13, resize: "none" }} />
      case "number":
        return <input type="number" className="input" placeholder="0" style={{ padding: "8px 10px", fontSize: 13 }} />
      case "select":
        return (
          <select className="input" style={{ padding: "8px 10px", fontSize: 13 }}>
            <option>Option A</option>
            <option>Option B</option>
            <option>Option C</option>
          </select>
        )
      case "multiselect":
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "8px 10px", border: "1px solid var(--line-3)", borderRadius: "var(--radius)", background: "var(--bg-3)" }}>
            <span className="tag" style={{ fontSize: 11 }}>Selected Option 1</span>
            <span className="tag" style={{ fontSize: 11 }}>Selected Option 2</span>
            <span style={{ fontSize: 12.5, color: "var(--txt-4)", paddingLeft: 4 }}>+ Click to add</span>
          </div>
        )
      case "date":
        return <input type="date" className="input" style={{ padding: "8px 10px", fontSize: 13 }} />
      case "boolean":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              style={{
                width: 32, height: 18, borderRadius: 9, border: "none",
                background: "linear-gradient(135deg, var(--gold-2), var(--gold))",
                position: "relative", cursor: "pointer",
              }}
            >
              <span style={{ position: "absolute", top: 2, left: 16, width: 14, height: 14, borderRadius: "50%", background: "#fff" }}/>
            </button>
            <span style={{ fontSize: 12.5, color: "var(--txt-2)" }}>Enabled</span>
          </div>
        )
      case "url":
        return <input type="url" className="input" placeholder="https://example.com" style={{ padding: "8px 10px", fontSize: 13 }} />
      case "user":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", border: "1px solid var(--line-3)", borderRadius: "var(--radius)", background: "var(--bg-3)" }}>
            <span className="av" style={{ width: 18, height: 18, fontSize: 8.5 }}>MC</span>
            <span style={{ fontSize: 12.5, color: "var(--txt-2)" }}>Maya Chen</span>
          </div>
        )
      case "reference":
        return (
          <div style={{ display: "flex", alignItems: "center", padding: "8px 10px", border: "1px solid var(--line-3)", borderRadius: "var(--radius)", background: "var(--bg-3)", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12.5, color: "var(--txt-4)" }}>Reference record lookup...</span>
            <RiSearchLine size={12} style={{ color: "var(--txt-4)" }} />
          </div>
        )
    }
  }

  return (
    <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
      {/* ── Main Panel ── */}
      <main style={{ flex: 1, padding: "28px 32px 48px", display: "flex", flexDirection: "column", gap: 0, overflowY: "auto", minWidth: 0 }}>

        {/* Breadcrumb */}
        <nav className="crumb">
          <a href="/dashboard">Administration</a>
          <span className="sep">/</span>
          <a href="#">Customization</a>
          <span className="sep">/</span>
          <span className="cur">Fields</span>
        </nav>

        {/* Title */}
        <div className="title-row" style={{ marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ color: "var(--txt)" }}>Fields</h1>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(76,183,130,.10)", border: "1px solid rgba(76,183,130,.25)",
                display: "grid", placeItems: "center",
              }}>
                <RiInputMethodLine size={16} style={{ color: "var(--green)" }} />
              </div>
            </div>
            <p className="sub">Define and manage custom fields available across ticket forms.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreate}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <RiAddLine size={14} />
            New Field
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
              <div className="v" style={{ color: s.label === "Required" ? "var(--gold)" : undefined }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="card" style={{ flex: 1 }}>
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid var(--line-2)", flexWrap: "wrap" }}>
            <div className="search" style={{ maxWidth: 220 }}>
              <RiSearchLine size={13} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search fields…"
                style={{ fontSize: 13 }}
              />
            </div>

            {/* Scope pills */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {(["ALL", ...SCOPES] as const).map((s) => (
                <button key={s} type="button"
                  onClick={() => { setFilterScope(s); setPage(1) }}
                  style={{
                    padding: "4px 10px", borderRadius: 999, fontSize: 11.5,
                    fontFamily: "inherit", cursor: "pointer",
                    background: filterScope === s ? "var(--bg-4)" : "transparent",
                    border: `1px solid ${filterScope === s ? "var(--line-4)" : "var(--line-2)"}`,
                    color: filterScope === s
                      ? (s !== "ALL" ? SCOPE_COLOR[s] : "var(--txt)")
                      : "var(--txt-4)",
                    transition: "all .12s",
                  }}
                >{s === "ALL" ? "All scopes" : s}</button>
              ))}
            </div>

            {/* Type filter */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 5, flexWrap: "wrap" }}>
              <button type="button"
                onClick={() => { setFilterType("ALL"); setPage(1) }}
                style={{
                  padding: "4px 10px", borderRadius: 999, fontSize: 11.5,
                  fontFamily: "inherit", cursor: "pointer",
                  background: filterType === "ALL" ? "var(--bg-4)" : "transparent",
                  border: `1px solid ${filterType === "ALL" ? "var(--line-4)" : "var(--line-2)"}`,
                  color: filterType === "ALL" ? "var(--txt)" : "var(--txt-4)",
                  transition: "all .12s",
                }}
              >All types</button>
              {allTypes.map((t) => {
                const meta = FIELD_TYPE_META[t]
                const active = filterType === t
                return (
                  <button key={t} type="button"
                    onClick={() => { setFilterType(t); setPage(1) }}
                    style={{
                      padding: "4px 10px", borderRadius: 999, fontSize: 11.5,
                      fontFamily: "var(--font-mono)", cursor: "pointer",
                      background: active ? "var(--bg-4)" : "transparent",
                      border: `1px solid ${active ? "var(--line-4)" : "var(--line-2)"}`,
                      color: active ? meta.color : "var(--txt-4)",
                      transition: "all .12s",
                    }}
                  >{meta.label}</button>
                )
              })}
            </div>
          </div>

          {/* Table */}
          {paged.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--txt-4)", fontSize: 13 }}>
              No fields match your search.
            </div>
          ) : (
            <table className="tbl" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: 56, paddingLeft: 20 }}>ID</th>
                  <th>Name &amp; Description</th>
                  <th style={{ width: 140, fontFamily: "var(--font-mono)", fontSize: 11 }}>API key</th>
                  <th style={{ width: 130 }}>Type</th>
                  <th style={{ width: 130 }}>Scope</th>
                  <th style={{ width: 80, textAlign: "center" }}>Required</th>
                  <th style={{ width: 80, textAlign: "center" }}>Used in</th>
                  <th style={{ width: 90 }}>Modified</th>
                  <th style={{ width: 110, paddingRight: 20, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => setSelectedFieldId(f.id)}
                    className={selectedFieldId === f.id ? "selected" : ""}
                    style={
                      selectedFieldId === f.id
                        ? { background: "linear-gradient(90deg,rgba(227,179,65,.08),rgba(227,179,65,.02) 40%,transparent)" }
                        : undefined
                    }
                  >
                    <td style={{ paddingLeft: 20 }}>
                      <span className="id" style={{ fontWeight: 600 }}>#{f.id}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="ti">{f.name}</div>
                        {f.system && (
                          <span title="System field — cannot be deleted" style={{
                            display: "inline-flex", alignItems: "center", gap: 3,
                            fontSize: 9.5, fontFamily: "var(--font-mono)", padding: "1px 6px",
                            borderRadius: 3, background: "var(--bg-4)", border: "1px solid var(--line-3)",
                            color: "var(--txt-5)", letterSpacing: ".06em",
                          }}>
                            <RiLockLine size={9} />SYSTEM
                          </span>
                        )}
                      </div>
                      <div className="sub" style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {f.description}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--txt-4)", background: "var(--bg-3)", padding: "2px 6px", borderRadius: 4 }}>
                        {f.apiKey}
                      </span>
                    </td>
                    <td><FieldTypeBadge type={f.type} /></td>
                    <td><ScopeBadge scope={f.scope} /></td>
                    <td style={{ textAlign: "center" }}>
                      {f.required
                        ? <span style={{ color: "var(--gold)", fontSize: 13, fontWeight: 700 }}>✓</span>
                        : <span style={{ color: "var(--txt-5)", fontSize: 13 }}>—</span>
                      }
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: f.usedIn > 0 ? "var(--txt-2)" : "var(--txt-5)" }}>
                        {f.usedIn > 0 ? f.usedIn : "—"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--txt-4)" }}>{f.lastModified}</span>
                    </td>
                    <td style={{ paddingRight: 20 }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="iconbtn"
                          title={f.system ? "System fields cannot be edited" : "Edit"}
                          disabled={f.system}
                          onClick={(e) => handleOpenEdit(e, f)}
                          style={{ opacity: f.system ? 0.3 : 1 }}
                        >
                          <RiEditLine size={13} />
                        </button>
                        <button
                          type="button"
                          className="iconbtn"
                          title="Duplicate"
                          onClick={(e) => handleDuplicate(e, f)}
                        >
                          <RiFileCopyLine size={13} />
                        </button>
                        <button
                          type="button"
                          className="iconbtn"
                          title={f.system ? "System fields cannot be deleted" : "Delete"}
                          disabled={f.system}
                          onClick={() => !f.system && setDeleteId(f.id)}
                          style={{ color: f.system ? "var(--txt-5)" : "var(--red)", opacity: f.system ? 0.3 : 1 }}
                          onMouseEnter={(e) => { if (!f.system) { e.currentTarget.style.background = "rgba(235,87,87,.08)"; e.currentTarget.style.borderColor = "rgba(235,87,87,.2)" } }}
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
              Showing {filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} fields
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                className="iconbtn" style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? "default" : "pointer" }}>
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
                className="iconbtn" style={{ opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? "default" : "pointer" }}>
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

      {/* ── Right Rail Field Configuration Sidebar ── */}
      {selectedField && (
        <aside className="rail" style={{ width: 360, flexShrink: 0, animation: "item-in .2s ease-out" }}>
          {/* Header */}
          <div className="rail-hd">
            <RiSettings4Line size={13} style={{ color: "var(--gold)" }} />
            <span className="t-mono">FIELD SPECIFICATION</span>
            <button
              type="button"
              className="close"
              onClick={() => setSelectedFieldId(null)}
            >
              <RiCloseLine size={14} />
            </button>
          </div>

          {/* Profile Card Header */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8,
              background: "var(--bg-3)", border: "1px solid var(--line-2)",
              display: "grid", placeItems: "center",
              color: FIELD_TYPE_META[selectedField.type].color,
            }}>
              {(() => {
                const Icon = FIELD_TYPE_META[selectedField.type].icon
                return <Icon size={18} />
              })()}
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--txt)", margin: 0 }}>
                {selectedField.name}
              </h2>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--txt-4)", marginTop: 2 }}>
                Key API: {selectedField.apiKey}
              </div>
            </div>
          </div>

          {/* Metadata Card Info */}
          <div className="card" style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--gold)", letterSpacing: ".05em" }}>
              VALIDATION SCHEMA
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { k: "Field Scope Scope", v: <ScopeBadge scope={selectedField.scope} /> },
                { k: "Input Element Type", v: <FieldTypeBadge type={selectedField.type} /> },
                { k: "Required Constraint", v: selectedField.required ? <span style={{ color: "var(--gold)", fontWeight: 600 }}>REQUIRED</span> : <span style={{ color: "var(--txt-4)" }}>OPTIONAL</span> },
                { k: "System Field Status", v: selectedField.system ? <span style={{ color: "var(--txt-4)", fontWeight: 500 }}>IMMUTABLE SYSTEM</span> : <span style={{ color: "var(--green)", fontWeight: 500 }}>CUSTOMIZABLE</span> },
                { k: "Active in Forms Count", v: <span style={{ fontFamily: "var(--font-mono)" }}>{selectedField.usedIn} ticket flow templates</span> }
              ].map(row => (
                <div key={row.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 }}>
                  <span style={{ color: "var(--txt-3)" }}>{row.k}</span>
                  <span style={{ color: "var(--txt-2)", fontWeight: 500 }}>{row.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="rail-section-h">Description Summary</div>
            <p style={{ fontSize: 13, color: "var(--txt-3)", lineHeight: 1.5, margin: "6px 0 0" }}>
              {selectedField.description || "No description provided for this field."}
            </p>
          </div>

          {/* Live Preview Element Visualizer */}
          <div>
            <div className="rail-section-h">Form Render Preview</div>
            <p style={{ fontSize: 11.5, color: "var(--txt-4)", margin: "4px 0 10px", lineHeight: 1.45 }}>
              This is how the custom input element will render visually to end-users inside active forms.
            </p>

            <div className="card" style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--txt-3)", display: "flex", gap: 4 }}>
                {selectedField.name}
                {selectedField.required && <span style={{ color: "var(--red)" }}>*</span>}
              </label>
              <div style={{ marginTop: 4 }}>
                {renderPreviewInput(selectedField.type)}
              </div>
            </div>
          </div>

          {/* Sidebar Quick Actions */}
          {!selectedField.system && (
            <div style={{ marginTop: "auto", display: "flex", gap: 8, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={(e) => handleOpenEdit(e, selectedField)}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <RiEditLine size={13} />
                Edit Settings
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setDeleteId(selectedField.id)}
                style={{ display: "grid", placeItems: "center", width: 34, height: 30, padding: 0 }}
              >
                <RiDeleteBinLine size={13} />
              </button>
            </div>
          )}
        </aside>
      )}

      {/* ── New/Edit Form Modal ── */}
      {showFormModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onClick={() => setShowFormModal(false)}
        >
          <form
            onSubmit={handleFormSubmit}
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              width: 460,
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
                background: "rgba(76,183,130,.10)", border: "1px solid rgba(76,183,130,.25)",
                display: "grid", placeItems: "center", color: "var(--green)"
              }}>
                <RiInputMethodLine size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>Customization Settings</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--txt)" }}>
                  {formMode === "create" ? "Define New Custom Field" : `Configure Field: ${formName}`}
                </h3>
              </div>
            </div>

            {/* Name */}
            <div className="field">
              <label>Field Name Label</label>
              <input
                type="text"
                required
                className="input"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Host IP Address"
              />
            </div>

            {/* Description */}
            <div className="field">
              <label>Description Helper Text</label>
              <textarea
                className="input"
                rows={2}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Explains to users what to input in this field..."
                style={{ resize: "none" }}
              />
            </div>

            {/* Data Input Type custom dropdown */}
            <div className="field" style={{ position: "relative" }}>
              <label>Data Input Type</label>
              {/* Trigger button */}
              <button
                type="button"
                disabled={formMode === "edit"}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="input"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  fontSize: 13,
                  background: "var(--bg-2)",
                  border: "1px solid var(--line-2)",
                  borderRadius: "var(--radius)",
                  cursor: formMode === "edit" ? "not-allowed" : "pointer",
                  width: "100%",
                  textAlign: "left",
                  color: "var(--txt)",
                  opacity: formMode === "edit" ? 0.6 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {(() => {
                    const selectedItem = DROPDOWN_ITEMS.find(item => 'value' in item && item.value === formType);
                    if (selectedItem && 'icon' in selectedItem) {
                      const Icon = selectedItem.icon;
                      return (
                        <>
                          <Icon size={16} style={{ color: "var(--gold)" }} />
                          <span>{selectedItem.label}</span>
                        </>
                      );
                    }
                    return <span>Select type...</span>;
                  })()}
                </div>
                {formMode !== "edit" && <RiArrowDownSLine size={16} style={{ color: "var(--txt-4)" }} />}
              </button>

              {/* Dropdown Menu overlay */}
              {dropdownOpen && formMode !== "edit" && (
                <>
                  {/* Click-away backdrop */}
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 99,
                      background: "transparent",
                    }}
                    onClick={() => setDropdownOpen(false)}
                  />

                  {/* Menu popup */}
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      marginTop: 4,
                      background: "var(--bg-3)",
                      border: "1px solid var(--line-2)",
                      borderRadius: 8,
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,.5), 0 0 0 1px var(--line)",
                      zIndex: 100,
                      maxHeight: 280,
                      overflowY: "auto",
                      padding: "6px 0",
                      animation: "item-in .15s ease",
                    }}
                  >
                    {DROPDOWN_ITEMS.map((item, idx) => {
                      if ('type' in item && item.type === "divider") {
                        return (
                          <div
                            key={`div-${idx}`}
                            style={{
                              height: 1,
                              background: "var(--line-3)",
                              margin: "6px 0",
                            }}
                          />
                        )
                      }

                      if ('value' in item) {
                        const Icon = item.icon
                        const isSelected = formType === item.value
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                              setFormType(item.value)
                              setDropdownOpen(false)
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              width: "100%",
                              padding: "8px 16px",
                              border: "none",
                              background: isSelected ? "rgba(227,179,65,.1)" : "transparent",
                              color: isSelected ? "var(--gold)" : "var(--txt-2)",
                              fontSize: 13,
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "background .12s, color .12s",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.background = "var(--bg-4)"
                                e.currentTarget.style.color = "var(--txt)"
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.background = "transparent"
                                e.currentTarget.style.color = "var(--txt-2)"
                              }
                            }}
                          >
                            <Icon size={16} style={{ color: isSelected ? "var(--gold)" : "var(--txt-3)" }} />
                            <span style={{ fontWeight: isSelected ? 600 : 400 }}>{item.label}</span>
                            {isSelected && (
                              <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700 }}>✓</span>
                            )}
                          </button>
                        )
                      }
                      return null
                    })}
                  </div>
                </>
              )}
            </div>

            {/* API Key */}
            <div className="field">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RiCodeBoxLine size={12} />
                API Identifier Key (JSON key)
              </label>
              <input
                type="text"
                required
                className="input"
                value={formApiKey}
                onChange={(e) => {
                  setFormApiKey(e.target.value)
                  setIsApiKeyCustom(true)
                }}
                disabled={formMode === "edit"}
                placeholder="e.g. host_ip_address"
                style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
              />
            </div>

            {/* Constraints */}
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--txt-2)", cursor: "pointer", marginTop: 4 }}>
              <input
                type="checkbox"
                checked={formRequired}
                onChange={(e) => setFormRequired(e.target.checked)}
                style={{ accentColor: "var(--gold)", width: 14, height: 14 }}
              />
              Required (Validation blocks submission if left empty)
            </label>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowFormModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {formMode === "create" ? "Create Field" : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
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
              Delete field #{deleteId}?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--txt-3)", lineHeight: 1.55 }}>
              This cannot be undone. All ticket form designs using this custom field will lose it and any associated data permanently.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setDeleteId(null)} className="btn btn-secondary">Cancel</button>
              <button type="button"
                onClick={handleDeleteConfirm}
                className="btn btn-danger">
                Delete field
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
