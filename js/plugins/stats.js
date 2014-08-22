define(['core', 'logger', 'd3', 'jquery', 'plugins/editor', 'utils/data', 'utils/layout', 'utils/helper'], function (core, logger, d3, $, editor, data, layout, helper) {
	var log = logger.get('stats');
	var plugin = core.create_plugin('stats', 'stats');

	plugin.init = function () {
		log.info('stats:init');
	};

	plugin.goto = function(line) {
		editor.goto(line);
	}
	
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
		data.parsed.tokens.forEach(function (token) {
			var type;
			if (token.type === 'scene_heading') {
				var suffix = token.text.substring(token.text.lastIndexOf(' - '))
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
			}
		});

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