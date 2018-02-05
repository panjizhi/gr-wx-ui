const config = require('../../config');
const utils = require('../../util/util');

const app = getApp();

Page({
    data: {
        user: null,
        realName: '',
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

            utils.AsyncRequest('exam/list', { openid: user.openid }, (err, dat) => {
                wx.hideLoading();

                this.setData({
                    papers: err ? [] : dat.map(item => {
                        let paper = item.paper;
                        paper._dispatchId = item._id;

                        return paper;
                    }),
                    ready: true
                });
            });
        });
    },
    addRealName(e) {
        let realName = this.data.realName;
        let msg = '';

        if (!realName) {
            msg = '请输入真实姓名, 保存后不能修改, 请确保信息真实有效'
        }

        if (utils.sizeOfHans(realName) > 4) {
            msg = '请确保名字真实有效, 最多4个汉字, 保存后不能修改';
        }

        if (msg.length > 0) {
            return wx.showModal({
                content: msg,
                showCancel: false
            });
        }

        const self = this;
        const user = self.data.user;

        utils.AsyncRequest('user/add', {
            name: realName,
            openid: user.openid,
            avatar: user.avatarUrl
        }, (err, dat) => {
            self.setData({
                user: {
                    'session_key': user.session_key,
                    'expires_in': user.expires_in,
                    'openid': user.openid,
                    '_id': dat._id,
                    'name': dat.name,
                    'nickName': user.nickName,
                    'gender': user.gender,
                    'language': user.language,
                    'city': user.city,
                    'province': user.province,
                    'country': user.country,
                    'avatarUrl': user.avatarUrl
                }
            });
        });
    },
    inputRealName(e) {
        this.setData({
            realName: e.detail.value.trim()
        });
    }
});
