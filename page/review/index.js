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

                    questions.forEach( item => {
                        let errorOptions = errors[item._id] ? errors[item._id].split(',') : [];
                        let isCorrect = errorOptions.length === 0;
                        let correctOptions = item.result.split(',');

                        item.options = (item.options || []).map( option => {
                            let value = option.charAt(0).toUpperCase();
                            let correct = isCorrect && correctOptions.indexOf(value) > -1;
                            let error = errorOptions.indexOf(value) > -1;

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
