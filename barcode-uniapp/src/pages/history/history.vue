<template>
  <view class="page" :class="themeClass">
    <AppNavBar
      title="历史记录"
      :subtitle="`${list.length} 条记录`"
      :is-dark="isDark"
      @toggle-theme="toggleTheme"
    />

    <view class="content">
      <EmptyState
        v-if="!list.length"
        icon="◷"
        title="暂无历史记录"
        desc="保存码图后会自动记录在这里，点击可快速回填"
      />

      <view v-else class="list glass-card fade-in">
        <view
          v-for="item in list"
          :key="item.id"
          class="history-item"
          @tap="openItem(item)"
          @longpress="confirmDelete(item)"
        >
          <view class="item-main">
            <text class="item-text">{{ item.text }}</text>
            <text class="item-meta">{{ formatLabel(item) }} · {{ formatTime(item.time) }}</text>
          </view>
          <text class="item-arrow">›</text>
        </view>
      </view>

      <view v-if="list.length" class="clear-wrap">
        <button class="clear-btn" @tap="handleClear">清空全部</button>
      </view>

      <AdSlot />
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import AppNavBar from "@/components/AppNavBar/AppNavBar.vue";
import EmptyState from "@/components/EmptyState/EmptyState.vue";
import AdSlot from "@/components/AdSlot/AdSlot.vue";
import {
  getHistory,
  removeHistory,
  clearHistory,
  formatTime,
} from "@/utils/history.js";
import { updateTabBar } from "@/utils/tabbar.js";
import { useTheme } from "@/composables/useTheme.js";

const { isDark, toggleTheme, themeClass } = useTheme();
const list = ref([]);

function formatLabel(item) {
  const f = item.format || "CODE128";
  if (f === "QRCODE") return "二维码";
  if (f === "EAN13") return "EAN-13";
  return "CODE128";
}

function loadList() {
  list.value = getHistory();
}

onShow(() => {
  updateTabBar();
  loadList();
});

function openItem(item) {
  uni.setStorageSync("pending_barcode_text", item.text);
  if (item.format) uni.setStorageSync("pending_barcode_format", item.format);
  uni.switchTab({ url: "/pages/index/index" });
}

function confirmDelete(item) {
  uni.showModal({
    title: "删除记录",
    content: `删除「${item.text.slice(0, 20)}」？`,
    success: (res) => {
      if (res.confirm) {
        list.value = removeHistory(item.id);
        uni.showToast({ title: "已删除", icon: "none" });
      }
    },
  });
}

function handleClear() {
  uni.showModal({
    title: "清空历史",
    content: "确定删除全部历史记录？",
    success: (res) => {
      if (res.confirm) {
        list.value = clearHistory();
        uni.showToast({ title: "已清空", icon: "none" });
      }
    },
  });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  background: var(--bg-page);
}

.content {
  padding: 24rpx 32rpx;
}

.list {
  @include card;
  overflow: hidden;
}

.glass-card {
  @include glass;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid var(--border);
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: var(--bg-subtle);
  }
}

.item-main {
  flex: 1;
  min-width: 0;
}

.item-text {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: block;
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-top: 8rpx;
}

.item-arrow {
  font-size: 40rpx;
  color: var(--text-placeholder);
  margin-left: 16rpx;
}

.clear-wrap {
  margin-top: 32rpx;
}

.clear-btn {
  background: var(--bg-card);
  color: #ff3b30;
  font-size: 28rpx;
  border-radius: 24rpx;
  border: 1rpx solid var(--border);

  &::after {
    border: none;
  }
}
</style>
