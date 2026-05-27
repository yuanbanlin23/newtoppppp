/**
 * 按换行或空格分割批量内容
 * @param {string} raw
 * @param {'newline'|'space'|'both'} mode
 */
export function splitBatchContent(raw, mode = "both") {
  if (!raw || !raw.trim()) return [];

  let parts;
  if (mode === "newline") {
    parts = raw.split(/\r?\n/);
  } else if (mode === "space") {
    parts = raw.split(/\s+/);
  } else {
    parts = raw.split(/\r?\n|\s+/);
  }

  return [...new Set(parts.map((s) => s.trim()).filter(Boolean))];
}
