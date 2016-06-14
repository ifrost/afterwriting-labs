define(function(require) {

    var Plugin = require('core/plugin'),
        template = require('text!templates/plugins/facts.hbs'),
        off = require('off'),
        fhelpers = require('utils/fountain/helpers');

    var Editor = Plugin.extend({

        name: 'facts',

        title: 'facts',

        template: template,

        data: {
            inject: 'data'
        },

        editor: {
            inject: 'editor'
        },

        queries: {
            inject: 'queries'
        },

        refresh: function() {
            this.generate_data();
        },

        generate_data: function() {

            var basics = this.queries.basics.run(this.data.parsed_stats.lines);
            this.data.facts = basics;
            var facts = this.data.facts;

            facts.title = fhelpers.first_text('title', this.data.parsed.title_page, '');

            facts.characters = this.queries.characters.run(this.data.parsed_stats.tokens, basics, {sort_by: 'lines'});
            facts.locations = this.queries.locations.run(this.data.parsed_stats.tokens);
        },

        get_characters_by_level: function(level) {
            return this.data.facts.characters.filter(function(character) {
                return character.level === level;
            });
        },

        each_scene_on_new_page: function() {
            return this.data.config.each_scene_on_new_page;
        },

        activate: function() {
            this.editor.synced.add(this.refresh);
            this.refresh();
        },

        deactivate: function() {
            this.editor.synced.remove(this.refresh);
        }

    });

    return Editor.create();
});