"use client"

import { useState, useRef } from "react"
import {
  RiCpuLine,
  RiShieldUserLine,
  RiGlobalLine,
  RiQuestionLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiAttachmentLine,
  RiFolderUploadLine,
  RiCloseLine,
  RiSparklingLine,
  RiHistoryLine,
  RiTimerLine,
  RiSendPlaneLine,
} from "@remixicon/react"

/* ── Types & Interfaces ── */
type Category = "hardware" | "software" | "network" | "general"
type Priority = "p1" | "p2" | "p3" | "p4"

interface MockFile {
  name: string
  size: string
}

interface SubmittedRequest {
  id: string
  title: string
  category: string
  priority: Priority
  justification: string
  details: Record<string, string | string[]>
  files: MockFile[]
  date: string
}

/* ── Initial Mock History ── */
const INITIAL_HISTORY = [
  {
    id: "REQ-2204",
    title: "New starter laptop provision · 4 units for Q3 sales hires",
    category: "Hardware",
    status: "pending",
    date: "Today, 11:20",
    priority: "p2" as Priority,
  },
  {
    id: "REQ-2195",
    title: "AWS Sandbox Account permissions elevation request",
    category: "Software",
    status: "resolved",
    date: "Yesterday",
    priority: "p3" as Priority,
  },
  {
    id: "REQ-2182",
    title: "Bangkok Office 4th floor VIP Wi-Fi connection issues",
    category: "Network",
    status: "resolved",
    date: "Jun 1",
    priority: "p1" as Priority,
  },
]

export default function ServiceRequestPage() {
  const [step, setStep] = useState<"category" | "form" | "receipt">("category")
  const [category, setCategory] = useState<Category>("hardware")
  const [priority, setPriority] = useState<Priority>("p3")
  const [title, setTitle] = useState("")
  const [justification, setJustification] = useState("")
  const [files, setFiles] = useState<MockFile[]>([])
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [submittedData, setSubmittedData] = useState<SubmittedRequest | null>(null)

  // Hardware custom states
  const [hwDevice, setHwDevice] = useState("MacBook Pro M3 Max (16-inch, 36GB)")
  const [hwAccessories, setHwAccessories] = useState<string[]>([])

  // Software custom states
  const [swApp, setSwApp] = useState("Figma Enterprise")
  const [swRole, setSwRole] = useState("Contributor / Designer")

  // Network custom states
  const [netType, setNetType] = useState("VPN Profile Access")
  const [netEnv, setNetEnv] = useState("Staging / UAT")

  // General custom states
  const [generalAsset, setGeneralAsset] = useState("")
  const [generalDetails, setGeneralDetails] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const categoriesList = [
    {
      id: "hardware" as Category,
      title: "Hardware Provisioning",
      desc: "Order standard laptops, screens, mobile devices, and office peripherals.",
      icon: RiCpuLine,
      color: "var(--gold)",
    },
    {
      id: "software" as Category,
      title: "Software & Accounts",
      desc: "Request software licenses, credentials, SaaS access, and permission upgrades.",
      icon: RiShieldUserLine,
      color: "var(--blue)",
    },
    {
      id: "network" as Category,
      title: "Network & VPN Access",
      desc: "Request static IPs, VPN profiles, subnet routing, or domain registrations.",
      icon: RiGlobalLine,
      color: "var(--green)",
    },
    {
      id: "general" as Category,
      title: "General IT Support",
      desc: "Report printing errors, request device checkups, or ask general IT questions.",
      icon: RiQuestionLine,
      color: "var(--txt-3)",
    },
  ]

  const handleSelectCategory = (catId: Category) => {
    setCategory(catId)
    // Pre-populate intelligent titles
    if (catId === "hardware") setTitle("Request Laptop Provisioning - ")
    else if (catId === "software") setTitle("Request Software License Access - ")
    else if (catId === "network") setTitle("Request Network/VPN Configuration - ")
    else setTitle("IT Support Request - ")
    setStep("form")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles: MockFile[] = []
    for (let i = 0; i < e.target.files.length; i++) {
      const f = e.target.files[i]
      newFiles.push({
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB`,
      })
    }
    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const mockId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`
    
    // Gather details depending on category
    let details: Record<string, string | string[]> = {}
    if (category === "hardware") {
      details = { "Device Type": hwDevice, "Accessories": hwAccessories }
    } else if (category === "software") {
      details = { "Application": swApp, "Access Level": swRole }
    } else if (category === "network") {
      details = { "Request Type": netType, "Environment": netEnv }
    } else {
      details = { "Asset Tag": generalAsset, "Description": generalDetails }
    }

    const payload: SubmittedRequest = {
      id: mockId,
      title,
      category: categoriesList.find((c) => c.id === category)?.title || "General",
      priority,
      justification,
      details,
      files,
      date: "Just now",
    }

    setSubmittedData(payload)
    
    // Prepend to history
    setHistory((prev) => [
      {
        id: payload.id,
        title: payload.title,
        category: payload.category,
        status: "pending",
        date: "Just now",
        priority: payload.priority,
      },
      ...prev,
    ])

    setStep("receipt")
  }

  const handleReset = () => {
    setTitle("")
    setJustification("")
    setFiles([])
    setHwAccessories([])
    setGeneralAsset("")
    setGeneralDetails("")
    setStep("category")
  }

  return (
    <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
      {/* ── Main Form Area ── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "28px 32px" }}>
        {/* Breadcrumb */}
        <nav className="crumb">
          <a href="/dashboard">Dashboard</a>
          <span className="sep">/</span>
          <span className="cur">Service Request</span>
        </nav>

        {/* Header Row */}
        <div style={{ marginTop: 18, marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-.02em", margin: 0 }}>
            New Service Request
          </h1>
          <p style={{ color: "var(--txt-3)", fontSize: 13.5, margin: "8px 0 0", lineHeight: 1.5 }}>
            Submit structured requests for hardware, software licenses, network setup, or general IT support. 
            All submissions are auto-triaged and assigned SLAs.
          </p>
        </div>

        {/* Category Step */}
        {step === "category" && (
          <div style={{ animation: "fade-up .25s ease-out" }}>
            <h3 style={{ fontSize: 14, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--txt-4)", marginBottom: 16 }}>
              Select Request Type
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {categoriesList.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                      padding: "24px",
                      background: "var(--bg-2)",
                      border: "1px solid var(--line-2)",
                      borderRadius: "var(--radius-lg)",
                      cursor: "pointer",
                      transition: "all .2s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = cat.color
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = `0 12px 24px -10px rgba(0,0,0,0.5), 0 0 12px ${cat.color}25`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--line-2)"
                      e.currentTarget.style.transform = "none"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    {/* Glowing highlight indicator */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, ${cat.color}, transparent)`,
                    }} />

                    <div style={{
                      display: "grid", placeItems: "center",
                      width: 42, height: 42, borderRadius: 8,
                      background: "var(--bg-3)", border: "1px solid var(--line-3)",
                      color: cat.color, marginBottom: 18,
                    }}>
                      <Icon size={20} />
                    </div>

                    <h4 style={{ fontSize: 16, fontWeight: 600, color: "var(--txt)", margin: "0 0 6px" }}>
                      {cat.title}
                    </h4>
                    <p style={{ fontSize: 13, color: "var(--txt-3)", lineHeight: 1.5, margin: "0 0 20px" }}>
                      {cat.desc}
                    </p>

                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 12.5, fontWeight: 600, color: cat.color,
                      marginTop: "auto", fontFamily: "var(--font-sans)",
                    }}>
                      Configure Request <RiArrowRightLine size={13} />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Form Step */}
        {step === "form" && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fade-up .25s ease-out" }}>
            {/* Form Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 14 }}>
              <button
                type="button"
                onClick={() => setStep("category")}
                style={{
                  display: "grid", placeItems: "center",
                  width: 32, height: 32, borderRadius: "var(--radius)",
                  border: "1px solid var(--line-2)", background: "var(--bg-2)",
                  color: "var(--txt-2)", cursor: "pointer", transition: "all .12s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--line-3)"; e.currentTarget.style.color = "var(--txt)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line-2)"; e.currentTarget.style.color = "var(--txt-2)" }}
              >
                <RiArrowLeftLine size={16} />
              </button>
              <div>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--gold)" }}>
                  Configure Request
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "2px 0 0" }}>
                  {categoriesList.find((c) => c.id === category)?.title}
                </h3>
              </div>
            </div>

            {/* Title / Summary */}
            <div className="field">
              <label>Request Title / Summary</label>
              <input
                type="text"
                required
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Briefly state the goal of your request..."
              />
            </div>

            {/* Dynamic Custom Fields */}
            {category === "hardware" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16, background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)" }}>
                <div className="field">
                  <label>Select Device Type</label>
                  <select
                    className="input"
                    value={hwDevice}
                    onChange={(e) => setHwDevice(e.target.value)}
                    style={{ appearance: "none" }}
                  >
                    <option>MacBook Pro M3 Max (16-inch, 36GB)</option>
                    <option>MacBook Air M3 (13-inch, 16GB)</option>
                    <option>ThinkPad X1 Carbon Gen 12 (14-inch, 32GB)</option>
                    <option>iPad Pro 13-inch (M4, 256GB)</option>
                  </select>
                </div>
                <div className="field">
                  <label>Additional Accessories</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                    {[
                      "External 4K Monitor (27-inch)",
                      "Mechanical Keyboard & Mouse combo",
                      "USB-C Multi-port Docking Station",
                    ].map((acc) => (
                      <label key={acc} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--txt-2)", cursor: "pointer", textTransform: "none", fontFamily: "inherit" }}>
                        <input
                          type="checkbox"
                          checked={hwAccessories.includes(acc)}
                          onChange={(e) => {
                            if (e.target.checked) setHwAccessories((prev) => [...prev, acc])
                            else setHwAccessories((prev) => prev.filter((a) => a !== acc))
                          }}
                          style={{
                            accentColor: "var(--gold)",
                            width: 15,
                            height: 15,
                            borderRadius: 4,
                          }}
                        />
                        {acc}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {category === "software" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16, background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)" }}>
                <div className="field">
                  <label>Application / SaaS Platform</label>
                  <select
                    className="input"
                    value={swApp}
                    onChange={(e) => setSwApp(e.target.value)}
                  >
                    <option>Figma Enterprise</option>
                    <option>Slack Grid (Enterprise)</option>
                    <option>AWS Developer Sandbox</option>
                    <option>Datadog Pro Monitor</option>
                    <option>Adobe Creative Cloud Suite</option>
                  </select>
                </div>
                <div className="field">
                  <label>Access Role / Level</label>
                  <select
                    className="input"
                    value={swRole}
                    onChange={(e) => setSwRole(e.target.value)}
                  >
                    <option>Viewer / Auditor</option>
                    <option>Contributor / Designer</option>
                    <option>Developer / Sandbox Admin</option>
                    <option>Workspace Admin / Billing</option>
                  </select>
                </div>
              </div>
            )}

            {category === "network" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16, background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)" }}>
                <div className="field">
                  <label>Network Request Type</label>
                  <select
                    className="input"
                    value={netType}
                    onChange={(e) => setNetType(e.target.value)}
                  >
                    <option>VPN Profile Access</option>
                    <option>Static IP Assignment (SCB TechX Hub)</option>
                    <option>DNS Subdomain Registration (*.xservice.net)</option>
                    <option>Office Firewall Exception Request</option>
                  </select>
                </div>
                <div className="field">
                  <label>Target Environment</label>
                  <select
                    className="input"
                    value={netEnv}
                    onChange={(e) => setNetEnv(e.target.value)}
                  >
                    <option>Development (Dev / Test)</option>
                    <option>Staging / UAT</option>
                    <option>Production (Core systems)</option>
                  </select>
                </div>
              </div>
            )}

            {category === "general" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)" }}>
                <div className="field">
                  <label>Hardware Asset Tag (If applicable)</label>
                  <input
                    type="text"
                    className="input"
                    value={generalAsset}
                    onChange={(e) => setGeneralAsset(e.target.value)}
                    placeholder="e.g. SCBTX-LAP-9042"
                  />
                </div>
                <div className="field">
                  <label>Troubleshooting details / symptoms</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={generalDetails}
                    onChange={(e) => setGeneralDetails(e.target.value)}
                    placeholder="Provide troubleshooting details or printer names..."
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
            )}

            {/* Priority / Urgency */}
            <div className="field">
              <label>Urgency &amp; Priority</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {[
                  { id: "p4" as Priority, label: "P4 · Low", desc: "No core blocker" },
                  { id: "p3" as Priority, label: "P3 · Medium", desc: "Minor productivity lag" },
                  { id: "p2" as Priority, label: "P2 · High", desc: "Blocked department work" },
                  { id: "p1" as Priority, label: "P1 · Critical", desc: "System down / Security incident" },
                ].map((prio) => (
                  <button
                    key={prio.id}
                    type="button"
                    onClick={() => setPriority(prio.id)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: "var(--radius)",
                      border: "1px solid " + (priority === prio.id ? (prio.id === "p1" ? "var(--red)" : prio.id === "p2" ? "var(--amber)" : "var(--gold)") : "var(--line-2)"),
                      background: priority === prio.id ? (prio.id === "p1" ? "rgba(235,87,87,.08)" : prio.id === "p2" ? "rgba(242,153,74,.08)" : "rgba(227,179,65,.08)") : "var(--bg-2)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      transition: "all .15s",
                    }}
                  >
                    <span style={{
                      fontWeight: 600,
                      fontSize: 12.5,
                      color: priority === prio.id ? (prio.id === "p1" ? "var(--red)" : prio.id === "p2" ? "var(--amber)" : "var(--gold)") : "var(--txt-2)",
                    }}>
                      {prio.label}
                    </span>
                    <span style={{ fontSize: 9.5, color: "var(--txt-4)", fontFamily: "var(--font-sans)", textTransform: "none", textAlign: "center" }}>
                      {prio.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Business Justification */}
            <div className="field">
              <label>Business Justification &amp; Purpose</label>
              <textarea
                required
                className="input"
                rows={4}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Explain why this request is required, project tags, or cost codes if pre-approved by finance..."
              />
            </div>

            {/* Attachment Dropzone */}
            <div className="field">
              <label>Attachments (Logs, screenshots, receipts)</label>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "1.5px dashed var(--line-3)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--bg-2)",
                  padding: "24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "var(--bg-3)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line-3)"; e.currentTarget.style.background = "var(--bg-2)" }}
              >
                <RiFolderUploadLine size={24} style={{ color: "var(--txt-4)", marginBottom: 8, display: "inline-block" }} />
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>Drag &amp; drop files, or browse</div>
                <div style={{ fontSize: 11.5, color: "var(--txt-4)", marginTop: 4 }}>Supports JPG, PNG, PDF, ZIP up to 10MB</div>
              </div>

              {/* Uploaded File List */}
              {files.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 12px", border: "1px solid var(--line-2)",
                        borderRadius: "var(--radius)", background: "var(--bg-3)",
                      }}
                    >
                      <RiAttachmentLine size={13} style={{ color: "var(--gold)" }} />
                      <span style={{ fontSize: 12.5, color: "var(--txt-2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.name}
                      </span>
                      <span style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--txt-4)" }}>
                        {file.size}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        style={{ border: "none", background: "none", cursor: "pointer", color: "var(--txt-4)", display: "grid", placeItems: "center" }}
                      >
                        <RiCloseLine size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 10, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <RiSendPlaneLine size={14} />
                Submit request
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleReset}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Receipt Step */}
        {step === "receipt" && submittedData && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fade-up .3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            {/* Header success */}
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "20px", border: "1px solid rgba(76, 183, 130, 0.25)",
              borderRadius: "var(--radius-lg)", background: "rgba(76, 183, 130, 0.04)",
            }}>
              <div style={{
                display: "grid", placeItems: "center",
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(76, 183, 130, 0.15)", color: "var(--green)",
              }}>
                <RiCheckLine size={20} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--green)" }}>{submittedData.id}</span>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--line-3)" }} />
                  <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--txt-3)" }}>Submitted just now</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "2px 0 0" }}>Request Successfully Logged</h3>
              </div>
            </div>

            {/* Layout split for receipt */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }}>
              {/* Receipt Left: Summary Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <h4 style={{ fontSize: 12, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--txt-4)", margin: 0 }}>
                  Request Details
                </h4>

                <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Row title */}
                  <div>
                    <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--txt-4)" }}>TITLE</span>
                    <div style={{ fontSize: 14.5, fontWeight: 550, color: "var(--txt)", marginTop: 2 }}>{submittedData.title}</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--txt-4)" }}>CATEGORY</span>
                      <div style={{ fontSize: 13, color: "var(--txt-2)", marginTop: 2 }}>{submittedData.category}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--txt-4)" }}>PRIORITY</span>
                      <div style={{ marginTop: 2 }}>
                        <span className={`prio ${submittedData.priority}`} style={{ height: 18, fontSize: 9 }}>
                          {submittedData.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category dynamic configurations */}
                  <div style={{ padding: 12, border: "1px solid var(--line-2)", borderRadius: 6, background: "var(--bg-3)" }}>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--gold)", letterSpacing: ".05em" }}>CONFIGURED OPTION</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                      {Object.entries(submittedData.details).map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                          <span style={{ color: "var(--txt-3)" }}>{k}</span>
                          <span style={{ color: "var(--txt-2)", fontWeight: 500, textAlign: "right" }}>
                            {Array.isArray(v) ? (v.length > 0 ? v.join(", ") : "None") : v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Justification */}
                  <div>
                    <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--txt-4)" }}>BUSINESS JUSTIFICATION</span>
                    <p style={{ fontSize: 13, color: "var(--txt-3)", margin: "4px 0 0", lineHeight: 1.5 }}>
                      {submittedData.justification || "No justification provided."}
                    </p>
                  </div>

                  {/* Files */}
                  {submittedData.files.length > 0 && (
                    <div>
                      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--txt-4)" }}>ATTACHMENTS</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                        {submittedData.files.map((file, idx) => (
                          <div key={idx} style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "4px 8px", border: "1px solid var(--line-2)",
                            borderRadius: 4, background: "var(--bg-3)", fontSize: 11.5,
                          }}>
                            <RiAttachmentLine size={11} style={{ color: "var(--gold)" }} />
                            <span style={{ color: "var(--txt-2)" }}>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleReset}>
                    Submit another request
                  </button>
                  <a href="/dashboard" className="btn btn-secondary btn-sm">
                    Go to Dashboard
                  </a>
                </div>
              </div>

              {/* Receipt Right: Live Status Tracking */}
              <div>
                <h4 style={{ fontSize: 12, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--txt-4)", margin: "0 0 16px" }}>
                  Live Request Status
                </h4>

                <div className="card" style={{ padding: "20px 16px" }}>
                  {/* Status header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: 14, marginBottom: 14 }}>
                    <span style={{ fontSize: 13, color: "var(--txt-2)", fontWeight: 500 }}>Ticket Progress</span>
                    <span className="st pending">
                      <span className="d" /> Pending Approval
                    </span>
                  </div>

                  {/* Progress Timeline */}
                  <div className="timeline" style={{ paddingLeft: 22 }}>
                    {/* Stage 1: Submitted */}
                    <div className="tli green" style={{ padding: "0 0 20px" }}>
                      <span className="w">Step 1 · Completed</span>
                      <b style={{ color: "var(--txt)" }}>Request Submitted</b>
                      <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 2 }}>Auto-assigned ID {submittedData.id}</div>
                    </div>

                    {/* Stage 2: Triage */}
                    <div className="tli green" style={{ padding: "0 0 20px" }}>
                      <span className="w">Step 2 · Auto-Triage</span>
                      <b style={{ color: "var(--txt)" }}>AI Triaged &amp; SLA Mapped</b>
                      <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 2 }}>
                        SLA Target: {submittedData.priority === "p1" ? "2 hours" : submittedData.priority === "p2" ? "8 hours" : "3 days"}
                      </div>
                    </div>

                    {/* Stage 3: Approval */}
                    <div className="tli gold" style={{ padding: "0 0 20px" }}>
                      <span className="w">Step 3 · Pending Approval</span>
                      <b style={{ color: "var(--txt)" }}>Manager Approval Required</b>
                      <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 2 }}>
                        Awaiting review by <span style={{ color: "var(--gold)", fontWeight: 500 }}>@maya.chen</span>
                      </div>
                    </div>

                    {/* Stage 4: Fulfillment */}
                    <div className="tli" style={{ padding: 0 }}>
                      <span className="w" style={{ color: "var(--txt-5)" }}>Step 4 · Pending Fulfillment</span>
                      <b style={{ color: "var(--txt-4)" }}>IT Support Team Execution</b>
                      <div style={{ fontSize: 12, color: "var(--txt-5)", marginTop: 2 }}>Will be assigned on approval</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Right Info Rail ── */}
      <aside className="rail" style={{ width: 360, flexShrink: 0 }}>
        {/* SLA Information */}
        <div>
          <div className="rail-hd">
            <RiTimerLine size={13} style={{ color: "var(--gold)" }} />
            <span className="t-mono">SLA GUARANTEES &amp; TARGETS</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--txt-3)", lineHeight: 1.5, margin: "10px 0 14px" }}>
            All incoming service requests are triaged under the SCB TechX IT department charter. Responding and resolution SLAs depend on priority.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "P1 · Critical", value: "2h resolution", color: "var(--red)", bg: "rgba(235,87,87,.05)", border: "rgba(235,87,87,.2)" },
              { label: "P2 · High", value: "8h resolution", color: "var(--amber)", bg: "rgba(242,153,74,.05)", border: "rgba(242,153,74,.2)" },
              { label: "P3 · Medium", value: "3 days resolution", color: "var(--gold)", bg: "rgba(227,179,65,.05)", border: "rgba(227,179,65,.2)" },
              { label: "P4 · Low", value: "5 days resolution", color: "var(--txt-3)", bg: "var(--bg-3)", border: "var(--line-2)" },
            ].map((prio) => (
              <div
                key={prio.label}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "9px 12px", borderRadius: 6, background: prio.bg, border: `1px solid ${prio.border}`,
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: prio.color }}>{prio.label}</span>
                <span style={{ fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--txt-2)" }}>{prio.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assist Notice */}
        <div style={{
          borderRadius: 10,
          border: "1px solid rgba(139,92,246,.28)",
          background: "linear-gradient(145deg, rgba(94,106,210,.06) 0%, rgba(139,92,246,.04) 100%)",
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <RiSparklingLine size={13} style={{ color: "#8B5CF6" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa" }}>
              AI Copilot Auto-Assign
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--txt-3)", lineHeight: 1.5, margin: 0 }}>
            Our system uses natural language processing to automatically categorize, tags, and map tickets. Approvers are selected based on department cost code.
          </p>
        </div>

        {/* Recent Requests History */}
        <div style={{ marginTop: 8 }}>
          <div className="rail-hd">
            <RiHistoryLine size={13} style={{ color: "var(--txt-3)" }} />
            <span className="t-mono">YOUR RECENT REQUESTS</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {history.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: "12px", border: "1px solid var(--line-2)",
                  borderRadius: 8, background: "var(--bg-2)",
                  display: "flex", flexDirection: "column", gap: 6,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--txt-3)" }}>
                    {req.id} · {req.category}
                  </span>
                  <span className={`st ${req.status}`} style={{ fontSize: 9, padding: "1px 6px" }}>
                    {req.status}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--txt)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {req.title}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                  <span style={{ fontSize: 10.5, color: "var(--txt-4)" }}>{req.date}</span>
                  <span className={`prio ${req.priority}`} style={{ width: 18, height: 18, fontSize: 8.5 }}>
                    {req.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
