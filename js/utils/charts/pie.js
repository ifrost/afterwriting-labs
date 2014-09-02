/* global define */
define(function (require) {
	var d3 = require('d3');

	var plugin = {};

	plugin.render = function(id, data, layout) {

		var vis = d3.select(id)
			.append('svg:svg')
			.data([data])
			.attr('width', 200)
			.attr('height', 200)
			.style('margin-left', 'auto')
			.style('margin-right', 'auto')
			.append('svg:g')
			.attr('transform', 'translate(100,100)');

		var arc = d3.svg.arc().outerRadius(100);
		var pie = d3.layout.pie().value(function (d) {
			return d.value;
		});

		var arcs = vis.selectAll('g')
			.data(pie)
			.enter()
			.append('svg:g');

		var color = function (d) {
			if (d.data.label == 'DAY') {
				return '#ffffff';
			} else if (d.data.label == 'NIGHT') {
				return '#222222';
			} else if (d.data.label == 'DAWN') {
				return '#777777';
			} else if (d.data.label == 'DUSK') {
				return '#444444';
			} else {
				return '#aaaaaa';
			}
		};
		arcs.append('svg:path')
			.attr('fill', function (d) {
			return color(d);
		}).attr('d', arc)
			.on("mouseover", function (d) {
			layout.show_tooltip(d.data.label + ': ' + d.data.value + (d.data.value == 1 ? ' scene' : ' scenes'));
		})
			.on("mousemove", function () {
			layout.move_tooltip(d3.event.pageX, d3.event.pageY);
		})
			.on("mouseout", function () {
			layout.hide_tooltip();
		});

		vis.append('svg:circle')
			.attr('fill', 'none')
			.attr('stroke', '#000000')
			.attr('stroke-width', '1')
			.attr('cx', '0')
			.attr('cy', '0')
			.attr('r', '100');
	};
	
	return plugin;
});