const config = require('../../config');
const utils = require('../../util/util');

const app = getApp();

Page({
    data: {
        user: {},
        realName: '',
        papers: [],
        ready: false
    },
    onLoad() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });

        app.getUserInfo( user => {
            this.setData({
                user
            });

            wx.request({
                url: `${config.requestUrl}/exam`,
                dataType: 'json',
                success: res => {
                    wx.hideLoading();

                    this.setData({
                        papers: res.data.collections || [],
                        ready: true
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
            return wx.showModal({
                content: msg,
                showCancel: false
            });
        }

        const self = this;

        wx.request({
            url: `${config.requestUrl}/user/add`,
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            data: {
                name: self.data.realName,
                wxid: self.data.user.openid,
                weixin: self.data.user.nickName
            },
            success(res){
                const user = self.data.user;
                const data = res.data || {};
                self.setData({
                    user: {
                        'session_key': user.session_key,
                        'expires_in': user.expires_in,
                        'openid': user.openid,
                        '_id': data._id,
                        'weixin': data.weixin,
                        'name': data.name,
                        'nickName': user.nickName,
                        'gender': user.gender,
                        'language': user.language,
                        'city': user.city,
                        'province': user.province,
                        'country': user.country,
                        'avatarUrl': user.avatarUrl
                    }
                });
            }
        });
    },
    inputRealName(e) {
        this.setData({
            realName: e.detail.value.trim()
        });
    }
});
