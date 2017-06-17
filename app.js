const config = require('config');
const utils = require('util/util');

App({
    onLaunch() {
        console.log('Launch App');
    },
    onShow() {
        console.log('Display App');
    },
    onHide() {
        console.log('Hide App');
    },
    globalData: {
        code: '',
        userInfo: null
    },
    getUserInfo(callback) {
        callback = callback || function () {};

        if ( typeof callback !== 'function' ) {
            return false;
        }

        let globalData = this.globalData;
        let userInfo = globalData.userInfo || {};

        if ( userInfo.id ) {
            return callback(userInfo);
        }

        wx.login({
            success: res => {
                globalData.code = res.code;

                wx.request({
                    url: `${config.requestUrl}/code2session/${res.code}`,
                    dataType: 'json',
                    success: session => {
                        session.data.openid && wx.getUserInfo({
                            success: res => {
                                globalData.userInfo = utils.assign(session.data, res.userInfo);
                                return callback(globalData.userInfo);
                            }
                        });
                    }
                });
            }
        });
    }
})
