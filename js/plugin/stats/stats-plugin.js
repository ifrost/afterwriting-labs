define(function(require) {

    var data = require('modules/data'),
        Plugin = require('core/plugin'),
        FactsSection = require('plugin/stats/model/facts-section'),
        StatsSection = require('plugin/stats/model/stats-section'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var StatsPlugin = Plugin.extend({

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

            data.bindScript(function(){
                factsSection.isVisibleInMenu = true;
                statsSection.isVisibleInMenu = true;
            });
        }

    });

    return StatsPlugin;
});