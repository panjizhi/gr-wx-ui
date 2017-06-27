/**
 * 配置文件
 */

const host = 'jizhi.work';

const config = {

    host,

    requestUrl: `https://${host}/api`,

    questionTypes: {
        'choice': '单选题',
        'multiple-choices': '多选题',
        'cloze': '填空题'
    }
};

module.exports = config;
