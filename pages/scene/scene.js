// pages/scene/scene.js
Page({
    playing: false,
    data: {
        scanning: false,
        loading: false
    },

    onLoad: function (options) {
        wx.showLoading({
          title: 'title',
        })
    },

    onReady: function () {
        // test
        // wx.hideLoading({
        //   success: (res) => {},
        // })
        // this.setData({
        //     loading: true
        // })
    },

    onShow: function () {

    },

    onHide: function () {

    },

    onUnload: function () {

    },

    onShareAppMessage: function () {

    },

    ready: function({detail: view}) {
        wx.hideLoading({
          success: (res) => {},
        })
        console.log("ready", view);
        this.view = view
        this.setData({
            loading: true
        })
    },

    sceneStart: function() {
        console.log('start');
        if(typeof this.view.getObject === "function") {
            this.model = this.view.getObject("yimiji-ani");
            this.mask = this.view.getObject("mask");
        }
        this.setData({
            scanning: true,
            loading: false
        })
        // this.mask && this.mask.setEnableMask();
    },

    play(model) {
        const [name] = model.getAnimationNames();
        // 如果name为假，说明此模型没有模型动画
        if (name) {
          model.playAnimation({
            name, // 动画名称
            loop: true, // 是否循环播放
            clampWhenFinished: true // 播放完毕后是否停留在动画最后一帧
          });
        } else {
          console.warn(`模型(${model.name})没有动画`);
        }
    },
    loadSceneStart: function() {
        console.log("loading");
    },

    tracked: function() {
        console.log("tracked");
        if(!this.playing) {
            // this.play(this.model)
            setTimeout(() => {
                this.play(this.mask)
            }, 500);
        }
        this.playing = true
        this.setData({
            scanning: false
        })
    },

    lostTrack: function() {
        this.playing = false
        this.setData({
            scanning: true
        })
    }
})