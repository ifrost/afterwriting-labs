define(function(require) {    

    var browser = require('utils/browser'),
        PrintProfileUtil = require('utils/print-profile-util');            

    var print_profiles = PrintProfileUtil.loadFiles();

    // font size = experimental feature
    var url_params = browser.url_params();
    if (url_params.fontSize) {
        var fontSize = parseInt(url_params.fontSize, 10);
        Object.keys(print_profiles, function(profile) {
            var prf = print_profiles[profile];
            print_profiles[profile] = ProcessingInstruction.withNewFontSize(prf, fontSize);
        });      
    }

    return print_profiles;
});