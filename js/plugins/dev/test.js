define(function (require) {
	var template = require('text!templates/plugins/dev/test.hbs'),
      pm = require('utils/pluginmanager'),
		fparser = require('aw-parser').parser,
		fliner = require('utils/fountain/liner'),
		data = require('modules/data');

	var plugin = pm.create_plugin('dev/test', 'test', template);

	plugin.parse_times = function (times) {
		var start, end, result = [],
			config = data.config,
			parsed, tokens, lines,
			script = data.script();

		start = new Date().getTime();
		for (var i = 0; i < times; i++) {
			parsed = fparser.parse(script, config);
		}
		end = new Date().getTime();
		result.push({
			action: 'parser',
			avg: (end - start) / times
		});

		tokens = parsed.tokens;
		
		start = new Date().getTime();
		for (i = 0; i < times; i++) {
			lines = fliner.line(tokens, config);
		}
		end = new Date().getTime();
		result.push({
			action: 'liner',
			avg: (end - start) / times
		});

		return result;
	};

	return plugin;
});