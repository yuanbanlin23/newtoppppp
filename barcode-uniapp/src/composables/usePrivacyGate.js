import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { hasPrivacyAgreed } from "@/utils/privacy.js";

/** 各 Tab 页挂载隐私授权弹窗 */
export function usePrivacyGate() {
  const showPrivacyModal = ref(!hasPrivacyAgreed());

  onShow(() => {
    if (!hasPrivacyAgreed()) {
      showPrivacyModal.value = true;
    }
  });

  function onPrivacyAgreed() {
    showPrivacyModal.value = false;
  }

  return { showPrivacyModal, onPrivacyAgreed };
}
