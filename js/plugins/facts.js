define(['core', 'logger', 'jquery', 'utils/data'], function (core, logger, $, data) {
	var log = logger.get('facts');
	var plugin = core.create_plugin('facts', 'facts');

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
		var facts = plugin.data.facts;

		// title
		data.parsed.title_page.forEach(function (token) {
			if (token.type === 'title') {
				facts.title = token.text;
			}
		});

		var last_page_lines = 0;
		var action_lines = 0;
		var dialogue_lines = 0;
		data.parsed.lines.forEach(function (line) {
			if (line.type === "page_break") {
				facts.pages++;
				last_page_lines = 0;
			}
			if (["character", "dialogue", "parenthetical"].indexOf(line.type) !== -1) {
				dialogue_lines++;
			} else {
				action_lines++;
			}
			last_page_lines++;
		});
		facts.pages += last_page_lines / data.config.lines_per_page;

		var action_and_dialogue = action_lines + dialogue_lines;
		facts.action_time = (action_lines / action_and_dialogue) * facts.pages;
		facts.dialogue_time = (dialogue_lines / action_and_dialogue) * facts.pages;

		if (isNaN(facts.action_time)) {
			facts.action_time = 0;
		}

		if (isNaN(facts.dialogue_time)) {
			facts.dialogue_time = 0;
		}

		var characters_to_sort = [],
			locations_to_sort = [],
			characters_cache = {}, locations_cache = {};
		data.parsed.tokens.forEach(function (token) {
			if (token.type === 'scene_heading') {
				facts.scenes++;
				var location = token.text.trim();
				location = location.replace(/^(INT.?\/.EXT\.?)|(I\/E)|(INT\.?)|(EXT\.?)/, '');
				var dash = location.lastIndexOf(' - ');
				if (dash != -1) {
					location = location.substring(0, dash);
				}
				location = location.trim();
				locations_cache[location] = locations_cache[location] ? locations_cache[location] + 1 : 1;
			}

			if (token.type === "character") {
				var character = token.text;
				var p = character.indexOf('(');
				if (p != -1) {
					character = character.substring(0, p);
				}
				character = character.trim();
				characters_cache[character] = characters_cache[character] ? characters_cache[character] + 1 : 1;
			}
		});

		var count_sort = function (a, b) {
			return b.count - a.count;
		};

		for (var character in characters_cache) {
			characters_to_sort.push({
				name: character,
				count: characters_cache[character]
			});
		}
		facts.characters = characters_to_sort.sort(count_sort);

		for (var location in locations_cache) {
			locations_to_sort.push({
				name: location,
				count: locations_cache[location]
			});
		}
		facts.locations = locations_to_sort.sort(count_sort);
	};

	plugin.activate = function () {
		clear_data();
		generate_data();
	};


	return plugin;
});