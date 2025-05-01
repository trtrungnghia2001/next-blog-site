export type ThemeType = "light" | "dark";

export type ThemeStore = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};
