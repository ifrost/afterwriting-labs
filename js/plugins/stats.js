define(function (require) {

	var Section = require('aw-bubble/model/section'),
        StatsView = require('templates/plugins/stats-view'),
      pm = require('utils/pluginmanager'),
		editor = require('plugins/editor'),
		data = require('modules/data'),
		decorator = require('utils/decorator'),
		queries = require('modules/queries');

    var section = Section.create('stats');
    section.title = 'Useless Stats';
    section.shortTitle = 'stats';
    section.isVisibleInMenu = false;
    section.smallIcon = 'gfx/icons/stats.svg';
    section.mainContent = StatsView.create();

    data.script.add(function(){
        section.isVisibleInMenu = true;
    });
    
    var plugin = pm.create_plugin(null, null, null, section);

	plugin.goto = function (line) {
		editor.goto(line);
	};

	plugin.refresh = decorator(function () {
		plugin.is_active = true;
		plugin.data.days_and_nights = queries.days_and_nights.run(data.parsed_stats.tokens);
		plugin.data.int_and_ext = queries.int_and_ext.run(data.parsed_stats.tokens);
		plugin.data.scenes = queries.scene_length.run(data.parsed_stats.tokens);
		var basics = queries.basics.run(data.parsed_stats.lines);
		plugin.data.who_with_who = queries.dialogue_breakdown.run(data.parsed_stats.tokens, basics, data.config.stats_who_with_who_max);
		plugin.data.page_balance = queries.page_balance.run(data.parsed_stats.lines);
		plugin.data.tempo = queries.tempo.run(data.parsed_stats.tokens);
		plugin.data.locations_breakdown = queries.locations_breakdown.run(data.parsed_stats.tokens);
	});
	
	plugin.activate = function() {
		editor.synced.add(plugin.refresh);
		plugin.refresh();
	};

	plugin.deactivate = function () {
		plugin.is_active = false;
		editor.synced.remove(plugin.refresh);
	};

	return plugin;
});