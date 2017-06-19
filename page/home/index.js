const config = require('../../config');
const utils = require('../../util/util');

const app = getApp();

Page({
    data: {
        user: {},
        realName: '',
        papers: []
    },
    onLoad() {
        app.getUserInfo( user => {
            this.setData({
                user
            });

            wx.request({
                url: `${config.requestUrl}/exam`,
                dataType: 'json',
                success: res => {
                    this.setData({
                        papers: res.data.collections || []
                    });
                }
            });
        });
    },
    addRealName(e) {
        let msg = '';

        if ( !this.data.realName ) {
            msg = '请输入真实姓名, 只需输一次, 务必确保信息有效.'
        }

        if ( utils.sizeOfHans(this.data.realName) > 4 ) {
            msg = '请确保名字真实有效, 最多4个汉子, 后期无法修改';
        }

        if ( msg.length > 0 ) {
            wx.showModal({
                content: msg,
                showCancel: false
            });
        }


    },
    inputRealName(e) {
        this.setData({
            realName: e.detail.value.trim()
        });
    }
});
