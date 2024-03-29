const { setAuth } = require("../../utils/util");

Page({
  data: {
    photo: "",
    marginTop: 0
  },
  shareInfo: {
    path: "/pages/index/index",
    title: "AR元宇宙开启 伊弥戟王者出击",
    imageUrl: "/assets/share.jpg"
  },
  async onLoad({ photo: photoUrl }) {
    const menu = wx.getMenuButtonBoundingClientRect()
    this.setData({
      marginTop: menu.bottom + 19
    })
    wx.showLoading({ title: "加载中...", mask: true });
    const res = await new Promise((resolve) => {
      wx.createSelectorQuery()
        .select("#canvas")
        .fields({
          node: true,
          size: true,
        })
        .exec((els) => resolve(els[0]));
    });
    const canvas = res.node;
    const ctx = canvas.getContext("2d");
    const { width, height } = res;
    canvas.width = width;
    canvas.height = height;
    const frame = canvas.createImage();
    await new Promise((resolve) => {
      frame.onload = resolve;
      frame.src = "../../assets/photo/poster-frame.png";
    });
    const photo = canvas.createImage();
    await new Promise((resolve) => {
      photo.onload = resolve;
      photo.src = decodeURIComponent(photoUrl);
    });
    let photoHeight = photo.height;
    let photoWidth = photo.width;
    const ratio = width / height;
    if (photo.height * ratio < width) {
      // 比frame窄, 截取高度
      photoHeight = photoHeight - (photoHeight - photoWidth * (height / width));
    } else {
      // 比frame宽，截取宽度
      photoWidth = photoWidth - (photoWidth - photoHeight * (width / height));
    }
    ctx.drawImage(
      photo,
      (photo.width - photoWidth) / 2,
      (photo.height - photoHeight) / 2,
      photoWidth,
      photoHeight,
      0,
      0,
      width,
      height
    );
    ctx.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, width, height);
    const page = this;
    // 小程序canvas似乎有bug，需要延时执行，否则可能生成空白图片
    setTimeout(async () => {
      const pic = await new Promise((resolve) => {
        wx.canvasToTempFilePath({
          fileType: "jpg",
          canvas,
          success: (res) => {
            resolve(res.tempFilePath);
          },
          fail: (e) => {
            console.warn("生成图像失败", e);
          },
        });
      });
      page.setData({
        photo: pic,
      });
      wx.hideLoading();
    }, 500);
  },

  onShareAppMessage() {
    return this.shareInfo;
  },
  async save() {
    const userAuth = await setAuth(
      "scope.writePhotosAlbum",
      "相册权限被拒绝",
      "保存照片需要您授予相册权限"
    );
    if (!userAuth)
      return wx.showToast({ title: "保存照片失败, 需要相机权限", icon: none });
    wx.saveImageToPhotosAlbum({
      filePath: this.data.photo,
      success() {
        wx.showToast({ title: "保存照片成功" });
      },
      fail(e) {
        console.error("保存照片失败", e);
        wx.showToast({ title: "保存照片失败", icon: none });
      },
    });
  },
  retake() {
    wx.navigateBack();
  },
});
