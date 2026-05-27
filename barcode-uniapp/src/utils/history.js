const STORAGE_KEY = "barcode_history_v1";
const MAX_ITEMS = 100;

export function getHistory() {
  try {
    const data = uni.getStorageSync(STORAGE_KEY);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function addHistory(text, meta = {}) {
  const trimmed = (text || "").trim();
  if (!trimmed) return getHistory();

  let list = getHistory().filter((item) => item.text !== trimmed);
  list.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    text: trimmed,
    time: Date.now(),
    ...meta,
  });
  if (list.length > MAX_ITEMS) {
    list = list.slice(0, MAX_ITEMS);
  }
  uni.setStorageSync(STORAGE_KEY, list);
  return list;
}

export function removeHistory(id) {
  const list = getHistory().filter((item) => item.id !== id);
  uni.setStorageSync(STORAGE_KEY, list);
  return list;
}

export function clearHistory() {
  uni.removeStorageSync(STORAGE_KEY);
  return [];
}

export function formatTime(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
