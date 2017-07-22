const config = require('../../config');

const app = getApp();

Page({
    data: {
        user: null,
        papers: [],
        ready: false
    },
    onShow() {
        this.updateData();
    },
    onLoad() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });

        this.updateData();
    },
    updateData() {
        app.getUserInfo( user => {
            this.setData({
                user
            });

            wx.request({
                url: `${config.requestUrl}/exam/accomplish/${user.openid}`,
                dataType: 'json',
                success: res => {
                    wx.hideLoading();

                    this.setData({
                        papers: res.data || [],
                        ready: true
                    });
                }
            });
        });        
    }
});
