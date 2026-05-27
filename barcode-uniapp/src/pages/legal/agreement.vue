<template>
  <view class="page" :class="themeClass">
    <LegalNavBar title="用户协议" />

    <scroll-view scroll-y class="scroll-body" :show-scrollbar="true">
      <view class="doc">
        <text class="update">更新日期：2026年5月28日 · 生效日期：2026年5月28日</text>

        <text class="p">
          欢迎您使用「条形码生成器」微信小程序（以下简称「本小程序」或「我们」）。请您在使用前仔细阅读本《用户协议》（以下简称「本协议」）。您点击同意、勾选同意或实际使用本小程序，即表示您已阅读并同意接受本协议的全部内容。
        </text>

        <text class="h2">一、服务说明</text>
        <text class="p">
          1.1 本小程序是一款工具类应用，向您提供条形码（如 CODE128、EAN-13 等）及二维码的生成、预览与保存至设备相册等功能。
        </text>
        <text class="p">
          1.2 本小程序仅在您的设备本地完成码图生成与相关数据处理，不向用户提供社交网络、即时通讯、信息发布社区等功能。
        </text>
        <text class="p">
          1.3 本小程序当前不涉及任何付费购买、会员订阅、虚拟商品交易或资金结算服务。
        </text>

        <text class="h2">二、用户行为规范</text>
        <text class="p">
          2.1 您应保证所输入、生成、保存的内容合法合规，不侵犯任何第三方的知识产权、商业秘密或其他合法权益。
        </text>
        <text class="p">
          2.2 您不得利用本小程序制作、传播含有法律法规禁止内容的码图，不得将本小程序用于欺诈、传销、赌博或其他违法违规用途。
        </text>
        <text class="p">
          2.3 您对使用本小程序生成的码图自行承担使用后果，包括但不限于扫码识别结果、印刷质量及商业使用风险。
        </text>

        <text class="h2">三、知识产权</text>
        <text class="p">
          3.1 本小程序的界面设计、程序代码、文档说明等相关知识产权归开发者所有，未经授权不得复制、修改或用于商业目的。
        </text>
        <text class="p">
          3.2 您输入的内容及生成的码图，其权利归属由您自行负责；我们不对您内容主张权利。
        </text>

        <text class="h2">四、免责声明</text>
        <text class="p">
          4.1 本小程序按「现状」提供，我们尽力保障服务稳定，但不保证服务不中断、无错误或完全满足您的特定商业场景需求。
        </text>
        <text class="p">
          4.2 因网络状况、设备兼容性、系统权限限制、第三方平台规则变化等原因导致的功能受限或数据丢失，我们将在法律允许范围内免除相应责任。
        </text>

        <text class="h2">五、协议变更与终止</text>
        <text class="p">
          5.1 我们有权根据法律法规或业务需要修订本协议，并通过小程序内适当方式提示。若您继续使用，视为接受修订后的协议。
        </text>
        <text class="p">
          5.2 您可随时停止使用本小程序。我们亦有权在必要时暂停或终止向全部或部分用户提供服务。
        </text>

        <text class="h2">六、适用法律与争议解决</text>
        <text class="p">
          6.1 本协议的订立、执行与解释适用中华人民共和国大陆地区法律。
        </text>
        <text class="p">
          6.2 因本协议产生的争议，双方应友好协商；协商不成的，提交开发者所在地有管辖权的人民法院诉讼解决。
        </text>

        <text class="h2">七、联系我们</text>
        <text class="p">
          如您对本协议有任何疑问，可通过微信小程序「意见反馈」功能与我们联系。
        </text>

        <view class="bottom-pad" />
      </view>
    </scroll-view>

    <view class="footer-bar">
      <button v-if="fromModal" class="footer-btn primary" @tap="onAgree">
        同意本协议
      </button>
      <button v-else class="footer-btn" @tap="goBack">返回</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import LegalNavBar from "@/components/LegalNavBar/LegalNavBar.vue";
import { setPrivacyAgreed } from "@/utils/privacy.js";

const fromModal = ref(false);

const themeClass = computed(() => {
  const t = uni.getStorageSync("app_theme_v1") || "light";
  return `theme-${t}`;
});

onLoad((query) => {
  fromModal.value = query?.from === "modal";
});

function goBack() {
  uni.navigateBack();
}

function onAgree() {
  setPrivacyAgreed();
  uni.showToast({ title: "已同意", icon: "success" });
  setTimeout(() => {
    const pages = getCurrentPages();
    if (pages.length > 1) uni.navigateBack();
    else uni.switchTab({ url: "/pages/index/index" });
  }, 400);
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: var(--bg-page, #f2f6fc);
  display: flex;
  flex-direction: column;
}

.scroll-body {
  flex: 1;
  height: calc(100vh - 200rpx);
}

.doc {
  padding: 24rpx 32rpx;
}

.update {
  display: block;
  font-size: 24rpx;
  color: var(--text-secondary, #8e8e93);
  margin-bottom: 32rpx;
}

.h2 {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary, #1c1c1e);
  margin: 36rpx 0 16rpx;
}

.p {
  display: block;
  font-size: 28rpx;
  color: var(--text-primary, #1c1c1e);
  line-height: 1.75;
  margin-bottom: 16rpx;
  text-align: justify;
}

.bottom-pad {
  height: 160rpx;
}

.footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
  background: linear-gradient(
    180deg,
    rgba(242, 246, 252, 0) 0%,
    var(--bg-page, #f2f6fc) 24%
  );
}

.footer-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  background: var(--bg-card, #fff);
  color: var(--text-primary, #1c1c1e);
  border: 1rpx solid var(--border, #e5e5ea);

  &::after {
    border: none;
  }

  &.primary {
    background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
    color: #fff;
    border: none;
  }
}
</style>
