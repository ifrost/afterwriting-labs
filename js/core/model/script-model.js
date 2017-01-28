define(function(require) {

    var Protoplast = require('p'),
        fquery = require('utils/fountain/query'),
        fhelpers = require('utils/fountain/helpers'),
        data = require('modules/data');

    var h = fhelpers.fq;

    var ScriptModel = Protoplast.Model.extend({

        settings: {
            inject: 'settings'
        },
        
        /**
         * Basic stats query
         */
        _basicStats: null,
        
        config: {
            set: function(value) {
                data.config = value
            },
            get: function() {
                throw new Error('data.config is deprecated, use Settings instead')
            }
        },
        
        format: {
            set: function(value) {
                data.format = value
            },
            get: function() {
                return data.format
            }
        },

        parsed: {
            set: function(value) {
                data.parsed = value;
            },
            get: function() {
                return data.parsed;
            }
        },
        
        parsed_stats: {
            set: function(value) {
                data.parsed_stats = value;
            },
            get: function() {
                return data.parsed_stats;
            }
        },

        bindScript: function(callback) {
            return data.bindScript(callback);
        },
        
        script: function(value) {
            if (arguments.length) {
                return data.script(value);
            }
            else {
                return data.script();
            }
        },
        
        parse: function() {
            return data.parse();
        },
        
        getBasicStats: function() {
            this._createStatsQuery(); // to refresh config-related properties
            return this._basicStats.run(data.parsed_stats.lines);
        },
        
        _createStatsQuery: function() {
            var print = this.settings.print();
            var basic = fquery(null, {
                last_page_lines: 0,
                scenes: 0,
                pages: 0,
                filled_pages: 0,
                action_lines: 0,
                dialogue_lines: 0,
                action_scenes: 0,
                dialogue_scenes: 0
            });
            basic.prepare(function (fq) {
                fq.current_scene_heading_token = null;
                fq.dialogue_in_the_scene = false;
            });
            basic.count('action_lines', h.is('action', 'scene_heading', 'shot'));
            basic.count('dialogue_lines', h.is_dialogue());
            basic.count('pages', h.is('page_break'));
            basic.enter(h.is_dialogue(), function (item, fq) {
                fq.dialogue_in_the_scene = true;
            });
            basic.enter(h.is('scene_heading'), function (item, fq) {
                if (fq.current_scene_heading_token !== item.token) {
                    fq.select().scenes++;
                    fq.current_scene_heading_token = item.token;
                    if (fq.select().scenes > 1) {
                        if (fq.dialogue_in_the_scene) {
                            fq.select().dialogue_scenes += 1;
                        } else {
                            fq.select().action_scenes += 1;
                        }
                        fq.dialogue_in_the_scene = false;
                    }
                }
            });
            basic.enter(true, function (item, fq) {
                var selector = fq.select();
                if (item.is('page_break')) {
                    selector.filled_pages += (selector.last_page_lines + 1) / print.lines_per_page;
                    selector.last_page_lines = 0;
                } else {
                    selector.last_page_lines++;
                }
            });
            basic.exit(function (item, fq) {
                // last scene
                if (fq.dialogue_in_the_scene) {
                    fq.select().dialogue_scenes++;
                } else {
                    fq.select().action_scenes++;
                }

                var all = item.action_lines + item.dialogue_lines;
                item.pages = item.pages + item.last_page_lines / print.lines_per_page;
                item.filled_pages += item.last_page_lines / print.lines_per_page;
                item.action_time = (item.action_lines / all) * item.filled_pages;
                item.dialogue_time = (item.dialogue_lines / all) * item.filled_pages;
            });
            basic.end(function (result) {
                if (result.length === 0) {
                    result.push({
                        pages: 0.0,
                        filled_pages: 0.0,
                        scenes: 0,
                        action_time: 0.0,
                        dialogue_time: 0.0,
                        dialogue_lines: 0,
                        characters: [],
                        locations: []
                    });
                }
            });
            
            this._basicStats = basic;
        }
        
    });

    return ScriptModel;
});