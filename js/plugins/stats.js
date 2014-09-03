/* global define */
define(function (require) {

	var pm = require('utils/pluginmanager'),
		logger = require('logger'),
		editor = require('plugins/editor'),
		data = require('modules/data'),
		queries = require('modules/queries');
	
	var log = logger.get('stats');
	var plugin = pm.create_plugin('stats', 'stats');

	plugin.goto = function (line) {
		editor.goto(line);
	};

	plugin.activate = function () {
		plugin.data.days_and_nights = queries.days_and_nights.run(data.parsed.tokens);
		plugin.data.scenes = queries.scene_length.run(data.parsed.tokens);
		var basics = queries.basics.run(data.parsed.lines);
		plugin.data.who_with_who = queries.dialogue_breakdown.run(data.parsed.tokens, basics, data.config.stats_who_with_who_max);
		plugin.data.page_balance = queries.page_balance.run(data.parsed.lines);
	};

	plugin.deactivate = function () {
		log.info('stats:deactivate');
	};

	return plugin;
});