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
        wx.showToast({
          title: '录音失败，请检查是否给予微信录音权限',
          duration: 2000
        });
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
        wx.showToast({
          title: '播放失败',
          duration: 2000,
        })
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
      wx.showToast({
        title: '请填写您的基本信息',
        duration: 2000,
      })
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
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000,
          })
        }
        else {
          wx.showToast({
            title: response.message,
            duration: 2000,
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        // console.log(res);
        wx.showToast({
          title: '上传失败，请重试',
          duration: 2000,
        })
      },
    })
  }
})
