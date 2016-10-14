define(function(require) {

    var $ = require('jquery'),
        common = require('utils/common'),
        layout = require('utils/layout'),
        HandlebarComponent = require('utils/handlebar-component');

    return HandlebarComponent.extend({

        hbs: '<textarea id="editor-textarea" placeholder=""></textarea>',

        plugin: null,

        addInteractions: function() {
            var editor = this.plugin;

            editor.create_editor($('#editor-textarea').get(0));

            var editor_content = $('.plugin-content[plugin="editor"]');

            var sync_on_icon = 'gfx/icons/other/sync.svg',
                sync_off_icon = 'gfx/icons/other/no-sync.svg',
                update_sync_layout = function() {
                    $('.auto-reload-icon')
                        .attr('src', editor.is_sync() ? sync_on_icon : sync_off_icon)
                        .attr('title', editor.is_sync() ? 'Turn auto-reload off' : 'Turn auto-reload on');
                    $('.auto-save-icon')
                        .attr('src', editor.is_auto_save() ? sync_on_icon : sync_off_icon)
                        .attr('title', editor.is_auto_save() ? 'Turn auto-save off' : 'Turn auto-save on');
                    $('.CodeMirror').css('opacity', editor.is_sync() ? 0.5 : 1);
                };

            $('a[action="sync-fountain"]').click(function() {
                if (editor.is_sync()) {
                    editor.toggle_sync();
                    $.prompt('Synchronization turned off.', {
                        buttons: {'Keep content': true, 'Load version before sync': false},
                        submit: function(e, v) {
                            if (!v) {
                                editor.restore();
                            }
                        }
                    });
                }
                else {
                    editor.store();
                    $.prompt("You can start writing in your editor. Content will be synchronized with ’afterwriting! PDF preview, facts and stats will be automatically updated.", {
                        buttons: {'OK': true, 'Cancel': false},
                        submit: function(e, v) {
                            if (v) {
                                editor.toggle_sync();
                            }
                        }
                    });
                }
            });

            $('a[action="auto-save"]').click(function() {
                if (editor.is_sync()) {
                    $.prompt('This will turn auto-reload off. Do you wish to continue?', {
                        buttons: {'Yes': true, 'No': 'false'},
                        submit: function(e, v) {
                            if (v) {
                                editor.toggle_auto_save();
                            }
                        }
                    });
                }
                else {
                    editor.toggle_auto_save();
                }
            });

            editor.activate.add(function() {
                if (editor.sync_available()) {
                    $('a[action="sync-fountain"]').parent().show();
                }
                else {
                    $('a[action="sync-fountain"]').parent().hide();
                }

                if (editor.auto_save_available()) {
                    $('a[action="auto-save"]').parent().show();
                }
                else {
                    $('a[action="auto-save"]').parent().hide();
                }
                update_sync_layout();
            });

            editor.toggle_sync.add(function() {
                update_sync_layout();
            });

            editor.toggle_auto_save.add(function() {
                update_sync_layout();
            });

            function update_auto_save_icon() {

                if (editor.is_auto_save()) {
                    if (editor.pending_changes() || editor.save_in_progress()) {
                        $('.auto-save-icon').addClass('in-progress');
                    }
                    else {
                        $('.auto-save-icon').removeClass('in-progress');
                    }

                    if (editor.save_in_progress()) {
                        $('.auto-save-icon').addClass('rotate');
                    }
                    else {
                        $('.auto-save-icon').removeClass('rotate');
                    }
                }
                else {
                    $('.auto-save-icon').removeClass('rotate');
                    $('.auto-save-icon').removeClass('in-progress');
                }
            }

            editor.save_in_progress.add(update_auto_save_icon);
            editor.pending_changes.add(update_auto_save_icon);

            var resize = function() {

                editor.set_size("auto", $(this.root.parentNode).height() - 70);
            }.bind(this);

            resize();
            $(window).resize(resize);
        }
    });
});

