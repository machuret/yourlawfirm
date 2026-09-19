"use client";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
type Theme = "light" | "dark";
function readTheme(): Theme { return document.documentElement.dataset.theme === "dark" ? "dark" : "light"; }
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, (): Theme => "light");
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  }
  const Icon = theme === "dark" ? Sun : Moon;
  return <button type="button" onClick={toggle} aria-label={label} title={label} className="navbtn flex h-9 w-9 shrink-0 items-center justify-center !p-0 text-muted hover:text-ink"><Icon className="h-[18px] w-[18px]" /></button>;
}
