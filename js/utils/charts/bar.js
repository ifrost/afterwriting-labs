/* global define */
define(function (require) {
	var d3 = require('d3'),
		$ = require('jquery');

	var plugin = {};

	plugin.render = function (id, data, layout, helper, stats) {
		var max = 0;
		data.forEach(function (scene) {
			if (scene.length > max) {
				max = scene.length;
			}
		});
		data.forEach(function (scene) {
			scene.value = scene.length / (max * 1.1);
		});

		var graph_width = ($('.content').width() - (layout.small ? 30 : 100));
		var scene_width = graph_width / data.length;

		var vis = d3.select(id)
			.append('svg:svg')
			.attr('width', '100%')
			.attr('height', '200');

		$('#stats-scene-length svg').attr('viewBox', '0 0 200px ' + graph_width + 'px')

		var bars = vis.selectAll('g')
			.data(stats.data.scenes)
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
			stats.goto(d.token.line);
		})
			.on("mouseover", function (d) {
			layout.show_tooltip(d.header + ' (time: ' + helper.format_time(helper.lines_to_minutes(d.length)) + ')');
		})
			.on("mousemove", function () {
			layout.move_tooltip(d3.event.pageX, d3.event.pageY);
		})
			.on("mouseout", function () {
			layout.hide_tooltip();
		});

		vis.append('svg:path')
			.attr('d', 'M 0 0 L 0 200')
			.attr('stroke', '#000000');

		vis.append('svg:path')
			.attr('d', 'M 0 200 L 600 200')
			.attr('stroke', '#000000');

	};
	
	return plugin;
});