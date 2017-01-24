define(function(require) {

    var Section = require('aw-bubble/model/section'),
        FactsView = require('plugin/stats/view/facts-view');
    
    var FactsSection = Section.extend({
        
        title: 'Facts',

        shortTitle: 'facts',

        smallIcon: 'gfx/icons/facts.svg',

        isVisibleInMenu: false,

        mainContent: {
            value: FactsView.create()
        }

    });

    return FactsSection;
});