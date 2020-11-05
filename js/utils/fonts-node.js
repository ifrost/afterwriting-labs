define(function (require) {

    var CourierPrime = require('fonts/courier-prime');
    var CourierPrimeCyrillic = require('fonts/courier-prime-cyrillic');
    var Kosugi = require('fonts/kosugi');

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

    fonts["Kosugi"] = function (callback) {
        callback(Kosugi);
    };

    fonts["Courier"] = function (callback) {
        callback(null); // don't embed
    };

    return fonts;
});