"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  // Show a placeholder while not mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="p-2 w-[34px] h-[34px]" />
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      title={`Theme: ${theme}`}
    >
      {theme === "system" ? (
        <Monitor size={18} />
      ) : resolvedTheme === "dark" ? (
        <Moon size={18} />
      ) : (
        <Sun size={18} />
      )}
    </button>
  );
}
