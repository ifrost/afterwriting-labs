/* global define */
define(function () {

	var operators = {};

	var module = {
		operators: operators
	};

	operators.is = function () {
		var types = Array.prototype.slice.call(arguments);
		return types.indexOf(this.type) != -1;
	};

	operators.is_dialogue = function () {
		return this.is('character', 'parenthetical', 'dialogue');
	};

	operators.name = function () {
		var character = this.text;
		var p = character.indexOf('(');
		if (p != -1) {
			character = character.substring(0, p);
		}
		character = character.trim();
		return character;
	};

	module.enrich_token = function (token) {
		for (var name in operators) {
			token[name] = operators[name];
		}
		return token;
	};

	var create_token_delegator = function (line, name) {
		return function () {
			return line.token ? line.token[name].apply(line.token, arguments) : null;
		};
	};

	var create_fquery_delegator = function (name) {
		return function () {
			var args = arguments;
			return function (item) {
				return item[name].apply(item, args);
			};
		};
	};

	module.fq = {};
	for (var name in operators) {
		module.fq[name] = create_fquery_delegator(name);
	}

	module.enrich_line = function (line) {
		for (var name in operators) {
			line[name] = create_token_delegator(line, name);
		}
		return line;
	};


	return module;
});