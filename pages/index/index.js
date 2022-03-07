// index.js
import { setAuth } from "../../utils/util";

// 获取应用实例
const app = getApp();

Page({
  data: {},

  async start() {
    const userAuthorize = await setAuth(
      "scope.camera",
      "摄像头权限被拒绝",
      "AR体验需要您授予摄像头权限，摄像头权限仅用作AR体验时的本地实景画面预览"
    );
    if (!userAuthorize) return;
    wx.navigateTo({
      url: "../scene/scene",
      // url: "../photo/photo",
    });
  },
});
