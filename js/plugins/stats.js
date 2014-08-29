/* global define */
define(function (require) {
	
	var core = require('core'),
		logger = require('logger'), 
		d3 = require('d3'), 
		editor = require('plugins/editor'), 
		data = require('utils/data');
	
	var log = logger.get('stats');
	var plugin = core.create_plugin('stats', 'stats');

	plugin.init = function () {
		log.info('stats:init');
	};

	plugin.goto = function (line) {
		editor.goto(line);
	};

	plugin.activate = function () {
		var scenes = [];
		var days_and_nights = {
			night: 0,
			day: 0,
			dusk: 0,
			dawn: 0,
			other: 0,
			sum: 0
		};
		var scenes_characters = [];
		var current_scene_characters = d3.set();
		var all_characters_nof_scenes = {};
		var all_characters = d3.set();

		var append_characters = function () {
			scenes_characters.push(current_scene_characters);
			current_scene_characters.values().forEach(function (character) {
				if (!all_characters_nof_scenes[character]) {
					all_characters_nof_scenes[character] = 0;
				}
				all_characters_nof_scenes[character]++;
			});
			current_scene_characters = d3.set();

		};

		data.parsed.tokens.forEach(function (token) {
			var type;
			if (token.type === 'scene_heading') {
				append_characters();
				var suffix = token.text.substring(token.text.lastIndexOf(' - '));
				if (suffix.indexOf('DAY') !== -1) {
					days_and_nights.day++;
					type = 'day';
				} else if (suffix.indexOf('NIGHT') !== -1) {
					days_and_nights.night++;
					type = 'night';
				} else if (suffix.indexOf('DUSK') !== -1) {
					days_and_nights.dusk++;
					type = 'dusk';
				} else if (suffix.indexOf('DAWN') !== -1) {
					days_and_nights.dawn++;
					type = 'dawn';
				} else {
					days_and_nights.other++;
					type = 'other';
				}
				days_and_nights.sum++;

				scenes.push({
					header: token.text,
					length: 0,
					token: token,
					type: type
				});
			} else {
				if (scenes.length) {
					scenes[scenes.length - 1].length += token.lines.length;
				}
				if (token.type === "character") {
					var character = token.text;
					var p = character.indexOf('(');
					if (p != -1) {
						character = character.substring(0, p);
					}
					character = character.trim();
					current_scene_characters.add(character);
					all_characters.add(character);
				}
			}

		});

		append_characters();

		var top10 = (function (data) {
			var flat = [];
			for (var key in data) {
				flat.push({
					name: key,
					nof_scenes: data[key]
				});
			}
			var compare = function (a, b) {
				return b.nof_scenes - a.nof_scenes;
			};
			return flat.sort(compare).slice(0, 10);
		})(all_characters_nof_scenes);

		var top10_names = top10.map(function (character) {
			return character.name;
		});
		var links = [];
		var id = function (a, b) {
			return Math.min(a, b) + '_' + Math.max(a, b);
		};
		var perm = function (t) {
			return t.map(function (item, index) {
				return t.slice(index + 1).map(function (i) {
					return [t[index], i];
				});
			}).reduce(function (prev, cur) {
				return prev.concat(cur);
			}, []);
		};

		var link_map = {};
		scenes_characters.forEach(function (scene) {
			var perms = perm(scene.values());
			for (var i=0; i<perms.length;i++) {
				var a = top10_names.indexOf(perms[i][0]);
				var b = top10_names.indexOf(perms[i][1]);
				if (a == -1 || b == -1) {continue;}
				
				var key = id(a,b);
				if (!link_map[key]) {
					link_map[key] = 0;
				}
				link_map[key]++;
			}
		});
		
		for (var key in link_map) {
			var indexes = key.split('_').map(Number);
			links.push({
				from: indexes[0],
				to: indexes[1],
				scenes: link_map[key]
			});	
		}

		plugin.who_with_who = {
			characters: top10,
			links: links
		};

		plugin.data.days_and_nights = [
			{
				label: 'DUSK',
				value: days_and_nights.dusk
			},
			{
				label: 'DAY',
				value: days_and_nights.day
			},
			{
				label: 'DAWN',
				value: days_and_nights.dawn
			},
			{
				label: 'NIGHT',
				value: days_and_nights.night
			},
			{
				label: 'OTHER',
				value: days_and_nights.other
			},
		];

		plugin.data.scenes = scenes;


	};

	plugin.deactivate = function () {
		log.info('stats:deactivate');
	};

	return plugin;
});