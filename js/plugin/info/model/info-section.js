define(function(require) {

    var Section = require('theme/aw-bubble/model/section'),
        InfoView = require('plugin/info/view/info-view');

    var InfoSection = Section.extend({
        
        title: 'Info',

        shortTitle: 'info',

        smallIcon: 'gfx/icons/info.svg',

        MainContent: {
            value: InfoView
        }

    });

    return InfoSection;
});