var app = getApp();
var name = "";
var score = "";
var words = "";
Page({
  data: {
    motto: '植物识别',
    userInfo: {},
    images: {},
    info: "点击查看识别结果",
    names: "",
    scores: "",
    remark: ""
  },
  onShareAppMessage: function () {
    return {
      title: '植物识别小程序',
      path: '/pages/plant/plant',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 500
          });
        }
      },
      fail: function (res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '分享取消',
            icon: 'loading',
            duration: 500
          })
        }
      }
    }
  },
  clear: function (event) {
    console.info(event);
    wx.clearStorage();
  },
  changeinfo: function () {
    console.info(name);
    var that = this;
    var imgdata = that.data.img;
    if (words == "success") {
      this.setData({
        names: "植物名称：" + " " + name,
        scores: "可信度：" + " " + score
      })
    } else {
      if (imgdata == null) {
        wx.showModal({
          title: '友情提示',
          content: '亲，您还没有选取图片呢'
        })
      } else {
        if (words != "" && words != "success") {
          this.setData({
            names: words,
          })
        } else {
          this.setData({
            names: "大队正在疯狂识别中。。。\r\n请稍等后点击识别！",
          })
        }
      }
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  uploads: function () {
    var that = this;
    if (app.globalData.userInfo && app.globalData.userInfo.id) {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          that.setData({
            names: "大队正在疯狂识别中。。。\r\n请稍等后点击识别！",
            score:""
          })
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          //console.log( res )
          that.setData({
            img: res.tempFilePaths[0]
          })
          wx.uploadFile({
            url: 'https://blog.ouyanglol.com/wxapp/api/baiduPlant',
            filePath: res.tempFilePaths[0],
            header: {
              'content-type': 'multipart/form-data'
            },
            name: 'file',
            formData: {
              'userInfoId': getApp().globalData.userInfo.id
            },
            success: function (res) {
              var data = res.data;
              var str = JSON.parse(data);
              if (str.success) {
                var result = JSON.parse(str.result);
                name = result.name;
                score = (result.score * 100).toFixed(2) + "%";
                words = 'success';
              } else {
                wx.showModal({
                  title: '来自大队的警告',
                  content: '你的图片不得行！',
                  showCancel: false
                })
              }
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      });
    } else {
      //获取用户信息
      app.getOpenSetting();
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
});