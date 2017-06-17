const config = require('../../config');

const app = getApp();

Page({
    data: {
        user: null,
        list: []
    },
    onLoad() {
        app.getUserInfo( user => {
            this.setData({
                user
            });
        });

        wx.request({
            url: `${config.requestUrl}/exam`,
            dataType: 'json',
            success: res => {
                this.setData({
                    list: res.data.collections
                });
            }
        })
    }
});
