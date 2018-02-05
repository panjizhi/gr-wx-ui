const config = require('../config');

function formatTime(time) {
    if (typeof time !== 'number' || time < 0) {
        return time
    }

    var hour = parseInt(time / 3600)
    time = time % 3600
    var minute = parseInt(time / 60)
    time = time % 60
    var second = time

    return ([hour, minute, second]).map(function (n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }).join(':')
}

function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude)
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}

function assign(target, varArgs) {
    if (typeof Object.assign === 'function') {
        return Object.assign(target, varArgs);
    }

    if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}

function sizeOfHans(str) {
    if (typeof str !== 'string') {
        return 0;
    }

    var strHex = '';

    for (var i = str.length - 1; i >= 0; i--) {
        strHex += str.charCodeAt(i).toString(16);
    }

    return Math.ceil(strHex.length / 4);
}

function shuffle(array) {
    var temporaryValue;
    var randomIndex;
    var currentIndex = array.length;

    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

module.exports = {
    formatTime,
    formatLocation,
    assign,
    sizeOfHans,
    shuffle,
    AsyncRequest: (action, pdt, cb) => {
        if (!cb) {
            cb = () => { };
        }

        wx.request({
            url: `${config.requestUrl}/${action}`,
            method: 'POST',
            dataType: 'json',
            data: pdt ? JSON.stringify(pdt) : null,
            success: (res) => {
                if (res.statusCode !== 200) {
                    return cb('Status code ' + res.statusCode);
                }
                cb(null, res.data);
            },
            fail: () => {
                cb && cb('Response error');
            }
        });
    }
};
