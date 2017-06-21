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
                url: `${config.requestUrl}/exam/list/${user.openid}`,
                dataType: 'json',
                success: res => {
                    wx.hideLoading();

                    let papers = (res.data || []).map(item => {
                        let paper = item.paper;
                        paper._dispatchId = item._id;
                        paper.isDone = item.isDone;

                        return paper;
                    });

                    self.setData({
                        papers: papers.filter( paper => paper.isDone ),
                        ready: true
                    });
                }
            });
        });
    }
});
