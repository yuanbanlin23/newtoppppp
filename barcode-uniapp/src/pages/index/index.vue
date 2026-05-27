<template>
  <view class="page">
    <AppNavBar title="条形码生成" subtitle="CODE128 · 实时预览" />

    <view class="content">
      <view class="input-card">
        <text class="label">条形码内容</text>
        <textarea
          v-model="content"
          class="input-large"
          placeholder="输入数字或英文，自动生成条形码"
          placeholder-class="placeholder"
          :maxlength="200"
          auto-height
        />
        <text class="counter">{{ content.length }}/200</text>
      </view>

      <BarcodeCanvas
        ref="barcodeRef"
        canvas-id="mainBarcode"
        :value="content"
        @error="onBarcodeError"
      />

      <AdSlot />
    </view>

    <GradientButton
      text="保存到相册"
      :disabled="!canSave"
      :loading="saving"
      @click="handleSave"
    />
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import AppNavBar from "@/components/AppNavBar/AppNavBar.vue";
import BarcodeCanvas from "@/components/BarcodeCanvas/BarcodeCanvas.vue";
import AdSlot from "@/components/AdSlot/AdSlot.vue";
import GradientButton from "@/components/GradientButton/GradientButton.vue";
import { validateCode128 } from "@/utils/code128.js";
import { saveImageToAlbum, requestAlbumPermission } from "@/utils/canvas.js";
import { addHistory } from "@/utils/history.js";
import { updateTabBar } from "@/utils/tabbar.js";

const content = ref("123456789012");
const barcodeRef = ref(null);
const saving = ref(false);
const hasError = ref(false);

const canSave = computed(() => {
  const t = content.value.trim();
  return t && validateCode128(t).ok && !hasError.value && !saving.value;
});

function onBarcodeError(msg) {
  hasError.value = !!msg;
}

onLoad((query) => {
  if (query?.text) {
    content.value = decodeURIComponent(query.text);
  }
});

onShow(() => {
  updateTabBar();
  const pending = uni.getStorageSync("pending_barcode_text");
  if (pending) {
    content.value = pending;
    uni.removeStorageSync("pending_barcode_text");
  }
});

async function handleSave() {
  const text = content.value.trim();
  if (!validateCode128(text).ok) {
    uni.showToast({ title: "内容无效", icon: "none" });
    return;
  }

  saving.value = true;
  try {
    const ok = await requestAlbumPermission();
    if (!ok) return;

    const path = await barcodeRef.value.exportImage();
    await saveImageToAlbum(path);
    addHistory(text, { from: "index" });
    uni.showToast({ title: "已保存到相册", icon: "success" });
  } catch (e) {
    uni.showToast({ title: e.errMsg || e.message || "保存失败", icon: "none" });
  } finally {
    saving.value = false;
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: calc(280rpx + env(safe-area-inset-bottom));
}

.content {
  padding: 24rpx 32rpx 0;
}

.input-card {
  @include card;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.label {
  font-size: 26rpx;
  color: #8e8e93;
  font-weight: 500;
  margin-bottom: 16rpx;
  display: block;
}

.input-large {
  width: 100%;
  min-height: 160rpx;
  font-size: 36rpx;
  font-weight: 500;
  color: #1c1c1e;
  line-height: 1.5;
}

.placeholder {
  color: #c7c7cc;
  font-weight: 400;
}

.counter {
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: #c7c7cc;
  margin-top: 12rpx;
}
</style>
