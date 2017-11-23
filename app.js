//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxeadff8cfd42bc3a9&secret=08cb141033ff61196cddb284fac405a7&js_code='+ code +'&grant_type=authorization_code',
                  data: {},
                  header: {
                      'content-type': 'application/json'
                  },
                  success: function(res) {
                    console.log('code:'+code)
                    that.globalData.userInfo.openid = res.data.openid //返回openid
                  }
               })
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})