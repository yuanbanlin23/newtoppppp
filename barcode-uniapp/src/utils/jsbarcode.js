/**
 * JsBarcode 适配层 — 微信小程序 canvas 2d
 */
import JsBarcode from "jsbarcode";
import { validateQrCode } from "./qrcode.js";

export const BARCODE_FORMATS = [
  { value: "CODE128", label: "CODE128", hint: "通用字母数字" },
  { value: "EAN13", label: "EAN-13", hint: "13 位商品码" },
  { value: "QRCODE", label: "二维码", hint: "QR Code" },
];

function createMockCanvas() {
  const canvas = { width: 0, height: 0 };
  const ctx = {
    save() {},
    restore() {},
    translate() {},
    fillRect() {},
    clearRect() {},
    fillText() {},
    measureText() {
      return { width: 0 };
    },
    fillStyle: "",
    font: "",
  };
  canvas.getContext = () => ctx;
  return canvas;
}

function translateError(message, format) {
  if (!message) return "无法生成条形码";
  const m = String(message);
  if (/invalid/i.test(m)) return "内容或格式无效";
  if (format === "EAN13") return "EAN-13 需要 12 或 13 位数字";
  if (/character/i.test(m) || /ascii/i.test(m)) {
    return "该格式不支持此字符";
  }
  return m;
}

export function renderJsBarcode(canvas, text, options = {}) {
  const format = options.format || "CODE128";
  const dpr = options.dpr || 1;
  const barWidth = options.barWidth ?? 2;
  const height = options.height ?? 100;
  const margin = options.margin ?? 12;
  const fontSize = options.fontSize ?? 14;

  const jsOptions = {
    format,
    width: barWidth * dpr,
    height: height * dpr,
    displayValue: options.displayValue !== false,
    margin: margin * dpr,
    marginLeft: margin * dpr,
    marginRight: margin * dpr,
    background: options.background || "#ffffff",
    lineColor: options.lineColor || "#000000",
    fontSize: fontSize * dpr,
    font: `bold ${fontSize * dpr}px sans-serif`,
    textMargin: (options.textMargin ?? 6) * dpr,
  };

  JsBarcode(canvas, text, jsOptions);

  return {
    pixelWidth: canvas.width,
    pixelHeight: canvas.height,
    width: canvas.width / dpr,
    height: canvas.height / dpr,
    dpr,
    format,
  };
}

export function validateBarcode(text, format = "CODE128") {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return { ok: false, message: "内容不能为空" };
  }
  if (format === "QRCODE") {
    return validateQrCode(trimmed);
  }
  try {
    const mock = createMockCanvas();
    JsBarcode(mock, trimmed, {
      format,
      width: 2,
      height: 40,
      displayValue: false,
      margin: 0,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, message: translateError(e.message, format) };
  }
}

export const validateCode128 = (text) => validateBarcode(text, "CODE128");
