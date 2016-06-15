define('modules/data', function(require) {

    var Modernizr = require('modernizr'),
        fparser = require('utils/fountain/parser'),
        fliner = require('utils/fountain/liner'),
        converter = require('utils/converters/scriptconverter'),
        preprocessor = require('utils/fountain/preprocessor'),
        print_profiles = require('utils/print-profiles'),
        browser = require('utils/browser'),
        Module = require('core/module'),
        off = require('off');

    var Data = Module.extend({

        name: 'data',

        _tempStorage: null,

        format: '',

        _script: null,

        default_config: null,

        fontFixEnabled: !!browser.url_params().fontFix,

        $create: function() {
            this._tempStorage = {};
            this.format = '';
            this._script = '';
            this.script = off(this.script);
            this.parse = off(this.parse);
            this.save_config = off(this.save_config);
            this.init_default_config();
        },

        data: function(key, value) {
            if (Modernizr.localstorage) {
                if (arguments.length === 1) {
                    return window.localStorage.getItem('com.afterwriting.labs.local-storage.' + key);
                } else {
                    window.localStorage.setItem('com.afterwriting.labs.local-storage.' + key, value);
                }
            } else {
                if (arguments.length === 1) {
                    return _tempStorage[key];
                } else {
                    _tempStorage[key] = value;
                }
            }
        },

        script: function(value) {
            if (arguments.length && this._value !== value) {
                var result = converter.to_fountain(value);
                result.value = preprocessor.process_snippets(result.value, this.config.snippets);
                this.format = this.format || result.format;
                this._script = result.value;
            }
            else {
                this.script.lock = true;
            }
            return this._script;
        },

        parse: function() {
            this.parsed = fparser.parse(this.script(), this.config);
            this.parsed.lines = fliner.line(this.parsed.tokens, this.config);

            if (this.config.use_print_settings_for_stats) {
                this.parsed_stats = this.parsed;
            } else {
                var stats_config = Object.create(this.config);
                stats_config.print_actions = true;
                stats_config.print_headers = true;
                stats_config.print_dialogues = true;
                stats_config.print_sections = false;
                stats_config.print_notes = false;
                stats_config.print_synopsis = false;
                this.parsed_stats = fparser.parse(this.script(), stats_config);
                this.parsed_stats.lines = fliner.line(this.parsed_stats.tokens, stats_config);
            }
        },

        get_title_page_token: function(type) {
            var result = null;
            if (this.parsed && this.parsed.title_page) {
                this.parsed.title_page.forEach(function(token) {
                    if (token.is(type)) {
                        result = token;
                    }
                });
            }
            return result;
        },

        init_default_config: function() {
            this.default_config = {
                show_background_image: true,
                embolden_scene_headers: false,
                show_page_numbers: true,
                split_dialogue: true,
                print_title_page: true,
                text_more: '(MORE)',
                text_contd: "(CONT'D)",
                text_scene_continued: 'CONTINUED',
                print_profile: "a4",
                load_last_opened: false,
                night_mode: false,
                double_space_between_scenes: false,
                print_sections: false,
                print_synopsis: false,
                print_actions: true,
                print_headers: true,
                print_dialogues: true,
                number_sections: false,
                use_dual_dialogue: true,
                stats_keep_last_scene_time: true,
                stats_who_with_who_max: 10,
                print_notes: false,
                print_header: '',
                print_footer: '',
                print_watermark: '',
                scenes_numbers: 'none',
                each_scene_on_new_page: false,
                use_print_settings_for_stats: true,
                scene_continuation_bottom: false,
                scene_continuation_top: false,
                cloud_lazy_loading: false,
                pdfjs_viewer: false
            };

            this.default_config.print = function() {
                return print_profiles[this.config.print_profile];
            }.bind(this);

        },

        save_config: function() {
            this.data('config', JSON.stringify(this.config));
        },

        reset_config: function() {
            this.data('config', JSON.stringify({}));
            this.load_config();
        },

        load_config: function(overrides) {
            this.config = Object.create(this.default_config);
            if (!overrides) {
                try {
                    overrides = JSON.parse(this.data('config'));
                } catch (error) {
                    overrides = {};
                }
            }
            for (var attrname in overrides) {
                this.config[attrname] = overrides[attrname];
            }
        },

        prepare: function() {
            this.load_config();
        }

    });

    return Data.create();
});