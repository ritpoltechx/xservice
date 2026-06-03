"use client"

import { useEffect, useRef } from "react"
import { RiSearchLine } from "@remixicon/react"

export function SearchBar() {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div
      className="search"
      onClick={() => ref.current?.focus()}
    >
      <RiSearchLine size={13} />
      <input
        ref={ref}
        type="text"
        placeholder="Search tickets, assets, runbooks, people…"
        onFocus={(e) => e.currentTarget.parentElement?.classList.add("focused")}
        onBlur={(e) => e.currentTarget.parentElement?.classList.remove("focused")}
      />
      <span className="kbd">⌘K</span>
    </div>
  )
}
