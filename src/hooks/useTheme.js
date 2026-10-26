import { useEffect, useState } from "react";

// Must match the key read by the inline script in index.html.
const STORAGE_KEY = "theme";

/**
 * Light/dark mode. The starting theme is decided by the inline script in
 * index.html (saved choice, else OS setting), which sets the "dark" class on
 * <html>; this hook starts from that class and keeps it in sync.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Only an explicit click is saved, so until then the OS setting is used.
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (e.g. private browsing); the toggle still works.
    }
  };

  return { theme, toggleTheme };
};
