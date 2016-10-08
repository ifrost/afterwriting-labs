define(function(require) {

    var template = require('text!templates/plugins/settings.hbs'),
        $ = require('jquery'),
        HandlebarComponent = require('utils/handlebar-component');
    
    return HandlebarComponent.extend({

        hbs: template,

        plugin: null,

        addInteractions: function() {
            var settings = this.plugin;
            
            var data_to_components = function() {
                var c = settings.get_config();
                $('*[setting="show_background_image"]').prop('checked', c.show_background_image);
                $('*[setting="print_title_page"]').prop('checked', c.print_title_page);
                $('*[setting="embolden_scene_headers"]').prop('checked', c.embolden_scene_headers);
                $('*[setting="load_last_opened"]').prop('checked', c.load_last_opened);
                $('*[setting="night_mode"]').prop('checked', c.night_mode);
                $('*[setting="double_space_between_scenes"]').prop('checked', c.double_space_between_scenes);
                $('*[setting="each_scene_on_new_page"]').prop('checked', c.each_scene_on_new_page);
                $('*[setting="split_dialogue"]').prop('checked', c.split_dialogue);
                $('*[setting="print_sections"]').prop('checked', c.print_sections);
                $('*[setting="print_synopsis"]').prop('checked', c.print_synopsis);
                $('*[setting="print_notes"]').prop('checked', c.print_notes);
                $('*[setting="print_headers"]').prop('checked', c.print_headers);
                $('*[setting="print_actions"]').prop('checked', c.print_actions);
                $('*[setting="print_dialogues"]').prop('checked', c.print_dialogues);
                $('*[setting="number_sections"]').prop('checked', c.number_sections);
                $('*[setting="use_dual_dialogue"]').prop('checked', c.use_dual_dialogue);
                $('*[setting="stats_keep_last_scene_time"]').prop('checked', c.stats_keep_last_scene_time);
                $('*[setting="scene_continuation_top"]').prop('checked', c.scene_continuation_top);
                $('*[setting="scene_continuation_bottom"]').prop('checked', c.scene_continuation_bottom);
                $('*[setting="cloud_lazy_loading"]').prop('checked', c.cloud_lazy_loading);
                $('*[setting="pdfjs_viewer"]').prop('checked', c.pdfjs_viewer);
                $('*[setting="print_profile"]').val(c.print_profile);
                $('*[setting="stats_who_with_who_max"]').val(c.stats_who_with_who_max);
                $('*[setting="print_header"]').val(c.print_header);
                $('*[setting="print_footer"]').val(c.print_footer);
                $('*[setting="print_watermark"]').val(c.print_watermark);
                $('*[setting="scenes_numbers"]').val(c.scenes_numbers);
                $('*[setting="text_more"]').val(c.text_more);
                $('*[setting="text_contd"]').val(c.text_contd);
                $('*[setting="text_scene_continued"]').val(c.text_scene_continued);
            };

            var components_to_data = function() {
                var c = settings.get_config();
                c.show_background_image = $('*[setting="show_background_image"]').is(':checked');
                c.print_title_page = $('*[setting="print_title_page"]').is(':checked');
                c.embolden_scene_headers = $('*[setting="embolden_scene_headers"]').is(':checked');
                c.load_last_opened = $('*[setting="load_last_opened"]').is(':checked');
                c.night_mode = $('*[setting="night_mode"]').is(':checked');
                c.double_space_between_scenes = $('*[setting="double_space_between_scenes"]').is(':checked');
                c.each_scene_on_new_page = $('*[setting="each_scene_on_new_page"]').is(':checked');
                c.split_dialogue = $('*[setting="split_dialogue"]').is(':checked');
                c.print_sections = $('*[setting="print_sections"]').is(':checked');
                c.print_synopsis = $('*[setting="print_synopsis"]').is(':checked');
                c.print_notes = $('*[setting="print_notes"]').is(':checked');
                c.print_headers = $('*[setting="print_headers"]').is(':checked');
                c.print_actions = $('*[setting="print_actions"]').is(':checked');
                c.print_dialogues = $('*[setting="print_dialogues"]').is(':checked');
                c.number_sections = $('*[setting="number_sections"]').is(':checked');
                c.use_dual_dialogue = $('*[setting="use_dual_dialogue"]').is(':checked');
                c.stats_keep_last_scene_time = $('*[setting="stats_keep_last_scene_time"]').is(':checked');
                c.scene_continuation_top = $('*[setting="scene_continuation_top"]').is(':checked');
                c.scene_continuation_bottom = $('*[setting="scene_continuation_bottom"]').is(':checked');
                c.cloud_lazy_loading = $('*[setting="cloud_lazy_loading"]').is(':checked');
                c.pdfjs_viewer = $('*[setting="pdfjs_viewer"]').is(':checked');
                c.stats_who_with_who_max = parseInt($('*[setting="stats_who_with_who_max"]').val());
                c.print_header = $('*[setting="print_header"]').val();
                c.print_footer = $('*[setting="print_footer"]').val();
                c.print_watermark = $('*[setting="print_watermark"]').val();
                c.print_profile = $('*[setting="print_profile"]').val();
                c.scenes_numbers = $('*[setting="scenes_numbers"]').val();
                c.text_more = $('*[setting="text_more"]').val();
                c.text_contd = $('*[setting="text_contd"]').val();
                c.text_scene_continued = $('*[setting="text_scene_continued"]').val();
                settings.save();
            };

            $('.plugin-content[plugin="settings"]').select('input, option').on('change keyup', function() {
                $('.settings-save').removeClass('inactive');
                components_to_data();
            });

            settings.activate.add(function() {
                data_to_components();
            });
            
        }

    });

});
