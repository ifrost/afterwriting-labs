define(function(require) {

    var Protoplast = require('protoplast'),
        Plugin = require('core/plugin'),
        PreviewSection = require('plugin/preview/model/preview-section'),
        PreviewController = require('plugin/preview/controller/preview-controller'),
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
            context.register(PreviewController.create());
        },

        init: function() {
            var previewSection = PreviewSection.create('preview');
            this.themeController.addSection(previewSection);

            Protoplast.utils.bind(this.scriptModel, 'script', function(){
                previewSection.isVisibleInMenu = true;
            });
        }

    });

    return PreviewPlugin;
});