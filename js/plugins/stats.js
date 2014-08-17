define(['core', 'logger', 'd3', 'jquery', 'plugins/editor'], function (core, logger, d3, $, editor) {
	var log = logger.get('stats');
	var plugin = core.create_plugin('stats', 'stats');

	plugin.init = function () {
		log.info('stats:init');
	};

	var stats = {};

	var render = function () {

		$('#stats-scene-length').empty();
		$('#stats-days-and-nights').empty();

		(function () {
			var max = 0;
			stats.scenes.forEach(function (scene) {
				if (scene.length > max) {
					max = scene.length;
				}
			});
			stats.scenes.forEach(function (scene) {
				scene.value = scene.length / (max * 1.1);
			});

			var scene_width = 590 / stats.scenes.length;

			var vis = d3.select('#stats-scene-length')
				.append('svg:svg')
				.attr('width', '100%')
				.attr('height', '200');

			$('#stats-scene-length svg').attr('viewBox', '0 0 200px 600px')

			var bars = vis.selectAll('g')
				.data(stats.scenes)
				.enter()
				.append('rect');


			var color = function (d) {
				if (d.type == 'day') {
					return '#ffffff';
				} else if (d.type == 'night') {
					return '#222222';
				} else {
					return '#777777';
				}
			}

			bars.attr('width', scene_width)
				.attr('height', function (d) {
				return d.value * 200;
			})
				.attr('y', function (d) {
				return 200 - d.value * 200;
			})
				.attr('x', function (d, i) {
				return i * scene_width;
			})
				.attr('fill', color)
				.attr('stroke', '#000000')
				.style('cursor', 'pointer')
				.on('click', function (d) {
				editor.goto(d.token.line);
			})
				.on("mouseover", function (d) {
				core.show_tooltip(d.header + ' (time: ' + core.format_time(core.lines_to_minutes(d.length)) + ')');
			})
				.on("mousemove", function () {
				core.move_tooltip(d3.event.pageX, d3.event.pageY);
			})
				.on("mouseout", function () {
				core.hide_tooltip();
			});

			vis.append('svg:path')
				.attr('d', 'M 0 0 L 0 200')
				.attr('stroke', '#000000');

			vis.append('svg:path')
				.attr('d', 'M 0 200 L 600 200')
				.attr('stroke', '#000000');

		})();

		(function () {

			var vis = d3.select('#stats-days-and-nights')
				.append('svg:svg')
				.data([stats.days_and_nights])
				.attr('width', 200)
				.attr('height', 200)
				.style('margin', 'auto')
				.append('svg:g')
				.attr('transform', 'translate(100,100)');

			var arc = d3.svg.arc().outerRadius(100);
			var pie = d3.layout.pie().value(function (d) {
				return d.value;
			});

			var arcs = vis.selectAll('g')
				.data(pie)
				.enter()
				.append('svg:g')

			var color = function (d) {
				if (d.data.label == 'DAY') {
					return '#ffffff';
				} else if (d.data.label == 'NIGHT') {
					return '#222222';
				} else {
					return '#777777';
				}
			}
			arcs.append('svg:path')
				.attr('fill', function (d) {
				return color(d);
			}).attr('d', arc)
				.on("mouseover", function (d) {
				core.show_tooltip(d.data.label + ': ' + d.data.value + (d.data.value == 1 ? ' scene' : ' scenes'));
			})
				.on("mousemove", function () {
				core.move_tooltip(d3.event.pageX, d3.event.pageY);
			})
				.on("mouseout", function () {
				core.hide_tooltip();
			});

			vis.append('svg:circle')
				.attr('fill', 'none')
				.attr('stroke', '#000000')
				.attr('stroke-width', '1')
				.attr('cx', '0')
				.attr('cy', '0')
				.attr('r', '100');
		})()
	};

	plugin.activate = function () {
		var scenes = [];
		var days_and_nights = {
			night: 0,
			day: 0,
			other: 0,
			sum: 0
		};
		core.parsed.tokens.forEach(function (token) {
			var type;
			if (token.type === 'scene_heading') {
				if (token.text.search(/- ?DAY/) !== -1) {
					days_and_nights.day++;
					type = 'day';
				} else if (token.text.search(/- ?NIGHT/) !== -1) {
					days_and_nights.night++;
					type = 'night';
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

		stats.days_and_nights = [
			{
				label: 'DAY',
				value: days_and_nights.day
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

		stats.scenes = scenes;

		render();
	};

	plugin.deactivate = function () {
		log.info('stats:deactivate');
	};

	return plugin;
});