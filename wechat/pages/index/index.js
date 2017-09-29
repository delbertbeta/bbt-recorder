//index.js
//获取应用实例
var app = getApp()
var functions = require('./function');

Page({
  data: {
    userInfo: {},
    isRecorded: false,
    isRecording: false,
    isPlaying: false,
    recordTime: 0,
    userRemark: '',
    errorAnimation: {},
    errorText: '错误',
    errorShowing: false
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  userRemarkInput: function (e) {
    this.data.userRemark = e.detail.value;
  },
  startRecord: function () {
    this.setData({
      isRecording: true,
    })
    var that = this;
    if (this.data.recordTime != 0) {
      this.setData({
        recordTime: 0,
      })
    }
    this.timerRequestId = setInterval(function () {
      that.setData({
        recordTime: that.data.recordTime + 1,
      })
      if (that.data.recordTime > 60) {
        that.stopRecord();
      }
    }, 1000)
    wx.startRecord({
      success: function (res) {
        that.data.recordFile = res.tempFilePath;
        that.setData({
          isRecording: false,
          isRecorded: true,
        })
      },
      fail: function (res) {
        that.showError('录音失败，请检查是否给予微信录音权限')
        that.stopRecord();
      },
    })
  },
  stopRecord: function () {
    clearInterval(this.timerRequestId);
    wx.stopRecord();
    this.setData({
      isRecording: false,
    })
  },
  playRecord: function () {
    var that = this;
    that.setData({
      isPlaying: true,
    })
    that.data.playRequestId = setTimeout(function () {
      that.stopPlayRecord();
    }, that.data.recordTime * 1000)
    wx.playVoice({
      filePath: that.data.recordFile,
      success: function () {

      },
      fail: function () {
        that.showError('播放失败');
      },
    })
  },
  stopPlayRecord: function () {
    this.setData({
      isPlaying: false,
    })
    clearTimeout(this.data.playRequestId);
    wx.stopVoice();
  },
  retry: function () {
    this.setData({
      isRecorded: false,
    })
  },
  uploadRecord: function () {
    var that = this;
    if (this.data.userRemark === '') {
      this.showError('请填写您的基本信息');
      return;
    }
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: 'https://withcic.cn/apps/upload/index.php?upload',
      filePath: that.data.recordFile,
      name: 'recordFile',
      formData: {
        user: JSON.stringify({
          wechat: that.data.userInfo.nickName,
          remark: that.data.userRemark,
        })
      },
      success: function (res) {
        console.log(res);
        var response = JSON.parse(res.data);
        wx.hideLoading();
        if (response.status == 1) {
          that.retry();
          wx.navigateTo({
            url: 'result?state=true&code=' + response.code,
          })
        }
        else {
          that.showError(response.message);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        // console.log(res);
        that.showError('上传失败，请重试')
      },
    })
  },
  showError: function (msg) {
    this.errorShowing = true;
    this.setData({
      errorText: msg
    });
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
      delay: 0
    });
    this.animation = animation;
    animation.opacity(1).step();
    this.setData({
      errorAnimation: this.animation.export()
    });
    setTimeout(this.hideError.bind(this), 2000)
  },
  hideError: function () {
    if (this.errorShowing === true) {
      this.errorShowing = false;
      this.animation.opacity(0).step();
      this.setData({
        errorAnimation: this.animation.export()
      })
    }
  }
})
