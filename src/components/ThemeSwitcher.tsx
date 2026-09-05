"use client";

import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun {...stylex.props(styles.themePlaceholderIcon)} />
        <span {...stylex.props(styles.themePlaceholderLabel)}>Toggle theme</span>
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun {...stylex.props(styles.themeSun)} />;
      case "dark":
        return <Moon {...stylex.props(styles.themeMoon)} />;
      default:
        return <Monitor {...stylex.props(styles.themeSystem)} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark mode";
      case "dark":
        return "Switch to system mode";
      default:
        return "Switch to light mode";
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme}>
      {getIcon()}
      <span {...stylex.props(styles.themeLabel)}>{getLabel()}</span>
    </Button>
  );
}
