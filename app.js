// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 开启AR扫一扫图像追踪
    const { setOptions } = requirePlugin("kivicube");
    setOptions({
      license: "OA7EIJ7JB4JmAZ5CiceSt0ScZael9lB0GJTb+5YJ5B6l8idXnc3eJ5/8wlH44ZPycUu1anh7DuOremv6GKmChel5PT4WcQNqny5/vpWy4Zr7Y119sdRK7bGEpBVx6b9IpO2/otJ7e7qQza9ESKBR+0i2EaYxd9khEdWE/ofgsONfEDW+mWqT26i598ev1zbhO8lwGYbUcqhL0UIrTjdLpfG0sBp2a4WqNc3YOnoh0e5EnzRn3h1AXVHpjutf86vwuDgJKq/MTVBZ7Y3dP7K7Jbye9whYL2nrgRQkvw38nsuo/FspqweCujz7MzP1wPpYZLms2KtgGdjzSfuTbWxThQ=="
    });
  },
  globalData: {
    userInfo: null
  }
})
