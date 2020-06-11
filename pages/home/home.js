// pages/home/home.js
const app = getApp();
const utils = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID: '',
    userName: '',
    userType: '',
    userAvatar: '',
    current: 0,
    beShow: false,
    show_error_1: false,
    show_error_2: false,
    show_error_3: false,
    isLogin: false,
    showLogin: false,
    is_password: true,
    eye_status: 'browse',
    animation: '',
    error_message: '',
    show_error: false,
    swiperList: [],
    bitMap: [],
    cardCur: 0,
    device: '',
    address: '',
    detail: '',
    phone: '',
    orderID: '',
    device_type: '',
    device_model: '',
    imgList: [],
    showInfo: false,
    showModalErr: false,
    address: '',
    text_err: '',
    _id: '',
    _pass: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    this.setData({
      current: 0
    });
    if (app.globalData.avatar === '') {
      wx.getUserInfo({
        success(res) {
          console.log(res);
        }
      });
    }
    if (app.globalData.loginStatus) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      console.log(app.globalData)
      this.setData({
        userID: app.globalData.id,
        userName: app.globalData.name,
        userType: app.globalData.type,
        isLogin: app.globalData.loginStatus
      });
      if (this.data.userType === '巡检员') {
        wx.request({
          url: 'https://tjsseibm.club/api/mobile/getRepair',
          method: 'GET',
          data: {
            'id': app.globalData.id
          },
          success(res) {
            console.log(res);
            var lis = [];
            for (var i = 0; i < res.data['data'].length; ++i) {
              lis.push({
                'id': res.data['data'][i]['id'],
                'device': res.data['data'][i]['device_id'],
                'address': res.data['data'][i]['address'],
                'detail': res.data['data'][i]['detail'],
                'phone': res.data['data'][i]['phone'],
                'url': res.data['data'][i]['url'].split(' ').filter(Boolean),
                'device_type': res.data['data'][i]['device_type'],
                'device_model': res.data['data'][i]['device_model'],
                'position': res.data['data'][i]['position']
              });
            }
            console.log(lis);
            that.setData({
              swiperList: lis
            });
            wx.hideLoading();
            wx.showToast({
              title: '加载成功'
            });
          },
          fail() {
            wx.hideLoading();
            wx.showToast({
              title: '加载失败',
              image: '../../img/err.png'
            });
          }
        });
      } else {
        console.log(app.globalData.id);
        wx.request({
          url: 'https://tjsseibm.club/api/mobile/getWork',
          method: 'GET',
          data: {
            id: app.globalData.id
          },
          success(res) {
            var lis = [];
            for (var i = 0; i < res.data['data'].length; ++i) {
              lis.push({
                'id': res.data['data'][i]['id'],
                'device': res.data['data'][i]['device_id'],
                'address': res.data['data'][i]['address'],
                'url': res.data['data'][i]['url'].split(' ').filter(Boolean),
                'device_type': res.data['data'][i]['device_type'],
                'device_model': res.data['data'][i]['device_model'],
                'position': res.data['data'][i]['position']
              });
            }
            console.log(lis);
            that.setData({
              swiperList: lis
            });
            wx.hideLoading();
            wx.showToast({
              title: '加载成功'
            });
          },
          fail() {
            wx.hideLoading();
            wx.showToast({
              title: '加载失败'
            });
          }
        })
      }
    } else {
      this.setData({
        isLogin: false,
        userType: '',
        userName: '',
        userID: ''
      });
    }
  },
  onLoad: function (options) {
    var that = this;
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

    //登陆
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
            wx.hideLoading();
            if (app.globalData.type === '巡检员') {
              console.log(app.globalData.id);
              wx.request({
                url: 'https://tjsseibm.club/api/mobile/getRepair',
                method: 'GET',
                data: {
                  'id': app.globalData.id
                },
                success(res) {
                  console.log(res);
                  var lis = [];
                  for (var i = 0; i < res.data['data'].length; ++i) {
                    lis.push({
                      'id': res.data['data'][i]['id'],
                      'device': res.data['data'][i]['device_id'],
                      'address': res.data['data'][i]['address'],
                      'detail': res.data['data'][i]['detail'],
                      'phone': res.data['data'][i]['phone'],
                      'url': res.data['data'][i]['url'].split(' ').filter(Boolean),
                      'device_type': res.data['data'][i]['device_type'],
                      'device_model': res.data['data'][i]['device_model'],
                      'position': res.data['data'][i]['position']
                    });
                  }
                  console.log(lis);
                  that.setData({
                    swiperList: lis
                  });
                  wx.hideLoading();
                }
              });
            } else {
              wx.request({
                url: 'https://tjsseibm.club/api/mobile/getWork',
                method: 'GET',
                data: {
                  'id': app.globalData.id
                },
                success(res) {
                  console.log(res);
                  wx.hideLoading();
                  var lis = [];
                  for (var i = 0; i < res.data['data'].length; ++i) {
                    lis.push({
                      'id': res.data['data'][i]['id'],
                      'device': res.data['data'][i]['device_id'],
                      'address': res.data['data'][i]['address'],
                      'url': [res.data['data'][i]['url']],
                      'device_type': res.data['data'][i]['device_type'],
                      'device_model': res.data['data'][i]['device_model'],
                      'position': res.data['data'][i]['position']
                    });
                  }
                  that.setData({
                    swiperList: lis
                  });
                },
                fail() {
                  wx.hideLoading();
                  wx.showToast({
                    title: '加载失败',
                    image: '../../img/err.png'
                  });
                }

              });
            }
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '账号密码错误',
              image: '../../img/err.png'
            });
            this.setData({
              userName: '路人',
              isLogin: app.globalData.loginStatus
            });
          }
        },
        fail() {
          wx.hideLoading();
          wx.showToast({
            title: '登陆失败',
            image: '../../img/err.png'
          });
          this.setData({
            userName: '路人',
            isLogin: app.globalData.loginStatus
          });
        }
      });
    }

  },
  login: function () {
    this.setData({
      showLogin: true,
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
  hideLogin: function () {
    this.setData({
      showLogin: false
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
      wx.request({
        url: 'https://tjsseibm.club/api/mobile/login',
        method: 'POST',
        data: {
          count_id: e.detail.value['id'],
          password: pass
        },
        success(res) {
          console.log(res);
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
            if (app.globalData.type === '巡检员') {
              console.log(app.globalData.id);
              wx.request({
                url: 'https://tjsseibm.club/api/mobile/getRepair',
                method: 'GET',
                data: {
                  'id': app.globalData.id
                },
                success(res) {
                  console.log(res);
                  var lis = [];
                  for (var i = 0; i < res.data['data'].length; ++i) {
                    lis.push({
                      'id': res.data['data'][i]['id'],
                      'device': res.data['data'][i]['device_id'],
                      'address': res.data['data'][i]['address'],
                      'detail': res.data['data'][i]['detail'],
                      'phone': res.data['data'][i]['phone'],
                      'url': res.data['data'][i]['url'].split(' ').filter(Boolean),
                      'device_type': res.data['data'][i]['device_type'],
                      'device_model': res.data['data'][i]['device_model'],
                      'position': res.data['data'][i]['position']
                    });
                  }
                  console.log(lis);
                  that.setData({
                    swiperList: lis
                  });
                  wx.hideLoading();
                  wx.showToast({
                    title: '登陆成功'
                  });
                }
              });
            } else {
              wx.request({
                url: 'https://tjsseibm.club/api/mobile/getWork',
                method: 'GET',
                data: {
                  'id': app.globalData.id.toString()
                },
                success(res) {
                  console.log(res);
                  var lis = [];
                  for (var i = 0; i < res.data['data'].length; ++i) {
                    lis.push({
                      'id': res.data['data'][i]['id'],
                      'device': res.data['data'][i]['device_id'],
                      'address': res.data['data'][i]['address'],
                      'url': [res.data['data'][i]['url']],
                      'device_type': res.data['data'][i]['device_type'],
                      'device_model': res.data['data'][i]['device_model'],
                      'position': res.data['data'][i]['position']
                    });
                  }
                  that.setData({
                    swiperList: lis
                  });
                  wx.hideLoading();
                }
              });
            }
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
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  showInformation: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    that.setData({
      imgList: [],
      bitMap: [],
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var bit = [];
    for (var i = 0; i < this.data.swiperList[id]['url'].length; ++i) {
      bit.push(0);
    }
    that.setData({
      bitMap: bit
    });
    for (var i = 0; i < this.data.swiperList[id]['url'].length; ++i) {
      this.downloadData(id, i, that);
    }
    console.log(this.data.swiperList[id]);
    if (this.data.userType === '巡检员') {
      this.setData({
        device: this.data.swiperList[id]['device'],
        detail: this.data.swiperList[id]['detail'],
        phone: this.data.swiperList[id]['phone'],
        address: this.data.swiperList[id]['address'],
        orderID: this.data.swiperList[id]['id'],
        device_type: this.data.swiperList[id]['device_type'],
        device_model: this.data.swiperList[id]['device_model'],
        showInfo: true
      });
    } else {
      this.setData({
        device: this.data.swiperList[id]['device'],
        address: this.data.swiperList[id]['address'],
        orderID: this.data.swiperList[id]['id'],
        device_type: this.data.swiperList[id]['device_type'],
        device_model: this.data.swiperList[id]['device_model'],
        showInfo: true
      });
    }
  },
  hideInformation: function () {

    this.setData({
      showInfo: false
    })
  },
  ViewImage: function (e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  Edit: function () {
    var that = this;
    var urlPath = String();
    for (var i = 1; i < 5; ++i) {
      if (i - 1 < this.data.imgList.length) {
        urlPath += '&url' + i.toString() + '=' + this.data.imgList[i - 1];
      } else {
        urlPath += '&url' + i.toString() + '=';
      }
    }
    wx.navigateTo({
      url: '../index/index?deviceID=' + this.data.device + '&phone=' + this.data.phone + '&detail=' + this.data.detail +
        urlPath + '&orderID=' + this.data.orderID + '&device_type=' + this.data.device_type + '&device_model=' + this.data.device_model,
      success: function (res) {
        that.hideInformation();
      }

    });
  },
  downloadData: function (id, idx, that) {
    console.log(that.data.swiperList[id]['url'][idx]);
    wx.downloadFile({
      url: that.data.swiperList[id]['url'][idx],
      success(res) {
        var lis = that.data.imgList;
        lis.push(res.tempFilePath);
        var b = that.data.bitMap;
        b[idx] = 1;
        that.setData({
          imgList: lis,
          bitMap: b
        });
        var flag = 1;
        for (var x = 0; x < that.data.bitMap.length; ++x) {
          flag = flag * that.data.bitMap[x];
        }
        if (flag != 0) {
          wx.hideLoading();
        }
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '加载图像失败',
          image: '../../img/err.png'
        });
      }
    });
  },
  Scan: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      success: res => {
        console.log(res);
        if (res['result'] === undefined) {
          this.setData({
            showModalErr: true,
            text_err: '请扫描设备提供的二维吗'
          })
          return;
        }
        var path = decodeURIComponent(res['result']);
        var reg1 = /deviceID=(\d)+/;
        var reg2 = /device_type=[\w|\u4e00-\u9fa5|-]+/;
        var reg3 = /device_model=[\w|\u4e00-\u9fa5|-]+/;
        var r1 = path.match(reg1);
        var r2 = path.match(reg2);
        var r3 = path.match(reg3);
        console.log(r1);
        console.log(r2);
        console.log(r3);
        if (r1 === null || r2 === null || r3 === null) {
          this.setData({
            showModalErr: true,
            text_err: '请扫描器材提供的二维码'
          })
          return;
        }
        var id = r1[0].slice(9);
        var type = r2[0].slice(12);
        var model = r3[0].slice(13);
        var order = '';
        if (that.data.userType === '维修员') {
          var flag = false;
          for (var i = 0; i < that.data.swiperList.length; ++i) {
            if (id === that.data.swiperList[i]['device']) {
              flag = true;
              order = that.data.swiperList[i]['id']
            }
          }
          if (!flag) {
            this.setData({
              showModalErr: true,
              text_err: '请扫描您负责的设备'
            })
            return;
          }
        }

        wx.navigateTo({
          url: '../employee/employee?deviceID=' + id + '&device_type=' + type + '&device_model=' + model + '&orderID=' + order
        });
      }
    });
  },
  turnMap: function () {
    wx.navigateTo({
      url: '../map/map'
    });
  },
  hideModal: function () {
    this.setData({
      showModalErr: false
    });
  },
  Delete: function () {
    var that = this;
    this.setData({
      current: 0
    });
    wx.showLoading({
      title: '删除中',
      mask: true
    });
    console.log(that.data.orderID)
    wx.request({
      url: 'https://tjsseibm.club/api/mobile/delete',
      method: 'POST',
      data: {
        id: that.data.orderID
      },
      success(res) {
        console.log(res);
        that.setData({
          showInfo: false
        });
        if (that.data.userType === '巡检员') {
          if (res.data['data']['result'] == 'success') {
            wx.request({
              url: 'https://tjsseibm.club/api/mobile/getRepair',
              method: 'GET',
              data: {
                'id': app.globalData.id
              },
              success(res) {
                console.log(res);
                var lis = [];
                for (var i = 0; i < res.data['data'].length; ++i) {
                  lis.push({
                    'id': res.data['data'][i]['id'],
                    'device': res.data['data'][i]['device_id'],
                    'address': res.data['data'][i]['address'],
                    'device_type': res.data['data'][i]['device_type'],
                    'device_model': res.data['data'][i]['device_model'],
                    'detail': res.data['data'][i]['detail'],
                    'phone': res.data['data'][i]['phone'],
                    'url': res.data['data'][i]['url'].split(' ').filter(Boolean),
                    'position': res.data['data'][i]['position']
                  });
                }
                console.log(lis);
                if (that.data.cardCur >= lis.length) {

                  that.data.cardCur -= 1;
                }
                that.setData({
                  cardCur: that.data.cardCur,
                  swiperList: lis
                });
                wx.hideLoading();
                wx.showToast({
                  title: '删除成功'
                });
              }
            });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '删除失败',
              image: '../../img/err.png'
            });
          }
        } else {
          if (res.data['data']['result'] == 'success') {
            wx.request({
              url: 'https://tjsseibm.club/api/mobile/getWork',
              method: 'GET',
              data: {
                'id': app.globalData.id
              },
              success(res) {
                console.log(res);
                var lis = [];
                for (var i = 0; i < res.data['data'].length; ++i) {
                  lis.push({
                    'id': res.data['data'][i]['id'],
                    'device': res.data['data'][i]['device_id'],
                    'address': res.data['data'][i]['address'],
                    'device_type': res.data['data'][i]['device_type'],
                    'device_model': res.data['data'][i]['device_model'],
                    'url': res.data['data'][i]['url'].split(' ').filter(Boolean),
                    'position': res.data['data'][i]['position']
                  });
                }
                console.log(lis);
                if (that.data.cardCur >= lis.length) {
                  that.data.cardCur -= 1;
                }
                that.setData({
                  cardCur: that.data.cardCur,
                  swiperList: lis
                });
                wx.hideLoading();
                wx.showToast({
                  title: '删除成功'
                });
              }
            });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '删除失败',
              image: '../../img/err.png'
            });
          }
        }
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '删除失败',
          image: '../../img/err.png'
        })
      }
    })
  }
})