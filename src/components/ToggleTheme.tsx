"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";

function ToggleTheme() {
  const [checked, setChecked] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // set init
  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      setChecked(storedTheme === "dark");
    }
  }, []);

  // action
  const handleThemeSwitch = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    setChecked(checked);
  };

  // updated when theme change
  React.useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <Switch
      id="button-theme"
      checked={checked}
      onCheckedChange={handleThemeSwitch}
    />
  );
}

export default ToggleTheme;
