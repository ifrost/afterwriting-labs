define(function(require) {

    var _ = require('lodash'),
        data = require('modules/data'),
        Protoplast = require('p'),
        SettingsConfigProvider = require('plugin/settings/model/settings-config-provider'),
        ThemeController = require('aw-bubble/controller/theme-controller');
    
    var SettingsController = Protoplast.Object.extend({

        settingsModel: {
            inject: 'settings'
        },

        storage: {
            inject: 'storage'
        },

        themeController: {
            inject: ThemeController
        },

        init: function() {
            var settingsConfigProvider = SettingsConfigProvider.create();
            this.settingsModel.groups = settingsConfigProvider.getSettingGroups();
            this._loadSettings();
        },

        updateValue: function(key, value) {
            this.settingsModel.update(key, value);
        },

        setValues: function(map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    this.updateValue(key, map[key]);
                }
            }
        },

        _loadSettings: function() {
            this.storage.load('settings', function(userSettings) {
                this.settingsModel.values.fromJSON(userSettings);
                data.config = this.settingsModel.values;
                this.settingsModel.values.userSettingsLoaded = true;
                this.settingsModel.values.on('changed', this._saveCurrentSettings, this);
            }.bind(this));

            Protoplast.utils.bind(this, {
                'settingsModel.values.night_mode': this.themeController.nightMode,
                'settingsModel.values.show_background_image': this.themeController.showBackgroundImage
            })
        },

        _saveCurrentSettings: function() {
            data.config = this.settingsModel.values;
            data.script(data.script()); // parse again (e.g. to add/hide tokens)
            this.storage.save('settings', this.settingsModel.values.toJSON());
        }

    });

    return SettingsController;
});