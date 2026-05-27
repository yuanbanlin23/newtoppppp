<template>
  <view class="format-picker">
    <view
      v-for="item in formats"
      :key="item.value"
      class="format-chip"
      :class="{ active: modelValue === item.value }"
      @tap="$emit('update:modelValue', item.value)"
    >
      <text class="chip-label">{{ item.label }}</text>
      <text class="chip-hint">{{ item.hint }}</text>
    </view>
  </view>
</template>

<script setup>
import { BARCODE_FORMATS } from "@/utils/jsbarcode.js";

defineProps({
  modelValue: { type: String, default: "CODE128" },
});

defineEmits(["update:modelValue"]);

const formats = BARCODE_FORMATS;
</script>

<style lang="scss" scoped>
.format-picker {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.format-chip {
  flex: 1;
  padding: 16rpx 12rpx;
  border-radius: 20rpx;
  background: var(--bg-subtle, #f2f6fc);
  border: 2rpx solid transparent;
  transition: all 0.25s ease;
  text-align: center;

  &.active {
    background: var(--primary-light, #e8f2ff);
    border-color: var(--primary, #007aff);
    transform: scale(1.02);
  }
}

.chip-label {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-primary, #1c1c1e);
}

.chip-hint {
  display: block;
  font-size: 20rpx;
  color: var(--text-secondary, #8e8e93);
  margin-top: 4rpx;
}
</style>
