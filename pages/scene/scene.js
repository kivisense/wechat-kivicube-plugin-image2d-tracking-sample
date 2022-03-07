// pages/scene/scene.js
import { setAuth } from "../../utils/util";
Page({
  playing: false,
  data: {
    scanning: false,
    loading: false,
    photoing: false,
    showScene: false,
    progress: 0,
  },

  onLoad: async function (options) {
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });
    wx.showLoading({
      title: "加载中...",
    });
    const userAuthorize = await setAuth(
      "scope.camera",
      "摄像头权限被拒绝",
      "AR体验需要您授予摄像头权限，摄像头权限仅用作AR体验时的本地实景画面预览"
    );
    if (!userAuthorize) {
      wx.navigateTo({
        url: "../index/index",
      });
      return;
    }
    this.setData({
      showScene: true,
    });
  },

  onReady: function () {
    // test
    // wx.hideLoading({
    //   success: (res) => {},
    // });
    // this.setData({
    //   loading: true,
    // });
  },

  onShow: function () {},

  onHide: function () {
    this.stopAnim();
  },

  onUnload: function () {
    this.stopAnim();
    wx.setKeepScreenOn({
      keepScreenOn: false,
    });
  },

  onShareAppMessage: function () {},

  ready: function ({ detail: view }) {
    wx.hideLoading({
      success: (res) => {},
    });
    this.view = view;
    this.setData({
      loading: true,
    });
  },

  sceneStart: function () {
    this.stopAnim();
    if (typeof this.view.getObject === "function") {
      this.model = this.view.getObject("image");
      this.mask = this.view.getObject("image-mask");
    }
    this.setData({
      scanning: true,
      loading: false,
    });
    this.mask && this.mask.setEnableMask();
  },

  stop(model) {
    if (!model) return;
    const names = model.getAnimationNames();
    if (!Array.isArray(names)) return;
    names.forEach((name) => {
      model.stopAnimation(name);
    });
  },

  play(model, name, loop, callback) {
    if (!model) return false;
    this.stop(model);
    const names = model.getAnimationNames();
    if (!Array.isArray(names)) return;
    if (!name) {
      name = names[0];
    }
    if (!names.includes(name)) return false;
    model.playAnimation({
      name, // 动画名称
      loop, // 是否循环播放
      clampWhenFinished: true, // 播放完毕后是否停留在动画最后一帧
    });
    callback &&
      model.addEventListener("animationEnded", ({ animationName }) => {
        if (animationName !== name) return;
        callback();
      });
  },

  playAnim() {
    if (!this.playing) {
      this.playing = true;
      const { model, mask } = this;
      this.play(model, "start", false, () => this.play(model, "loop", true));
      this.play(mask);
      this.setData({
        scanning: false,
        photoing: true,
      });
    }
  },

  stopAnim() {
    this.playing = false;
    this.stop(this.model);
    this.stop(this.mask);
    this.setData({
      scanning: true,
      photoing: false,
    });
  },

  loadSceneStart: function () {},

  tracked: function () {
    this.playAnim();
  },

  lostTrack: function () {
    this.stopAnim();
  },

  takePhoto: async function () {
    wx.showLoading({ title: "拍照中...", mask: true });
    const photoPath = await this.view.takePhoto();
    wx.navigateTo({
      url: `/pages/photo/photo?photo=${encodeURIComponent(photoPath)}`,
    });
  },

  downloadAssetProgress: function ({ detail }) {
    this.setData({
      progress: detail * 100,
    });
  },
});
