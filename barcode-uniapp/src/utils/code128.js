/**
 * CODE128-B 编码，供微信小程序 canvas 绘制
 */

const CODE128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112",
];

const START_B = 104;
const STOP = 106;

function encodeCode128B(text) {
  if (!text || typeof text !== "string") {
    throw new Error("内容不能为空");
  }
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 32 || c > 126) {
      throw new Error("仅支持 ASCII 可打印字符");
    }
  }

  const codes = [START_B];
  for (let i = 0; i < text.length; i++) {
    codes.push(text.charCodeAt(i) - 32);
  }

  let checksum = codes[0];
  for (let i = 1; i < codes.length; i++) {
    checksum += codes[i] * i;
  }
  codes.push(checksum % 103);
  codes.push(STOP);
  return codes;
}

export function codesToModules(codes) {
  const modules = [];
  for (let c = 0; c < codes.length; c++) {
    const pattern = CODE128_PATTERNS[codes[c]];
    if (!pattern) throw new Error("编码失败");
    for (let i = 0; i < pattern.length; i++) {
      modules.push({ w: Number(pattern[i]), black: i % 2 === 0 });
    }
  }
  return modules;
}

export function encodeToModules(text) {
  return codesToModules(encodeCode128B(text));
}

export function calcBarcodeSize(text, options = {}) {
  const barWidth = options.barWidth || 2;
  const height = options.height || 120;
  const margin = options.margin || 16;
  const fontSize = options.fontSize || 14;
  const displayValue = options.displayValue !== false;

  const modules = encodeToModules(text);
  let totalW = 0;
  modules.forEach((m) => {
    totalW += m.w * barWidth;
  });

  const textH = displayValue ? fontSize + 8 : 0;
  return {
    width: totalW + margin * 2,
    height: height + margin * 2 + textH,
    modules,
    barWidth,
    height,
    margin,
    fontSize,
    displayValue,
  };
}

export function validateCode128(text) {
  try {
    encodeCode128B(text);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}
