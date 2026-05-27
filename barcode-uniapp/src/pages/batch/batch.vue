<template>
  <view class="page">
    <AppNavBar title="批量生成" subtitle="换行或空格分割" />

    <view class="content">
      <view class="input-card">
        <view class="split-tabs">
          <view
            v-for="tab in splitTabs"
            :key="tab.value"
            class="split-tab"
            :class="{ active: splitMode === tab.value }"
            @tap="splitMode = tab.value"
          >
            {{ tab.label }}
          </view>
        </view>
        <textarea
          v-model="rawContent"
          class="batch-input"
          placeholder="每行一个条形码，或用空格分隔&#10;例如：&#10;123456789012&#10;HELLO123"
          placeholder-class="placeholder"
        />
        <text class="hint">共 {{ items.length }} 条有效内容</text>
      </view>

      <scroll-view scroll-y class="list" :show-scrollbar="false">
        <view v-if="!items.length" class="empty">输入内容后自动生成预览</view>
        <view v-for="(item, index) in items" :key="item + index" class="batch-item">
          <BarcodeCanvas
            :ref="(el) => setItemRef(el, index)"
            :canvas-id="'batch_' + index"
            :value="item"
            :height="80"
          />
        </view>
      </scroll-view>

      <AdSlot />
    </view>

    <GradientButton
      text="保存全部到相册"
      :disabled="!items.length"
      :loading="saving"
      @click="handleSaveAll"
    />
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { onShow } from "@dcloudio/uni-app";
import AppNavBar from "@/components/AppNavBar/AppNavBar.vue";
import BarcodeCanvas from "@/components/BarcodeCanvas/BarcodeCanvas.vue";
import AdSlot from "@/components/AdSlot/AdSlot.vue";
import GradientButton from "@/components/GradientButton/GradientButton.vue";
import { splitBatchContent } from "@/utils/split.js";
import { saveImageToAlbum, requestAlbumPermission } from "@/utils/canvas.js";
import { addHistory } from "@/utils/history.js";
import { updateTabBar } from "@/utils/tabbar.js";

const splitTabs = [
  { label: "换行", value: "newline" },
  { label: "空格", value: "space" },
  { label: "全部", value: "both" },
];

const rawContent = ref("123456789012\nHELLO123\n998877");
const splitMode = ref("both");
const saving = ref(false);
const itemRefs = ref([]);

const items = computed(() => splitBatchContent(rawContent.value, splitMode.value));

function setItemRef(el, index) {
  if (el) itemRefs.value[index] = el;
}

watch(items, () => {
  itemRefs.value = [];
});

onShow(updateTabBar);

async function handleSaveAll() {
  if (!items.value.length) return;

  saving.value = true;
  try {
    const ok = await requestAlbumPermission();
    if (!ok) return;

    let saved = 0;
    for (let i = 0; i < items.value.length; i++) {
      const comp = itemRefs.value[i];
      if (!comp?.exportImage) continue;
      await new Promise((r) => setTimeout(r, 300));
      const path = await comp.exportImage();
      await saveImageToAlbum(path);
      addHistory(items.value[i], { from: "batch" });
      saved++;
    }
    uni.showToast({ title: `已保存 ${saved} 张`, icon: "success" });
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
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200rpx);
}

.input-card {
  @include card;
  padding: 24rpx;
  margin-bottom: 20rpx;
  flex-shrink: 0;
}

.split-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.split-tab {
  flex: 1;
  text-align: center;
  padding: 14rpx 0;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: #8e8e93;
  background: #f2f6fc;

  &.active {
    background: #e8f2ff;
    color: #007aff;
    font-weight: 600;
  }
}

.batch-input {
  width: 100%;
  min-height: 180rpx;
  font-size: 30rpx;
  color: #1c1c1e;
  line-height: 1.45;
}

.placeholder {
  color: #c7c7cc;
}

.hint {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #007aff;
}

.list {
  flex: 1;
  max-height: 52vh;
}

.empty {
  text-align: center;
  color: #8e8e93;
  padding: 48rpx;
  font-size: 28rpx;
}

.batch-item {
  margin-bottom: 20rpx;
}
</style>
