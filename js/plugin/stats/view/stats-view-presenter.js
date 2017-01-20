define(function(require) {

    var BaseSectionViewPresenter = require('aw-bubble/presenter/base-section-view-presenter'),
        data = require('modules/data'),
        queries = require('modules/queries');

    var StatsViewPresenter = BaseSectionViewPresenter.extend({

        init: function() {
            BaseSectionViewPresenter.init.call(this);
            this.view.on('goto', this._goto);
        },

        activate: function() {
            BaseSectionViewPresenter.activate.call(this);

            var statsData = {};
            // editor.synced.add(plugin.refresh);
            statsData.days_and_nights = queries.days_and_nights.run(data.parsed_stats.tokens);
            statsData.int_and_ext = queries.int_and_ext.run(data.parsed_stats.tokens);
            statsData.scenes = queries.scene_length.run(data.parsed_stats.tokens);
            var basics = queries.basics.run(data.parsed_stats.lines);
            statsData.who_with_who = queries.dialogue_breakdown.run(data.parsed_stats.tokens, basics, data.config.stats_who_with_who_max);
            statsData.page_balance = queries.page_balance.run(data.parsed_stats.lines);
            statsData.tempo = queries.tempo.run(data.parsed_stats.tokens);
            statsData.locations_breakdown = queries.locations_breakdown.run(data.parsed_stats.tokens);

            this.view.data = statsData;
        },

        deactivate: function() {
            BaseSectionViewPresenter.deactivate.call(this);
            //editor.synced.remove(plugin.refresh);
        },

        _goto: function(position) {
            console.log(position);
        }

    });

    return StatsViewPresenter;
});