define(function(require) {

    var data = require('modules/data'),
        Plugin = require('core/plugin'),
        FactsSection = require('plugin/facts/model/facts-section'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var FactsPlugin = Plugin.extend({

        themeController: {
            inject: ThemeController
        },

        $create: function(context) {

        },

        init: function() {
            var factsSection = FactsSection.create('facts');
            this.themeController.addSection(factsSection);

            data.bindScript(function(){
                factsSection.isVisibleInMenu = true;
            });
        }

    });

    return FactsPlugin;
});