// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    motto: "Hello World",
  },

  start() {
    wx.navigateTo({
      url: "../scene/scene",
      // url: '../photo/photo',
    });
  },
});
