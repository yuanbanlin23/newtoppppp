<template>
  <view class="tab-bar">
    <view
      v-for="(item, index) in list"
      :key="item.pagePath"
      class="tab-item"
      :class="{ active: selected === index }"
      @tap="switchTab(index)"
    >
      <view class="tab-icon">
        <text class="icon">{{ item.icon }}</text>
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
    <view class="safe-bottom" />
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";

const list = [
  { pagePath: "/pages/index/index", text: "生成", icon: "▦" },
  { pagePath: "/pages/batch/batch", text: "批量", icon: "☰" },
  { pagePath: "/pages/history/history", text: "历史", icon: "◷" },
];

const selected = ref(0);

function updateSelected() {
  const pages = getCurrentPages();
  const route = pages[pages.length - 1]?.route || "";
  const idx = list.findIndex((i) => route.includes(i.pagePath.replace(/^\//, "")));
  if (idx >= 0) selected.value = idx;
}

function switchTab(index) {
  if (selected.value === index) return;
  uni.switchTab({ url: list[index].pagePath });
}

onMounted(updateSelected);

// 供页面 onShow 调用
defineExpose({ updateSelected });
</script>

<script>
export default {
  options: { styleIsolation: "shared" },
};
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border-top: 1rpx solid #e5e5ea;
  padding-top: 8rpx;
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.04);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx 0 4rpx;

  &.active {
    .tab-icon {
      background: #e8f2ff;
    }
    .icon,
    .tab-text {
      color: #007aff;
    }
  }
}

.tab-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rpx;
}

.icon {
  font-size: 32rpx;
  color: #8e8e93;
}

.tab-text {
  font-size: 20rpx;
  color: #8e8e93;
}

.safe-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: env(safe-area-inset-bottom);
  pointer-events: none;
}
</style>
