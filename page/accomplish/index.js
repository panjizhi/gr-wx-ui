const config = require('../../config');

const app = getApp();

Page({
    data: {
        ready: false,
        user: {},
        papers: []
    },
    onLoad() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });

        const self = this;

        app.getUserInfo( user => {
            self.setData({
                user
            });

            wx.request({
                url: `${config.requestUrl}/exam/accomplish/${user.openid}`,
                dataType: 'json',
                success: res => {
                    wx.hideLoading();

                    self.setData({
                        papers: res.data || [],
                        ready: true
                    });
                }
            });
        });
    }
});
