export type { ActorRow as Actor } from "@/lib/actors.functions";

// Deterministic gradient for placeholder portraits, keyed off the name.
export const portraitGradient = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  const hue2 = (hue + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue} 70% 28%), hsl(${hue2} 70% 14%))`;
};

export const initials = (name: string) =>
  name
    .replace(/\(.*\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
