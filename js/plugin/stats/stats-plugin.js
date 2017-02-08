define(function(require) {

    var Protoplast = require('protoplast'),
        Plugin = require('core/plugin'),
        FactsSection = require('plugin/stats/model/facts-section'),
        StatsSection = require('plugin/stats/model/stats-section'),
        ThemeController = require('theme/aw-bubble/controller/theme-controller');

    var StatsPlugin = Plugin.extend({
        
        scriptModel: {
            inject: 'script'
        },
        
        themeController: {
            inject: ThemeController
        },

        $create: function(context) {

        },

        init: function() {

            var factsSection = FactsSection.create('facts');
            this.themeController.addSection(factsSection);

            var statsSection = StatsSection.create('stats');
            this.themeController.addSection(statsSection);

            Protoplast.utils.bind(this.scriptModel, 'script', function(){
                factsSection.isVisibleInMenu = true;
                statsSection.isVisibleInMenu = true;
            });
        }

    });

    return StatsPlugin;
});