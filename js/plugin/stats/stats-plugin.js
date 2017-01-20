define(function(require) {

    var data = require('modules/data'),
        Plugin = require('core/plugin'),
        StatsSection = require('plugin/stats/model/stats-section'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var StatsPlugin = Plugin.extend({

        themeController: {
            inject: ThemeController
        },

        $create: function(context) {

        },

        init: function() {
            var statsSection = StatsSection.create('stats');
            this.themeController.addSection(statsSection);

            data.bindScript(function(){
                statsSection.isVisibleInMenu = true;
            });
        }

    });

    return StatsPlugin;
});