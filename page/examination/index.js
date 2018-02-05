const config = require('../../config');
const util = require('../../util/util');

const app = getApp();

Page({
    data: {
        user: null,
        dispatchId: '',
        typesMap: config.questionTypes,
        currIndex: 0,
        currQuestion: null,
        paper: null,
        answers: {}, // 考生答案
        result: null // 测试结果
    },
    onLoad(options) {
        const self = this;

        app.getUserInfo(user => {
            self.setData({
                user
            });

            util.AsyncRequest('exam/detail', { id: options.id }, (err, dat) => {
                if (err) {
                    return;
                }

                let data = dat || {};
                let questions = data.questions || [];

                questions.forEach(item => { // 初始化选项状态
                    if (!item.content) {
                        return true;
                    }

                    const dict = [
                        ins => {
                            if (ins.options) {
                                ins.options.forEach((option, i) => {
                                    option.index = i;
                                });
                                util.shuffle(ins.options);

                                ins.options.forEach((option, i) => {
                                    option.sign = String.fromCharCode(i + 65);
                                });
                            }
                            else {
                                ins.options = [];
                            }

                        },
                        ins => {
                            const blanks = [];
                            for (let i = 0, l = ins.count; i < l; ++i) {
                                blanks.push('_');
                            }
                            ins.blanks = blanks;
                        },
                        null,
                        null
                    ];

                    const func = dict[item.qtype];
                    func && func(item.content);
                });

                data.questions = util.shuffle(questions); // 打乱考题顺序

                self.setData({
                    paper: data,
                    currQuestion: questions[self.data.currIndex],
                    dispatchId: options.dispatchId,
                    blanks: null
                });
            });
        });
    },
    addResult(answer) {
        let id = this.data.currQuestion._id;
        let answers = this.data.answers || {};

        answers[id] = answer;

        this.data.answers = answers;
    },
    radioChange(e) {
        this.addResult(parseInt(e.detail.value));
        this.nextQuestion();
    },
    checkboxStatusUpdate(e) {
        let checkedValues = e.detail.value || [];
        let currQuestion = this.data.currQuestion;

        for (let i = 0, lenI = currQuestion.options.length; i < lenI; i++) {
            let option = currQuestion.options[i];
            option.checked = false;

            for (let j = 0, lenJ = checkedValues.length; j < lenJ; j++) {
                if (option.value === checkedValues[j]) {
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
        const checkedValues = this.data.currQuestion.options.reduce((ret, item) => {
            if (item.checked) {
                ret.push(item.value);
            }

            return ret;
        }, []);

        this.addResult(checkedValues.join(',')); // 多选结果逗号分隔
        this.nextQuestion();
    },
    clozeTextInput(e) {
        let { blanks, currQuestion } = this.data;
        if (!blanks) {
            blanks = new Array(currQuestion.content.count);
        }
        blanks[e.target.dataset.index] = e.detail.value.trim();
        this.data.blanks = blanks;
    },
    clozeTextSubmit(e) {
        let { blanks, currQuestion } = this.data;
        if (!blanks || !blanks.every(ins => ins)) {
            return wx.showModal({
                title: '提示',
                content: '请输入全部填空',
                showCancel: false
            });
        }

        this.addResult(blanks);
        this.nextQuestion();
    },
    nextQuestion() {
        const questions = this.data.paper.questions;
        const nextIndex = this.data.currIndex + 1;

        if (nextIndex === questions.length) { // 最后一道考题
            return wx.request({
                url: `${config.requestUrl}/exam/calculate`,
                method: 'POST',
                data: {
                    start_time: this.data.paper.now,
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
            currQuestion: questions[nextIndex],
            blanks: null
        });
    },
    PreviewImage: function (e) {
        e.stopPr
        wx.previewImage({
            urls: [e.currentTarget.dataset.src]
        });
    }
});
