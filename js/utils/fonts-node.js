define(function (require) {

    var CourierPrime = require('fonts/courier-prime');
    var CourierPrimeCyrillic = require('fonts/courier-prime-cyrillic');
    var NotoJP = require('fonts/noto-jp');
    var NotoSC = require('fonts/noto-sc');

    var fonts = {};

    fonts["CourierPrime"] = function (callback) {
        callback(CourierPrime);
    };

    fonts["CourierPrimeCyrillic"] = function (callback) {
        callback(CourierPrimeCyrillic);
    };

    fonts["NotoJP"] = function (callback) {
        callback(NotoJP);
    };

    fonts["NotoSC"] = function (callback) {
        callback(NotoSC);
    };

    fonts["Courier"] = function (callback) {
        callback(null); // don't embed
    };

    return fonts;
});