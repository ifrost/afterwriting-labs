/* global define */
define(function () {
	var module = {};

	var _state = 'normal'; // 'dialogue'

	var get_all_tokens = function (script, cfg) {

		var result = {
			title_page: [],
			tokens: []
		};

		var regex = {
			title_page: /(title|credit|author[s]?|source|notes|draft date|date|contact|copyright)\:.*/i,
			
            section: /^(#+)(?: *)(.*)/,
            synopsis: /^(?:\=(?!\=+) *)(.*)/,

			scene_heading: /^((?:\*{0,3}_?)?(?:(?:int|ext|est|i\/e)[. ]).+)|^(?:\.(?!\.+))(.+)/i,
			scene_number: /( *#(.+)# *)/,

			transition: /^((?:FADE (?:TO BLACK|OUT)|CUT TO BLACK)\.|.+ TO\:)|^(?:> *)(.+)/,

			dialogue: /^([A-Z*_]+[0-9A-Z (._\-')]*)(\^?)?(?:\n(?!\n+))([\s\S]+)/,
			character: /^([A-Z*_]+[0-9A-Z (._\-')]*)\^?$/,
			parenthetical: /^(\(.+\))$/,

			action: /^(.+)/g,
			centered: /^(?:> *)(.+)(?: *<)(\n.+)*/g,

			page_break: /^\={3,}$/,
			line_break: /^ {2}$/
		};

		// determine end line delimeter lengths
		var new_line_length = script.match(/\r\n/) ? 2 : 1;

		// split text
		var lines = script.split(/\r\n|\r|\n/);

		var lines_length = lines.length,
			current = 0,
			match, text, last_title_page_token,
			token, last_was_separator = false,
			token_category = 'none', last_character_index,
			dual_right;
		var state = 'normal';
		for (var i = 0; i < lines_length; i++) {
			text = lines[i];
			token = {
				text: text.trim(),
				start: current,
				end: current + text.length - 1 + new_line_length,
				line: i
			};
			current = token.end + 1;

			if (text.length === 0) {
				if (!last_was_separator) {
					state = 'normal';
					dual_right = false;
					token.type = 'separator';
					last_was_separator = true;
					result.tokens.push(token);
					continue;
				} else {
					continue;
				}
			}

			token_category = 'script';

			if (regex.title_page.test(token.text)) {
				var split = token.text.split(":");
				token.type = split[0].toLowerCase();
				token.text = split[1] || '';
				state = 'title_page';
				last_title_page_token = token;
				result.title_page.push(token);
				continue;
			} else if (state == 'title_page') {
				last_title_page_token.text += (last_title_page_token.text ? "\n" : "") + token.text;
				continue;
			}

			if (state === 'normal') {
				if (token.text.match(regex.line_break)) {
					token_category = 'none';
				} else if (token.text.match(regex.centered)) {
					token.type = 'centered';
					token.text = token.text.replace(/>|</g, '').trim();
				} else if (token.text.match(regex.transition)) {
					token.text = token.text.replace(/> ?/, '');
					token.type = 'transition';
				} 
				else if (match = token.text.match(regex.synopsis)) {
					if (!cfg.print_synopsis) {
						continue;
					}
					token.text = match[1];
					token.type = 'synopsis';
				}
				else if (match = token.text.match(regex.section)) {
					if (!cfg.print_sections) {
						continue;
					}
					token.level = match[1].length;
					token.text = match[2];
					token.type = 'section';
				}
				else if (token.text.match(regex.scene_heading)) {
					token.text = token.text.replace(/^\./, '');
					if (cfg.double_space_between_scenes) {
						var additional_separator = {
							text: '',
							start: token.start,
							end: token.end,
							line: token.line,
							type: 'separator'
						};
						result.tokens.push(additional_separator);
					}
					token.type = 'scene_heading';
				} else if (token.text.match(regex.character)) {
					if (i === lines_length || i === lines_length - 1 || lines[i + 1].length === 0) {
						token.type = 'shot';
					} else {
						state = 'dialogue';
						token.type = 'character';
						if (token.text[token.text.length - 1] === '^') {
							if (cfg.use_dual_dialogue) {
								// update last dialogue to be dual:left
								var dialogue_tokens = ['dialogue', 'character', 'parenthetical'];
								while(dialogue_tokens.indexOf(result.tokens[last_character_index].type) != -1) {
									result.tokens[last_character_index].dual = 'left';
									last_character_index++;
								}
								token.dual = 'right';								
								dual_right = true;
							}
							token.text = token.text.replace('^', '');
						}
						last_character_index = result.tokens.length;
					}
				} else if (token.text.match(regex.page_break)) {
					token.text = '';
					token.type = 'page_break';
				} else {
					token.type = 'action';
				}
			} else {
				if (token.text.match(regex.parenthetical)) {
					token.type = 'parenthetical';
				} else {
					token.type = 'dialogue';
				}
				if (dual_right) {
					token.dual = 'right';
				}
			}

			last_was_separator = false;

			if (token_category === 'script') {
				result.tokens.push(token);
			}

		}

		return result;
	};

	var split_text = function (text, max, index, token) {
		if (text.length <= max) {
			return [{
				type: token.type,
				token: token,
				text: text,
				start: index,
				end: index + text.length - 1
			}];
		}
		var pointer = text.substr(0, max + 1).lastIndexOf(" ");

		if (pointer === -1) {
			pointer = max - 1;
		}

		return [{
			type: token.type,
			token: token,
			text: text.substr(0, pointer),
			start: index,
			end: index + pointer
		}].concat(split_text(text.substr(pointer + 1), max, index + pointer, token));
	};

	var split_token = function (token, max) {
		token.lines = split_text(token.text || "", max, token.start, token);
	};

	var default_breaker = function (index, lines, cfg) {
		for (var before = index - 1; before && !(lines[before].text); before--) {}
		for (var after = index + 1; after < lines.length && !(lines[after].text); after++) {}

		var token_on_break = lines[index].type;
		var token_after = lines[after] ? lines[after].type : "";
		var token_before = lines[before] ? lines[before].type : "";

		if (token_on_break === "scene_heading" && token_after !== "scene_heading") {
			return false;
		} else if (cfg.split_dialogue && token_on_break == "dialogue" && token_after == "dialogue" && token_before == "dialogue" && !(lines[index].token.dual)) {
			console.log(lines[index]);
			for (var character = before; lines[character].type != "character"; character--) {}
			lines.splice(index, 0, {
				type: "parenthetical",
				text: cfg.text.more || "(MORE)"
			}, {
				type: "character",
				text: lines[character].text.trim() + " " + (cfg.text.continued || "(CONT'D)")
			});
			return true;
		} else if (["character", "dialogue", "parenthetical"].indexOf(token_on_break) != -1 && ["dialogue", "parenthetical"].indexOf(token_after) != -1) {
			return false; // or break
		}

		return true;
	};

	var break_lines = function (lines, max, breaker, cfg) {
		while (lines.length && !(lines[0].text)) {
			lines.shift();
		}


		var s = max;
		var p, internal_break = 0;


		for (var i = 0; i < lines.length && i < max; i++) {
			if (lines[i].type == 'page_break') {
				internal_break = i;
			}
		}

		if (!internal_break) {

			if (lines.length <= max) {
				return lines;
			}

			do {
				for (p = s - 1; p && !(lines[p].text); p--) {}
				s = p;
			} while (!breaker(p, lines, cfg));
		} else {
			p = internal_break - 1;
		}
		var page = lines.slice(0, p + 1);
		page.push({
			type: "page_break"
		});
		var append = break_lines(lines.slice(p + 1), max, breaker, cfg);
		return page.concat(append);
	};

	module.parse = function (text, cfg) {

		var result = get_all_tokens(text, cfg);
		result.lines = [];

		_state = 'normal';

		result.tokens.forEach(function (token) {
			var max = (cfg.print()[token.type] || {}).max || 99999;
			if (token.dual) {
				max *= 0.75;
			}
			split_token(token, max);

			token.lines.forEach(function (line) {
				result.lines.push(line);
			});
		});
		
		// fold dual dialogue for breaking
		var dual_left, dual_right, contains_dual = true;
		while (contains_dual) {
			dual_left = -1;
			dual_right = -1;
			contains_dual = false;
			// find left && right index		
			for (var i=0; i<result.lines.length; i++) {
				if (result.lines[i].token && result.lines[i].token.type === 'character' && result.lines[i].token.dual === 'left') {
					dual_left = i;
				}
				else if (result.lines[i].token && result.lines[i].token.dual === 'right') {
					dual_right = i;					
					break;
				}
			}
			// move right to left
			if (dual_left != -1 && dual_right != -1) {
				contains_dual = true;
				result.lines[dual_left].right_column = [];
				while (result.lines[dual_right].token.dual === 'right') {
					result.lines[dual_left].right_column.push(result.lines.splice(dual_right, 1)[0]);
				}
				if (result.lines[dual_right].type === 'separator') {
					result.lines.splice(dual_right, 1);
				}
			}
		}
		

		result.lines = break_lines(result.lines, cfg.print().lines_per_page, cfg.lines_breaker || default_breaker, cfg);

		// unfold dual dialogue
		
		console.log(result);
		
		return result;
	};

	return module;

});