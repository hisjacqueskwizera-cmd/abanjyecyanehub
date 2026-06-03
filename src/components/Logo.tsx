import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/cyane-logo.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center ${className}`} aria-label="CyaneHub home">
      <img
        src={logoAsset.url}
        alt="Abanjye CyaneHub"
        className="h-10 w-auto md:h-12 object-contain"
      />
    </Link>
  );
}
