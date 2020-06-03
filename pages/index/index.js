//index.js
//获取应用实例
const app = getApp();
const utils = require('../../utils/md5.js');
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    device: '',
    animation: '',
    userName: '',
    userID: '',
    userType: '',
    show_error_1: false,
    show_error_2: false,
    show_error_3: false,
    show_error_4: false,
    show_error_5: false,
    show_error_6: false,
    beReplaced: false,
    isLogin: false,
    showLogin: false,
    imgList: [],
    index: [],
    index_replace: 0,
    value: [],
    bitMap: [],
    bMap: [],
    picker: [],
    picker_r: [],
    step: 'first',
    detail: '',
    phone: '',
    modalName: '',
    upURL: '',
    is_password: true,
    eye_status: 'browse',
    error_message: '',
    show_error: false,
    phone_init: '',
    detail_init: '',
    orderID: '',
    device_type: '',
    device_model: '',
    result: '',
    _id: '',
    _pass: ''
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },
  //事件处理函数

  onLoad: function (options) {
    var lis = [];
    var that = this;
    for (var i = 1; i < 5; ++i) {
      if (options['url' + i.toString()] != '') {
        lis.push(options['url' + i.toString()]);
      }
    }
    this.setData({
      device: options['deviceID'],
      phone_init: options['phone'],
      detail_init: options['detail'],
      phone: options['phone'],
      detail: options['detail'],
      orderID: options['orderID'],
      device_model: options['device_model'],
      device_type: options['device_type'],
      imgList: lis
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
              if (app.globalData.type === '巡检员') {
                wx.showLoading({
                  title: '加载中'
                });
                console.log(that.data.device_type);
                wx.request({
                  url: 'https://tjsseibm.club/api/mobile/accessory',
                  method: 'GET',
                  data: {
                    id: that.data.device
                  },
                  success(res) {
                    console.log(res);
                    that.setData({
                      picker: res.data['data']
                    });
                    that.data.bMap[0] = 1;
                    that.setData({
                      bMap: that.data.bMap
                    });
                    if (that.data.bMap[0] && that.data.bMap[1]) {
                      wx.hideLoading();
                    }
                  },
                  fail() {
                    wx.showToast({
                      title: '获取配件列表失败',
                      image: '../../img/err.png'
                    })
                  }
                });
                wx.request({
                  url: 'https://tjsseibm.club/api/mobile/deviceModel',
                  method: 'GET',
                  data: {
                    device_type: that.data.device_type
                  },
                  success(res) {
                    console.log(res);
                    that.setData({
                      picker_r: res.data['data']
                    });
                    that.data.bMap[1] = 1;
                    that.setData({
                      bMap: that.data.bMap
                    });
                    if (that.data.bMap[0] && that.data.bMap[1]) {
                      wx.hideLoading();
                    }
                  },
                  fail() {
                    wx.showToast({
                      title: '获取器件列表失败',
                      image: '../../img/err.png'
                    })
                  }
                });
              }
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '账号密码错误',
                image: '../../img/err.png'
              })
            }
          },
          fail() {
            wx.hideLoading();
            wx.showToast({
              title: '因网络原因登陆失败'
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
      if (this.data.userType === '巡检员') {
        wx.showLoading({
          title: '加载中'
        });
        console.log(that.data.device_type);
        wx.request({
          url: 'https://tjsseibm.club/api/mobile/accessory',
          method: 'GET',
          data: {
            id: that.data.device
          },
          success(res) {
            console.log(res);
            that.setData({
              picker: res.data['data']
            });
            that.data.bMap[0] = 1;
            that.setData({
              bMap: that.data.bMap
            });
            if (that.data.bMap[0] && that.data.bMap[1]) {
              wx.hideLoading();
            }
          },
          fail() {
            wx.showToast({
              title: '获取配件列表失败',
              image: '../../img/err.png'
            })
          }
        });
        wx.request({
          url: 'https://tjsseibm.club/api/mobile/deviceModel',
          method: 'GET',
          data: {
            device_type: that.data.device_type
          },
          success(res) {
            console.log(res);
            that.setData({
              picker_r: res.data['data']
            });
            that.data.bMap[1] = 1;
            that.setData({
              bMap: that.data.bMap
            });
            if (that.data.bMap[0] && that.data.bMap[1]) {
              wx.hideLoading();
            }
          },
          fail() {
            wx.showToast({
              title: '获取器件列表失败',
              image: '../../img/err.png'
            })
          }
        });
      }
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
          });

        } else {
          this.setData({
            imgList: res.tempFilePaths,
            bitMap: [0]
          })
        }
        console.log(this.data.bitMap);
      }
    });
    console.log(this.data.imgList);
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
  textareaInput: function (e) {
    this.setData({
      detail: e.detail.value
    });
  },
  formSubmit: function (e) {
    var that = this;
    var flag = false;
    console.log(e.detail.value);
    if (e.detail.value['phone'] === '') {
      that.setData({
        show_error_3: true
      });
      flag = true;
    }
    if (e.detail.value['problem'] === '') {
      that.setData({
        show_error_2: true
      });
      flag = true;
    }
    if (that.data.imgList.length === 0) {
      that.setData({
        show_error_1: true
      });
      flag = true;
    }
    if (e.detail.value['problem_type'] === '' && this.data.userType === '巡检员') {
      that.setData({
        show_error_4: true
      });
      flag = true;
    }
    if (!that.data.beReplaced) {
      for (var i = 0; i < this.data.index.length; ++i) {
        if (!this.data.index[i]) {
          that.setData({
            show_error_5: true
          });
          flag = true;
        }
      }
    } else {
      if (!this.data.index_replace) {
        that.setData({
          show_error_6: true
        });
        flag = true;
      }
    }
    if (flag) {
      if (e.detail.value['phone'] != '') {
        that.setData({
          show_error_3: false
        });
      }
      if (e.detail.value['problem'] != '') {
        that.setData({
          show_error_2: false
        });
      }
      if (e.detail.value['problem_type'] != '') {
        that.setData({
          show_error_4: false
        });
      }
      if (that.data.imgList.length != 0) {
        that.setData({
          show_error_1: false
        });
      }
      var flag2 = true;
      for (var i = 0; i < that.data.index.length; ++i) {
        if (!that.data.index[i]) {
          flag2 = false;
        }
      }
      if (flag2) {
        that.setData({
          show_error_5: false
        });
      }
      if (that.data.index_replace) {
        that.setData({
          show_error_6: false
        })
      }
      that.setData({
        animation: 'shake'
      })
      setTimeout(function () {
        that.setData({
          animation: ''
        })
      }, 1000);
    } else {
      that.setData({
        show_error_1: false,
        show_error_2: false,
        show_error_3: false,
        show_error_4: false,
      });
      wx.showLoading({
        title: '上传中',
        mask: true
      })
      var detail_old = that.data.detail;
      if (that.data.userType === '巡检员') {
        if (that.data.beReplaced) {
          if (that.data.index_replace) {
            that.data.detail += String.fromCharCode(30);
            that.data.detail += that.data.picker_r[that.data.index_replace];
            that.setData({
              detail: that.data.detail
            });
          }
        } else {
          that.data.detail += String.fromCharCode(30);
          for (var i = 0; i < that.data.index.length; ++i) {
            that.data.detail += that.data.picker[that.data.index[i]] + ':' + that.data.value[i];
          }
          that.setData({
            detail: that.data.detail
          });
        }
      }
      console.log(that.data.detail);
      for (var i = 0; i < that.data.imgList.length; ++i) {
        this.Upload(that, i, e, detail_old);
      }

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
  login: function () {
    this.setData({
      _id: '',
      _pass: '',
      show_error: false,
      showLogin: true
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
            if (app.globalData.type === '巡检员') {
              wx.showLoading({
                title: '加载中'
              });
              console.log(that.data.device_type);
              wx.request({
                url: 'https://tjsseibm.club/api/mobile/accessory',
                method: 'GET',
                data: {
                  id: that.data.device
                },
                success(res) {
                  console.log(res);
                  that.setData({
                    picker: res.data['data']
                  });
                  that.data.bMap[0] = 1;
                  that.setData({
                    bMap: that.data.bMap
                  });
                  if (that.data.bMap[0] && that.data.bMap[1]) {
                    wx.hideLoading();
                  }
                }
              });
              wx.request({
                url: 'https://tjsseibm.club/api/mobile/deviceModel',
                method: 'GET',
                data: {
                  device_type: that.data.device_type
                },
                success(res) {
                  console.log(res);
                  that.setData({
                    picker_r: res.data['data']
                  });
                  that.data.bMap[1] = 1;
                  that.setData({
                    bMap: that.data.bMap
                  });
                  if (that.data.bMap[0] && that.data.bMap[1]) {
                    wx.hideLoading();
                  }
                }
              });
            }
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
  nextStep: function () {
    var flag = false;
    var that = this;
    if (that.data.phone === '') {
      that.setData({
        show_error_3: true
      });
      flag = true;
    }
    if (that.data.detail === '') {
      that.setData({
        show_error_2: true
      });
      flag = true;
    }
    if (that.data.imgList.length === 0) {
      that.setData({
        show_error_1: true
      });
      flag = true;
    }
    if (flag) {
      if (that.data.phone != '') {
        that.setData({
          show_error_3: false
        });
      }
      if (that.data.detail != '') {
        that.setData({
          show_error_2: false
        });
      }
      if (that.data.imgList.length != 0) {
        that.setData({
          show_error_1: false
        });
      }
      that.setData({
        animation: 'shake'
      })
      setTimeout(function () {
        that.setData({
          animation: ''
        })
      }, 1000);
    } else {
      that.setData({
        show_error_1: false,
        show_error_2: false,
        show_error_3: false
      });
      that.setData({
        page: true,
        step: 'second'
      });
    }
  },
  prevStep: function () {
    this.setData({
      page: false,
      step: 'first'
    });
  },
  addAcc: function () {
    var idxList = this.data.index;
    var valList = this.data.value;
    idxList.push(0);
    valList.push('1');
    this.setData({
      index: idxList,
      value: valList
    });
  },
  phoneNumber: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  PickerChange: function (e) {
    var id = e.currentTarget.dataset.id;
    var idxList = this.data.index;
    idxList[id] = e.detail.value;
    console.log(idxList);
    this.setData({
      index: idxList
    });
  },
  PickerChange2: function (e) {
    console.log(e.detail.value);
    this.setData({
      index_replace: e.detail.value
    });
  },
  inputNumber: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var valList = this.data.value;
    valList[id] = e.detail.value;
    that.setData({
      value: valList
    });
    console.log(valList);
  },
  delPicker: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var valList = that.data.value;
    var idxList = that.data.index;
    console.log(id);
    valList.splice(id, 1);
    idxList.splice(id, 1);
    that.setData({
      value: valList,
      index: idxList
    });
  },
  goHome: function () {
    wx.switchTab({
      url: '../home/home'
    });
    var pages = getCurrentPages();
    console.log(pages.length);
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
  switchChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      beReplaced: e.detail.value
    });
  },
  Upload: function (that, idx, e, detail_old) {
    wx.uploadFile({
      url: 'https://sm.ms/api/upload',
      filePath: that.data.imgList[idx],
      name: 'smfile',
      success: res => {
        console.log(res);
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
          var url = (that.data.orderID === '') ? 'https://tjsseibm.club/api/mobile/postrepairOrder' : 'https://tjsseibm.club/api/mobile/putrepairOrder';
          wx.request({
            url: url,
            method: 'POST',
            data: {
              deviceID: that.data.device,
              imgurl: that.data.upURL,
              detail: that.data.detail,
              phone: that.data.phone,
              problem_type: (that.data.userType === '巡检员') ? e.detail.value['problem_type'] : '0000',
              status: (that.data.userType === '巡检员') ? 1 : 0,
              id: (that.data.orderID === '') ? '0000' : that.data.orderID
            },
            success(res) {
              console.log(res);
              wx.hideLoading();
              if (res.data['data'] === 'success') {
                that.setData({
                  step: 'third',
                  result: '报修成功，感谢您的帮助'
                });
              } else if (res.data['data'] === 'fail2') {
                that.setData({
                  step: 'third',
                  result: '感谢您的协助，该器材已经被报修过了'
                })
              } else {
                wx.showToast({
                  title: '上传失败',
                  image: '../../img/err.png'
                });
                that.setData({
                  detail: detail_old
                });
              }
            },
            fail() {
              wx.hideLoading();
              wx.showToast({
                title: '上传失败',
                image: '../../img/err.png'
              });
              that.setData({
                detail: detail_old
              });
            }
          })
        }
      }
    });
  }
})