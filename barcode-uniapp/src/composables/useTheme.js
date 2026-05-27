import { ref, computed } from "vue";

const THEME_KEY = "app_theme_v1";
const theme = ref(uni.getStorageSync(THEME_KEY) || "light");

export function useTheme() {
  const isDark = computed(() => theme.value === "dark");
  const themeClass = computed(() => `theme-${theme.value}`);

  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
    uni.setStorageSync(THEME_KEY, theme.value);
    uni.showToast({
      title: theme.value === "dark" ? "已切换深色模式" : "已切换浅色模式",
      icon: "none",
    });
  }

  return { theme, isDark, toggleTheme, themeClass };
}
