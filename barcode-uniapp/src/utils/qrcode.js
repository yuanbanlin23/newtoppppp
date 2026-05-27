import UQRCode from "uqrcodejs";

/**
 * 在 canvas 2d 上绘制二维码（uQRCode）
 */
export function renderQrCode(canvas, text, options = {}) {
  const dpr = options.dpr || 1;
  const size = Math.floor((options.size || 200) * dpr);

  canvas.width = size;
  canvas.height = size;

  const qr = new UQRCode();
  qr.data = text;
  qr.size = size;
  qr.margin = Math.floor((options.margin ?? 10) * dpr);
  qr.backgroundColor = options.background || "#ffffff";
  qr.foregroundColor = options.lineColor || "#000000";
  qr.errorCorrectLevel = UQRCode.errorCorrectLevel?.M ?? 1;
  qr.make();

  const ctx = canvas.getContext("2d");
  qr.canvasContext = ctx;
  qr.drawCanvas();

  const logical = size / dpr;
  return {
    pixelWidth: size,
    pixelHeight: size,
    width: logical,
    height: logical,
    dpr,
  };
}

export function validateQrCode(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return { ok: false, message: "内容不能为空" };
  if (trimmed.length > 800) return { ok: false, message: "二维码内容过长（最多约 800 字）" };
  return { ok: true };
}
