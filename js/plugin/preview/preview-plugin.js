define(function(require) {

    var Plugin = require('core/plugin'),
        PreviewSection = require('plugin/preview/model/preview-section'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var PreviewPlugin = Plugin.extend({

        scriptModel: {
            inject: 'script'
        },
        
        themeController: {
            inject: ThemeController
        },
        
        section: null,

        $create: function(context) {
            
        },

        init: function() {
            var previewSection = PreviewSection.create('preview');
            this.themeController.addSection(previewSection);

            this.scriptModel.bindScript(function(){
                previewSection.isVisibleInMenu = true;
            });
        }

    });

    return PreviewPlugin;
});