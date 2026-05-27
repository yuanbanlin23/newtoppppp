<template>
  <view class="btn-wrap" :class="{ fixed, aboveTabBar }">
    <button
      class="btn"
      :disabled="disabled || loading"
      :loading="loading"
      @tap="onTap"
    >
      <text class="btn-text">{{ text }}</text>
    </button>
    <view v-if="fixed" class="safe-pad" />
  </view>
</template>

<script setup>
defineProps({
  text: { type: String, default: "保存到相册" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  fixed: { type: Boolean, default: true },
  aboveTabBar: { type: Boolean, default: true },
});

const emit = defineEmits(["click"]);

function onTap() {
  emit("click");
}
</script>

<style lang="scss" scoped>
.btn-wrap.fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  padding: 20rpx 32rpx 0;
  background: linear-gradient(
    180deg,
    rgba(242, 246, 252, 0) 0%,
    rgba(242, 246, 252, 0.95) 30%,
    #f2f6fc 100%
  );

  &.aboveTabBar {
    bottom: calc(100rpx + env(safe-area-inset-bottom));
  }
}

.btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  border: none;
  border-radius: 48rpx;
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
  box-shadow: 0 12rpx 32rpx rgba(0, 122, 255, 0.35);

  &::after {
    border: none;
  }

  &[disabled] {
    opacity: 0.45;
    box-shadow: none;
  }
}

.btn-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  letter-spacing: 1rpx;
}

.safe-pad {
  height: calc(20rpx + env(safe-area-inset-bottom));
}
</style>
