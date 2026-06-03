import Link from "next/link"
import {
  RiInbox2Line,
  RiCheckboxLine,
  RiLayoutGridLine,
  RiTimeLine,
  RiLineChartLine,
  RiFileList3Line,
  RiPhoneLine,
  RiServerLine,
  RiMacLine,
  RiFilePaper2Line,
  RiGlobalLine,
  RiPlugLine,
  RiSettings4Line,
  RiAddLine,
  RiBellLine,
  RiQuestionLine,
  RiArrowDownSLine,
} from "@remixicon/react"
import { SearchBar } from "@/components/onyx/search-bar"

import type { RemixiconComponentType } from "@remixicon/react"

interface NavItem {
  label: string
  href: string
  icon: RemixiconComponentType
  count?: number | string
  active?: boolean
}

interface NavSection {
  group: string
  items: NavItem[]
}

const NAV: NavSection[] = [
  {
    group: "Workspace",
    items: [
      { label: "Inbox",      href: "/dashboard", icon: RiInbox2Line,      count: 12, active: true },
      { label: "My queue",   href: "/dashboard", icon: RiCheckboxLine,    count: 4  },
      { label: "All tickets",href: "/dashboard", icon: RiLayoutGridLine              },
      { label: "SLA timers", href: "/dashboard", icon: RiTimeLine,        count: 3  },
    ],
  },
  {
    group: "Operate",
    items: [
      { label: "Dashboards", href: "/dashboard", icon: RiLineChartLine },
      { label: "Runbooks",   href: "/dashboard", icon: RiFileList3Line },
      { label: "On-call",    href: "/dashboard", icon: RiPhoneLine     },
    ],
  },
  {
    group: "Catalog · ITAM",
    items: [
      { label: "Services",  href: "/dashboard", icon: RiServerLine,     count: 42    },
      { label: "Assets",    href: "/dashboard", icon: RiMacLine,        count: "1.2k"},
      { label: "Licenses",  href: "/dashboard", icon: RiFilePaper2Line              },
      { label: "Requests",  href: "/dashboard", icon: RiGlobalLine                  },
    ],
  },
  {
    group: "Admin",
    items: [
      { label: "Integrations", href: "/dashboard", icon: RiPlugLine     },
      { label: "Settings",     href: "/dashboard", icon: RiSettings4Line },
    ],
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      {/* ── Topbar ── */}
      <header className="topbar" style={{ gridTemplateColumns: "240px auto 1fr auto auto auto auto", gap: 10 }}>
        {/* Brand */}
        <Link href="/dashboard" className="brand">
          <span className="mark"><b>X</b></span>
          <span>xService</span>
        </Link>

        {/* Workspace switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--bg-2)",
            border: "1px solid var(--line-2)",
            borderRadius: "var(--radius)",
            padding: "4px 8px 4px 4px",
            fontSize: 12.5,
            color: "var(--txt-2)",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              width: 20, height: 20, borderRadius: 4,
              background: "linear-gradient(135deg,#E3B341,#8C6516)",
              color: "#3B2A00",
              fontFamily: "var(--font-mono)",
              fontSize: 9, fontWeight: 700,
              display: "grid", placeItems: "center", flexShrink: 0,
            }}
          >
            AC
          </span>
          <span>Acme Cloud</span>
          <RiArrowDownSLine size={12} style={{ color: "var(--txt-4)" }} />
        </div>

        {/* Search */}
        <SearchBar />

        {/* Create */}
        <button className="iconbtn" title="Create">
          <RiAddLine size={13} />
        </button>

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
        <div className="avatar" data-i="AM" title="Asha Menon" />
      </header>

      {/* ── Body: sidebar + page content ── */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 51px)" }}>
        {/* Sidebar */}
        <aside className="side">
          {NAV.map((section) => (
            <div key={section.group}>
              <div className="grp">{section.group}</div>
              {section.items.map((item) => (
                <Link key={item.label} href={item.href} className={`it${item.active ? " active" : ""}`}>
                  <item.icon size={14} />
                  {item.label}
                  {item.count !== undefined && (
                    <span className="c">{item.count}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </aside>

        {/* Page content fills the rest */}
        <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
          {children}
        </div>
      </div>
    </div>
  )
}
