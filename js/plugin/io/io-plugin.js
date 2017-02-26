define(function(require) {

    var Protoplast = require('protoplast'),
        Plugin = require('core/plugin'),
        IoModel = require('plugin/io/model/io-model'),
        OpenController = require('plugin/io/controller/open-controller'),
        SaveController = require('plugin/io/controller/save-controller'),
        SaveMobileController = require('plugin/io/controller/save-mobile-controller'),
        MobileScriptSettings = require('plugin/io/model/mobile-script-settings'),
        MobileScriptModel = require('plugin/io/model/mobile-script-model'),
        OpenSection = require('plugin/io/model/open-section'),
        SaveSection = require('plugin/io/model/save-section'),
        ThemeController = require('theme/aw-bubble/controller/theme-controller');
    
    var IoPlugin = Plugin.extend({
        
        scriptModel: {
            inject: 'script'
        },

        themeController: {
            inject: ThemeController
        },
        
        $create: function(context) {
            context.register(OpenController.create());
            context.register(SaveController.create());
            context.register(SaveMobileController.create());
            context.register(MobileScriptModel.create());
            context.register(MobileScriptSettings.create());
            context.register(IoModel.create());
        },
        
        init: function() {
            var openSection = OpenSection.create('open');
            this.themeController.addSection(openSection);

            var saveSection = SaveSection.create('save');
            this.themeController.addSection(saveSection);
            
            Protoplast.utils.bind(this.scriptModel, 'script', function(){
                saveSection.isVisibleInMenu = true;
            });
        }
        
    });

    return IoPlugin;
});