const config = require('../../config');

const app = getApp();

Page({
    data: {
        user: null,
        dispatchId: '',
        typesMap: {
            'choice': '单选题',
            'multiple-choices': '多选题',
            'cloze': '填空题'
        },
        currIndex: 0,
        currQuestion: null,
        answerText: '',
        paper: null,
        answers: [],
        result: null
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
                        currQuestion: questions[self.data.currIndex],
                        dispatchId: options.dispatchId
                    });
                }
            });
        });
    },
    changeRadioAnswer(e) {
        let answers = this.data.answers;
        answers.push({
            id: this.data.currQuestion._id,
            answer: e.detail.value
        });
        this.setData({
            answers
        });

        this.nextQuestion();
    },
    changeCheckboxAnswser(e) {
        this.checkQuestionOptions(e.detail.value || []);
    },
    checkQuestionOptions(values) {
        let currQuestion = this.data.currQuestion;

        for ( let i = 0, lenI = currQuestion.options.length; i < lenI; i++ ) {
            let option = currQuestion.options[i];
            option.checked = false;

            for ( let j = 0, lenJ = values.length; j < lenJ; j++ ) {
                if ( option.value === values[j] ) {
                    option.checked = true;
                    break;
                }
            }
        }

        this.setData({
            currQuestion
        });
    },
    submitMultiChoices(e) {
        const question = this.data.currQuestion;
        const values = question.options.reduce( (ret, item) => {
            if ( item.checked ) {
                ret.push(item.value);
            }

            return ret;
        }, []);

        let answers = this.data.answers;
        answers.push({
            id: question._id,
            answer: values.join(',')
        });

        this.setData({
            answers
        });

        this.nextQuestion();
    },
    submitAnswerText(e) {
        let answers = this.data.answers;
        answers.push({
            id: this.data.currQuestion._id,
            answer: this.data.answerText
        });

        this.setData({
            answers,
            answerText: ''
        });

        this.nextQuestion();
    },
    inputAnswerText(e) {
        this.setData({
            answerText: e.detail.value
        });
    },
    nextQuestion() {
        const selfData = this.data;

        if ( selfData.currIndex + 1 === selfData.paper.questions.length ) {
            wx.request({
                url: `${config.requestUrl}/exam/calculate`,
                method: 'POST',
                data: {
                    examId: selfData.paper._id,
                    answers: selfData.answers,
                    dispatchId: selfData.dispatchId,
                    userId: selfData.user._id
                },
                dataType: 'json',
                success: res => {
                    this.setData({
                        result: res.data
                    });
                }
            });

            return true;
        }

        const currIndex = selfData.currIndex + 1;
        const currQuestion = selfData.paper.questions[currIndex];

        this.setData({
            currIndex,
            currQuestion
        });
    }
});
