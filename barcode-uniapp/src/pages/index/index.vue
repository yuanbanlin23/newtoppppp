<template>
  <view class="page" :class="themeClass">
    <AppNavBar
      title="条形码生成"
      :subtitle="navSubtitle"
      :is-dark="isDark"
      @toggle-theme="toggleTheme"
    />

    <view class="content fade-in">
      <view class="input-card glass-card">
        <FormatPicker v-model="format" />
        <text class="label">码图内容</text>
        <textarea
          v-model="content"
          class="input-large"
          :placeholder="placeholder"
          placeholder-class="placeholder"
          :maxlength="format === 'QRCODE' ? 500 : 200"
        />
        <text class="counter">{{ content.length }}/{{ format === 'QRCODE' ? 500 : 200 }}</text>
      </view>

      <BarcodeCanvas
        ref="barcodeRef"
        canvas-id="mainBarcode"
        :value="debouncedContent"
        :format="format"
        :dark="isDark"
        @error="(msg) => (hasError = !!msg)"
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
import { ref, computed, watch } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import AppNavBar from "@/components/AppNavBar/AppNavBar.vue";
import BarcodeCanvas from "@/components/BarcodeCanvas/BarcodeCanvas.vue";
import FormatPicker from "@/components/FormatPicker/FormatPicker.vue";
import AdSlot from "@/components/AdSlot/AdSlot.vue";
import GradientButton from "@/components/GradientButton/GradientButton.vue";
import { validateBarcode } from "@/utils/jsbarcode.js";
import { saveImageToAlbum, requestAlbumPermission } from "@/utils/canvas.js";
import { addHistory } from "@/utils/history.js";
import { updateTabBar } from "@/utils/tabbar.js";
import { useDebouncedRef } from "@/composables/useDebounce.js";
import { useTheme } from "@/composables/useTheme.js";

const { isDark, toggleTheme, themeClass } = useTheme();

const format = ref("CODE128");
const content = ref("123456789012");
const debouncedContent = useDebouncedRef(content, 300);
const barcodeRef = ref(null);
const saving = ref(false);
const hasError = ref(false);

const placeholders = {
  CODE128: "输入字母或数字，自动生成条形码",
  EAN13: "输入 12 或 13 位商品数字",
  QRCODE: "输入链接或文字，生成二维码",
};

const placeholder = computed(() => placeholders[format.value] || placeholders.CODE128);
const navSubtitle = computed(() => {
  if (format.value === "QRCODE") return "QR Code · 实时生成";
  if (format.value === "EAN13") return "EAN-13 · JsBarcode";
  return "CODE128 · JsBarcode 实时生成";
});

const canSave = computed(() => {
  const t = content.value.trim();
  return t && validateBarcode(t, format.value).ok && !hasError.value && !saving.value;
});

watch(format, (f) => {
  if (f === "EAN13" && !/^\d{12,13}$/.test(content.value.trim())) {
    content.value = "5901234123457";
  }
});

onLoad((query) => {
  if (query?.text) content.value = decodeURIComponent(query.text);
  if (query?.format) format.value = query.format;
});

onShow(() => {
  updateTabBar();
  const pending = uni.getStorageSync("pending_barcode_text");
  if (pending) {
    content.value = pending;
    uni.removeStorageSync("pending_barcode_text");
  }
  const pendingFormat = uni.getStorageSync("pending_barcode_format");
  if (pendingFormat) {
    format.value = pendingFormat;
    uni.removeStorageSync("pending_barcode_format");
  }
});

async function handleSave() {
  const text = content.value.trim();
  if (!validateBarcode(text, format.value).ok) {
    uni.showToast({ title: "内容无效", icon: "none" });
    return;
  }

  saving.value = true;
  try {
    const ok = await requestAlbumPermission();
    if (!ok) return;
    const path = await barcodeRef.value.exportImage();
    await saveImageToAlbum(path);
    addHistory(text, { from: "index", format: format.value });
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
  background: var(--bg-page);
  transition: background 0.3s ease;
}

.content {
  padding: 24rpx 32rpx 0;
}

.input-card {
  @include card;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.glass-card {
  @include glass;
}

.label {
  font-size: 26rpx;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 16rpx;
  display: block;
}

.input-large {
  width: 100%;
  min-height: 160rpx;
  font-size: 36rpx;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.5;
}

.placeholder {
  color: var(--text-placeholder);
}

.counter {
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: var(--text-placeholder);
  margin-top: 12rpx;
}
</style>
