//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    console.log('调用登陆接口。。。');
    if (!(this.globalData.userInfo && this.globalData.userInfo.id)) {
      //调用登录接口
      console.log('开始登陆。。。');
      wx.login({
        success: function (res) {
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              that.globalData.userInfo.code = code;
              console.log('code:' + code)
              //储存用户访问信息
              wx.request({
                url: 'https://blog.ouyanglol.com/wxapp/api/saveUserInfo',
                method: "POST",
                data: that.globalData.userInfo,
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  var data = res.data;
                  console.log(data);
                  if (data.success) {
                    var result = data.result;
                    that.globalData.userInfo.id = result.id;
                    that.globalData.userInfo.openid = result.openid;
                  }
                }
              })

            }
          })
        }
      })
    }
  },
  getOpenSetting: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请允许大队使用用户信息！',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              console.log(res);
              that.getUserInfo();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  globalData: {
    userInfo: null
  }
})