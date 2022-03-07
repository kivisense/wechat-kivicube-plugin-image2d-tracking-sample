Component({
  properties: {
    progress: 0,
  },
  data: {
    posX: 0,
    posY: 0
  },
  observers: {
    "progress": function() {
      const r = 58.67 / 2
      const progress = parseInt(this.properties.progress);
      const posX = Math.sin(progress / 50 * Math.PI) * r
      const posY = (1 - Math.cos(progress / 50 * Math.PI)) * r
      this.setData({
        posX,
        posY,
      });
    }
  },
});
