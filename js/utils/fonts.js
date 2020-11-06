define(function(require){

    throw new Error("Deprecated");
    var fonts = {};

    fonts["CourierPrime"] = function(callback) {
        require(['js/fonts/courier-prime.js?callback=define'], function(fonts) {
            callback(fonts);
        });
    };

    fonts["CourierPrimeCyrillic"] = function(callback) {
        require(['js/fonts/courier-prime-cyrillic.js?callback=define'], function(fonts) {
            callback(fonts);
        });
    };

    fonts["Kosugi"] = function(callback) {
        require(['js/fonts/kosugi.js?callback=define'], function(fonts) {
            callback(fonts);
        });
    };

    fonts["FreeMono"] = function(callback) {
        require(['js/fonts/free-mono.js?callback=define'], function(fonts) {
            callback(fonts);
        });
    };

    fonts["Courier"] = function(callback) {
        callback(null); // don't embed
    };

    return fonts;
});