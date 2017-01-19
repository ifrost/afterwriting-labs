define(function(require) {

    var Protoplast = require('p');

    var SettingsModel = Protoplast.Model.extend({

        /**
         * @type {SettingsGroup[]}
         */
        groups: null,

        values: null,

        $create: function() {
            this.values = {};
            this.groups = Protoplast.Collection.create([]);
        },

        update: function(key, value) {
            this.values[key] = value;
            this.dispatch('valuesChanged', {key: key, value: value});
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