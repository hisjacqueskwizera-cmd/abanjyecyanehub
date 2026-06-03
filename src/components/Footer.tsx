import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "How it works", to: "/about" as const },
      { label: "Discover actors", to: "/actors" as const },
      { label: "Featured talent", to: "/actors" as const },
    ],
  },
  {
    title: "For Actors",
    links: [
      { label: "Join CyaneHub", to: "/about" as const },
      { label: "Build your profile", to: "/about" as const },
      { label: "Get cast", to: "/actors" as const },
    ],
  },
  {
    title: "For Producers",
    links: [
      { label: "Browse talent", to: "/actors" as const },
      { label: "Casting support", to: "/about" as const },
      { label: "Production partners", to: "/about" as const },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about" as const },
      { label: "Contact", to: "/about" as const },
      { label: "Press", to: "/about" as const },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help & support", to: "/about" as const },
      { label: "FAQ", to: "/about" as const },
      { label: "Stories", to: "/about" as const },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border bg-background hidden md:block">
      <div className="absolute inset-0 imigongo-bg opacity-[0.06] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 md:pt-20">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <Logo />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Rwanda's Actor Branding & Casting Platform
          </p>
        </div>

        {/* Link columns */}
        <div className="mt-14 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 md:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-sky"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-border pt-6 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} CyaneHub</span>
            <span className="hidden md:inline">|</span>
            <Link to="/about" className="hover:text-ink">Terms</Link>
            <span className="hidden md:inline">|</span>
            <Link to="/about" className="hover:text-ink">Privacy</Link>
            <span className="hidden md:inline">|</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Kigali, Rwanda
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="mailto:hello@cyanehub.rw"
              aria-label="Email CyaneHub"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-sky hover:text-sky"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-sky hover:text-sky"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-sky hover:text-sky"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
