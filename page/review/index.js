const config = require('../../config');

const app = getApp();

Page({
    data: {
        user: null,
        typesMap: config.questionTypes,
        paper: null,
        errors: null
    },
    onLoad(options) {
        const self = this;

        try {
            let errJSON = JSON.parse(options.errJSON) || [];

            self.setData({
                errors: errJSON.reduce((result, item, index) => {
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

                    questions.forEach( question => {
                        const qid = question._id;
                        const options = {
                            correct: question.answer.split(',').map( value => value.trim()),
                            error: typeof errors[qid] !== 'undefined'
                                ? errors[qid].split(',').map( value => value.trim())
                                : []
                        };                        
                        const isCorrect = options.error.length === 0;

                        question.options = (question.options || []).map( option => {
                            let value = option.charAt(0).toUpperCase();
                            let correct = isCorrect && options.correct.indexOf(value) > -1;
                            let error = options.error.indexOf(value) > -1;

                            return {
                                value,
                                name: option,
                                checked: correct || error,
                                style: error ? 'color:#f00;' : ( correct ? 'color:#1aad19;' : '' )
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
    }
});
