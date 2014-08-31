/* global define */
define(function (require) {
	var pm = require('utils/pluginmanager'),
		data = require('modules/data'),
		fquery = require('utils/fountain/query'),
		fhelpers = require('utils/fountain/helpers');

	var h = fhelpers.fq;

	var plugin = pm.create_plugin('facts', 'facts');

	var clear_data = function () {
		plugin.data = {
			facts: {
				pages: 0.0,
				scenes: 0,
				action_time: 0.0,
				dialogue_time: 0.0,
				characters: [],
				locations: [],
				title: ''
			}
		};
	};

	var generate_data = function () {
		var basic = fquery('basics', {last_page_lines: 0});
		basic.count('action_lines', h.is('action', 'scene_heading'));
		basic.count('dialogue_lines', h.is_dialogue());
		basic.count('pages', h.is('page_break'));
		basic.enter(true, function(item, fq){
			var selector = fq.select();
			if (item.is('page_break')) {
				selector.last_page_lines = 0;
			}
			else {
				selector.last_page_lines++;
			}
		});
		basic.exit(function(item){
			var all = item.action_lines + item.dialogue_lines;
			item.pages = item.pages + item.last_page_lines / data.config.print().lines_per_page;
			item.action_time = (item.action_lines / all) * item.pages;
			item.dialogue_time = (item.dialogue_lines / all) * item.pages;
		});
		
		plugin.data.facts = basic.run(data.parsed.lines)[0];
		var facts = plugin.data.facts;
		console.log(facts);
		// title
		data.parsed.title_page.forEach(function (token) {
			if (token.type === 'title') {
				facts.title = token.text;
			}
		});

		var characters = fquery('name', {lines: 0}, {sort_by: 'lines'});
		characters.enter(h.is('character'), function (item, fq) {
			var selection = fq.select(item.name());
			fq.current_character = selection;
		});
		characters.enter(h.is_dialogue(), function(item, fq){
			fq.current_character.lines += item.lines.length;
		});	
		characters.exit(function(selection){			
			selection.time = (selection.lines / facts.dialogue_lines) * facts.dialogue_time;
		});
		facts.characters = characters.run(data.parsed.tokens);
		
		facts.scenes = 0;
		var locations = fquery('name', {count: 0}, {sort_by: 'count'});
		locations.enter(h.is('scene_heading'), function(item, fq) {
			fq.select(item.location()).count++;
			facts.scenes++;
		});
		facts.locations = locations.run(data.parsed.tokens);
	};

	plugin.activate = function () {
		clear_data();
		generate_data();
	};


	return plugin;
});