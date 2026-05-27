<script setup>
import { onLaunch } from "@dcloudio/uni-app";

onLaunch(() => {
  const theme = uni.getStorageSync("app_theme_v1") || "light";
  console.log("条形码生成器启动，主题:", theme);
});
</script>

<style lang="scss">
@import "./uni.scss";

page {
  background-color: var(--bg-page, #f2f6fc);
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue",
    "Microsoft YaHei", sans-serif;
  color: var(--text-primary, #1c1c1e);
  font-size: 28rpx;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease, color 0.3s ease;
}

view,
text,
input,
textarea,
button {
  box-sizing: border-box;
}
</style>
