const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

async function setAuth(scope, title, content) {
  const { authSetting } = await wx.getSetting();
  if (authSetting[scope]) return true;
  try {
    await wx.authorize({
      scope,
    });
    return true;
  } catch (error) {
    const res = await new Promise((resolve) => {
      wx.showModal({
        title,
        content,
        cancelText: "不授权",
        cancelColor: "#999999",
        confirmText: "去授权",
        confirmColor: "#f94218",
        success: resolve,
      });
    });
    if (res.confirm) {
      const { authSetting } = await wx.openSetting();
      if (authSetting[scope]) return true;
      return false;
    } else {
      return false;
    }
  }
}

module.exports = {
  formatTime,
  setAuth,
};
