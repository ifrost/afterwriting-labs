/* global define */
define(function (require) {
	"use strict";
	
	var CodeMirror = require('libs/codemirror/lib/codemirror');

	CodeMirror.defineMode("fountain", function () {
		var last;

		// our various parsers
		var parsers = {

			// the main tokenizer
			tokenizer: function (stream) {
				if (stream.match(/^((INT.\/.EXT\.)|(I\/E)|(INT\.)|(EXT\.)).*$/, true)) {
					return "scene-header";
				} else {
					stream.next();
					return null;
				}
			}
		};


		// the public API for CodeMirror
		return {
			startState: function () {
				return {
					tokenize: parsers.tokenizer,
					mode: "fountain",
					last: null,
					depth: 0
				};
			},
			token: function (stream, state) {
				var style = state.tokenize(stream, state);
				state.last = last;
				return style;
			},
			electricChars: ""
		};
	});

	CodeMirror.defineMIME("text/fountain", "fountain");

});