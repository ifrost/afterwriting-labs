/* global define */
define(function (require) {

	var PDFDocument = require('pdfkit'),
		fonts = require('utils/fonts'),
		data = require('modules/data'),
		helper = require('utils/helper');

	var module = {};

	var create_simplestream = function () {
		var simplestream = {
			chunks: []
		};
		simplestream.on = function (event, callback) {
			this.callback = callback;
		};
		simplestream.once = function () {};
		simplestream.emit = function () {};
		simplestream.write = function (chunk) {
			this.chunks.push(chunk);
		};
		simplestream.end = function () {
			simplestream.blob = new Blob(simplestream.chunks, {
				type: "application/pdf"
			});
			simplestream.url = URL.createObjectURL(this.blob)
			this.callback(simplestream);
		};
		return simplestream;
	};

	function initDoc() {
		var cfg = data.config;
		var options = {
			compress: false,
			size: cfg.print().paper_size == "a4" ? 'A4' : 'LETTER',
			margins: {
				top: 0,
				left: 0,
				bottom: 0,
				right: 0
			}
		};
		var doc = new PDFDocument(options);
		doc.font(fonts.prime.normal);
		doc.fontSize(12);

		// convert points to inches for text
		doc.format_state = {bold: false, italic: false, underline: false, override_color: null};
		var inner_text = doc.text;
		doc.simple_text = inner_text;
		doc.text = function (text, x, y, options) {	
			options = options || {};
			var color = options.color || 'black';
			color = doc.format_state.override_color ? doc.format_state.override_color : color;
			
			doc.fill(color);
			
			if (cfg.print().note.italic) {
				text = text.replace(/\[\[/g,'*[[').replace(/\]\]/g,']]*');
			}
			
			var split_for_fromatting = text.split(/(\*{1,3})|(_)|(\[\[)|(\]\])|([^\*_\[\]]+)/g).filter(function(a){return a})
			var font_width = cfg.print().font_width;
			for (var i=0; i<split_for_fromatting.length; i++) {
				var elem = split_for_fromatting[i];
				if (elem == '***') {
					doc.format_state.italic = !doc.format_state.italic;
					doc.format_state.bold = !doc.format_state.bold;
				}
				else if (elem === '**') {
					doc.format_state.bold = !doc.format_state.bold;
				}
				else if (elem == '*') {
					doc.format_state.italic = !doc.format_state.italic;
				}
				else if (elem == '_') {
					doc.format_state.underline = !doc.format_state.underline;
				}
				else if (elem == '[[') {
					doc.format_state.override_color = (cfg.print().note && cfg.print().note.color) || '#000000';
					doc.fill(doc.format_state.override_color);
				}
				else if (elem == ']]') {
					doc.format_state.override_color = null;
					doc.fill('black');					
				}
				else {
					if (doc.format_state.bold && doc.format_state.italic) {
						doc.font(fonts.prime.bolditalic);
					}
					else if (doc.format_state.bold) {
						doc.font(fonts.prime.bold);
					}
					else if (doc.format_state.italic) {
						doc.font(fonts.prime.italic);
					}
					else {
						doc.font(fonts.prime.normal);
					}
					inner_text.call(doc, elem, x * 72, y * 72, {underline: doc.format_state.underline});
					x += font_width * elem.length;
				}
			}
			
			
		};

		return doc;
	}

	function finishDoc(doc, callback) {
		var stream = doc.pipe(create_simplestream());
		doc.end();
		stream.on('finish', callback);
	}

	function generate(doc) {
		var parsed = data.parsed,
			cfg = data.config,
			lines = parsed.lines;

		var title_token = data.get_title_page_token('title');
		var author_token = data.get_title_page_token('author');
		if (!author_token) {
			author_token = data.get_title_page_token('authors');
		}

		doc.info.Title= title_token ? title_token.text : '';
		doc.info.Author = author_token ? author_token.text : '';
		doc.info.Creator = 'afterwriting.com';

		// helper
		var center = function (txt, y) {
			var txt_length = txt.replace(/\*/g,'').replace(/_/g,'').length;
			var feed = (cfg.print().page_width - txt_length * cfg.print().font_width) / 2;
			doc.text(txt, feed, y);
		};

		var title_y = cfg.print().title_page.top_start;

		var title_page_next_line = function () {
			title_y += cfg.print().line_spacing * cfg.print().font_height;
		};

		var title_page_main = function (type, options) {
			options = options || {};
			if (type === undefined) {
				title_page_next_line();
				return;
			}
			var token = data.get_title_page_token(type);
			if (token) {
				token.text.split('\n').forEach(function (line) {
					if (options.capitalize) {
						line = line.toUpperCase();
					}
					center(line, title_y);
					title_page_next_line();
				});
			}
		};

		if (cfg.print_title_page) {

			// title page
			title_page_main('title', {
				capitalize: true
			});
			title_page_main();
			title_page_main();
			title_page_main('credit');
			title_page_main();
			title_page_main('author');
			title_page_main();
			title_page_main();
			title_page_main();
			title_page_main();
			title_page_main('source');

			var draft = data.get_title_page_token('draft date');
			doc.text(draft ? draft.text.trim() : "", cfg.print().title_page.draft_date.x, cfg.print().title_page.draft_date.y);
			var contact = data.get_title_page_token('contact');
			doc.text(contact ? contact.text.trim() : "", cfg.print().title_page.contact.x, cfg.print().title_page.contact.y);

			var notes_and_copy = '';
			var notes = data.get_title_page_token('notes');
			var copy = data.get_title_page_token('copyright');
			notes_and_copy = notes ? (notes.text.trim() + "\n") : '';
			notes_and_copy += copy ? copy.text.trim() : '';
			doc.text(notes_and_copy, cfg.print().title_page.notes.x, cfg.print().title_page.notes.y);

			var date = data.get_title_page_token('date');
			doc.text(date ? date.text.trim() : "", cfg.print().title_page.date.x, cfg.print().title_page.date.y);
			doc.note(cfg.print().title_page.date.x * 72, cfg.print().title_page.date.y * 72, 0, 0, 'note');
			
			// script
			doc.addPage();
		}

		var y = 1,
			page = 1,
			current_section_level = 0,
			section_number = helper.version_generator(),
			text;

		lines.forEach(function (line) {
			if (line.type == "page_break") {
				y = 1;
				doc.addPage();
				page++;

				if (cfg.show_page_numbers) {
					var page_num = page.toFixed() + ".";
					var number_x = cfg.print().action.feed + cfg.print().action.max * cfg.print().font_width - page_num.length * cfg.print().font_width;
					var number_y = cfg.print().page_number_top_margin;
					doc.simple_text(page_num, number_x * 72, number_y * 72);
				}
			} else if (line.type == "separator") {
				y++;
			} else {
				// formatting not supported yet
				text = line.text;
				text = text.trim();

				var color = (cfg.print()[line.type] && cfg.print()[line.type].color) || '#000000';
				var text_properties = {
					color: color
				};
				
				if (line.type === 'centered') {
					center(text, cfg.print().top_margin + cfg.print().font_height * y++);
				} else {
					var feed = (cfg.print()[line.type] || {}).feed || cfg.print().action.feed;
					if (line.type == "transition") {
						feed = cfg.print().action.feed + cfg.print().action.max * 0.1 - line.text.length * 0.1;
					}
					if (line.type == "scene_heading" && cfg.embolden_scene_headers) {
						text = '**' + text + '**';
					} 

					if (line.type === 'section') {
						current_section_level = line.token.level;
						feed += current_section_level * cfg.print().section.level_indent;
						if (cfg.number_sections) {
							text = section_number(line.token.level) + '. ' + text;
						}
					} else if (line.type === 'synopsis') {
						feed += cfg.print().synopsis.padding || 0;
						if (cfg.print().synopsis.feed_with_last_section) {
							feed += current_section_level * cfg.print().section.level_indent;
						}
					}


					if (cfg.print()[line.type] && cfg.print()[line.type].italic) {
						text = '*' + text + '*';
					}

					if (line.token && line.token.dual) {
						if (line.right_column) {
							var y_right = y;
							line.right_column.forEach(function (line) {
								var feed_right = (cfg.print()[line.type] || {}).feed || cfg.print().action.feed;
								var text_right = line.text.replace(/\*/g, '').replace(/_/g, '');
								feed_right -= (feed_right - cfg.print().left_margin) / 2;
								feed_right += (cfg.print().page_width - cfg.print().right_margin - cfg.print().left_margin) / 2;
								doc.text(text_right, feed_right, cfg.print().top_margin + cfg.print().font_height * y_right++, text_properties);
							});
						}

						feed -= (feed - cfg.print().left_margin) / 2;
					}

					doc.text(text, feed, cfg.print().top_margin + cfg.print().font_height * y++, text_properties);					
				}
			}

		});

	}

	module.get_pdf = function (callback) {
		var doc = initDoc();
		generate(doc);
		finishDoc(doc, callback);
	};

	return module;

});