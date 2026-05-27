<template>
  <view class="page">
    <AppNavBar title="历史记录" :subtitle="`${list.length} 条记录`" />

    <view class="content">
      <view v-if="!list.length" class="empty-card">
        <text class="empty-icon">◷</text>
        <text class="empty-title">暂无历史记录</text>
        <text class="empty-desc">保存条形码后会自动记录在这里</text>
      </view>

      <view v-else class="list">
        <view
          v-for="item in list"
          :key="item.id"
          class="history-item"
          @tap="openItem(item)"
          @longpress="confirmDelete(item)"
        >
          <view class="item-main">
            <text class="item-text">{{ item.text }}</text>
            <text class="item-time">{{ formatTime(item.time) }}</text>
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
import AdSlot from "@/components/AdSlot/AdSlot.vue";
import {
  getHistory,
  removeHistory,
  clearHistory,
  formatTime,
} from "@/utils/history.js";
import { updateTabBar } from "@/utils/tabbar.js";

const list = ref([]);

function loadList() {
  list.value = getHistory();
}

onShow(() => {
  updateTabBar();
  loadList();
});

function openItem(item) {
  uni.setStorageSync("pending_barcode_text", item.text);
  uni.switchTab({ url: "/pages/index/index" });
}

function confirmDelete(item) {
  uni.showModal({
    title: "删除记录",
    content: `删除「${item.text}」？`,
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
}

.content {
  padding: 24rpx 32rpx;
}

.empty-card {
  @include card;
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-icon {
  font-size: 64rpx;
  color: #c7c7cc;
  margin-bottom: 24rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1c1c1e;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #8e8e93;
}

.list {
  @include card;
  overflow: hidden;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f2f2f7;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f9f9fb;
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
  color: #1c1c1e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-time {
  display: block;
  font-size: 24rpx;
  color: #8e8e93;
  margin-top: 8rpx;
}

.item-arrow {
  font-size: 40rpx;
  color: #c7c7cc;
  margin-left: 16rpx;
}

.clear-wrap {
  margin-top: 32rpx;
}

.clear-btn {
  background: #fff;
  color: #ff3b30;
  font-size: 28rpx;
  border-radius: 24rpx;
  border: none;

  &::after {
    border: none;
  }
}
</style>
