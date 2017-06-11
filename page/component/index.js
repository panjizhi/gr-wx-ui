const app = getApp();

Page({
    data: {
        user: null,
        list: []
    },
    onLoad() {
        app.getUserInfo( user => {
            this.setData({
                user: user
            });
        });

        wx.request({
            url: 'https://jizhi.work/api/exam',
            dataType: 'json',
            success: res => {
                this.setData({
                    list: res.data.collections
                });
            }
        })
    }
});