import { calcBarcodeSize } from "./code128.js";

/**
 * 在 canvas 2d 上下文绘制 CODE128 条形码
 */
export function drawBarcode(ctx, text, options = {}) {
  const size = calcBarcodeSize(text, options);
  const { width, height, modules, barWidth, margin, fontSize, displayValue } = size;
  const barHeight = options.height || 120;
  const dpr = options.dpr || 1;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = options.background || "#ffffff";
  ctx.fillRect(0, 0, width, height);

  let x = margin;
  const y = margin;
  ctx.fillStyle = options.lineColor || "#000000";

  modules.forEach((m) => {
    const w = m.w * barWidth;
    if (m.black) {
      ctx.fillRect(x, y, w, barHeight);
    }
    x += w;
  });

  if (displayValue) {
    ctx.fillStyle = options.textColor || "#000000";
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(text, width / 2, y + barHeight + 6);
  }

  return { width, height };
}

/**
 * 获取 canvas 2d 节点并绘制，返回 canvas 节点与尺寸
 */
export function getCanvasNode(instance, canvasId) {
  return new Promise((resolve, reject) => {
    const query = uni.createSelectorQuery().in(instance);
    query
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res?.[0]?.node) {
          reject(new Error("Canvas 初始化失败"));
          return;
        }
        resolve(res[0]);
      });
  });
}

export async function renderBarcodeCanvas(instance, canvasId, text, options = {}) {
  const { node, width: boxW } = await getCanvasNode(instance, canvasId);
  const sys = uni.getSystemInfoSync();
  const dpr = sys.pixelRatio || 2;

  const size = calcBarcodeSize(text, options);
  const canvasW = Math.min(size.width, boxW || size.width);
  const scale = canvasW / size.width;

  node.width = size.width * dpr;
  node.height = size.height * dpr;

  const ctx = node.getContext("2d");
  drawBarcode(ctx, text, { ...options, dpr });

  return { node, width: size.width, height: size.height, dpr };
}

export function canvasToTempFile(instance, canvasId, destWidth, destHeight) {
  return new Promise((resolve, reject) => {
    uni.canvasToTempFilePath(
      {
        canvasId,
        x: 0,
        y: 0,
        width: destWidth,
        height: destHeight,
        destWidth,
        destHeight,
        fileType: "png",
        success: (res) => resolve(res.tempFilePath),
        fail: reject,
      },
      instance
    );
  });
}

/** canvas 2d 导出图片 */
export function canvas2dToTempFile(canvas, width, height) {
  return new Promise((resolve, reject) => {
    uni.canvasToTempFilePath({
      canvas,
      x: 0,
      y: 0,
      width,
      height,
      destWidth: width,
      destHeight: height,
      fileType: "png",
      success: (res) => resolve(res.tempFilePath),
      fail: reject,
    });
  });
}

export function saveImageToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: reject,
    });
  });
}

export async function requestAlbumPermission() {
  // #ifdef MP-WEIXIN
  return new Promise((resolve) => {
    uni.getSetting({
      success: (res) => {
        if (res.authSetting["scope.writePhotosAlbum"]) {
          resolve(true);
          return;
        }
        uni.authorize({
          scope: "scope.writePhotosAlbum",
          success: () => resolve(true),
          fail: () => {
            uni.showModal({
              title: "需要相册权限",
              content: "请在设置中允许保存图片到相册",
              confirmText: "去设置",
              success: (m) => {
                if (m.confirm) {
                  uni.openSetting({
                    success: (s) =>
                      resolve(!!s.authSetting["scope.writePhotosAlbum"]),
                  });
                } else resolve(false);
              },
            });
          },
        });
      },
      fail: () => resolve(false),
    });
  });
  // #endif
  // #ifndef MP-WEIXIN
  return true;
  // #endif
}
