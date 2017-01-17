define(function(require) {

    var Section = require('aw-bubble/model/section'),
        OpenView = require('plugin/io/view/open-view');

    var OpenSection = Section.extend({
        
        title: 'Open',

        shortTitle: 'open',

        smallIcon: 'gfx/icons/open.svg',
        
        description: 'You can open a .fountain or .fdx file (it will be converted to Fountain), or use one of the samples below.',

        mainContent: {
            value: OpenView.create()
        }

    });

    return OpenSection;
});