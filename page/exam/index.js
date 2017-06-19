const config = require('../../config');

const app = getApp();

Page({
    data: {
        user: null,
        currentIndex: 0,
        currentQeustion: null,
        paper: null,
        result: []
    },
    onLoad(options) {
        const self = this;

        app.getUserInfo( user => {
            self.setData({
                user
            });

            wx.request({
                url: `${config.requestUrl}/exam/${options.id}`,
                dataType: 'json',
                success: res => {
                    let data = res.data || {};
                    let questions = data.questions || [];

                    questions.forEach( item => {
                        item.options = (item.options || []).map( option => {
                            return {
                                value: option.charAt(0).toUpperCase(),
                                name: option,
                                checked: false
                            };
                        });
                    });

                    self.setData({
                        paper: data,
                        currentQeustion: questions[self.data.currentIndex]
                    });
                }
            });
        });
    },
    radioChange(e) {
        const selfData = this.data;
        const currentIndex = selfData.currentIndex + 1;
        const currentQeustion = selfData.paper.questions[currentIndex];

        let result = selfData.result;
        result.push(e.detail.value);

        this.setData({
            currentIndex,
            currentQeustion,
            result
        });
    }
});
