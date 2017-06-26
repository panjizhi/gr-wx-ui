const config = require('../../config');

const app = getApp();

const typesMap = {
    'choice': '单选题',
    'multiple-choices': '多选题',
    'cloze': '填空题'
};

Page({
    data: {
        paper: null,
        currQuestion: null,
        currIndex: 0,
        user: null,
        typesMap
    },
    onLoad(options) {
        const self = this;

        app.getUserInfo( user => {
            self.setData({
                user
            });

            wx.request({
                url: `${config.requestUrl}/exam/review/${options.id}`,
                dataType: 'json',
                success: res => {
                    let data = res.data || {};
                    let questions = data.questions || [];

                    questions.forEach( item => {
                        item.options = (item.options || []).map( option => {
                            let value = option.charAt(0).toUpperCase();

                            return {
                                value,
                                name: option,
                                checked: value === item.result
                            };
                        });
                    });

                    self.setData({
                        paper: data,
                        currQuestion: questions[self.data.currIndex]
                    });
                }
            });
        });
    },
    nextQuestion() {
        const selfData = this.data;
        const currIndex = selfData.currIndex + 1;
        const currQuestion = selfData.paper.questions[currIndex];

        this.setData({
            currIndex,
            currQuestion
        });
    }
});
