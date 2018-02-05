/**
 * 配置文件
 */

const host = 'gerun.mobi';

const config = {

    host,

    requestUrl: `https://${host}/api`,

    questionTypes: [
        "单选",
        "填空",
        "计算",
        "写作"
    ]
};

module.exports = config;
