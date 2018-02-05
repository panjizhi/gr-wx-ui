const config = require('config');
const utils = require('util/util');

App({
    globalData: {
        userInfo: null
    },
    getUserInfo(callback) {
        callback = callback || function () { };

        if (typeof callback !== 'function') {
            return;
        }

        let globalData = this.globalData;
        let userInfo = globalData.userInfo || {};

        if (userInfo.name) {
            return callback(userInfo);
        }

        wx.login({
            success: res => {
                const code = res.code;
                utils.AsyncRequest('user/session', { code }, (err, dat) => {
                    if (err) {
                        return;
                    }

                    wx.getUserInfo({
                        success: infos => {
                            globalData.userInfo = utils.assign(dat, infos.userInfo);
                            return callback(globalData.userInfo);
                        }
                    });
                });
            }
        });
    }
})
