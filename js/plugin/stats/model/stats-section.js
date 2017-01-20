define(function(require) {

    var Section = require('aw-bubble/model/section'),
        StatsView = require('plugin/stats/view/stats-view');
    
    var FactsSection = Section.extend({
        
        title: 'Useless Stats',

        shortTitle: 'stats',

        smallIcon: 'gfx/icons/stats.svg',

        isVisibleInMenu: false,

        mainContent: {
            value: StatsView.create()
        }

    });

    return FactsSection;
});