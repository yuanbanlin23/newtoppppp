<template>
  <view class="privacy-mask" @touchmove.stop.prevent>
    <view class="privacy-card" :class="themeClass">
      <text class="modal-title">欢迎使用条形码生成器</text>
      <text class="modal-desc">
        本小程序为条形码/二维码生成工具。使用前请阅读并同意相关协议。我们不会收集与服务无关的个人信息。
      </text>

      <view class="highlight-box">
        <text class="highlight-item">· 数据主要在您的设备本地处理</text>
        <text class="highlight-item">· 历史记录仅保存在本机缓存</text>
        <text class="highlight-item">· 保存图片时需您授权相册权限</text>
        <text class="highlight-item">· 不涉及支付、社交及手机号登录</text>
      </view>

      <view class="check-row" @tap="toggleCheck">
        <view class="checkbox" :class="{ checked }">
          <text v-if="checked" class="check-mark">✓</text>
        </view>
        <view class="check-text-wrap">
          <text class="check-text">我已阅读并同意</text>
          <text class="link" @tap.stop="openAgreement">《用户协议》</text>
          <text class="check-text">和</text>
          <text class="link" @tap.stop="openPrivacy">《隐私政策》</text>
        </view>
      </view>

      <view class="btn-row">
        <button class="btn btn-ghost" @tap="onDisagree">不同意</button>
        <button
          class="btn btn-primary"
          :class="{ disabled: !checked }"
          :disabled="!checked"
          @tap="onAgree"
        >
          同意并继续
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { setPrivacyAgreed } from "@/utils/privacy.js";

const emit = defineEmits(["agreed", "disagree"]);

const checked = ref(false);

const themeClass = computed(() => {
  const t = uni.getStorageSync("app_theme_v1") || "light";
  return `theme-${t}`;
});

function toggleCheck() {
  checked.value = !checked.value;
}

function openAgreement() {
  uni.navigateTo({ url: "/pages/legal/agreement?from=modal" });
}

function openPrivacy() {
  uni.navigateTo({ url: "/pages/legal/privacy?from=modal" });
}

function onAgree() {
  if (!checked.value) {
    uni.showToast({ title: "请先勾选同意协议", icon: "none" });
    return;
  }
  setPrivacyAgreed();
  emit("agreed");
}

function onDisagree() {
  uni.showModal({
    title: "提示",
    content: "您需同意相关协议后方可使用本小程序提供的服务。",
    confirmText: "再想想",
    cancelText: "仍要退出",
    success: (res) => {
      if (res.cancel) {
        emit("disagree");
        // #ifdef MP-WEIXIN
        uni.exitMiniProgram();
        // #endif
      }
    },
  });
}
</script>

<style lang="scss" scoped>
.privacy-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx 40rpx;
  backdrop-filter: blur(6px);
}

.privacy-card {
  width: 100%;
  max-width: 640rpx;
  background: var(--bg-card, #fff);
  border-radius: 32rpx;
  padding: 48rpx 40rpx 40rpx;
  box-shadow: 0 24rpx 80rpx rgba(0, 0, 0, 0.15);
}

.modal-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-primary, #1c1c1e);
  text-align: center;
  margin-bottom: 20rpx;
}

.modal-desc {
  display: block;
  font-size: 28rpx;
  color: var(--text-secondary, #8e8e93);
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.highlight-box {
  background: var(--bg-subtle, #f2f6fc);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 28rpx;
}

.highlight-item {
  display: block;
  font-size: 26rpx;
  color: var(--text-primary, #1c1c1e);
  line-height: 1.7;
  margin-bottom: 8rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.check-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 32rpx;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border-radius: 10rpx;
  border: 2rpx solid var(--border, #c7c7cc);
  margin-right: 16rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &.checked {
    background: #007aff;
    border-color: #007aff;
  }
}

.check-mark {
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}

.check-text-wrap {
  flex: 1;
  line-height: 1.6;
}

.check-text {
  font-size: 26rpx;
  color: var(--text-secondary, #8e8e93);
}

.link {
  font-size: 26rpx;
  color: #007aff;
}

.btn-row {
  display: flex;
  gap: 20rpx;
}

.btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 600;
  border: none;

  &::after {
    border: none;
  }
}

.btn-ghost {
  background: var(--bg-subtle, #f2f6fc);
  color: var(--text-secondary, #8e8e93);
}

.btn-primary {
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
  color: #fff;

  &.disabled {
    opacity: 0.45;
  }
}
</style>
