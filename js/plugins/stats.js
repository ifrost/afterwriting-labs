define(function(require) {

    var Plugin = require('core/plugin'),
        template = require('text!templates/plugins/stats.hbs'),
        editor = require('plugins/editor'),
        off = require('off');
    
    var Stats = Plugin.extend({

        name: 'stats',

        title: 'stats',

        template: template,

        data: null,
        
        data_model: {
            inject: 'data'
        },
        
        queries: {
            inject: 'queries'
        },

        goto: function(line) {
            editor.goto(line);
        },

        refresh: function() {
            this.is_active = true;
            this.data.days_and_nights = this.queries.days_and_nights.run(this.data_model.parsed_stats.tokens);
            this.data.int_and_ext = this.queries.int_and_ext.run(this.data_model.parsed_stats.tokens);
            this.data.scenes = this.queries.scene_length.run(this.data_model.parsed_stats.tokens);
            var basics = this.queries.basics.run(this.data_model.parsed_stats.lines);
            this.data.who_with_who = this.queries.dialogue_breakdown.run(this.data_model.parsed_stats.tokens, basics, this.data_model.config.stats_who_with_who_max);
            this.data.page_balance = this.queries.page_balance.run(this.data_model.parsed_stats.lines);
            this.data.tempo = this.queries.tempo.run(this.data_model.parsed_stats.tokens);
            this.data.locations_breakdown = this.queries.locations_breakdown.run(this.data_model.parsed_stats.tokens);
        },

        activate: function() {
            editor.synced.add(this.refresh);
            this.refresh();
        },

        deactivate: function() {
            this.is_active = false;
            editor.synced.remove(this.refresh);
        }
    });

    return Stats.create();
});