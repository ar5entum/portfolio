"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { scrollToId } from "./SmoothScroll";
import { openPalette } from "./CommandPalette";

const items = [
  { label: "Work", id: "work" },
  { label: "Path", id: "path" },
  { label: "Research", id: "research" },
  { label: "Open source", id: "opensource" },
];

export function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div aria-hidden className="nav-bg" />
      <div className="container-x relative flex items-center justify-between h-14">
        <Link href="/" className="font-mono text-[0.78rem] tracking-[0.16em] uppercase text-fg hover:text-accent transition-colors">
          ar5entum
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {items.map((it) =>
            home ? (
              <button
                key={it.id}
                type="button"
                onClick={() => scrollToId(it.id)}
                className="nav-link"
              >
                {it.label}
              </button>
            ) : (
              <Link key={it.id} href={`/#${it.id}`} className="nav-link">
                {it.label}
              </Link>
            ),
          )}
          <Link href="/descent" className={`nav-link ${pathname === "/descent" ? "text-fg" : ""}`}>
            Descent ↗
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={openPalette}
            className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-fg-muted hover:text-fg transition-colors"
            aria-label="Open command palette"
          >
            <kbd className="border hairline rounded px-1.5 py-0.5">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
