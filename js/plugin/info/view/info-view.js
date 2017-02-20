define(function(require) {

    var template = require('text!plugin/info/view/info.hbs'),
        $ = require('jquery'),
        InfoViewPresenter = require('plugin/info/view/info-view-presenter'),
        HandlebarComponent = require('utils/handlebar-component'),
        SectionViewMixin = require('theme/aw-bubble/view/section-view-mixin'),
        Switcher = require('theme/aw-bubble/view/switcher');
    
    return HandlebarComponent.extend([SectionViewMixin], {

        $meta: {
            presenter: InfoViewPresenter
        },
        
        switchToOpen: {
            component: Switcher
        },
        
        hbs: template,

        addInteractions: function() {
            this.switchToOpen.sectionName = 'open';
            this.switchToOpen.title = 'samples';
            
            $('#download-link').click(this.dispatch.bind(this, 'download-clicked'));
        }

    });

});
