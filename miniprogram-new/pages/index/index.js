//index.js
//获取应用实例
const app = getApp()

let that;

const options = {
  duration: 60000,
  sampleRate: 44100,
  numberOfChannels: 2,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}

const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();

innerAudioContext.onPlay(() => {
  that.setData({
    playing: true
  })
})

innerAudioContext.onStop(() => {
  that.setData({
    playing: false
  })
})

innerAudioContext.onEnded(() => {
  that.setData({
    playing: false
  })
})

recorderManager.onStart(() => {
  that.setData({
    state: 1
  })
  if (that.data.progress != 0) {
    that.setData({
      progress: 0,
    })
  }
  that.time = 0;
  that.timerRequestId = setInterval(() => {
    that.time++;
    that.setData({
      progress: that.time / 60 * 100
    })
  }, 1000)
})

recorderManager.onStop((res) => {
  const { tempFilePath } = res;
  that.tempFilePath = tempFilePath;
  console.log(that.tempFilePath);
  that.setData({
    state: 2
  });
  clearInterval(that.timerRequestId);
})

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    username: '',
    content: '',
    state: 0,
    playing: false,
    progress: 0
  },
  //事件处理函数
  onLoad: function (options) {
    if (options.exit === 'true') {
      wx.navigateBack({
        delta: 1
      })
    }
    that = this;
    this.tempFilePath = '';
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  login() {
    wx.showModal({
      title: '提示',
      content: '由于您刚刚拒绝了获取您个人信息的请求，请您手动重新勾选该权限并返回该页面。',
      success: (res) => {
        wx.openSetting({
          success: (res) => {
            wx.login({
              success: (res) => {
                wx.getUserInfo({
                  success: (res) => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                      userInfo: res.userInfo,
                      hasUserInfo: true
                    })
                  }
                })
              }
            })
          }
        });
      }
    })
  },
  startRecord() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.record'] || res.authSetting['scope.record'] === undefined) {
          recorderManager.start(options);
        } else {
          wx.showModal({
            title: '提示',
            content: '由于您刚刚拒绝了获取您录音的请求，请您手动重新勾选该权限并返回该页面。',
            success: (res) => {
              wx.openSetting({
                success: (res) => {
                }
              });
            }
          })
        }
      }
    });
  },
  stopRecord() {
    recorderManager.stop();
  },
  playRecord() {
    if (this.data.playing === false) {
      innerAudioContext.src = this.tempFilePath;
      innerAudioContext.play();
    } else {
      innerAudioContext.stop();
    }
  },
  submit() {
    if (Object.getOwnPropertyNames(this.data.userInfo).length === 0) {
      wx.showToast({
        title: '请先登陆一下哦',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.username === '' || (this.data.content.trim() === '' && this.tempFilePath === '')) {
      wx.showToast({
        title: '是不是还有啥没弄完呢',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (this.tempFilePath === '') {
      wx.request({
        url: 'https://localhost/testurl',
        data: {
          wechat: this.data.userInfo.nickName,
          remark: this.data.username,
          message: this.data.content
        },
        dataType: 'json',
        success: (data) => {
          if (data.data.status === 0) {
            wx.redirectTo({
              url: '/pages/success/success'
            })
          } else {
            wx.showToast({
              title: data.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: (err) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.uploadFile({
        url: 'https://localhost/testurl',
        filePath: this.tempFilePath,
        name: 'recordFile',
        formData: {
          user: JSON.stringify({
            wechat: this.data.userInfo.nickName,
            remark: this.data.username,
            message: this.data.content
          })
        },
        success: (data) => {
          if (data.data.status === 0) {
            wx.redirectTo({
              url: '/pages/success/success'
            })
          } else {
            wx.showToast({
              title: data.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: (err) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  contentInput(e) {
    this.data.content = e.detail.value;
  },
  usernameInput(e) {
    this.data.username = e.detail.value;
  }
})
