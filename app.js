const openIdUrl = require('./config').openIdUrl

App({
    onLaunch() {
        console.log('Launch App');
    },
    onShow() {
        console.log('Display App');
    },
    onHide() {
        console.log('Hide App');
    },
    globalData: {
        code: '',
        user: null
    },
    getUserInfo(cb) {
        if ( typeof cb !== 'function' ) {
            return false;
        }

        if ( this.globalData.user !== null ) {
            cb(this.globalData.user);
            return true;
        }

        wx.login({
            success: res => {
                this.globalData.code = res.code;

                wx.getUserInfo({
                    success: res => {
                        this.globalData.user = res.userInfo;
                        cb(res.userInfo);
                    }
                })
            }
        });
    }
})