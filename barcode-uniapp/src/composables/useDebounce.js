import { ref, watch } from "vue";

/** 输入防抖，默认 300ms，减少 canvas 重绘 */
export function useDebouncedRef(sourceRef, delay = 300) {
  const debounced = ref(sourceRef.value);
  let timer = null;

  watch(sourceRef, (val) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      debounced.value = val;
      timer = null;
    }, delay);
  });

  return debounced;
}
