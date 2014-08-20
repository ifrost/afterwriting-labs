define(function () {

	var decorator = function (func) {
		var _handlers = [],
			result;

		var runner = function () {
			var self = this;
			var args;
			try {
				args = Array.prototype.slice.call(arguments, 0);
				result = func.apply(self, args);
			} catch (error) {
				// rethrow
				throw error;
			}

			_handlers.forEach(function (handler) {
				if (result instanceof Function && result.add) {
					result.subscribe(handler);
				} else {
					handler.apply(self, [result, args]);
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