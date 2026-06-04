"use client"

import { useState } from "react"
import Link from "next/link"
import {
  RiFlowChart,
  RiArrowLeftLine,
  RiAddLine,
  RiDeleteBinLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiCheckLine,
  RiSparklingLine,
  RiCodeBoxLine,
  RiInformationLine,
  RiPlayLine,
  RiCloseLine,
  RiSettings3Line,
} from "@remixicon/react"

/* ── Types & Interfaces ── */
type WfType = "SERVICE_REQUEST" | "INCIDENT" | "CHANGE_REQUEST" | "PROBLEM"

interface Step {
  id: string
  name: string
  role: string
  action: string
  color: string
}

/* ── Predefined templates data ── */
const TEMPLATES = [
  {
    name: "Standard Service Request",
    desc: "Line manager approval followed by IT team fulfillment.",
    type: "SERVICE_REQUEST" as WfType,
    steps: [
      { id: "1", name: "Initiation", role: "Requester", action: "Initiate Request", color: "var(--txt-3)" },
      { id: "2", name: "Line Manager Approval", role: "Line Manager", action: "Approve / Reject", color: "var(--gold)" },
      { id: "3", name: "IT Ops Assignment", role: "IT Support Team", action: "Assign Ticket", color: "var(--blue)" },
      { id: "4", name: "Hardware/Access Provisioning", role: "IT support Team", action: "Implement Fulfillment", color: "var(--blue)" },
      { id: "5", name: "Requester Verification", role: "Requester", action: "Verify & Close", color: "var(--green)" },
    ],
  },
  {
    name: "CAB Approved Change",
    desc: "Peer review, CAB approval, execution, and verification.",
    type: "CHANGE_REQUEST" as WfType,
    steps: [
      { id: "1", name: "Change Submission", role: "Change Owner", action: "Submit Draft", color: "var(--txt-3)" },
      { id: "2", name: "Technical Peer Review", role: "Technical Lead", action: "Review & Signoff", color: "var(--blue)" },
      { id: "3", name: "CAB Review", role: "CAB Board", action: "Authorize Release", color: "var(--gold)" },
      { id: "4", name: "Implementation Window", role: "Deployment Engineer", action: "Execute Change", color: "var(--blue)" },
      { id: "5", name: "Post-Implementation Review", role: "QA Specialist", action: "Verify Release", color: "var(--green)" },
    ],
  },
  {
    name: "SecOps Incident Escalation",
    desc: "Triage, containment, and CISO audit signoff.",
    type: "INCIDENT" as WfType,
    steps: [
      { id: "1", name: "Incident Logging", role: "Security Monitor", action: "Raise Security Alert", color: "var(--red)" },
      { id: "2", name: "Triage & Scope Assessment", role: "SOC Analyst", action: "Investigate Scope", color: "var(--blue)" },
      { id: "3", name: "Threat Containment", role: "Incident Responder", action: "Contain Threat", color: "var(--red)" },
      { id: "4", name: "Executive Review", role: "CISO", action: "Signoff Incident", color: "var(--gold)" },
      { id: "5", name: "Post-Mortem & Closure", role: "Security Manager", action: "Publish Post-Mortem", color: "var(--green)" },
    ],
  },
]

export default function CreateWorkflowPage() {
  const [name, setName] = useState("SR_StandardApproval")
  const [type, setType] = useState<WfType>("SERVICE_REQUEST")
  const [description, setDescription] = useState("Standard service request workflow: Line manager approval -> IT execution.")
  const [version, setVersion] = useState("v1")
  const [steps, setSteps] = useState<Step[]>(TEMPLATES[0].steps)
  
  // Custom step input states
  const [newStepName, setNewStepName] = useState("")
  const [newStepRole, setNewStepRole] = useState("Line Manager")
  const [newStepAction, setNewStepAction] = useState("Approve / Reject")

  // Modal / Receipt state
  const [showSavedModal, setShowSavedModal] = useState(false)
  const [generatedConfig, setGeneratedConfig] = useState("")

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStepName.trim()) return

    // Choose color based on action/role keywords
    let color = "var(--blue)"
    if (newStepAction.toLowerCase().includes("approve") || newStepRole.toLowerCase().includes("manager") || newStepRole.toLowerCase().includes("ciso") || newStepRole.toLowerCase().includes("board")) {
      color = "var(--gold)"
    } else if (newStepAction.toLowerCase().includes("verify") || newStepAction.toLowerCase().includes("close") || newStepAction.toLowerCase().includes("publish")) {
      color = "var(--green)"
    } else if (newStepAction.toLowerCase().includes("contain") || newStepAction.toLowerCase().includes("alert") || newStepAction.toLowerCase().includes("threat")) {
      color = "var(--red)"
    }

    const newStep: Step = {
      id: String(steps.length + 1),
      name: newStepName,
      role: newStepRole,
      action: newStepAction,
      color,
    }

    setSteps((prev) => [...prev, newStep])
    setNewStepName("")
  }

  const handleDeleteStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id).map((s, idx) => ({ ...s, id: String(idx + 1) })))
  }

  const applyTemplate = (tplIdx: number) => {
    const tpl = TEMPLATES[tplIdx]
    setName(tpl.name.replace(/\s+/g, ""))
    setType(tpl.type)
    setDescription(tpl.desc)
    setSteps(tpl.steps)
  }

  const handleSave = () => {
    const configSchema = {
      workflow_name: name,
      version: version,
      type: type,
      description: description,
      triggers: type === "INCIDENT" ? ["datadog_alert", "manual_escalation"] : ["service_catalog_submit"],
      steps: steps.map((s) => ({
        step_id: s.id,
        step_name: s.name,
        assigned_role: s.role,
        required_action: s.action,
        sla_target: s.color === "var(--gold)" ? "8h" : "24h",
      })),
    }

    setGeneratedConfig(JSON.stringify(configSchema, null, 2))
    setShowSavedModal(true)
  }

  return (
    <div style={{ display: "flex", flex: 1, minWidth: 0, flexDirection: "column" }}>
      {/* Top Header Row with Actions */}
      <header style={{
        display: "flex", alignItems: "center",
        padding: "16px 32px", borderBottom: "1px solid var(--line)",
        background: "var(--bg-1)", zIndex: 5,
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/workflow-designer" className="iconbtn" title="Back to Workflows">
            <RiArrowLeftLine size={14} />
          </Link>
          <div>
            <nav className="crumb" style={{ marginBottom: 2 }}>
              <a href="/workflow-designer">Workflow Designer</a>
              <span className="sep">/</span>
              <span className="cur">Create</span>
            </nav>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "var(--txt)" }}>
              Create Workflow Flow
            </h2>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/workflow-designer" className="btn btn-secondary btn-sm">
            Cancel
          </Link>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
            <RiCheckLine size={13} />
            Publish Workflow
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", flex: 1, minHeight: 0 }}>
        {/* Left Sidebar: Settings and templates */}
        <aside style={{
          borderRight: "1px solid var(--line)",
          background: "var(--bg-1)",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          overflowY: "auto"
        }}>
          {/* Section: Templates */}
          <div>
            <h4 style={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--txt-4)", marginBottom: 12 }}>
              Quick Start Templates
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TEMPLATES.map((tpl, idx) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => applyTemplate(idx)}
                  style={{
                    padding: "12px", border: "1px solid var(--line-2)",
                    borderRadius: 8, background: "var(--bg-2)",
                    textAlign: "left", cursor: "pointer", transition: "all .12s",
                    display: "flex", flexDirection: "column", gap: 4, width: "100%",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "var(--bg-3)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line-2)"; e.currentTarget.style.background = "var(--bg-2)" }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--txt)" }}>{tpl.name}</span>
                  <span style={{ fontSize: 11, color: "var(--txt-3)", lineHeight: 1.4 }}>{tpl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--line-2)" }} />

          {/* Section: Settings Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h4 style={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--txt-4)", margin: 0 }}>
              Workflow Metadata
            </h4>

            {/* Name */}
            <div className="field">
              <label>Workflow ID Name</label>
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SR_LineManagerApprove"
              />
            </div>

            {/* Type */}
            <div className="field">
              <label>Workflow Category Type</label>
              <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value as WfType)}
              >
                <option value="SERVICE_REQUEST">SERVICE_REQUEST (SR)</option>
                <option value="INCIDENT">INCIDENT (IC)</option>
                <option value="CHANGE_REQUEST">CHANGE_REQUEST (CHG)</option>
                <option value="PROBLEM">PROBLEM (PRB)</option>
              </select>
            </div>

            {/* Version */}
            <div className="field">
              <label>Version Tag</label>
              <input
                type="text"
                className="input"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1"
              />
            </div>

            {/* Description */}
            <div className="field">
              <label>Description</label>
              <textarea
                className="input"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of workflow triggers and steps..."
                style={{ resize: "none" }}
              />
            </div>
          </div>
        </aside>

        {/* Right Area: Step Builder Visualizer */}
        <main style={{
          padding: "24px 32px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 28,
          overflowY: "auto"
        }}>
          {/* Steps List / Builder */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--txt)", margin: 0 }}>
                Workflow Steps
              </h3>
              <p style={{ fontSize: 12.5, color: "var(--txt-3)", margin: "4px 0 0" }}>
                Add, remove, or customize actions triggering at each stage of the lifecycle.
              </p>
            </div>

            {/* Add Step Card */}
            <form onSubmit={handleAddStep} className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--gold)", letterSpacing: ".05em" }}>
                ADD NEW PROCESS STEP
              </div>
              <div className="field">
                <input
                  type="text"
                  required
                  className="input"
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  placeholder="e.g. Audit Approval Signoff"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div className="field">
                  <label>Assignee Role</label>
                  <select
                    className="input"
                    value={newStepRole}
                    onChange={(e) => setNewStepRole(e.target.value)}
                  >
                    <option>Requester</option>
                    <option>Line Manager</option>
                    <option>Department Head</option>
                    <option>IT Support Team</option>
                    <option>Security Analyst</option>
                    <option>CISO</option>
                    <option>CAB Board</option>
                  </select>
                </div>
                <div className="field">
                  <label>Required Action</label>
                  <select
                    className="input"
                    value={newStepAction}
                    onChange={(e) => setNewStepAction(e.target.value)}
                  >
                    <option>Initiate Request</option>
                    <option>Approve / Reject</option>
                    <option>Assign Ticket</option>
                    <option>Implement Fulfillment</option>
                    <option>Investigate Scope</option>
                    <option>Contain Threat</option>
                    <option>Verify &amp; Close</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-secondary btn-sm"
                style={{ width: "fit-content", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}
              >
                <RiAddLine size={13} />
                Add Process Step
              </button>
            </form>

            {/* Interactive Step Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {steps.length === 0 ? (
                <div style={{
                  padding: "32px", border: "1px dashed var(--line-3)",
                  borderRadius: 8, textAlign: "center", color: "var(--txt-4)", fontSize: 13,
                }}>
                  No steps defined. Add a step or select a template to begin.
                </div>
              ) : (
                steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="card"
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px", border: "1px solid var(--line-2)",
                      transition: "border-color .15s",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--line-3)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line-2)" }}
                  >
                    {/* Glowing highlight indicator matching step behavior color */}
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
                      background: step.color, borderRadius: "2px 0 0 2px",
                    }} />

                    {/* Step number */}
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: "var(--bg-3)", border: "1px solid var(--line-3)",
                      display: "grid", placeItems: "center",
                      fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--txt-3)",
                    }}>
                      {step.id}
                    </div>

                    {/* Step Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--txt)" }}>
                        {step.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--txt-3)", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                        <span>Role: <strong style={{ color: "var(--txt-2)" }}>{step.role}</strong></span>
                        <span style={{ color: "var(--line-3)" }}>|</span>
                        <span>Action: <strong style={{ color: "var(--txt-2)" }}>{step.action}</strong></span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      className="iconbtn"
                      onClick={() => handleDeleteStep(step.id)}
                      style={{ color: "var(--txt-4)", opacity: steps.length > 1 ? 1 : 0.4 }}
                      disabled={steps.length <= 1}
                      title="Delete Step"
                    >
                      <RiDeleteBinLine size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Visual Flowchart Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--txt)", margin: 0 }}>
                Visual Flowchart
              </h3>
              <p style={{ fontSize: 12.5, color: "var(--txt-3)", margin: "4px 0 0" }}>
                A visual representation of the temporal workflow routing path.
              </p>
            </div>

            <div className="card" style={{
              background: "var(--bg-2)", border: "1px solid var(--line-2)",
              borderRadius: 12, padding: "28px 20px", display: "flex",
              flexDirection: "column", alignItems: "center", gap: 12,
              minHeight: 380, justifyContent: "center", position: "relative"
            }}>
              {/* Watermark grid */}
              <div style={{
                position: "absolute", inset: 0, opacity: 0.02,
                backgroundImage: "radial-gradient(circle, var(--txt) 1px, transparent 1px)",
                backgroundSize: "20px 20px", pointerEvents: "none"
              }} />

              {steps.map((step, idx) => (
                <div key={step.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                  {/* Step Box */}
                  <div
                    style={{
                      width: "80%", maxWidth: 260, padding: "12px 14px",
                      borderRadius: 8, border: `1px solid var(--line-2)`,
                      background: "var(--bg-3)",
                      display: "flex", flexDirection: "column", gap: 3,
                      position: "relative", textAlign: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: -1, left: "10%", right: "10%", height: 1.5,
                      background: step.color,
                    }} />
                    <span style={{ fontSize: 9.5, fontFamily: "var(--font-mono)", color: "var(--txt-4)", textTransform: "uppercase", letterSpacing: ".04em" }}>
                      STEP {step.id} · {step.role}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--txt)" }}>
                      {step.name}
                    </span>
                    <span style={{
                      fontSize: 10, color: step.color, fontFamily: "var(--font-mono)",
                      letterSpacing: ".02em", background: `${step.color}08`,
                      border: `1px solid ${step.color}15`, padding: "1px 6px", borderRadius: 3,
                      width: "fit-content", alignSelf: "center", marginTop: 2, textTransform: "uppercase"
                    }}>
                      {step.action}
                    </span>
                  </div>

                  {/* Connecting Chevron Arrow */}
                  {idx < steps.length - 1 && (
                    <div style={{
                      display: "grid", placeItems: "center",
                      margin: "4px 0", color: "var(--txt-5)",
                    }}>
                      <RiArrowDownSLine size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── Publish Success Modal ── */}
      {showSavedModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onClick={() => setShowSavedModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              width: 520,
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
                <RiFlowChart size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>Workflow Flow Saved</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--txt)" }}>
                  {name} ({version}) Published Successfully
                </h3>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 13, color: "var(--txt-3)", lineHeight: 1.55 }}>
              The workflow schema definition was successfully compiled and published to the orchestrator temporal service node.
            </p>

            {/* Generated Schema Box */}
            <div className="field">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RiCodeBoxLine size={12} />
                JSON Config Output Schema
              </label>
              <pre style={{
                margin: "4px 0 0", padding: "12px", borderRadius: 6,
                background: "var(--bg-3)", border: "1px solid var(--line-3)",
                color: "var(--txt-2)", fontFamily: "var(--font-mono)", fontSize: 11,
                maxHeight: 180, overflow: "auto", whiteSpace: "pre-wrap"
              }}>
                {generatedConfig}
              </pre>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              <Link href="/workflow-designer" className="btn btn-primary btn-sm">
                Return to Designer
              </Link>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowSavedModal(false)}
              >
                Close preview
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
