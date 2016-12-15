define(function(require) {

    var template = require('text!plugin/preview/view/preview-view-menu.hbs'),
        HandlebarComponent = require('utils/handlebar-component');

    return HandlebarComponent.extend({
        hbs: template
    });
});

