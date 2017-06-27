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
                        let errOptions = errors[item._id] ? errors[item._id].split(',') : [];

                        item.options = (item.options || []).map( option => {
                            let value = option.charAt(0).toUpperCase();
                            let isAnswer = value === item.result;
                            let isErrAnswer = errOptions.indexOf(value) !== -1;

                            return {
                                value,
                                name: option,
                                checked: isAnswer || isErrAnswer,
                                style: isErrAnswer ? 'color:#f00;' : ( isAnswer ? 'color:#1aad19;' : '' )
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
        if ( selfData.currIndex === selfData.paper.questions.length - 1 ) {
            return;
        }
        
        const currIndex = selfData.currIndex + 1;
        const currQuestion = selfData.paper.questions[currIndex];

        this.setData({
            currIndex,
            currQuestion
        });
    }
});
