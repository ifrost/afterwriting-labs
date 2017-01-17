define(function(require) {

    var Plugin = require('core/plugin'),
        data = require('modules/data'),
        IoModel = require('plugin/io/model/io-model'),
        OpenController = require('plugin/io/controller/open-controller'),
        SaveController = require('plugin/io/controller/save-controller'),
        OpenSection = require('plugin/io/model/open-section'),
        SaveSection = require('plugin/io/model/save-section'),
        ThemeController = require('aw-bubble/controller/theme-controller');
    
    var IoPlugin = Plugin.extend({
        
        themeController: {
            inject: ThemeController
        },
        
        $create: function(context) {
            context.register(OpenController.create());
            context.register(SaveController.create());
            context.register(IoModel.create());
        },
        
        init: function() {
            var openSection = OpenSection.create('open');
            this.themeController.addSection(openSection);

            var saveSection = SaveSection.create('save');
            this.themeController.addSection(saveSection);
            
            data.bindScript(function(){
                saveSection.isVisibleInMenu = true;
            });
        }
        
    });

    return IoPlugin;
});