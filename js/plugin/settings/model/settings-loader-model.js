define(function(require) {

    var Protoplast = require('p');

    var SettingsLoaderModel = Protoplast.Model.extend({

        userSettingsLoaded: false
        
    });

    return SettingsLoaderModel;
});