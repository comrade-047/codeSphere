import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function ModeToggle() {
  const [theme, setTheme] = useState("light");

  const handleToggle = (nextTheme) => {
    setTheme(nextTheme);
    document.documentElement.className = nextTheme;
  };

  return (
    <div className="relative">
      <button onClick={() => handleToggle(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}
