<script setup>
import { onLaunch } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("条形码生成器启动");
});
</script>

<style lang="scss">
@import "./uni.scss";

page {
  background-color: $bg-page;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue",
    "Microsoft YaHei", sans-serif;
  color: $text-primary;
  font-size: 28rpx;
  -webkit-font-smoothing: antialiased;
}

view,
text,
input,
textarea,
button {
  box-sizing: border-box;
}
</style>
