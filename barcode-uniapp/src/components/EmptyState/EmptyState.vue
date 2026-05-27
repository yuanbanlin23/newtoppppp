<template>
  <view class="empty-state fade-in">
    <text class="icon">{{ icon }}</text>
    <text class="title">{{ title }}</text>
    <text v-if="desc" class="desc">{{ desc }}</text>
    <slot />
  </view>
</template>

<script setup>
defineProps({
  icon: { type: String, default: "📭" },
  title: { type: String, default: "暂无内容" },
  desc: { type: String, default: "" },
});
</script>

<style lang="scss" scoped>
.empty-state {
  @include card;
  padding: 72rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon {
  font-size: 72rpx;
  margin-bottom: 24rpx;
  opacity: 0.85;
}

.title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary, #1c1c1e);
  margin-bottom: 12rpx;
}

.desc {
  font-size: 26rpx;
  color: var(--text-secondary, #8e8e93);
  line-height: 1.5;
}

.fade-in {
  animation: fadeIn 0.35s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
