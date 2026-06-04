"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  RiDashboardLine,
  RiTicket2Line,
  RiApps2Line,
  RiBarChartBoxLine,
  RiSettings4Line,
  RiGroupLine,
  RiPaintBrushLine,
  RiPlugLine,
  RiTeamLine,
  RiAddLine,
  RiBellLine,
  RiQuestionLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiUser3Line,
  RiSettings3Line,
  RiEqualizerLine,
  RiLink,
  RiLogoutBoxRLine,
  RiSwitchLine,
  RiCheckLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiAlarmWarningLine,
  RiComputerLine,
  RiHeadphoneLine,
} from "@remixicon/react"
import { SearchBar } from "@/components/onyx/search-bar"
import type { RemixiconComponentType } from "@remixicon/react"

/* ── Nav types ── */
interface NavLeaf {
  kind?: "leaf"
  label: string
  href: string
  active?: boolean
}
interface NavGroup {
  kind: "group"
  label: string
  icon: RemixiconComponentType
  children: NavLeaf[]
  defaultOpen?: boolean
}
interface NavItem {
  kind?: "leaf"
  label: string
  href: string
  icon: RemixiconComponentType
  active?: boolean
}
interface NavSection {
  section?: string
  items: (NavItem | NavGroup)[]
}

/* Top nav — scrollable */
const NAV_TOP: NavSection[] = [
  {
    items: [
      { label: "Dashboard",      href: "/dashboard",      icon: RiDashboardLine },
      { label: "Service Catalog",href: "/service-catalog",icon: RiApps2Line     },
      { label: "Reports",        href: "/dashboard",      icon: RiBarChartBoxLine },
    ],
  },
]

/* Bottom nav — pinned */
const NAV_BOTTOM: NavSection[] = [
  {
    section: "Administration",
    items: [
      {
        kind: "group",
        label: "User Access",
        icon: RiGroupLine,
        defaultOpen: false,
        children: [
          { label: "Support Group", href: "/dashboard" },
        ],
      },
      {
        kind: "group",
        label: "Process Settings",
        icon: RiSettings4Line,
        defaultOpen: false,
        children: [
          { label: "SLA Policies",      href: "/dashboard" },
          { label: "Workflow Designer", href: "/workflow-designer" },
        ],
      },
      {
        kind: "group",
        label: "Customization",
        icon: RiPaintBrushLine,
        defaultOpen: false,
        children: [
          { label: "Forms",        href: "/customization/forms"        },
          { label: "Fields",       href: "/customization/fields"       },
          { label: "Ticket Types", href: "/customization/ticket-types" },
        ],
      },
      {
        kind: "group",
        label: "Integrations",
        icon: RiPlugLine,
        defaultOpen: false,
        children: [
          { label: "Webhooks", href: "/dashboard" },
          { label: "API Keys", href: "/dashboard" },
        ],
      },
    ],
  },
  {
    section: "Module Admin",
    items: [
      { label: "User Management", href: "/user-management", icon: RiTeamLine },
    ],
  },
]

/* ── Workspace / org data ── */
const WORKSPACES = [
  { value: "fasheasy",      label: "FastEasy"      },
  { value: "zurich",        label: "Zurich Project" },
  { value: "autox",         label: "AutoX LOS"      },
  { value: "xplatform",     label: "xPlatform"      },
  { value: "accessrequest", label: "Access Request" },
  { value: "itsm",          label: "ITSM"           },
]

const ORGS = [
  { value: "scbtechx",  label: "SCB TechX",  initials: "ST" },
  { value: "datax",     label: "DataX",       initials: "DX" },
  { value: "scbxgroup", label: "SCBx Group",  initials: "SX" },
]

const AVATAR_MENU = [
  { icon: RiUser3Line,     label: "Profile"     },
  { icon: RiSettings3Line, label: "Settings"    },
  { icon: RiEqualizerLine, label: "Preferences" },
  { icon: RiLink,          label: "Connections" },
]

/* ── Shared menu button ── */
function MenuItem({
  icon: Icon, label, onClick, danger = false, suffix,
}: {
  icon: RemixiconComponentType
  label: string
  onClick?: () => void
  danger?: boolean
  suffix?: React.ReactNode
}) {
  const [hov, setHov] = useState(false)
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 9,
        padding: "8px 10px", borderRadius: "var(--radius-sm)",
        background: hov ? (danger ? "rgba(235,87,87,.08)" : "var(--bg-3)") : "transparent",
        border: "none", cursor: "pointer", fontSize: 13,
        color: hov ? (danger ? "var(--red)" : "var(--txt)") : (danger ? "var(--txt-3)" : "var(--txt-2)"),
        fontFamily: "inherit", textAlign: "left", transition: "background .12s, color .12s",
      }}
    >
      <Icon size={14} style={{ flexShrink: 0, opacity: hov ? 1 : 0.6 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {suffix}
    </button>
  )
}

/* ── Collapsible nav group ── */
function NavGroupItem({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  const [open, setOpen] = useState(group.defaultOpen ?? false)
  const hasActive = group.children.some((c) => c.active)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={collapsed ? group.label : undefined}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          gap: collapsed ? 0 : 9,
          padding: collapsed ? "8px" : "8px 9px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 6, background: hasActive && !open ? "var(--bg-2)" : "transparent",
          border: "none", cursor: "pointer", fontSize: 13,
          color: hasActive ? "var(--txt)" : "var(--txt-2)",
          fontFamily: "inherit", textAlign: "left",
          transition: "background .12s, color .12s",
          position: "relative",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.color = "var(--txt)" }}
        onMouseLeave={(e) => { e.currentTarget.style.background = hasActive && !open ? "var(--bg-2)" : "transparent"; e.currentTarget.style.color = hasActive ? "var(--txt)" : "var(--txt-2)" }}
      >
        {/* Gold bar for active collapsed */}
        {hasActive && collapsed && (
          <span style={{
            position: "absolute", left: 0, top: 6, bottom: 6, width: 2,
            background: "linear-gradient(180deg, var(--gold-3), var(--gold))",
            borderRadius: "0 2px 2px 0", boxShadow: "0 0 8px var(--gold-glow)",
          }}/>
        )}
        <group.icon size={14} style={{ flexShrink: 0, color: hasActive ? "var(--gold)" : "var(--txt-3)" }} />
        {!collapsed && (
          <>
            <span style={{ flex: 1, fontWeight: hasActive ? 500 : 400 }}>{group.label}</span>
            <RiArrowDownSLine size={13} style={{
              color: "var(--txt-4)",
              transform: open ? "none" : "rotate(-90deg)",
              transition: "transform .18s",
            }}/>
          </>
        )}
      </button>

      {open && !collapsed && (
        <div style={{ marginLeft: 22, marginTop: 1, marginBottom: 2 }}>
          {group.children.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "7px 9px", borderRadius: 5, fontSize: 13,
                color: child.active ? "var(--txt)" : "var(--txt-3)",
                background: child.active ? "var(--bg-2)" : "transparent",
                fontWeight: child.active ? 500 : 400,
                textDecoration: "none", transition: "color .12s, background .12s",
                position: "relative",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--txt)"; (e.currentTarget as HTMLElement).style.background = "var(--bg-2)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = child.active ? "var(--txt)" : "var(--txt-3)"; (e.currentTarget as HTMLElement).style.background = child.active ? "var(--bg-2)" : "transparent" }}
            >
              {/* Active child gold bar */}
              {child.active && (
                <span style={{
                  position: "absolute", left: -22, top: 6, bottom: 6, width: 2,
                  background: "linear-gradient(180deg, var(--gold-3), var(--gold))",
                  borderRadius: "0 2px 2px 0", boxShadow: "0 0 8px var(--gold-glow)",
                }}/>
              )}
              <span style={{
                width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                background: child.active ? "var(--gold)" : "var(--txt-5)",
                boxShadow: child.active ? "0 0 6px var(--gold-glow)" : "none",
                transition: "background .12s",
              }}/>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Nav section renderer ── */
function NavSectionBlock({ section, si, sideCollapsed }: { section: NavSection; si: number; sideCollapsed: boolean }) {
  return (
    <div key={si} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {section.section && !sideCollapsed && (
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: ".12em",
          textTransform: "uppercase", color: "var(--txt-5)",
          padding: "8px 9px 3px", marginTop: si > 0 ? 4 : 0,
        }}>{section.section}</div>
      )}
      {section.items.map((item, ii) => {
        if (item.kind === "group") {
          return <NavGroupItem key={ii} group={item as NavGroup} collapsed={sideCollapsed} />
        }
        const leaf = item as NavItem
        return (
          <Link
            key={ii}
            href={leaf.href}
            title={sideCollapsed ? leaf.label : undefined}
            style={{
              display: "flex", alignItems: "center",
              gap: sideCollapsed ? 0 : 9,
              padding: sideCollapsed ? "8px" : "8px 9px",
              justifyContent: sideCollapsed ? "center" : "flex-start",
              borderRadius: 6, fontSize: 13,
              color: leaf.active ? "var(--txt)" : "var(--txt-2)",
              background: leaf.active ? "var(--bg-2)" : "transparent",
              fontWeight: leaf.active ? 500 : 400,
              textDecoration: "none", transition: "color .12s, background .12s",
              position: "relative",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; (e.currentTarget as HTMLElement).style.color = "var(--txt)" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = leaf.active ? "var(--bg-2)" : "transparent"; (e.currentTarget as HTMLElement).style.color = leaf.active ? "var(--txt)" : "var(--txt-2)" }}
          >
            {leaf.active && (
              <span style={{
                position: "absolute", left: 0, top: 6, bottom: 6, width: 2,
                background: "linear-gradient(180deg, var(--gold-3), var(--gold))",
                borderRadius: "0 2px 2px 0", boxShadow: "0 0 8px var(--gold-glow)",
              }}/>
            )}
            <leaf.icon size={14} style={{ flexShrink: 0, color: leaf.active ? "var(--gold)" : "var(--txt-3)" }} />
            {!sideCollapsed && <span>{leaf.label}</span>}
          </Link>
        )
      })}
    </div>
  )
}

/* ── Skeleton shimmer ── */
function Skeleton({ w, h, r = 4 }: { w: string | number; h: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "var(--bg-3)",
      position: "relative", overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,.04) 50%, transparent 100%)",
        animation: "skeleton-sweep 1.4s ease-in-out infinite",
      }}/>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
      <main style={{ flex: 1, minWidth: 0, padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Skeleton w={60} h={10} r={3}/>
          <Skeleton w={4} h={4} r={2}/>
          <Skeleton w={80} h={10} r={3}/>
        </div>
        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
          <Skeleton w={280} h={28} r={6}/>
          <Skeleton w={420} h={13} r={4}/>
        </div>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 8 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ padding: "16px", border: "1px solid var(--line-2)", borderRadius: 8, background: "var(--bg-2)", display: "flex", flexDirection: "column", gap: 10 }}>
              <Skeleton w={100} h={10} r={3}/>
              <Skeleton w={60} h={28} r={4}/>
              <Skeleton w={80} h={10} r={3}/>
            </div>
          ))}
        </div>
        {/* Table */}
        <div style={{ marginTop: 8, border: "1px solid var(--line-2)", borderRadius: 8, overflow: "hidden", background: "var(--bg-2)" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < 5 ? "1px solid var(--line)" : "none" }}>
              <Skeleton w={48} h={18} r={4}/>
              <Skeleton w={200} h={12} r={3}/>
              <Skeleton w={80} h={12} r={3}/>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <Skeleton w={70} h={20} r={10}/>
                <Skeleton w={24} h={24} r={12}/>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Rail skeleton */}
      <aside style={{ width: 360, flexShrink: 0, borderLeft: "1px solid var(--line)", padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Skeleton w={80} h={12} r={3}/>
          <div style={{ marginLeft: "auto" }}><Skeleton w={24} h={24} r={4}/></div>
        </div>
        <Skeleton w="100%" h={18} r={4}/>
        <Skeleton w="75%" h={14} r={4}/>
        <div style={{ display: "flex", gap: 6 }}>
          {[...Array(3)].map((_, i) => <Skeleton key={i} w={60} h={22} r={11}/>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              <Skeleton w={36} h={12} r={3}/>
              <Skeleton w={100} h={12} r={3}/>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          {[...Array(3)].map((_, i) => <Skeleton key={i} w="100%" h={12} r={3}/>)}
        </div>
        {/* AI prompt skeleton */}
        <div style={{ marginTop: "auto", border: "1px solid var(--line-2)", borderRadius: 8, overflow: "hidden" }}>
          <Skeleton w="100%" h={72} r={0}/>
        </div>
      </aside>
    </div>
  )
}
/* ── Main layout ── */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted]               = useState(false)
  const [sideCollapsed, setSideCollapsed]   = useState(true)
  const [avatarOpen, setAvatarOpen]         = useState(false)
  const [sideWsOpen, setSideWsOpen]         = useState(false)
  const [createOpen, setCreateOpen]         = useState(false)
  const [orgExpanded, setOrgExpanded]       = useState(false)
  const [activeOrg, setActiveOrg]           = useState("scbtechx")
  const [activeWs, setActiveWs]             = useState("accessrequest")

  const avatarRef    = useRef<HTMLDivElement>(null)

  const createRef    = useRef<HTMLDivElement>(null)
  const sideWsRef    = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false); setOrgExpanded(false)
      }
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateOpen(false)
      }
      if (sideWsRef.current && !sideWsRef.current.contains(e.target as Node)) {
        setSideWsOpen(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  const currentWs = WORKSPACES.find((w) => w.value === activeWs) ?? WORKSPACES[0]

  const sideW = sideCollapsed ? 52 : 224

  function computeNav(nav: NavSection[]): NavSection[] {
    return nav.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        if (item.kind === "group") {
          const g = item as NavGroup
          const children = g.children.map((child) => ({
            ...child,
            active: child.href === pathname && (pathname !== "/dashboard" || child.label === "Dashboard"),
          }))
          const hasActive = children.some((c) => c.active)
          return { ...g, children, defaultOpen: g.defaultOpen || hasActive } as NavGroup
        }
        const leaf = item as NavItem
        return {
          ...leaf,
          active: leaf.href === pathname && (pathname !== "/dashboard" || leaf.label === "Dashboard"),
        } as NavItem
      }),
    }))
  }

  const computedTop    = computeNav(NAV_TOP)
  const computedBottom = computeNav(NAV_BOTTOM)

  return (
    <div className="app-shell">
      <style>{`
        @keyframes item-in {
          from { opacity: 0; transform: translateY(6px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        @keyframes skeleton-sweep {
          0%   { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }
      `}</style>

      {/* ── Topbar ── */}
      <header className="topbar" style={{ gridTemplateColumns: "auto 1fr auto auto auto auto", gap: 8 }}>

        {/* Brand */}
        <Link href="/dashboard" className="brand" style={{ paddingRight: 0, marginRight: 24 }}>
          <span className="mark"><b>X</b></span>
          <span>SCB TechX</span>
        </Link>

        {/* Search */}
        <SearchBar />

        {/* Create — split group button */}
        <div ref={createRef} style={{ position: "relative", display: "flex" }}>
          {/* Primary action */}
          <button
            type="button"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 10px", borderRadius: "var(--radius) 0 0 var(--radius)",
              background: "linear-gradient(180deg, var(--gold-3) 0%, var(--gold) 55%, var(--gold-2) 100%)",
              color: "var(--gold-ink)", border: "1px solid var(--gold-2)", borderRight: "none",
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.25)",
              transition: "box-shadow .15s", whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.25), 0 0 0 3px var(--gold-glow)" }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.25)" }}
          >
            <RiAddLine size={14} />
            Create
          </button>
          {/* Dropdown trigger */}
          <button
            type="button"
            onClick={() => setCreateOpen((o) => !o)}
            style={{
              display: "grid", placeItems: "center",
              width: 26, padding: "6px 0",
              borderRadius: "0 var(--radius) var(--radius) 0",
              background: createOpen
                ? "linear-gradient(180deg, var(--gold-2) 0%, #a87e20 100%)"
                : "linear-gradient(180deg, var(--gold-3) 0%, var(--gold) 55%, var(--gold-2) 100%)",
              color: "var(--gold-ink)", border: "1px solid var(--gold-2)",
              borderLeft: "1px solid rgba(0,0,0,.18)",
              cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.15), 0 1px 0 rgba(0,0,0,.25)",
              transition: "background .12s",
            }}
          >
            <RiArrowDownSLine size={13} style={{ transform: createOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
          </button>

          {/* Dropdown menu */}
          {createOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
              minWidth: 220, background: "var(--bg-2)", border: "1px solid var(--line-2)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 16px 40px -8px rgba(0,0,0,.6), 0 0 0 1px var(--line)",
              padding: "4px", animation: "item-in .15s ease",
            }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: ".12em",
                textTransform: "uppercase", color: "var(--txt-5)", padding: "6px 10px 4px",
              }}>Create new</div>
              {[
                { label: "New Ticket",       icon: RiTicket2Line,       kbd: "C", href: "/dashboard" },
                { label: "New Incident",      icon: RiAlarmWarningLine,  kbd: "I", href: "/dashboard" },
                { label: "Issue Request",     icon: RiComputerLine,      kbd: "R", href: "/dashboard" },
                { label: "Service Request",   icon: RiHeadphoneLine,     kbd: "S", href: "/service-request" },
              ].map(({ label, icon: Icon, kbd, href }) => (
                <button key={label} type="button"
                  onClick={() => {
                    setCreateOpen(false)
                    router.push(href)
                  }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 9,
                    padding: "8px 10px", borderRadius: "var(--radius-sm)",
                    background: "transparent", border: "none", cursor: "pointer",
                    fontSize: 13, color: "var(--txt-2)", fontFamily: "inherit", textAlign: "left",
                    transition: "background .12s, color .12s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "var(--txt)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--txt-2)" }}
                >
                  <Icon size={14} style={{ color: "var(--txt-4)", flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{label}</span>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 10.5,
                    padding: "1px 6px", borderRadius: 4,
                    background: "var(--bg-4)", border: "1px solid var(--line-3)",
                    color: "var(--txt-4)",
                  }}>{kbd}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="iconbtn" title="Notifications">
          <RiBellLine size={13} />
          <span className="dot" />
        </button>

        {/* Help */}
        <button className="iconbtn" title="Help">
          <RiQuestionLine size={13} />
        </button>

        {/* Avatar */}
        <div ref={avatarRef} style={{ position: "relative" }}>
          <div className="avatar" data-i="RW" title="Ritpol Wongtaweesinkha"
            onClick={() => { setAvatarOpen((o) => !o); setOrgExpanded(false) }}
            style={{
              cursor: "pointer",
              outline: avatarOpen ? "2px solid var(--gold)" : "2px solid transparent",
              outlineOffset: 2, transition: "outline-color .15s",
            }}
          />

          {avatarOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50,
              minWidth: 220, background: "var(--bg-2)", border: "1px solid var(--line-2)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 16px 40px -8px rgba(0,0,0,.6), 0 0 0 1px var(--line)",
              overflow: "hidden", animation: "item-in .15s ease",
            }}>
              {/* User info */}
              <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid var(--line-2)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--txt)", letterSpacing: "-.01em" }}>
                  Ritpol Wongtaweesinkha
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--txt-4)", marginTop: 2, letterSpacing: ".02em" }}>
                  ritpolw@gmail.com
                </div>
              </div>

              {/* Menu */}
              <div style={{ padding: "4px" }}>
                {AVATAR_MENU.map(({ icon, label }) => (
                  <MenuItem key={label} icon={icon} label={label} onClick={() => setAvatarOpen(false)} />
                ))}

                {/* Switch organization */}
                <div>
                  <button type="button" onClick={() => setOrgExpanded((o) => !o)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 9,
                      padding: "8px 10px", borderRadius: "var(--radius-sm)",
                      background: orgExpanded ? "var(--bg-3)" : "transparent",
                      border: "none", cursor: "pointer", fontSize: 13,
                      color: orgExpanded ? "var(--txt)" : "var(--txt-2)",
                      fontFamily: "inherit", textAlign: "left", transition: "background .12s, color .12s",
                    }}
                    onMouseEnter={(e) => { if (!orgExpanded) { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "var(--txt)" } }}
                    onMouseLeave={(e) => { if (!orgExpanded) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--txt-2)" } }}
                  >
                    <RiSwitchLine size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
                    <span style={{ flex: 1 }}>Switch organization</span>
                    <RiArrowRightSLine size={13} style={{
                      color: "var(--txt-4)",
                      transform: orgExpanded ? "rotate(90deg)" : "none",
                      transition: "transform .15s",
                    }}/>
                  </button>

                  {orgExpanded && (
                    <div style={{ margin: "2px 0 2px 8px", paddingLeft: 8, borderLeft: "1px solid var(--line-2)" }}>
                      {ORGS.map((org) => (
                        <button key={org.value} type="button"
                          onClick={() => { setActiveOrg(org.value); setAvatarOpen(false); setOrgExpanded(false) }}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 8,
                            padding: "7px 8px", borderRadius: "var(--radius-sm)",
                            background: "transparent", border: "none", cursor: "pointer",
                            fontSize: 12.5,
                            color: org.value === activeOrg ? "var(--txt)" : "var(--txt-3)",
                            fontFamily: "inherit", textAlign: "left", transition: "background .12s, color .12s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-4)"; e.currentTarget.style.color = "var(--txt)" }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = org.value === activeOrg ? "var(--txt)" : "var(--txt-3)" }}
                        >
                          <span style={{
                            width: 18, height: 18, borderRadius: 4,
                            background: "linear-gradient(135deg, var(--gold-3), var(--gold-2))",
                            color: "var(--gold-ink)", fontFamily: "var(--font-mono)",
                            fontSize: 8, fontWeight: 700, display: "grid", placeItems: "center", flexShrink: 0,
                          }}>{org.initials}</span>
                          <span style={{ flex: 1 }}>{org.label}</span>
                          {org.value === activeOrg && <RiCheckLine size={11} style={{ color: "var(--gold)" }}/>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sign out */}
              <div style={{ padding: "4px", borderTop: "1px solid var(--line-2)" }}>
                <MenuItem icon={RiLogoutBoxRLine} label="Sign out" danger
                  onClick={() => { setAvatarOpen(false); router.push("/login") }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 51px)" }}>

        {/* Sidebar */}
        <aside style={{
          width: sideW, minWidth: sideW, flexShrink: 0,
          borderRight: "1px solid var(--line)",
          background: "var(--bg-1)",
          position: "sticky", top: 51, height: "calc(100vh - 51px)", overflowY: "auto", overflowX: "hidden",
          display: "flex", flexDirection: "column",
          transition: "width .2s cubic-bezier(.4,0,.2,1), min-width .2s cubic-bezier(.4,0,.2,1)",
        }}>
          {/* Topbar of sidebar: workspace + collapse toggle */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: sideCollapsed ? "center" : "space-between",
            padding: "10px 10px 6px",
            borderBottom: "1px solid var(--line)",
            gap: 6,
          }}>
            {/* Sidebar workspace switcher */}
            {!sideCollapsed && (
              <div ref={sideWsRef} style={{ position: "relative", flex: 1, minWidth: 0 }}>
                <button
                  type="button"
                  onClick={() => setSideWsOpen((o) => !o)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 6,
                    padding: "5px 7px", borderRadius: "var(--radius)",
                    background: sideWsOpen ? "var(--bg-3)" : "var(--bg-2)",
                    border: `1px solid ${sideWsOpen ? "var(--line-3)" : "var(--line-2)"}`,
                    cursor: "pointer", transition: "background .15s, border-color .15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.borderColor = "var(--line-3)" }}
                  onMouseLeave={(e) => { if (!sideWsOpen) { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.borderColor = "var(--line-2)" } }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                    background: "linear-gradient(135deg, var(--gold-3), var(--gold-2))",
                    color: "var(--gold-ink)", fontFamily: "var(--font-mono)",
                    fontSize: 8, fontWeight: 700, display: "grid", placeItems: "center",
                  }}>{currentWs.label.slice(0, 2).toUpperCase()}</span>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500, color: "var(--txt-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>
                    {currentWs.label}
                  </span>
                  <RiArrowDownSLine size={12} style={{
                    color: "var(--txt-4)", flexShrink: 0,
                    transform: sideWsOpen ? "rotate(180deg)" : "none",
                    transition: "transform .15s",
                  }}/>
                </button>

                {sideWsOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
                    background: "var(--bg-2)", border: "1px solid var(--line-2)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "0 16px 40px -8px rgba(0,0,0,.6), 0 0 0 1px var(--line)",
                    padding: "4px", animation: "item-in .15s ease",
                  }}>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: ".12em",
                      textTransform: "uppercase", color: "var(--txt-5)", padding: "5px 10px 3px",
                    }}>Workspaces</div>
                    {WORKSPACES.map((ws) => (
                      <button key={ws.value} type="button"
                        onClick={() => { setActiveWs(ws.value); setSideWsOpen(false) }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 8,
                          padding: "7px 10px", borderRadius: "var(--radius-sm)",
                          background: ws.value === activeWs ? "var(--bg-4)" : "transparent",
                          border: "none", cursor: "pointer", fontSize: 13,
                          color: ws.value === activeWs ? "var(--txt)" : "var(--txt-2)",
                          fontFamily: "inherit", textAlign: "left", transition: "background .12s, color .12s",
                        }}
                        onMouseEnter={(e) => { if (ws.value !== activeWs) { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.color = "var(--txt)" } }}
                        onMouseLeave={(e) => { if (ws.value !== activeWs) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--txt-2)" } }}
                      >
                        <span style={{ flex: 1 }}>{ws.label}</span>
                        {ws.value === activeWs && <RiCheckLine size={12} style={{ color: "var(--gold)" }}/>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Collapse toggle */}
            <button
              type="button"
              title={sideCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setSideCollapsed((c) => !c)}
              style={{
                width: 28, height: 28, flexShrink: 0, borderRadius: "var(--radius)",
                border: "1px solid var(--line-2)", background: "transparent",
                color: "var(--txt-4)", display: "grid", placeItems: "center",
                cursor: "pointer", transition: "color .15s, border-color .15s, background .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.color = "var(--txt-2)"; e.currentTarget.style.borderColor = "var(--line-3)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--txt-4)"; e.currentTarget.style.borderColor = "var(--line-2)" }}
            >
              {sideCollapsed ? <RiMenuUnfoldLine size={14} /> : <RiMenuFoldLine size={14} />}
            </button>
          </div>

          {/* Nav — top (scrollable) + bottom (pinned) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Top nav — grows and scrolls */}
            <nav style={{ flex: 1, overflowY: "auto", padding: sideCollapsed ? "4px 6px" : "4px 10px", display: "flex", flexDirection: "column", gap: 1 }}>
              {computedTop.map((section, si) => (
                <NavSectionBlock key={si} section={section} si={si} sideCollapsed={sideCollapsed} />
              ))}
            </nav>

            {/* Bottom nav — pinned to bottom */}
            <nav style={{ padding: sideCollapsed ? "4px 6px 32px" : "4px 10px 32px", borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 1 }}>
              {computedBottom.map((section, si) => (
                <NavSectionBlock key={si} section={section} si={si} sideCollapsed={sideCollapsed} />
              ))}
            </nav>
          </div>
        </aside>

        {/* Page content */}
        <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
          {mounted ? children : <PageSkeleton />}
        </div>
      </div>
    </div>
  )
}
