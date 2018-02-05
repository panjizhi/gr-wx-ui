const config = require('../../config');
const utils = require('../../util/util.js');
const moment = require('../../util/moment.min');

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
        app.getUserInfo(user => {
            this.setData({
                user
            });

            utils.AsyncRequest('exam/accomplish', { openid: user.openid }, (err, dat) => {
                wx.hideLoading();

                if (err) {
                    return;
                }

                const defaultTimestamp = moment('2000-01-01 00:00:00').unix();
                dat.forEach((ins) => {
                    ins.begin_time = moment.unix(ins.begin_time).format('YYYY-MM-DD HH:mm:ss');
                    ins.duration = moment.unix(defaultTimestamp + ins.duration).format('HH:mm:ss');
                });

                this.setData({
                    papers: dat || [],
                    ready: true
                });
            });
        });
    }
});
