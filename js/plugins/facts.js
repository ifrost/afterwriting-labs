/* global define */
define(function (require) {
	var pm = require('utils/pluginmanager'),
		data = require('modules/data'),
		queries = require('modules/queries'),
		fhelpers = require('utils/fountain/helpers');

	var plugin = pm.create_plugin('facts', 'facts');

	var generate_data = function () {
		
		var basics = queries.basics.run(data.parsed_stats.lines);
		plugin.data.facts = basics;
		var facts = plugin.data.facts;
		
		facts.title = fhelpers.first_text('title', data.parsed.title_page, '');

		facts.characters = queries.characters.run(data.parsed_stats.tokens, basics, {sort_by: 'lines'});
		facts.locations = queries.locations.run(data.parsed_stats.tokens);
	};

	plugin.each_scene_on_new_page = function() {
		return data.config.each_scene_on_new_page;
	};
	
	plugin.activate = function () {
		generate_data();
	};


	return plugin;
});