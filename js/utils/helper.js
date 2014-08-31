/* global define */
define(function (require) {
	
	var data = require('modules/data'),
		d3 = require('d3');
	
	var module = {};

	module.format_time = function (total) {
		var hours = Math.floor(total / 60);
		var minutes = Math.floor(total % 60);
		var seconds = Math.floor(60 * (total % 1));

		var string_time = function (value) {
			value = value.toString();
			return value.length == 1 ? '0' + value : value;
		};

		var result = hours ? string_time(hours) + ':' : '';
		result += string_time(minutes) + ':' + string_time(seconds);
		return result;
	};

	var date_formatter = d3.time.format("%Y-%m-%d %H:%M");
	module.format_date = function (date) {
		return date_formatter(date);
	};

	module.lines_to_minutes = function (lines) {
		return lines / data.config.print().lines_per_page;
	};

	module.version_generator = function (current) {
		current = current || "0";

		var numbers = current.split('.').concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

		var bump = function (level) {
			numbers[level - 1]++;
			for (var i = level; i < numbers.length; i++) {
				numbers[i] = 0;
			}
		};

		var to_str = function () {
			var copy = numbers.concat();
			copy.reverse();
			while (copy.length > 1 && copy[0] === 0) {
				copy.shift();
			}
			copy.reverse();
			return copy.join('.');
		};

		var increase = function (level) {
			if (arguments.length === 0) {
				return to_str();
			}
			bump(level);
			return to_str();
		};

		return increase;
	};

	return module;

});