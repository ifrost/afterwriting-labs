define(function (require) {
	var helper = require('utils/helper'),
		data = require('modules/data'),
		fquery = require('utils/fountain/query'),
		fhelpers = require('utils/fountain/helpers');

	var h = fhelpers.fq;

	var plugin = {};

	var create_days_and_nights = function () {

		var query = fquery('label', {
			value: 0
		});
		query.prepare(function (fq) {
			fq.recognized_scenes = 0;
		});
		query.count('value', h.has_scene_time('DAY'), 'DAY', true)
			.count('value', h.has_scene_time('NIGHT'), 'NIGHT', true)
			.count('value', h.has_scene_time('DUSK'), 'DUSK', true)
			.count('value', h.has_scene_time('DAWN'), 'DAWN', true);
		query.exit(function (item, fq) {
			fq.recognized_scenes += item.value;
		});
		query.end(function (result, fq) {
			var all_scenes = fquery().count('scenes', h.is('scene_heading')).run(fq.source).scenes;

			result.push({
				label: 'OTHER',
				value: all_scenes - fq.recognized_scenes
			});
		});
		return query;
	};

	var create_scene_length = function () {
		var query = fquery('token', {
			length: 0
		});
		query.prepare(function (fq) {
			fq.current_header = undefined;
		});
		query.enter(h.is('scene_heading'), function (token, fq) {
			fq.current_header = fq.select(token);
			fq.current_header.header = token.text;
		});
		query.enter(true, function (item, fq) {
			if (fq.current_header) {
				fq.current_header.length += item.lines.length;
				if (fq.current_header.token.has_scene_time('DAY')) {
					fq.current_header.type = 'day';
				} else if (fq.current_header.token.has_scene_time('NIGHT')) {
					fq.current_header.type = 'night';
				} else {
					fq.current_header.type = 'other';
				}
			}
		});
		return query;
	};

	var create_basics = function () {
		var basic = fquery(null, {
			last_page_lines: 0,
			scenes: 0
		});
		basic.count('action_lines', h.is('action', 'scene_heading'));
		basic.count('dialogue_lines', h.is_dialogue());
		basic.count('pages', h.is('page_break'));
		basic.enter(h.is('scene_heading'), function (item, fq) {
			fq.select().scenes++;
		});
		basic.enter(true, function (item, fq) {
			var selector = fq.select();
			if (item.is('page_break')) {
				selector.last_page_lines = 0;
			} else {
				selector.last_page_lines++;
			}
		});
		basic.exit(function (item) {
			var all = item.action_lines + item.dialogue_lines;
			item.pages = item.pages + item.last_page_lines / data.config.print().lines_per_page;
			item.action_time = (item.action_lines / all) * item.pages;
			item.dialogue_time = (item.dialogue_lines / all) * item.pages;
		});
		return basic;
	};

	var create_characters = function () {
		var runner = {};
		runner.run = function (tokens, basics, config) {
			var characters_query = fquery('name', {
				nof_scenes: 0,
				lines: 0
			});
			characters_query.enter(h.is('scene_heading'), function (item, fq) {
				fq.current_scene = item;
			});
			characters_query.enter(h.is('character'), function (item, fq) {
				var selector = fq.select(item.name());
				fq.current_character = selector;
				selector.scenes = selector.scenes || [];
				selector.scenes.indexOf(fq.current_scene) === -1 && selector.scenes.push(fq.current_scene);
				selector.nof_scenes = selector.scenes.length;
			});
			characters_query.enter(h.is_dialogue(), function (item, fq) {
				fq.current_character.lines += item.lines.length;
			});
			characters_query.exit(function (selection) {
				selection.time = (selection.lines / basics.dialogue_lines) * basics.dialogue_time;
			});
			return characters_query.run(tokens, config);
		};
		return runner;
	};

	var create_locations = function () {
		var query = fquery('name', {
			count: 0
		}, {
			sort_by: 'count'
		});
		query.enter(h.is('scene_heading'), function (item, fq) {
			fq.select(item.location()).count++;
		});
		return query;
	};

	var create_dialogue_breakdown = function () {
		var runner = {};
		runner.run = function (tokens, basics, max) {
			max = max || 10;
			var top_characters = plugin.characters.run(tokens, basics, {
				sort_by: 'nof_scenes'
			}).splice(0, max);
			top_characters.sort(function (a, b) {
				return a.name > b.name ? 1 : -1;
			});
			var top_index = {};
			top_characters.forEach(function (character, index) {
				top_index[character.name] = index;
			});

			// characters in scene
			var characters_in_scene = fquery('scene');
			characters_in_scene.enter(h.is('scene_heading'), function (item, fq) {
				fq.current_scene = item;
			});
			characters_in_scene.enter(h.is('character'), function (item, fq) {
				var selector = fq.select(fq.current_scene);
				selector.characters = selector.characters || [];
				selector.characters.indexOf(item.name()) === -1 && top_index[item.name()] !== undefined && selector.characters.push(item.name());
			});
			var characters_by_scene = characters_in_scene.run(tokens);
			var links_query = fquery('link_id', {
				scenes: 0
			});
			links_query.enter(true, function (item, fq) {
				var perms = helper.pairs(item.characters);
				perms.each(function (a, b) {
					a = top_index[a];
					b = top_index[b];
					var selector = fq.select(helper.double_id(a, b));
					selector.from = a;
					selector.to = b;
					selector.scenes++;
				});
			});
			var result = {
				characters: top_characters,
				links: links_query.run(characters_by_scene)
			};
			return result;
		};
		return runner;
	};

	plugin.windup = function () {
		plugin.days_and_nights = create_days_and_nights();
		plugin.scene_length = create_scene_length();
		plugin.characters = create_characters();
		plugin.locations = create_locations();
		plugin.dialogue_breakdown = create_dialogue_breakdown();
		plugin.basics = create_basics();
	};

	return plugin;

});