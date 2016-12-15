define(function(require) {

    var Section = require('aw-bubble/model/section'),
        PreviewView = require('plugin/preview/view/preview-view'),
        PreviewViewMenu = require('plugin/preview/view/preview-view-menu');

    var PreviewSection = Section.extend({
        
        title: 'Preview',

        shortTitle: 'view',

        smallIcon: 'gfx/icons/preview.svg',

        isVisibleInMenu: false,

        mainContent: {
            value: PreviewView.create()
        },
        
        tools: {
            value: PreviewViewMenu.create()
        }

    });

    return PreviewSection;
});