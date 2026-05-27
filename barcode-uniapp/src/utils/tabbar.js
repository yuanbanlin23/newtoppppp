export function updateTabBar() {
  // #ifdef MP-WEIXIN
  try {
    const page = getCurrentPages().at(-1);
    const tabBar = page?.getTabBar?.();
    if (tabBar?.updateSelected) {
      tabBar.updateSelected();
    }
  } catch (_) {
    /* ignore */
  }
  // #endif
}
