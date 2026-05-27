<template>
  <view class="ad-slot">
  <!-- 预留微信广告位：开通后替换为 <ad unit-id="你的广告位id" /> -->
    <view class="ad-inner">
      <text class="ad-label">广告位</text>
      <text class="ad-hint">可在 components/AdSlot 中接入 banner 广告</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  type: { type: String, default: "banner" },
});
</script>

<style lang="scss" scoped>
.ad-slot {
  margin: 24rpx 32rpx 0;
}

.ad-inner {
  height: 160rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #f0f4fa 0%, #e8f2ff 100%);
  border: 2rpx dashed #c7d8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.ad-label {
  font-size: 26rpx;
  color: #8e8e93;
  font-weight: 500;
}

.ad-hint {
  font-size: 22rpx;
  color: #c7c7cc;
}
</style>
