const config = require('config');
const utils = require('util/util');

App({
    globalData: {
        code: '',
        userInfo: null
    },
    onLaunch() {
        console.log('Launch App');
    },
    onShow() {
        console.log('Display App');
    },
    onHide() {
        console.log('Hide App');
    },
    getUserInfo(callback) {
        callback = callback || function () {};

        if ( typeof callback !== 'function' ) {
            return false;
        }

        let globalData = this.globalData;
        let userInfo = globalData.userInfo || {};

        if ( userInfo.openid ) {
            return callback(userInfo);
        }

        wx.login({
            success: res => {
                globalData.code = res.code;

                wx.request({
                    url: `${config.requestUrl}/user/session`,
                    method: 'POST',
                    data: {
                        code: res.code
                    },
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
