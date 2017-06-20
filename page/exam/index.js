const config = require('../../config');

const app = getApp();

Page({
    data: {
        user: null,
        currIndex: 0,
        currQuestion: null,
        answerText: '',
        paper: null,
        result: [],
        typesMap: {
            'choice': '单选题',
            'multiple-choices': '多选题',
            'cloze': '填空题'
        }
    },
    onLoad(options) {
        const self = this;

        app.getUserInfo( user => {
            self.setData({
                user
            });

            wx.request({
                url: `${config.requestUrl}/exam/detail/${options.id}`,
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
                        currQuestion: questions[self.data.currIndex]
                    });
                }
            });
        });
    },
    radioChange(e) {
        const value = e.detail.value;
        this.updateQuestion([value]);

        let result = this.data.result;
        result.push({
            id: this.data.currQuestion._id,
            answer: value
        });
        this.setData({
            result
        });

        this.nextQuestion();
    },
    checkboxChange(e) {
        this.updateQuestion(e.detail.value || []);
    },
    updateQuestion(values) {
        let question = this.data.currQuestion;

        for ( let i = 0, lenI = question.options.length; i < lenI; i++ ) {
            let option = question.options[i];
            option.checked = false;

            for ( let j = 0, lenJ = values.length; j < lenJ; j++ ) {
                if ( option.value === values[j] ) {
                    option.checked = true;
                    break;
                }
            }
        }

        this.setData({
            currQuestion: question
        });
    },
    submitChoices(e) {
        const question = this.data.currQuestion;
        const values = question.options.reduce( (ret, item) => {
            if ( item.checked ) {
                ret.push(item.value);
            }

            return ret;
        }, []);

        let result = this.data.result;
        result.push({
            id: question._id,
            answer: values.join(',')
        });

        this.setData({
            result
        });

        this.nextQuestion();
    },
    submitAnswerText(e) {
        let result = this.data.result;
        result.push({
            id: this.data.currQuestion._id,
            answer: this.data.answerText
        });

        this.setData({
            result,
            answerText: ''
        });

        this.nextQuestion();
    },
    inputAnswerText(e) {
        this.setData({
            answerText: e.detail.value.trim()
        });
    },
    nextQuestion() {
        const currIndex = this.data.currIndex + 1;
        const currQuestion = this.data.paper.questions[currIndex];

        this.setData({
            currIndex,
            currQuestion
        });
    }
});
