<template>
  <view class="page" :class="themeClass">
    <LegalNavBar title="隐私政策" />

    <scroll-view scroll-y class="scroll-body" :show-scrollbar="true">
      <view class="doc">
        <text class="update">更新日期：2026年5月28日 · 生效日期：2026年5月28日</text>

        <text class="p">
          「条形码生成器」（以下简称「本小程序」或「我们」）非常重视您的个人信息与隐私保护。本《隐私政策》将向您说明我们如何收集、使用、存储及保护您的信息。请您在使用前仔细阅读。您使用本小程序即表示您已理解并同意本政策。
        </text>

        <text class="h2">一、我们收集的信息范围</text>
        <text class="p">
          1.1 本小程序为工具类应用，<text class="strong">不强制要求您注册账号，不收集手机号码、身份证号码、生物识别信息等敏感个人信息。</text>
        </text>
        <text class="p">
          1.2 为提供核心功能，我们可能仅在您的设备本地处理以下信息：
        </text>
        <text class="p">（1）您主动输入的条形码/二维码文本内容，用于实时生成预览；</text>
        <text class="p">（2）您选择保存至相册的码图文件（经您授权后由系统相册功能完成）；</text>
        <text class="p">（3）本机缓存的历史生成记录（条码文本、格式类型、时间等），便于您再次查看。</text>
        <text class="p">
          1.3 我们不会将上述内容上传至我们的服务器，<text class="strong">不会建立用户画像，不会向第三方出售或共享您的个人隐私数据。</text>
        </text>

        <text class="h2">二、设备权限说明</text>
        <text class="p">
          2.1 <text class="strong">相册（保存图片）权限：</text>当您点击「保存到相册」时，我们将申请该权限，用于将生成的码图保存至您的设备相册。您可在系统设置中随时关闭该权限；关闭后仍可生成预览，但无法保存至相册。
        </text>
        <text class="p">
          2.2 我们不会申请与本工具功能无关的权限（如位置、通讯录、麦克风、摄像头等），除非法律法规另有要求。
        </text>

        <text class="h2">三、信息的存储与安全</text>
        <text class="p">
          3.1 历史记录等信息通过微信小程序本地存储（Storage）保存在您的设备上，您可通过「清空历史」自行删除，或卸载小程序后由系统清除。
        </text>
        <text class="p">
          3.2 我们采取合理措施防止信息泄露、损毁或丢失。鉴于本地存储特性，请您妥善保管设备，避免他人未经授权使用。
        </text>

        <text class="h2">四、第三方服务</text>
        <text class="p">
          4.1 本小程序运行在微信平台，可能受微信平台隐私政策及技术能力约束。除微信平台依法处理的数据外，我们不接入第三方广告追踪、支付或社交分享 SDK（广告位预留区域在未启用前不会收集额外信息）。
        </text>
        <text class="p">
          4.2 本小程序不涉及在线支付功能，不处理任何交易或银行卡信息。
        </text>

        <text class="h2">五、未成年人保护</text>
        <text class="p">
          若您为未满 14 周岁的未成年人，请在监护人陪同下阅读本政策，并在监护人同意后使用本小程序。
        </text>

        <text class="h2">六、您的权利</text>
        <text class="p">
          您有权查阅、删除本地历史记录；有权拒绝或撤回相册授权；有权通过卸载小程序停止我们继续处理本地数据。如需行使其他法定权利，可通过意见反馈联系我们。
        </text>

        <text class="h2">七、政策更新</text>
        <text class="p">
          我们可能适时修订本政策。重大变更将通过小程序内弹窗或页面提示等方式告知。若您继续使用，即视为接受更新后的政策。
        </text>

        <text class="h2">八、联系我们</text>
        <text class="p">
          如对本政策有任何疑问、意见或投诉，请通过微信小程序「意见反馈」与我们联系，我们将尽快核实处理。
        </text>

        <view class="bottom-pad" />
      </view>
    </scroll-view>

    <view class="footer-bar">
      <button class="footer-btn primary" @tap="onConfirm">
        {{ fromModal ? "我已阅读" : "返回" }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import LegalNavBar from "@/components/LegalNavBar/LegalNavBar.vue";

const fromModal = ref(false);

const themeClass = computed(() => {
  const t = uni.getStorageSync("app_theme_v1") || "light";
  return `theme-${t}`;
});

onLoad((query) => {
  fromModal.value = query?.from === "modal";
});

function onConfirm() {
  if (fromModal.value) {
    uni.navigateBack();
  } else {
    uni.navigateBack();
  }
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

.strong {
  font-weight: 600;
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
