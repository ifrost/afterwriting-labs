define(function(require) {

    var Section = require('aw-bubble/model/section'),
        InfoView = require('plugin/info/view/info-view');

    var InfoSection = Section.extend({
        
        title: 'Info',

        shortTitle: 'info',

        smallIcon: 'gfx/icons/info.svg',

        mainContent: {
            value: InfoView.create()
        }

    });

    return InfoSection;
});