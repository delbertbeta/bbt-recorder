Page({
  data: {
    state: true,
    code: '',
  },
  onLoad: function (para) {
    this.setData({
      state: para.state,
      code: para.code
    })
  }
})