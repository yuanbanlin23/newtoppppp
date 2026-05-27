<template>
  <view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="nav-inner">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">‹</text>
        <text class="back-text">返回</text>
      </view>
      <text class="nav-title">{{ title }}</text>
      <view class="nav-side" />
    </view>
  </view>
  <view class="nav-placeholder" :style="{ height: navHeight + 'px' }" />
</template>

<script setup>
import { ref, onMounted } from "vue";

defineProps({
  title: { type: String, default: "协议" },
});

const statusBarHeight = ref(20);
const navHeight = ref(88);

onMounted(() => {
  const sys = uni.getSystemInfoSync();
  statusBarHeight.value = sys.statusBarHeight || 20;
  navHeight.value = statusBarHeight.value + 44;
});

function goBack() {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.switchTab({ url: "/pages/index/index" });
  }
}
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

.nav-inner {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16rpx;
}

.back-btn {
  display: flex;
  align-items: center;
  min-width: 120rpx;
  padding: 8rpx 0;
}

.back-icon {
  color: #fff;
  font-size: 44rpx;
  line-height: 1;
  margin-right: 4rpx;
}

.back-text {
  color: #fff;
  font-size: 30rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
}

.nav-side {
  min-width: 120rpx;
}

.nav-placeholder {
  width: 100%;
}
</style>
