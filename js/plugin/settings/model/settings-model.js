define(function(require) {

    var Protoplast = require('p'),
        Settings = require('plugin/settings/model/settings');

    var SettingsModel = Protoplast.Model.extend({

        /**
         * @type {SettingsGroup[]}
         */
        groups: null,

        // TODO: remove, inject Settings to context
        values: null,

        $create: function() {
            this.values = Settings.create();
            this.groups = Protoplast.Collection.create([]);
        },

        update: function(key, value) {
            this.values[key] = value;
        },

        getSettingEntry: function(key) {
            var result = null;
            this.groups.forEach(function(group) {
                group.entries.forEach(function(entry) {
                    if (entry.key === key) {
                        result = entry;
                    }
                })
            });
            return result;
        }

    });

    return SettingsModel;
});