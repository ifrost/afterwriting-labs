define(function(require) {

    var Protoplast = require('p');

    var SettingsGroup = Protoplast.Model.extend({

        title: null,

        entries: null,

        $create: function(title) {
            this.title = title;
            this.entries = Protoplast.Collection.create([]);
        },

        addEntry: function(entry) {
            this.entries.add(entry);
        }

    });

    return SettingsGroup;
});