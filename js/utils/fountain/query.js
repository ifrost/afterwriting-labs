/* global define */
define(function () {

	var fquerybuilder = function (key_name, base, config) {

		var fquery = {
			key_name: key_name,
			base: base,
			processors: [],
			result: [],
			config: config || {}
		};
		
		fquery.not = function(condition) {
			return function(item) {
				return !condition(item);
			};
		};

		fquery.enter = function (condition, action) {
			var processor = {
				condition: condition,
				action: action
			};
			fquery.processors.push(processor);
			return fquery;
		};

		fquery.exit = function (func) {
			fquery.exit_handler = func;
		};
		
		fquery.select = function (key) {
			var selection;
			for (var i = 0; i < fquery.result.length; i++) {
				if (fquery.result[i][fquery.key_name] === key) {
					selection = fquery.result[i];
				}
			}

			if (selection === undefined) {
				var item = {};
				item[fquery.key_name] = key;
				for (var prop in base) {
					item[prop] = base[prop];
				}
				fquery.result.push(item);
				return item;
			} else {
				return selection;
			}
		};
		
		fquery.count = function(counter_name, condition, key) {
			fquery.enter(condition, function(item, fq){
				var selector = fq.select(key);
				if (!selector.hasOwnProperty(counter_name)) {
					selector[counter_name] = 0;
				};
				selector[counter_name]++;
			});
		};

		fquery.run = function (data) {
			fquery.result = [];
			data.forEach(function (item) {
				fquery.processors.forEach(function (processor) {
					if (processor.condition === true || processor.condition(item)) {
						processor.action(item, fquery);
					}
				});
			});

			if (fquery.config.sort_by) {
				var sort_prop = fquery.config.sort_by;
				fquery.result.sort(function (a, b) {
					return fquery.config.asc ? a[sort_prop] - b[sort_prop] : b[sort_prop] - a[sort_prop];
				});
			}

			if (fquery.exit_handler) {
				fquery.result.forEach(function (item) {
					fquery.exit_handler(item, fquery);
				});
			}

			return fquery.result;
		};


		return fquery;

	};

	return fquerybuilder;
});