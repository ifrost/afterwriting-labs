define(function(require) {

    var Protoplast = require('p'),
        print_profiles = require('utils/print-profiles');

    var DefaultSettingsProvider = Protoplast.extend({

        getConfig: function() {
            var config = {
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

            config.print = function() {
                return print_profiles[config.print_profile];
            }.bind(this);

            return config;
        }

    });

    return DefaultSettingsProvider;
});