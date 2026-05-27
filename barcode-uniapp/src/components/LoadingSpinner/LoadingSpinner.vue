<template>
  <view v-if="show" class="loading-mask" :class="{ inline }">
    <view class="spinner-wrap">
      <view class="spinner" />
      <text v-if="text" class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  text: { type: String, default: "生成中…" },
  inline: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.loading-mask {
  @include flex-center;
  padding: 48rpx 0;

  &:not(.inline) {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(8px);
    border-radius: $radius-xl;
    z-index: 2;
  }
}

.spinner-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.spinner {
  width: 48rpx;
  height: 48rpx;
  border: 4rpx solid var(--primary-light, #e8f2ff);
  border-top-color: var(--primary, #007aff);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.loading-text {
  font-size: 24rpx;
  color: var(--text-secondary, #8e8e93);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
