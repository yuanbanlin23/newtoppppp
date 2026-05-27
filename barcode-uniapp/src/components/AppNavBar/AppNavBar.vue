<template>
  <view class="nav glass-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="nav-inner">
      <view class="nav-text">
        <text class="nav-title">{{ title }}</text>
        <text v-if="subtitle" class="nav-sub">{{ subtitle }}</text>
      </view>
      <view v-if="showThemeToggle" class="theme-btn" @tap="$emit('toggle-theme')">
        <text>{{ isDark ? "☀️" : "🌙" }}</text>
      </view>
    </view>
  </view>
  <view class="nav-placeholder" :style="{ height: navHeight + 'px' }" />
</template>

<script setup>
import { ref, onMounted } from "vue";

defineProps({
  title: { type: String, default: "条形码生成器" },
  subtitle: { type: String, default: "" },
  isDark: { type: Boolean, default: false },
  showThemeToggle: { type: Boolean, default: true },
});

defineEmits(["toggle-theme"]);

const statusBarHeight = ref(20);
const navHeight = ref(88);

onMounted(() => {
  const sys = uni.getSystemInfoSync();
  statusBarHeight.value = sys.statusBarHeight || 20;
  navHeight.value = statusBarHeight.value + 44;
});
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
}

.glass-nav {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.nav-inner {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx 0 32rpx;
}

.nav-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-title {
  color: #fff;
  font-size: 34rpx;
  font-weight: 600;
}

.nav-sub {
  color: rgba(255, 255, 255, 0.75);
  font-size: 22rpx;
  margin-top: 2rpx;
}

.theme-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.92);
  }
}

.nav-placeholder {
  width: 100%;
}
</style>
