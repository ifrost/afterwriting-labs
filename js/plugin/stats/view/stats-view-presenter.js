define(function(require) {

    var BaseSectionViewPresenter = require('aw-bubble/presenter/base-section-view-presenter'),
        ScriptModel = require('core/model/script-model'),
        // DEBT: decouple modules (++)
        EditorController = require('plugin/editor/controller/editor-controller'),
        data = require('modules/data'),
        queries = require('plugin/stats/model/queries');

    var StatsViewPresenter = BaseSectionViewPresenter.extend({

        scriptModel: {
            inject: ScriptModel
        },
        
        editorController: {
            inject: EditorController
        },

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
            var basics = this.scriptModel.getBasicStats();
            statsData.who_with_who = queries.dialogue_breakdown.run(data.parsed_stats.tokens, basics, data.config.stats_who_with_who_max);
            statsData.page_balance = queries.page_balance.run(data.parsed_stats.lines);
            statsData.tempo = queries.tempo.run(data.parsed_stats.tokens);
            statsData.locationsBreakdown = queries.locationsBreakdown.run(data.parsed_stats.tokens);

            this.view.data = statsData;
        },

        deactivate: function() {
            BaseSectionViewPresenter.deactivate.call(this);
            //editor.synced.remove(plugin.refresh);
        },

        _goto: function(line) {
            this.editorController.goto(line);
        }

    });

    return StatsViewPresenter;
});