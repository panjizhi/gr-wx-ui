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

        const { questions, articles } = paper;

        const adict = {};
        if (articles) {
          articles.forEach(ins => adict[ins._id] = ins);
        }

        const wrongArr = [];
        const qusArr = [];
        questions.forEach((ins) => {
          const ans = ansDict[ins._id];
          ins.answer = ans ? ans.answer : null;
          (ans && ans.right ? qusArr : wrongArr).push(ins);
        });

        const arr = wrongArr.concat(qusArr);

        let lastArticle = null;
        arr.forEach(ins => {
          if (ins.article) {
            if (ins.article === lastArticle) {
              delete ins.article;
            }
            else {
              lastArticle = ins.article;
              ins.article = adict[ins.article];
            }
          }
        });

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
