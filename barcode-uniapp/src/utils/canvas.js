/**
 * 微信小程序 canvas 2d 工具（配合 JsBarcode 使用）
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

/** canvas 2d 导出为临时图片路径 */
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
      fail: (err) => reject(err),
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
