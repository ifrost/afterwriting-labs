define(function(require) {

    var _ = require('lodash'),
        Protoplast = require('p'),
        DefaultSettingsProvider = require('plugin/settings/model/default-settings-provider'),
        SettingsConfigProvider = require('plugin/settings/model/settings-config-provider'),
        ThemeController = require('aw-bubble/controller/theme-controller'),
        SettingsModel = require('plugin/settings/model/settings-model');

    var SettingsController = Protoplast.Object.extend({

        settingsModel: {
            inject: SettingsModel
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
            var defaultSettings = DefaultSettingsProvider.getConfig(),
                settings = {};

            this.storage.load('settings', function(userSettings) {
                _.assign(settings, defaultSettings, userSettings);
                this.setValues(settings);
                this.settingsModel.on('valuesChanged', this._saveCurrentSettings, this);
                this._updateThemeSettings();
            }.bind(this));
        },

        _saveCurrentSettings: function() {
            this._updateThemeSettings();
            this.storage.save('settings', this.settingsModel.values);
        },

        _updateThemeSettings: function() {
            this.themeController.nightMode(this.settingsModel.values['night_mode']);
            this.themeController.showBackgroundImage(this.settingsModel.values['show_background_image']);
        }

    });

    return SettingsController;
});