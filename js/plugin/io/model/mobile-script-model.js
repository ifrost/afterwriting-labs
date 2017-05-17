define(function(require) {

    var Protoplast = require('protoplast'),
        MobileScriptSettings = require('plugin/io/model/mobile-script-settings'),
        fparser = require('aw-parser').parser,
        fliner = require('utils/fountain/liner');

    /**
     * Script model representing mobile-friendly version of the script
     */
    var MobileScriptModel = Protoplast.Model.extend({
        
        scriptModel: {
            inject: 'script'
        },

        settings: {
            inject: 'settings'
        },

        mobileScriptSetting: {
            inject: MobileScriptSettings
        },
        
        script: {
            computed: ['scriptModel.script'],
            lazy: true,
            value: function() {
                return this.scriptModel.script;
            }
        },
        
        parsed: {
            computed: ['script'],
            lazy: true,
            value: function() {
                var parsed = fparser.parse(this.scriptModel.script, {
                    print_headers: true,
                    print_actions: true,
                    print_dialogues: true,
                    print_notes: true,
                    print_sections: true,
                    print_synopsis: true,
                    each_scene_on_new_page: false,
                    double_space_between_scenes: false,
                    use_dual_dialogue: false,
                    merge_multiple_empty_lines: true
                });

                parsed.lines = fliner.line(parsed.tokens, {
                    print: this.mobileScriptSetting.print,
                    text_more: this.settings.text_more,
                    text_contd: this.settings.text_contd,
                    split_dialogue: true
                });

                return parsed;
            }
        }
        
    });

    return MobileScriptModel;
});