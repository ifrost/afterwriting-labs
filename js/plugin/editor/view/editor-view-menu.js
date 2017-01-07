define(function(require) {

    var template = require('text!plugin/editor/view/editor-view-menu.hbs'),
        HandlebarComponent = require('utils/handlebar-component');

    return HandlebarComponent.extend({
        hbs: template
    });
});

