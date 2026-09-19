"use client";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
type T = "system" | "light" | "dark";
const NEXT: Record<T, T> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<T, string> = { system: "Theme: automatic", light: "Theme: light", dark: "Theme: dark" };
export default function ThemeToggle() {
  const [t, setT] = useState<T>("system");
  useEffect(() => { try { const v = localStorage.getItem("theme") as T | null; if (v === "light" || v === "dark") setT(v); } catch {} }, []);
  function cycle() {
    const n = NEXT[t]; setT(n);
    try { if (n === "system") { localStorage.removeItem("theme"); delete document.documentElement.dataset.theme; } else { localStorage.setItem("theme", n); document.documentElement.dataset.theme = n; } } catch {}
  }
  const I = t === "light" ? Sun : t === "dark" ? Moon : Monitor;
  return <button type="button" onClick={cycle} aria-label={`${LABEL[t]}. Click to change`} title={LABEL[t]} className="navbtn flex h-9 w-9 shrink-0 items-center justify-center !p-0 text-muted hover:text-ink"><I className="h-[18px] w-[18px]" /></button>;
}
