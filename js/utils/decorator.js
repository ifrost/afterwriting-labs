define(function () {

	var decorator = function (func) {
		var _handlers = [],
			result;

		var runner = function () {
			var self = this;
			try {
				result = func.apply(self, Array.prototype.slice.call(arguments, 0));
			} catch (error) {
				// rethrow
				throw error;
			}

			_handlers.forEach(function (handler) {
				if (result instanceof Function && result.add) {
					result.subscribe(handler);
				} else {
					handler.call(self, result);
				}
			});
			return result;
		};
		
		runner.add = function (handler) {
			_handlers.push(handler);
		}

		return runner;
	}

	return decorator;

});