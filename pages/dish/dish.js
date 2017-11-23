var app = getApp();
var name = "";
var calorie = "";
var probability ="";
var words = "";
Page({
  data: {
    motto: '菜品识别',
    userInfo: {},
    images: {},
    info: "点击查看识别结果",
    names: "",
    calories: "",
    probabilitys:"",
    remark: ""
  },
  onShareAppMessage: function () {
    return {
      title: '菜品识别小程序',
      path: '/pages/dish/dish',
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
  clear:function(event){
    console.info(event);
    wx.clearStorage();
  },
  changeinfo: function () {
    console.info(name);
    var that = this;
    var imgdata = that.data.img;
    if (words=="success") {
      this.setData({
        names: "名称：" + " " + name,
        calories: "卡路里：" + " " + calorie,
        probabilitys: "可信度：" + " " + probability
      })
    } else {
      if (imgdata == null) {
        wx.showModal({
          title: '友情提示',
          content: '亲，您还没有选取图片呢'
        })
      } else {
        if(words!=""&&words!="success"){
          this.setData({
            names:words,
          })
        }else{
          this.setData({
            names: "不着急等待1-2秒再点击",
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
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //console.log( res )
        that.setData({
          img: res.tempFilePaths[0]
        })
        wx.uploadFile({
          url: 'https://www.ouyanglol.com/wxapp/api/baiduDish',
          filePath: res.tempFilePaths[0],
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data;
            var str=JSON.parse(data);
            console.log(str);
            if (str.success) {
              var result = JSON.parse(str.result);
              var userInfo = getApp().globalData.userInfo;
              console.log(result);
              console.log(userInfo)
              name = result.name;
              calorie = result.calorie;
              probability = (result.probability*100).toFixed(2)+"%";
              words = 'success';
              userInfo.imageInfoId = result.imageInfoId;
              wx.request( {  
                url: "https://www.ouyanglol.com/wxapp/api/saveUserInfo",  
                header: {
                  'Content-Type': 'application/json;'
                },
                method: "POST", 
                data:userInfo,
                success: function(res) {
                  console.log(res.data);
                }
              })
            } else{
              wx.showModal({
                title: '来自大队的警告',
                content: '你的图片不得行！',
                showCancel:false
              })
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
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