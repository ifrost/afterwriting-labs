define(function(require) {

    var PDFDocument = require('pdfkit'),
        fonts = require('utils/fonts'),
        textstats = require('utils/textstats'),
        helper = require('utils/helper');

    var module = {}, data = null;

    var create_simplestream = function(filepath) {
        var simplestream = {
            chunks: [],
            filepath: filepath
        };
        simplestream.on = function(event, callback) {
            this.callback = callback;
        };
        simplestream.once = function() {
        };
        simplestream.emit = function() {
        };
        simplestream.write = function(chunk) {
            this.chunks.push(chunk);
        };
        simplestream.end = function() {
            if (simplestream.filepath) {
                var fsmodule = 'fs';
                var fs = require(fsmodule); // bypass requirejs minification/optimization
                var stream = fs.createWriteStream(simplestream.filepath, {
                    encoding: "binary"
                });
                stream.on('finish', this.callback);
                simplestream.chunks.forEach(function(buffer) {
                    stream.write(new Buffer(buffer.toString('base64'), 'base64'));
                });
                stream.end();
            } else {
                simplestream.blob = new Blob(simplestream.chunks, {
                    type: "application/pdf"
                });
                simplestream.url = URL.createObjectURL(this.blob);
                this.callback(simplestream);
            }
        };
        return simplestream;
    };

    function initDoc() {
        var cfg = data.config;
        var options = {
            compress: false,
            size: cfg.print().paper_size === "a4" ? 'A4' : 'LETTER',
            margins: {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }
        };
        var doc = new PDFDocument(options);
        doc.font(fonts.prime.normal);
        doc.fontSize(cfg.print().font_size || 12);

        // convert points to inches for text
        doc.reset_format = function() {
            doc.format_state = {
                bold: false,
                italic: false,
                underline: false,
                override_color: null
            };
        };
        doc.reset_format();
        var inner_text = doc.text;
        doc.simple_text = function() {
            doc.font(fonts.prime.normal);
            inner_text.apply(doc, arguments);
        }
        doc.format_text = function(text, x, y, options) {
            var cache_current_state = doc.format_state;
            doc.reset_format();
            doc.text(text, x, y, options);
            doc.format_state = cache_current_state;
        };
        doc.text = function(text, x, y, options) {
            options = options || {};
            var color = options.color || 'black';
            color = doc.format_state.override_color ? doc.format_state.override_color : color;

            doc.fill(color);

            if (cfg.print().note.italic) {
                text = text.replace(/\[\[/g, '*[[').replace(/\]\]/g, ']]*');
            }

            var split_for_fromatting = text.split(/(\\\*)|(\*{1,3})|(\\?_)|(\[\[)|(\]\])/g).filter(function(a) {
                return a
            });

            var font_width = cfg.print().font_width;
            for (var i = 0; i < split_for_fromatting.length; i++) {
                var elem = split_for_fromatting[i];
                if (elem === '***') {
                    doc.format_state.italic = !doc.format_state.italic;
                    doc.format_state.bold = !doc.format_state.bold;
                } else if (elem === '**') {
                    doc.format_state.bold = !doc.format_state.bold;
                } else if (elem === '*') {
                    doc.format_state.italic = !doc.format_state.italic;
                } else if (elem === '_') {
                    doc.format_state.underline = !doc.format_state.underline;
                } else if (elem === '[[') {
                    doc.format_state.override_color = (cfg.print().note && cfg.print().note.color) || '#000000';
                    doc.fill(doc.format_state.override_color);
                } else if (elem === ']]') {
                    doc.format_state.override_color = null;
                    doc.fill('black');
                } else {
                    if (doc.format_state.bold && doc.format_state.italic) {
                        doc.font(fonts.prime.bolditalic);
                    } else if (doc.format_state.bold) {
                        doc.font(fonts.prime.bold);
                    } else if (doc.format_state.italic) {
                        doc.font(fonts.prime.italic);
                    } else {
                        doc.font(fonts.prime.normal);
                    }
                    if (elem === '\\_' || elem === '\\*') {
                        elem = elem.substr(1, 1);
                    }
                    inner_text.call(doc, elem, x * 72, y * 72, {
                        underline: doc.format_state.underline,
                        lineBreak: options.line_break
                    });
                    x += font_width * elem.length;
                }
            }


        };

        return doc;
    }

    function finishDoc(doc, callback, filepath) {
        var stream = doc.pipe(create_simplestream(filepath));
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

        doc.info.Title = title_token ? title_token.text : '';
        doc.info.Author = author_token ? author_token.text : '';
        doc.info.Creator = 'afterwriting.com';

        // helper
        var center = function(txt, y) {
            var txt_length = txt.replace(/\*/g, '').replace(/_/g, '').length;
            var feed = (cfg.print().page_width - txt_length * cfg.print().font_width) / 2;
            doc.text(txt, feed, y);
        };

        var title_y = cfg.print().title_page.top_start;

        var title_page_next_line = function() {
            title_y += cfg.print().line_spacing * cfg.print().font_height;
        };

        var title_page_main = function(type, options) {
            options = options || {};
            if (type === undefined) {
                title_page_next_line();
                return;
            }
            var token = data.get_title_page_token(type);
            if (token) {
                token.text.split('\n').forEach(function(line) {
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

            var concat_types = function(prev, type) {
                var token = data.get_title_page_token(type);
                if (token) {
                    prev = prev.concat(token.text.split('\n'));
                }
                return prev;
            };

            var left_side = cfg.print().title_page.left_side.reduce(concat_types, []),
                right_side = cfg.print().title_page.right_side.reduce(concat_types, []),
                title_page_extra = function(x) {
                    return function(line) {
                        doc.text(line.trim(), x, title_y);
                        title_page_next_line();
                    };
                };

            title_y = 8.5;
            left_side.forEach(title_page_extra(1.3));

            title_y = 8.5;
            right_side.forEach(title_page_extra(5));

            // script
            doc.addPage();
        }

        if (data.fontFixEnabled) {
            var unicode_sample = textstats.get_characters(data.script());
            unicode_sample.forEach(function(character) {
                doc.format_text(character, 0, 0, {color: '#eeeeee'});
            })
        }

        var y = 0,
            page = 1,
            scene_number,
            prev_scene_continuation_header = '',
            scene_continuations = {},
            current_section_level = 0,
            current_section_number,
            current_section_token,
            section_number = helper.version_generator(),
            text,
            after_section = false; // helpful to determine synopsis indentation

        var print_header_and_footer = function(continuation_header) {
            if (cfg.print_header) {

                continuation_header = continuation_header || '';
                var offset = helper.blank_text(continuation_header);
                if (helper.get_indentation(cfg.print_header).length >= continuation_header.length) {
                    offset = '';
                }
                if (offset) {
                    offset += ' ';
                }

                doc.format_text(offset + cfg.print_header, 1.5, cfg.print().page_number_top_margin, {
                    color: '#777777'
                });
            }
            if (cfg.print_footer) {
                doc.format_text(cfg.print_footer, 1.5, cfg.print().page_height - 0.5, {
                    color: '#777777'
                });
            }
        };


        var print_watermark = function() {
            if (cfg.print_watermark) {
                var options = {
                        origin: [0, 0]
                    },
                    font_size,
                    angle = Math.atan(cfg.print().page_height / cfg.print().page_width) * 180 / Math.PI,
                    diagonal,
                    watermark, len;

                // underline and rotate pdfkit bug (?) workaround
                watermark = cfg.print_watermark.replace(/_/g, '');

                // unformat
                len = watermark.replace(/\*/g, '').length;

                diagonal = Math.sqrt(Math.pow(cfg.print().page_width, 2) + Math.pow(cfg.print().page_height, 2));
                diagonal -= 4;

                font_size = (1.667 * diagonal) / len * 72;
                doc.fontSize(font_size);
                doc.rotate(angle, options);
                doc.format_text(watermark, 2, -(font_size / 2) / 72, {
                    color: '#eeeeee',
                    line_break: false
                });
                doc.rotate(-angle, options);
                doc.fontSize(12);
            }
        };

        print_watermark();
        print_header_and_footer();
        lines.forEach(function(line) {
            if (line.type === "page_break") {

                if (cfg.scene_continuation_bottom && line.scene_split) {
                    var scene_continued_text = '(' + (cfg.text_scene_continued || 'CONTINUED') + ')';
                    var feed = cfg.print().action.feed + cfg.print().action.max * cfg.print().font_width - scene_continued_text.length * cfg.print().font_width;
                    doc.simple_text(scene_continued_text, feed * 72, (cfg.print().top_margin + cfg.print().font_height * (y + 2)) * 72);
                }

                y = 0;
                doc.addPage();
                page++;

                var number_y = cfg.print().page_number_top_margin;

                if (cfg.scene_continuation_top && line.scene_split) {
                    scene_continuations[scene_number] = scene_continuations[scene_number] || 0;
                    scene_continuations[scene_number]++;

                    var scene_continued = (cfg.scenes_numbers !== 'none' && scene_number ? scene_number + ' ' : '') + (cfg.text_scene_continued || 'CONTINUED') + ':';
                    scene_continued += scene_continuations[scene_number] > 1 ? ' (' + scene_continuations[scene_number] + ')' : '';

                    scene_continued = scene_continued.replace(/\*/g, '');
                    doc.simple_text(scene_continued, cfg.print().action.feed * 72, number_y * 72);
                    prev_scene_continuation_header = scene_continued;
                }

                if (cfg.show_page_numbers) {
                    var page_num = page.toFixed() + ".";
                    var number_x = cfg.print().action.feed + cfg.print().action.max * cfg.print().font_width - page_num.length * cfg.print().font_width;
                    doc.simple_text(page_num, number_x * 72, number_y * 72);
                }
                print_watermark();
                print_header_and_footer(prev_scene_continuation_header);
                prev_scene_continuation_header = '';

            } else if (line.type === "separator") {
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
                    if (line.type === "transition") {
                        feed = cfg.print().action.feed + cfg.print().action.max * cfg.print().font_width - line.text.length * cfg.print().font_width;
                    }
                    if (line.type === "scene_heading" && cfg.embolden_scene_headers) {
                        text = '**' + text + '**';
                    }

                    if (line.type === 'section') {
                        current_section_level = line.token.level;
                        feed += current_section_level * cfg.print().section.level_indent;
                        if (cfg.number_sections) {
                            if (line.token !== current_section_token) {
                                current_section_number = section_number(line.token.level);
                                current_section_token = line.token;
                                text = current_section_number + '. ' + text;
                            } else {
                                text = Array(current_section_number.length + 3).join(' ') + text;
                            }

                        }
                    } else if (line.type === 'synopsis') {
                        feed += cfg.print().synopsis.padding || 0;
                        if (cfg.print().synopsis.feed_with_last_section && after_section) {
                            feed += current_section_level * cfg.print().section.level_indent;
                        } else {
                            feed = cfg.print().action.feed;
                        }
                    }


                    if (cfg.print()[line.type] && cfg.print()[line.type].italic && text) {
                        text = '*' + text + '*';
                    }

                    if (line.token && line.token.dual) {
                        if (line.right_column) {
                            var y_right = y;
                            line.right_column.forEach(function(line) {
                                var feed_right = (cfg.print()[line.type] || {}).feed || cfg.print().action.feed;
                                feed_right -= (feed_right - cfg.print().left_margin) / 2;
                                feed_right += (cfg.print().page_width - cfg.print().right_margin - cfg.print().left_margin) / 2;
                                doc.text(line.text, feed_right, cfg.print().top_margin + cfg.print().font_height * y_right++, text_properties);
                            });
                        }

                        feed -= (feed - cfg.print().left_margin) / 2;
                    }

                    doc.text(text, feed, cfg.print().top_margin + cfg.print().font_height * y, text_properties);

                    if (line.number) {
                        scene_number = String(line.number);
                        var scene_text_length = scene_number.length;
                        if (cfg.embolden_scene_headers) {
                            scene_number = '**' + scene_number + '**';
                        }

                        var shift_scene_number;

                        if (cfg.scenes_numbers === 'both' || cfg.scenes_numbers === 'left') {
                            shift_scene_number = (scene_text_length + 4) * cfg.print().font_width;
                            doc.text(scene_number, feed - shift_scene_number, cfg.print().top_margin + cfg.print().font_height * y, text_properties);
                        }

                        if (cfg.scenes_numbers === 'both' || cfg.scenes_numbers === 'right') {
                            shift_scene_number = (cfg.print().scene_heading.max + 1) * cfg.print().font_width;
                            doc.text(scene_number, feed + shift_scene_number, cfg.print().top_margin + cfg.print().font_height * y, text_properties);
                        }
                    }

                    y++;
                }
            }


            // clear after section
            if (line.type === 'section') {
                after_section = true;
            } else if (line.type !== 'separator' && line.type !== 'synopsis') {
                after_section = false;
            }

        });

    }

    module.get_pdf = function(data_module, callback, filepath) {
        data = data_module;
        var doc = initDoc();
        generate(doc);
        finishDoc(doc, callback, filepath);
    };

    return module;

});
