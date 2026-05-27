<template>
  <view class="barcode-card">
    <view v-if="error" class="error-tip">{{ error }}</view>
    <view v-else-if="!value" class="empty-tip">输入内容后自动生成</view>
    <scroll-view v-else scroll-x class="scroll" :show-scrollbar="false">
      <view class="canvas-wrap" :style="wrapStyle">
        <canvas
          type="2d"
          :id="canvasId"
          class="canvas"
          :style="canvasStyle"
        />
      </view>
    </scroll-view>
    <text v-if="value && !error" class="code-text">{{ value }}</text>
  </view>
</template>

<script setup>
import { ref, watch, computed, getCurrentInstance, nextTick } from "vue";
import { validateCode128, calcBarcodeSize } from "@/utils/code128.js";
import { drawBarcode, getCanvasNode, canvas2dToTempFile } from "@/utils/canvas.js";

const props = defineProps({
  value: { type: String, default: "" },
  canvasId: { type: String, default: "barcodeCanvas" },
  barWidth: { type: Number, default: 2 },
  height: { type: Number, default: 100 },
  displayValue: { type: Boolean, default: true },
});

const emit = defineEmits(["ready", "error"]);

const instance = getCurrentInstance();
const error = ref("");
const renderInfo = ref(null);
const canvasStyle = ref({ width: "300px", height: "150px" });
const wrapStyle = ref({});

const sizeInfo = computed(() => {
  if (!props.value?.trim()) return null;
  try {
    return calcBarcodeSize(props.value.trim(), {
      barWidth: props.barWidth,
      height: props.height,
      displayValue: props.displayValue,
    });
  } catch {
    return null;
  }
});

async function render() {
  const text = props.value?.trim();
  error.value = "";

  if (!text) {
    emit("error", "");
    return;
  }

  const valid = validateCode128(text);
  if (!valid.ok) {
    error.value = valid.message;
    emit("error", valid.message);
    return;
  }

  await nextTick();

  try {
    const size = sizeInfo.value;
    const sys = uni.getSystemInfoSync();
    const dpr = sys.pixelRatio || 2;
    const maxW = sys.windowWidth - 48;
    const displayW = Math.min(size.width, maxW);
    const scale = displayW / size.width;

    canvasStyle.value = {
      width: `${displayW}px`,
      height: `${size.height * scale}px`,
    };
    wrapStyle.value = { minWidth: `${displayW}px` };

    const { node } = await getCanvasNode(instance.proxy, props.canvasId);
    node.width = size.width * dpr;
    node.height = size.height * dpr;

    const ctx = node.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawBarcode(ctx, text, {
      barWidth: props.barWidth,
      height: props.height,
      displayValue: props.displayValue,
      dpr,
    });

    renderInfo.value = { node, width: size.width, height: size.height, dpr, text };
    emit("ready", renderInfo.value);
  } catch (e) {
    error.value = e.message || "生成失败";
    emit("error", error.value);
  }
}

watch(
  () => [props.value, props.barWidth, props.height, props.displayValue],
  () => render(),
  { immediate: true }
);

async function exportImage() {
  if (!renderInfo.value?.node) {
    throw new Error("请先生成条形码");
  }
  const { node, width, height, dpr } = renderInfo.value;
  return canvas2dToTempFile(node, width * dpr, height * dpr);
}

defineExpose({ render, exportImage });
</script>

<style lang="scss" scoped>
.barcode-card {
  @include card;
  padding: 32rpx 24rpx;
  min-height: 280rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  color: #8e8e93;
  letter-spacing: 1rpx;
}

.empty-tip,
.error-tip {
  font-size: 28rpx;
  color: #8e8e93;
  padding: 60rpx 0;
}

.error-tip {
  color: #ff3b30;
}
</style>
