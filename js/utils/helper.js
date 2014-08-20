define(['plugins/data'], function (data) {
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

	module.lines_to_minutes = function (lines) {
		return lines / data.config.lines_per_page;
	};

	return module;

});