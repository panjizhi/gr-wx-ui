const config = require('../../config');
const util   = require('../../util/util');

const app = getApp();

Page({
    data: {
        user: null,
        dispatchId: '',
        typesMap: config.questionTypes,
        currIndex: 0,
        currQuestion: null,
        answerText: '',
        paper: null,
        answers: {}, // 考生答案
        result: null // 测试结果
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

                    questions.forEach( item => { // 初始化选项状态
                        item.options = (item.options || []).map( option => {
                            return {
                                value: option.charAt(0).toUpperCase(),
                                name: option,
                                checked: false
                            };
                        });
                    });

                    data.questions = util.shuffle(questions); // 打乱考题顺序

                    self.setData({
                        paper: data,
                        currQuestion: questions[self.data.currIndex],
                        dispatchId: options.dispatchId
                    });
                }
            });
        });
    },
    addResult(answer) {
        let answers = this.data.answers || {};
        let id = this.data.currQuestion._id;

        answers[id] = {
            id,
            answer
        };

        this.setData({
            answers
        });
    },
    radioChange(e) {
        this.addResult(e.detail.value);
        this.nextQuestion();
    },
    checkboxStatusUpdate(e) {
        let checkedValues = e.detail.value || [];
        let currQuestion = this.data.currQuestion;

        for ( let i = 0, lenI = currQuestion.options.length; i < lenI; i++ ) {
            let option = currQuestion.options[i];
            option.checked = false;

            for ( let j = 0, lenJ = checkedValues.length; j < lenJ; j++ ) {
                if ( option.value === checkedValues[j] ) {
                    option.checked = true;
                    break;
                }
            }
        }

        this.setData({
            currQuestion
        });
    },
    checkboxSubmit(e) {
        const checkedValues = this.data.currQuestion.options.reduce( (ret, item) => {
            if ( item.checked ) {
                ret.push(item.value);
            }

            return ret;
        }, []);

        this.addResult(checkedValues.join(',')); // 多选结果逗号分隔
        this.nextQuestion();
    },
    clozeTextInput(e) {
        this.setData({
            answerText: e.detail.value.trim()
        });
    },
    clozeTextSubmit(e) {
        this.addResult(this.data.answerText);
        this.setData({
            answerText: ''
        });
        this.nextQuestion();
    },
    nextQuestion() {
        const questions = this.data.paper.questions;
        const nextIndex = this.data.currIndex + 1;

        if ( nextIndex === questions.length ) { // 最后一道考题
            return wx.request({
                url: `${config.requestUrl}/exam/calculate`,
                method: 'POST',
                data: {
                    examId: this.data.paper._id,
                    answers: this.data.answers,
                    dispatchId: this.data.dispatchId,
                    userId: this.data.user._id
                },
                dataType: 'json',
                success: res => {
                    this.setData({
                        result: res.data
                    });
                }
            });
        }

        this.setData({ // 转到下一题
            currIndex: nextIndex,
            currQuestion: questions[nextIndex]
        });
    }
});
