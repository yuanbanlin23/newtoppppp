<template>
  <view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="nav-inner">
      <text class="nav-title">{{ title }}</text>
      <text v-if="subtitle" class="nav-sub">{{ subtitle }}</text>
    </view>
  </view>
  <view class="nav-placeholder" :style="{ height: navHeight + 'px' }" />
</template>

<script setup>
import { ref, onMounted } from "vue";

defineProps({
  title: { type: String, default: "条形码生成器" },
  subtitle: { type: String, default: "" },
});

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

.nav-inner {
  height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 32rpx;
}

.nav-title {
  color: #fff;
  font-size: 34rpx;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.nav-sub {
  color: rgba(255, 255, 255, 0.75);
  font-size: 22rpx;
  margin-top: 2rpx;
}

.nav-placeholder {
  width: 100%;
}
</style>
