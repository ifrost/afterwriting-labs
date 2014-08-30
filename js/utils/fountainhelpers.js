/* global define */
define(function () {

	var module = {};

	var token_is = function () {
		var types = Array.prototype.slice.call(arguments);
		return types.indexOf(this.type) != -1;
	};

	var token_is_dialogue = function () {
		return this.is('character', 'parenthetical', 'dialogue');
	};

	var line_is = function() {
		return this.token && this.token.is.apply(this.token, arguments);
	};
	
	var line_is_dialogue = function () {
		return this.token && this.token.is_dialogue();
	};

	module.enrich_token = function (token) {
		token.is = token_is;
		token.is_dialogue = token_is_dialogue;
		return token;
	};

	module.enrich_line = function (line) {
		line.is = line_is;
		line.is_dialogue = line_is_dialogue;
		return line;
	};


	return module;
});