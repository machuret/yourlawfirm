"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
type T = "light" | "dark";
const NEXT: Record<T, T> = { light: "dark", dark: "light" };
const LABEL: Record<T, string> = { light: "Switch to dark mode", dark: "Switch to light mode" };
export default function ThemeToggle() {
  const [t, setT] = useState<T>("light");
  useEffect(() => { try { if (localStorage.getItem("theme") === "dark") setT("dark"); } catch {} }, []);
  function cycle() {
    const n = NEXT[t]; setT(n);
    try { if (n === "dark") { localStorage.setItem("theme", "dark"); document.documentElement.dataset.theme = "dark"; } else { localStorage.removeItem("theme"); delete document.documentElement.dataset.theme; } } catch {}
  }
  const I = t === "dark" ? Sun : Moon;
  return <button type="button" onClick={cycle} aria-label={LABEL[t]} title={LABEL[t]} className="navbtn flex h-9 w-9 shrink-0 items-center justify-center !p-0 text-muted hover:text-ink"><I className="h-[18px] w-[18px]" /></button>;
}
