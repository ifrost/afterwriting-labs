define(function(require) {

    var template = require('text!plugin/info/view/info.hbs'),
        $ = require('jquery'),
        InfoViewPresenter = require('plugin/info/view/info-view-presenter'),
        HandlebarComponent = require('utils/handlebar-component');
    
    return HandlebarComponent.extend({

        $meta: {
            presenter: InfoViewPresenter
        },
        
        hbs: template,

        plugin: null,

        addInteractions: function() {
            $('#download-link').click(this.dispatch.bind(this, 'download-clicked'));
        }

    });

});
