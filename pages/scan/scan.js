// pages/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  Scan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      success: res => {
        
        console.log(decodeURIComponent(res['result']));
        if (res['result'] === undefined) {
          this.setData({
            showModal: true
          })
          console.log('fail');
          return;
        }
        var path = decodeURIComponent(res['result']);
        var reg1= /deviceID=(\d)+/;
        var reg2=/device_type=[\w|\u4e00-\u9fa5|-]+/;
        var reg3=/device_model=[\w|\u4e00-\u9fa5|-]+/;
        var r1 = path.match(reg1);
        var r2 = path.match(reg2);
        var r3 = path.match(reg3);
        console.log(r1);
        console.log(r2);
        console.log(r3);
        if (r1 === null||r2===null||r3===null) {
          this.setData({
            showModal: true
          })
          return;
        }       
        var id = r1[0].slice(9);
        var type=r2[0].slice(12);
        var model=r3[0].slice(13);
        wx.navigateTo({
          url: '../index/index?deviceID=' + id+'&device_type='+type+'&device_model='+model + '&detail=&phone=&url1=&url2=&url3=&url4=&orderID='
        });
      }
    })
  },
  hideModal: function(){
    this.setData({
      showModal: false
    });
  }
})