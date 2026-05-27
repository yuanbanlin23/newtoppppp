<template>
  <view class="barcode-card glass-card" :class="{ 'fade-in': ready }">
    <LoadingSpinner :show="loading" inline />
    <EmptyState
      v-if="!value && !loading"
      icon="▦"
      title="等待输入"
      desc="输入内容后将自动生成预览"
    />
    <view v-else-if="error" class="error-tip">{{ error }}</view>
    <scroll-view
      v-else-if="ready"
      scroll-x
      class="scroll"
      :show-scrollbar="false"
    >
      <view class="canvas-wrap" :style="wrapStyle">
        <canvas
          type="2d"
          :id="canvasId"
          class="canvas"
          :style="canvasStyle"
        />
      </view>
    </scroll-view>
    <text v-if="value && ready && !error" class="code-text">{{ value }}</text>
  </view>
</template>

<script setup>
import { ref, watch, getCurrentInstance, nextTick } from "vue";
import { validateBarcode, renderJsBarcode } from "@/utils/jsbarcode.js";
import { renderQrCode } from "@/utils/qrcode.js";
import { getCanvasNode, canvas2dToTempFile } from "@/utils/canvas.js";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner.vue";
import EmptyState from "@/components/EmptyState/EmptyState.vue";

const props = defineProps({
  value: { type: String, default: "" },
  format: { type: String, default: "CODE128" },
  canvasId: { type: String, default: "barcodeCanvas" },
  barWidth: { type: Number, default: 2 },
  height: { type: Number, default: 100 },
  displayValue: { type: Boolean, default: true },
  dark: { type: Boolean, default: false },
});

const emit = defineEmits(["ready", "error"]);

const instance = getCurrentInstance();
const error = ref("");
const loading = ref(false);
const ready = ref(false);
const renderInfo = ref(null);
const canvasStyle = ref({ width: "280px", height: "140px" });
const wrapStyle = ref({});

let renderToken = 0;

function getColors() {
  return {
    background: props.dark ? "#1c1c1e" : "#ffffff",
    lineColor: props.dark ? "#ffffff" : "#000000",
  };
}

async function render() {
  const text = props.value?.trim();
  const token = ++renderToken;
  error.value = "";
  ready.value = false;

  if (!text) {
    renderInfo.value = null;
    loading.value = false;
    emit("error", "");
    return;
  }

  const valid = validateBarcode(text, props.format);
  if (!valid.ok) {
    error.value = valid.message;
    loading.value = false;
    emit("error", valid.message);
    return;
  }

  loading.value = true;
  await nextTick();

  try {
    const sys = uni.getSystemInfoSync();
    const dpr = sys.pixelRatio || 2;
    const maxW = sys.windowWidth - 48;
    const colors = getColors();

    const { node } = await getCanvasNode(instance.proxy, props.canvasId);
    if (token !== renderToken) return;

    let result;
    if (props.format === "QRCODE") {
      result = renderQrCode(node, text, {
        dpr,
        size: 180,
        margin: 12,
        ...colors,
      });
    } else {
      result = renderJsBarcode(node, text, {
        dpr,
        format: props.format,
        barWidth: props.barWidth,
        height: props.height,
        displayValue: props.displayValue,
        ...colors,
      });
    }

    if (token !== renderToken) return;

    const displayW = Math.min(result.width, maxW);
    const scale = displayW / result.width;

    canvasStyle.value = {
      width: `${displayW}px`,
      height: `${result.height * scale}px`,
    };
    wrapStyle.value = { minWidth: `${displayW}px` };

    renderInfo.value = {
      node,
      pixelWidth: result.pixelWidth,
      pixelHeight: result.pixelHeight,
      text,
    };
    ready.value = true;
    emit("ready", renderInfo.value);
  } catch (e) {
    if (token !== renderToken) return;
    error.value = e.message || "生成失败";
    emit("error", error.value);
  } finally {
    if (token === renderToken) {
      loading.value = false;
    }
  }
}

watch(
  () => [
    props.value,
    props.format,
    props.barWidth,
    props.height,
    props.displayValue,
    props.dark,
  ],
  () => render(),
  { immediate: true }
);

async function exportImage() {
  if (!renderInfo.value?.node) {
    throw new Error("请先生成码图");
  }
  const { node, pixelWidth, pixelHeight } = renderInfo.value;
  return canvas2dToTempFile(node, pixelWidth, pixelHeight);
}

defineExpose({ render, exportImage });
</script>

<style lang="scss" scoped>
.barcode-card {
  @include card;
  position: relative;
  padding: 32rpx 24rpx;
  min-height: 280rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.glass-card {
  @include glass;
}

.fade-in {
  animation: fadeIn 0.35s ease;
}

.scroll {
  width: 100%;
  white-space: nowrap;
}

.canvas-wrap {
  display: inline-flex;
  justify-content: center;
  padding: 8rpx 0;
}

.canvas {
  display: block;
}

.code-text {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: var(--text-secondary, #8e8e93);
}

.error-tip {
  font-size: 28rpx;
  color: #ff3b30;
  padding: 60rpx 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
