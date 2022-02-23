Component({
  properties: {
    text: {
      type: String,
      value: "",
    },
    alertText: {
      type: String,
      value: "",
    },
  },
  data: {
    showAlert: false,
  },
  lifetimes: {
    attached() {
      this.timer = setTimeout(() => {
        this.setData({
          showAlert: true,
        });
      }, 3000);
    },
    detached() {
      clearTimeout(this.timer);
    },
  },
});
