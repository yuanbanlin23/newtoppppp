<template>
  <PrivacyModal v-if="showPrivacyModal" @agreed="onPrivacyAgreed" />
  <view class="page" :class="themeClass">
    <AppNavBar
      title="批量生成"
      subtitle="换行 / 空格 · 防抖优化"
      :is-dark="isDark"
      @toggle-theme="toggleTheme"
    />

    <view class="content">
      <view class="input-card glass-card fade-in">
        <FormatPicker v-model="format" />
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
          placeholder="每行一个，或用空格分隔"
          placeholder-class="placeholder"
        />
        <text class="hint">共 {{ debouncedItems.length }} 条（输入防抖 400ms）</text>
      </view>

      <scroll-view scroll-y class="list" :show-scrollbar="false">
        <EmptyState
          v-if="!debouncedItems.length"
          icon="☰"
          title="暂无批量内容"
          desc="输入多条数据后将在此预览"
        />
        <view
          v-for="(item, index) in debouncedItems"
          :key="item + '-' + index"
          class="batch-item fade-in"
        >
          <BarcodeCanvas
            :ref="(el) => setItemRef(el, index)"
            :canvas-id="'batch_' + index"
            :value="item"
            :format="format"
            :height="80"
            :dark="isDark"
          />
        </view>
      </scroll-view>

      <AdSlot />
    </view>

    <GradientButton
      text="保存全部到相册"
      :disabled="!debouncedItems.length"
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
import FormatPicker from "@/components/FormatPicker/FormatPicker.vue";
import EmptyState from "@/components/EmptyState/EmptyState.vue";
import AdSlot from "@/components/AdSlot/AdSlot.vue";
import GradientButton from "@/components/GradientButton/GradientButton.vue";
import { splitBatchContent } from "@/utils/split.js";
import { saveImageToAlbum, requestAlbumPermission } from "@/utils/canvas.js";
import { addHistory } from "@/utils/history.js";
import { updateTabBar } from "@/utils/tabbar.js";
import { useTheme } from "@/composables/useTheme.js";
import { usePrivacyGate } from "@/composables/usePrivacyGate.js";
import PrivacyModal from "@/components/PrivacyModal/PrivacyModal.vue";

const { isDark, toggleTheme, themeClass } = useTheme();
const { showPrivacyModal, onPrivacyAgreed } = usePrivacyGate();

const splitTabs = [
  { label: "换行", value: "newline" },
  { label: "空格", value: "space" },
  { label: "全部", value: "both" },
];

const format = ref("CODE128");
const rawContent = ref("123456789012\n5901234123457\nHELLO123");
const splitMode = ref("both");
const saving = ref(false);
const itemRefs = ref([]);

const items = computed(() => splitBatchContent(rawContent.value, splitMode.value));
const debouncedItems = ref(items.value);
let batchTimer = null;

watch(items, (val) => {
  if (batchTimer) clearTimeout(batchTimer);
  batchTimer = setTimeout(() => {
    debouncedItems.value = val;
    batchTimer = null;
  }, 400);
}, { immediate: true });

function setItemRef(el, index) {
  if (el) itemRefs.value[index] = el;
}

watch(debouncedItems, () => {
  itemRefs.value = [];
});

onShow(updateTabBar);

async function handleSaveAll() {
  const list = debouncedItems.value;
  if (!list.length) return;

  saving.value = true;
  try {
    const ok = await requestAlbumPermission();
    if (!ok) return;

    let saved = 0;
    for (let i = 0; i < list.length; i++) {
      const comp = itemRefs.value[i];
      if (!comp?.exportImage) continue;
      await new Promise((r) => setTimeout(r, 280));
      const path = await comp.exportImage();
      await saveImageToAlbum(path);
      addHistory(list[i], { from: "batch", format: format.value });
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
  background: var(--bg-page);
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

.glass-card {
  @include glass;
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
  color: var(--text-secondary);
  background: var(--bg-subtle);
  transition: all 0.25s ease;

  &.active {
    background: var(--primary-light);
    color: var(--primary);
    font-weight: 600;
  }
}

.batch-input {
  width: 100%;
  min-height: 180rpx;
  font-size: 30rpx;
  color: var(--text-primary);
}

.placeholder {
  color: var(--text-placeholder);
}

.hint {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: var(--primary);
}

.list {
  flex: 1;
  max-height: 50vh;
}

.batch-item {
  margin-bottom: 20rpx;
}
</style>
