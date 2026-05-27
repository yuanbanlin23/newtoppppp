/** 隐私合规：协议版本更新后可调整以触发重新确认 */
export const PRIVACY_POLICY_VERSION = "1.0.0";

const STORAGE_KEY = "privacy_consent_v1";

export function hasPrivacyAgreed() {
  try {
    const data = uni.getStorageSync(STORAGE_KEY);
    return (
      data &&
      data.agreed === true &&
      data.version === PRIVACY_POLICY_VERSION
    );
  } catch {
    return false;
  }
}

export function setPrivacyAgreed() {
  uni.setStorageSync(STORAGE_KEY, {
    agreed: true,
    version: PRIVACY_POLICY_VERSION,
    agreedAt: Date.now(),
  });
}

export function clearPrivacyAgreed() {
  uni.removeStorageSync(STORAGE_KEY);
}
