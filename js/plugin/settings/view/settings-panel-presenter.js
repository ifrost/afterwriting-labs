define(function(require) {

    var Protoplast = require('p'),
        SettingsController = require('plugin/settings/controller/settings-controller'),
        SettingsModel = require('plugin/settings/model/settings-model');

    var SettingsPanelPresenter = Protoplast.Object.extend({

        settings: {
            inject: SettingsModel
        },

        controller: {
            inject: SettingsController
        },

        init: function() {
            Protoplast.utils.bind(this, 'settings.groups', this._updateConfig);

            this.settings.on('valuesChanged', function(event) {
                var entry = this.settings.getSettingEntry(event.key);
                if (entry) {
                    entry.control.value = event.value;
                }
            }.bind(this));

            this.view.on('configValueChanged', function(event) {
                this.controller.updateValue(event.key, event.value);
            }.bind(this));
        },

        _updateConfig: function() {
            this.view.config = this.settings.groups;
            this.settings.groups.forEach(function(group) {
                group.entries.forEach(function(entry) {
                    entry.control.value = this.settings.values[entry.key];
                }, this);
            }, this);
        }

    });

    return SettingsPanelPresenter;
});