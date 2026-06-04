const KEY = "cyanehub:anon-id";

export function getAnonId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id =
      (crypto.randomUUID?.() as string | undefined) ??
      `anon-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

const NAME_KEY = "cyanehub:anon-name";
export function getAnonName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NAME_KEY) ?? "";
}
export function setAnonName(name: string) {
  if (typeof window === "undefined") return;
  if (name.trim()) localStorage.setItem(NAME_KEY, name.trim());
  else localStorage.removeItem(NAME_KEY);
}
