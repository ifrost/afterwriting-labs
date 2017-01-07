define(function(require) {

    var data = require('modules/data'),
        Plugin = require('core/plugin'),
        PreviewSection = require('plugin/preview/model/preview-section'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var PreviewPlugin = Plugin.extend({

        themeController: {
            inject: ThemeController
        },
        
        section: null,

        $create: function(context) {
            
        },

        init: function() {
            var previewSection = PreviewSection.create('preview');
            this.themeController.addSection(previewSection);

            data.script.add(function(){
                previewSection.isVisibleInMenu = true;
            });
        }

    });

    return PreviewPlugin;
});