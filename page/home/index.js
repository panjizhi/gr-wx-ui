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

                    self.setData({
                        papers: (res.data || []).map( item => item.paper ),
                        ready: true
                    });
                }
            });
        });
    },
    addRealName(e) {
        let realName = this.data.realName;
        let msg = '';

        if ( !realName ) {
            msg = '请输入真实姓名, 只需输一次, 务必确保信息有效.'
        }

        if ( utils.sizeOfHans(realName) > 4 ) {
            msg = '请确保名字真实有效, 最多4个汉子, 后期无法修改';
        }

        if ( msg.length > 0 ) {
            return wx.showModal({
                content: msg,
                showCancel: false
            });
        }

        const self = this;
        const user = self.data.user;

        wx.request({
            url: `${config.requestUrl}/user/add`,
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            data: {
                name: realName,
                openid: user.openid,
                avatarUrl: user.avatarUrl
            },
            success(res){
                const data = res.data || {};

                self.setData({
                    user: {
                        'session_key': user.session_key,
                        'expires_in': user.expires_in,
                        'openid': user.openid,
                        '_id': data._id,
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
