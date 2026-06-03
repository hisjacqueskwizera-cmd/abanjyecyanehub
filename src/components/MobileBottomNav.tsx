import { Link } from "@tanstack/react-router";
import { Home, Compass, Search, Info } from "lucide-react";

const items = [
  { to: "/", label: "Home", Icon: Home, exact: true },
  { to: "/actors", label: "Explore", Icon: Compass, exact: false },
  { to: "/search", label: "Search", Icon: Search, exact: false },
  { to: "/about", label: "About", Icon: Info, exact: false },
] as const;

export function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-fit items-center gap-1 rounded-full px-2 py-2 md:hidden glass-dark"
      aria-label="Primary"
    >
      {items.map(({ to, label, Icon, exact }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact }}
          activeProps={{ className: "bg-sky text-ink" }}
          inactiveProps={{ className: "text-white/80" }}
          className="flex h-11 w-11 items-center justify-center rounded-full transition-colors"
          aria-label={label}
        >
          <Icon className="h-5 w-5" />
        </Link>
      ))}
    </nav>
  );
}
