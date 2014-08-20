define(['libs/codemirror/lib/codemirror'], function (CodeMirror) {
	"use strict";

	CodeMirror.defineMode("fountain", function (config) {
		"use strict";

		var last;

		// our various parsers
		var parsers = {

			// the main tokenizer
			tokenizer: function (stream, state) {
				if (stream.match(/^((INT.?\/.EXT\.?)|(I\/E)|(INT\.?)|(EXT\.?)).*$/, true)) {
					return "scene-header";
				} else {
					stream.next();
					return null;
				}
			},
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