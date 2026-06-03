import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/actors", label: "Actors" },
  { to: "/about", label: "About" },
] as const;

export function FloatingNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 hidden justify-center px-4 md:flex">
      <nav className="glass pointer-events-auto flex items-center gap-2 rounded-full px-3 py-2 pr-2">
        <Logo className="px-2" />
        <div className="mx-2 h-6 w-px bg-border" />
        <ul className="flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-ink text-white" }}
                inactiveProps={{ className: "text-ink hover:bg-ink/5" }}
                className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/actors"
          className="ml-2 rounded-full bg-sky px-4 py-1.5 text-sm font-semibold text-ink shadow-sm transition-transform hover:scale-[1.02]"
        >
          Discover
        </Link>
      </nav>
    </header>
  );
}
