const config = require('../../config');
const utils = require('../../util/util.js');

const app = getApp();

Page({
    data: {
        user: null,
        typesMap: config.questionTypes,
        paper: null,
        errors: null
    },
    onLoad(options) {
        app.getUserInfo(user => {
            this.setData({
                user
            });

            utils.AsyncRequest('exam/review', { id: options.id }, (err, dat) => {
                if (err) {
                    return;
                }

                const { answers, paper } = dat;

                const ansDict = {};
                answers.forEach((ins) => ansDict[ins.question] = ins);

                const wrongArr = [];
                const qusArr = [];
                paper.questions.forEach((ins) => {
                    const ans = ansDict[ins._id];
                    if (ans) {
                        ins.answer = ans.answer;
                        (ans.right ? qusArr : wrongArr).push(ins);
                    }
                });

                const arr = wrongArr.concat(qusArr);

                this.setData({
                    paper: paper,
                    questions: arr
                });
            });
        });
    },
    PreviewImage: function (e) {
        wx.previewImage({
            urls: [e.currentTarget.dataset.src]
        });
    }
});
