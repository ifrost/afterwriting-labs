define(function(require) {

    var data = require('modules/data'),
        Plugin = require('core/plugin'),
        SettingsSection = require('plugin/settings/model/settings-section'),
        SettingsController = require('plugin/settings/controller/settings-controller'),
        SettingsModel = require('plugin/settings/model/settings-model'),
        ThemeController = require('aw-bubble/controller/theme-controller');

    var SettingsPlugin = Plugin.extend({

        themeController: {
            inject: ThemeController
        },

        $create: function(context) {
            context.register('settings', SettingsModel.create());
            context.register(SettingsController.create());
        },

        init: function() {
            var settingsSection = SettingsSection.create('settings');
            this.themeController.addSection(settingsSection);

            data.bindScript(function(){
                settingsSection.isVisibleInMenu = true;
            });
        }

    });

    return SettingsPlugin;
});