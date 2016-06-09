define(function (require) {

	var template = require('text!templates/plugins/stats.hbs'),
      pm = require('utils/pluginmanager'),
		editor = require('plugins/editor'),
		data = require('modules/data'),
		decorator = require('utils/decorator'),
		queries = require('modules/queries');
	
	var plugin = pm.create_plugin('stats', 'stats', template);

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