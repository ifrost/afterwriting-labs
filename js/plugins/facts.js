/* global define */
define(function (require) {
	var pm = require('utils/pluginmanager'),
		data = require('modules/data'),
		fquery = require('utils/fountain/query'),
		queries = require('modules/queries'),
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
		
		plugin.data.facts = queries.basics.run(data.parsed.lines);
		var facts = plugin.data.facts;
		
		// title
		data.parsed.title_page.forEach(function (token) {
			if (token.type === 'title') {
				facts.title = token.text;
			}
		});

		facts.characters = queries.characters.run(data.parsed.tokens, facts, {sort_by: 'lines'});
		facts.locations = queries.locations.run(data.parsed.tokens);
	};

	plugin.activate = function () {
		clear_data();
		generate_data();
	};


	return plugin;
});