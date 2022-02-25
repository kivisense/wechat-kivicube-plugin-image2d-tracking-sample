Page({
  data: {
    photo: "",
  },
  shareInformation:  {
    path: `/pages/index/index`,
    title: `伊弥戟`,
  },
  async onLoad({ photo: photoUrl }) {
    console.log(photoUrl);
    const res = await new Promise((resolve) => {
      wx.createSelectorQuery()
        .select('#canvas')
        .fields({
          node: true,
          size: true,
        })
        .exec(els => resolve(els[0]))
    })
    const canvas = res.node
    console.log(canvas);
    const ctx = canvas.getContext("2d")
    const {width, height} = res
    canvas.width = width
    canvas.height = height
    const frame = canvas.createImage()
    await new Promise(resolve => {
      frame.onload = resolve
      frame.src = "../../assets/photo/poster-frame.png"
    })
    const photo = canvas.createImage()
    await new Promise(resolve => {
      photo.onload = resolve
      photo.src = decodeURIComponent(photoUrl)
    })
    let photoHeight = photo.height
    let photoWidth = photo.width
    const ratio = width / height
    if(photo.height * ratio < width) {
      // 比frame窄, 截取高度
      photoHeight = photoHeight - (photoHeight - photoWidth * (height / width))
    }else {
      // 比frame宽，截取宽度
      photoWidth = photoWidth - (photoWidth - photoHeight *  (width / height))
    }
    console.log('pphoto', photo);
    console.log(ctx, photo, photoWidth, photoHeight, width, height);
    ctx.drawImage(photo, (photo.width - photoWidth) / 2, (photo.height - photoHeight) / 2, photoWidth, photoHeight, 0, 0, width, height)
    ctx.drawImage(frame, 0, 0, frame.width, frame.height, 0,  0, width, height)
    const page = this
    setTimeout( async () => {
      const pic = await new Promise(resolve => {
        wx.canvasToTempFilePath({
          fileType: 'jpg',
          canvas,
          success: (res) => {
            console.log("rrres",res);
            resolve(res.tempFilePath)
          },
          fail: (e) => {
            console.warn("生成图像失败", e)
          }
        })
      })
      page.setData({
        photo: pic,
      });
    }, 500);
  },

  onShareAppMessage() {
    return this.shareInformation
  },
  save() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.photo,
      success() {
        wx.showToast({ title: "保存照片成功" });
      },
      fail(e) {
        console.error("保存照片失败", e);
        wx.showToast({ title: "保存照片失败", icon: "none" });
      },
    });
  },
  retake() {
    wx.navigateBack()
  }
});
