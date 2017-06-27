const config = require('../../config');
const typesMap = config.questionTypes;

const app = getApp();

Page({
    data: {
        typesMap,
        paper: null,
        currQuestion: null,
        currIndex: 0,
        user: null,
        errors: {}
    },
    onLoad(options) {
        const self = this;

        try {
            let errors = JSON.parse(options.errJSON) || [];

            self.setData({
                errors: errors.reduce((result, item, index) => {
                    result[item.id] = item.answer;
                    return result;
                }, {})
            });
        } catch (e) {}

        app.getUserInfo( user => {
            self.setData({
                user
            });

            wx.request({
                url: `${config.requestUrl}/exam/review/${options.id}`,
                dataType: 'json',
                success: res => {
                    const data = res.data || {};
                    const questions = data.questions || [];
                    const errors = self.data.errors || {};

                    questions.forEach( item => {
                        item.options = (item.options || []).map( option => {
                            let value = option.charAt(0).toUpperCase();
                            let isErrAnswer = value === errors[item._id];

                            return {
                                value,
                                name: option,
                                checked: value === item.result || isErrAnswer,
                                style: isErrAnswer ? 'color:#f00;' : ''
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
