define(function(require) {

    var config = [
        { name: "Courier", label: "Courier", file: "" },
        { name: "CourierPrime", label: "Courier Prime", file: "courier-prime" },
        { name: "CourierPrimeCyrillic", label: "Courier Prime Cyrillic", file: "courier-prime-cyrillic" }
        // { name: "Kosugi", label: "Kosugi", file: "kosugi", "tmp-ratio": 0.62 }
    ];

    var loaders = {};
    config.forEach(function(font) {
        if (font.file) {
            if (window) {
                // BROWSER LOADER
                // LOCAL
                if (window.location.protocol === "file:") {
                    loaders[font.name] = function(callback) {
                        require(['bundle/js/fonts/' + font.file + '.js?callback=define'], function (fonts) {
                            callback(fonts);
                        });
                    };
                }
                // DYNAMIC
                else {
                    loaders[font.name] = function(callback) {
                        require(['js/fonts/' + font.file + '.js?callback=define'], function (fonts) {
                            callback(fonts);
                        });
                    };
                }
            } else {
                // NDOE.JS LOADER
                loaders[font.name] = function(callback) {
                    callback(require('fonts/' + font.file));
                };
            }
        } else {
            // USE PDF SUPPORTED FONT
            loaders[font.name] = function (callback) {
                callback(null);
            };
        }
        loaders[font.name].config = font;
    });

    // list of fonts for settings
    loaders.fontsList = config;

    return loaders;
});