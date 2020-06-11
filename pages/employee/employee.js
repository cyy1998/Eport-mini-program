// pages/employee/employee.
var app = getApp();
const utils = require('../../utils/md5.js');
var date = new Date();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    device: '',
    device_type: '',
    device_model: '',
    animation: '',
    userName: '',
    userID: '',
    userType: '',
    upURL: '',
    isLogin: false,
    showLogin: false,
    imgList: [],
    bitMap: [],
    picker: ['损坏', '正常'],
    modalName: '',
    is_password: true,
    eye_status: 'browse',
    error_message: '',
    show_error_1: false,
    show_error_2: false,
    pickerStatus: 0,
    step: 'first',
    orderID: '',
    _id: '',
    _pass: '',
    animation: ''
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      device: options['deviceID'],
      device_type: options['device_type'],
      device_model: options['device_model'],
      orderID: options['orderID']
    });
    if (!app.globalData.loginStatus) {
      var _id = wx.getStorageSync('id');
      if (_id) {
        app.globalData.id = _id;
      }
      var _name = wx.getStorageSync('name');
      if (_name) {
        app.globalData.name = _name;
      }
      var _type = wx.getStorageSync('type');
      if (_type) {
        app.globalData.type = _type;
      }
      var _count_id = wx.getStorageSync('count_id');
      var _pass = wx.getStorageSync('password');
      if (app.globalData.id != '') {
        wx.showLoading({
          title: '登陆中',
          mask: true
        });
        wx.request({
          url: 'https://tjsseibm.club/api/mobile/login',
          method: 'POST',
          data: {
            count_id: _count_id,
            password: _pass
          },
          success(res) {
            if (res.data['data']['id'] != null) {
              wx.hideLoading();
              app.globalData.name = res.data['data']['name'];
              app.globalData.id = res.data['data']['id'];
              app.globalData.type = res.data['data']['type'];
              app.globalData.loginStatus = true;
              that.setData({
                show_error: false,
                showLogin: false,
                isLogin: true,
                userName: app.globalData.name,
                userID: app.globalData.id,
                userType: app.globalData.type
              });

            } else {
              wx.hideLoading();
              wx.showToast({
                title: '登陆失败',
                image: '../../img/err.png'
              });
            }
          },
          fail() {
            wx.hideLoading();
            wx.showToast({
              title: '因网络原因登陆失败',
              image: '../../img/err.png'
            })
          }
        });
      } else {
        console.log('路人');
        this.setData({
          userName: '路人',
          isLogin: app.globalData.loginStatus
        });

      }
    } else {
      this.setData({
        userID: app.globalData.id,
        userName: app.globalData.name,
        userType: app.globalData.type,
        isLogin: app.globalData.loginStatus
      });
    }
  },
  showModal: function () {
    this.setData({
      modalName: 'DrawerModal'
    });
  },
  hideModal: function () {
    this.setData({
      modalName: ''
    });
  },
  goHome: function () {
    wx.switchTab({
      url: '../home/home'
    });
    var pages = getCurrentPages();
    console.log(pages.length);
  },
  login: function () {
    this.setData({
      showLogin: true
    });
  },
  hideLogin: function () {
    this.setData({
      showLogin: false,
      show_error: false,
      _id: '',
      _pass: ''
    });
  },
  quit: function () {
    app.globalData.loginStatus = false;
    app.globalData.name = '';
    app.globalData.id = '';
    app.globalData.type = '';
    this.setData({
      isLogin: false,
      userName: '路人',
      userID: '',
      userType: '',
      step: 'first'
    });
    wx.setStorage({
      key: 'id',
      data: ''
    });
    wx.setStorage({
      key: 'name',
      data: ''
    });
    wx.setStorage({
      key: 'type',
      data: ''
    });
  },
  formSubmit_lo: function (e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value['id'] === '') {
      that.setData({
        animation: 'shake',
        error_message: '用户名不能为空',
        show_error: true
      });
      setTimeout(function () {
        that.setData({
          animation: ''
        })
      }, 1000);
    } else if (e.detail.value['password'] === '') {
      that.setData({
        animation: 'shake',
        error_message: '密码不能为空',
        show_error: true
      });
      setTimeout(function () {
        that.setData({
          animation: ''
        })
      }, 1000);
    } else {
      wx.showLoading({
        title: '登陆中',
        mask: true
      });
      var pass = utils.hex_md5(e.detail.value['password']);
      console.log(e.detail.value['id']);
      wx.request({
        url: 'https://tjsseibm.club/api/mobile/login',
        method: 'POST',
        data: {
          count_id: e.detail.value['id'],
          password: pass
        },
        success(res) {
          if (res.data === "API calls quota exceeded! maximum admitted 2 per Second.") {
            wx.hideLoading();
            wx.showToast({
              title: '登陆过于频繁',
              image: '../../img/err.png'
            });
            return;
          }
          if (res.data['data']['id'] != null) {
            app.globalData.name = res.data['data']['name'];
            app.globalData.id = res.data['data']['id'];
            app.globalData.type = res.data['data']['type'];
            app.globalData.loginStatus = true;
            that.setData({
              show_error: false,
              showLogin: false,
              isLogin: true,
              userName: app.globalData.name,
              userID: app.globalData.id,
              userType: app.globalData.type
            });
            wx.setStorage({
              key: 'id',
              data: app.globalData.id
            });
            wx.setStorage({
              key: 'count_id',
              data: e.detail.value['id']
            });
            wx.setStorage({
              key: 'password',
              data: pass
            });
            wx.setStorage({
              key: 'name',
              data: app.globalData.name
            });
            wx.setStorage({
              key: 'type',
              data: app.globalData.type
            });
            wx.hideLoading();
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '账号密码错误',
              image: '../../img/err.png'
            });
          }

        },
        fail() {
          wx.hideLoading();
          wx.showToast({
            title: '登陆失败',
            image: '../../img/err.png'
          });
        }
      });
    }
  },
  changeStatus: function () {
    if (this.data.is_password) {
      this.setData({
        is_password: false,
        eye_status: "browse_fill"
      });
    } else {
      this.setData({
        is_password: true,
        eye_status: "browse"
      });
    }
  },
  ChooseImage: function () {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths),
            bitMap: this.data.bitMap.concat(0)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths,
            bitMap: [0]
          })
        }
      }
    });
  },
  ViewImage: function (e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });

  },
  DelImg: function (e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.data.bitMap.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList,
      bitMap: this.data.bitMap
    });
  },
  PickerChange: function (e) {
    this.setData({
      pickerStatus: e.detail.value
    });
  },
  nextStep: function (e) {
    var that = this;
    var flag = true;
    if (this.data.imgList.length === 0) {
      this.setData({
        show_error_1: true
      });
      flag = false;
    }
    if (this.data.pickerStatus === 0 && this.data.userType == '巡检员') {
      this.setData({
        show_error_2: true
      });
      flag = false;
    }
    if (flag) {
      wx.showLoading({
        title: '上传中',
        mask: true
      });
      for (var i = 0; i < that.data.imgList.length; ++i) {
        this.Upload(that, i, e);
      }
    } else {
      if (this.data.imgList.length != 0) {
        this.setData({
          show_error_1: false
        });
      }
      if (this.data.pickerStatus != 0) {
        this.setData({
          show_error_2: false
        });
      }
      that.setData({
        animation: 'shake'
      });
      setTimeout(function () {
        that.setData({
          animation: ''
        })
      }, 1000);

    }
  },
  goBack: function () {
    var pages = getCurrentPages();
    if (pages.length == 1) {
      wx.switchTab({
        url: '../scan/scan'
      });
    } else {
      wx.navigateBack();
    }
  },
  Upload: function (that, idx, e) {
    if (that.data.userType == '巡检员') {
      wx.uploadFile({
        url: 'https://sm.ms/api/upload',
        filePath: that.data.imgList[idx],
        name: 'smfile',
        success: res => {
          that.data.upURL += JSON.parse(res.data).data.url + ' ';
          var b = that.data.bitMap;
          b[idx] = 1;
          that.setData({
            upURL: that.data.upURL,
            bitMap: b
          });
          var flag = 1;
          for (var x = 0; x < that.data.bitMap.length; ++x) {
            flag = flag * that.data.bitMap[x];
          }
          if (flag === 1) {
            console.log('success');
            wx.request({
              url: 'https://tjsseibm.club/api/mobile/patrolOrder',
              method: 'POST',
              data: {
                imgurl: that.data.upURL,
                deviceID: that.data.device,
                id: app.globalData.id,
                status: 1,
                time: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
              },
              success(res) {
                console.log(res);
                wx.hideLoading();
                if (res.data['data'] === 'success') {
                  that.setData({
                    step: 'third'
                  });
                } else {
                  wx.showToast({
                    title: '上传失败',
                    image: '../../img/err.png'
                  });
                }
              },
              fail() {
                wx.hideLoading();
                wx.showToast({
                  title: '上传失败',
                  image: '../../img/err.png'
                });
              }
            })
          }
        }
      });
    } else {
      wx.uploadFile({
        url: 'https://sm.ms/api/upload',
        filePath: that.data.imgList[idx],
        name: 'smfile',
        success: res => {
          that.data.upURL += JSON.parse(res.data).data.url + ' ';
          var b = that.data.bitMap;
          b[idx] = 1;
          that.setData({
            upURL: that.data.upURL,
            bitMap: b
          });
          var flag = 1;
          for (var x = 0; x < that.data.bitMap.length; ++x) {
            flag = flag * that.data.bitMap[x];
          }
          if (flag === 1) {
            console.log('success');
            wx.request({
              url: 'https://tjsseibm.club/api/mobile/workOrder',
              method: 'POST',
              data: {
                imgurl: that.data.upURL,
                id: that.data.orderID,
                status: 1,
              },
              success(res) {
                console.log(res);
                wx.hideLoading();
                if (res.data['data'] === 'success') {
                  that.setData({
                    step: 'third'
                  });
                } else {
                  wx.showToast({
                    title: '上传失败',
                    image: '../../img/err.png'
                  });
                }
              },
              fail() {
                wx.hideLoading();
                wx.showToast({
                  title: '上传失败',
                  image: '../../img/err.png'
                })
              }
            })
          }
        }
      });
    }
  }
})