define(function(require) {

    var Section = require('aw-bubble/model/section'),
        SaveView = require('plugin/io/view/save-view');

    var SaveSection = Section.extend({
        
        title: 'Save',

        shortTitle: 'save',

        smallIcon: 'gfx/icons/save.svg',

        isVisibleInMenu: false,

        MainContent: {
            value: SaveView
        }

    });

    return SaveSection;
});