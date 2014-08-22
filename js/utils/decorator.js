define(function () {

	var decorator = function (func) {
		var _handlers = [],
			result;

		var runner = function () {
			var self = this;
			var args;

			args = Array.prototype.slice.call(arguments, 0);
			result = func.apply(self, args);

			if (runner.lock) {
				runner.lock = false;
			} else {
				_handlers.forEach(function (handler) {
					if (result instanceof Function && result.add) {
						result.add(handler);
					} else {
						handler.apply(self, [result, args]);
					}
				});
			}
			
			return result;
		};

		runner.add = function (handler) {
			_handlers.push(handler);
		};
		
		runner.decorated = true;

		return runner;
	};

	decorator.signal = function () {
		return decorator(function (value) {
			return value;
		});
	};
	
	decorator.property = function () {
		var _value;
		var property = decorator(function(value) {
			if (arguments.length === 0) {
				property.lock = true;
				return _value;
			}
			else {
				_value = value;
				return _value;
			}
		});
		return property;
	};


	return decorator;

});