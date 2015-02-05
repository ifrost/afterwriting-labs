define(function (require) {
	var pm = require('utils/pluginmanager'),
		data = require('modules/data'),
		queries = require('modules/queries'),
		editor = require('plugins/editor'),
		decorator = require('utils/decorator'),
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
	
	plugin.get_characters_by_level = function(level) {
		return plugin.data.facts.characters.filter(function(character){
			return character.level === level;
		});
	};

	plugin.each_scene_on_new_page = function() {
		return data.config.each_scene_on_new_page;
	};
	
	plugin.refresh = decorator(function(){
		generate_data();
	});
	
	plugin.activate = function () {
		editor.synced.add(plugin.refresh);
		plugin.refresh();
	};
	
	plugin.deactivate = function() {
		editor.synced.remove(plugin.refresh);
	};

	return plugin;
});