define(function(require) {

    var Section = require('aw-bubble/model/section'),
        OpenView = require('plugin/io/view/open-view');

    var OpenSection = Section.extend({
        
        title: 'Open',

        shortTitle: 'open',

        smallIcon: 'gfx/icons/open.svg',

        mainContent: {
            value: OpenView.create()
        }

    });

    return OpenSection;
});