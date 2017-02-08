define(function(require) {

    var Plugin = require('core/plugin'),
        InfoSection = require('plugin/info/model/info-section'),
        ThemeController = require('theme/aw-bubble/controller/theme-controller');
    
    var InfoPlugin = Plugin.extend({
        
        themeController: {
            inject: ThemeController
        },
        
        $create: function(context) {
            
        },
        
        init: function() {
            var infoSection = InfoSection.create('info');
            this.themeController.addSection(infoSection);
        }
        
    });

    return InfoPlugin;
});