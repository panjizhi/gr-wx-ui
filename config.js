/**
 * 配置文件
 */

const host = 'jizhi.work';

const config = {

    host,

    requestUrl: `https://${host}/api`,

    questionTypes: {
        'choice': '单选',
        'multiple-choices': '多选',
        'cloze': '填空'
    }
};

module.exports = config;
