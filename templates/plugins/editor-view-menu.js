define(function(require) {

    var template = require('text!templates/plugins/editor-view-menu.hbs'),
        HandlebarComponent = require('utils/handlebar-component');

    return HandlebarComponent.extend({
        hbs: template
    });
});

