define(function(require) {

    var Module = require('core/module'),
        $ = require('jquery'),
        template = require('text!templates/layout.hbs'),
        Handlebars = require('handlebars'),
        common = require('utils/common'),
        off = require('off'),
        core = require('bootstrap');

    var Layout = Module.extend({

        name: 'layout',

        /**
         * True if on a small layout (based on screen dimensions)
         */
        small: false,

        data: {
            inject: 'data'
        },

        $create: function() {
            // set up handlebars
            Handlebars.registerHelper('static_path', function() {
                return common.data.static_path;
            });

            this.only_active_visible = true;
        },

        switch_and_return: function(plugin) {
            this.switch_to(plugin);
            return plugin;
        },

        calculate_basics: function() {
            this.small = $('html').width() < 800;
        },

        update_selector: function(no_animation) {
            no_animation = no_animation || this.small;
            var active_only = this.only_active_visible;
            var cols = 3;
            var img_size = this.small ? 70 : 100;
            var padding = this.small ? 5 : 15;
            var corner = {};
            corner.top = this.small ? 120 : 150;
            var icons_with_padding = cols * (img_size + padding) + padding;
            corner.left = ($('html').width() - icons_with_padding) / 2;

            var get_position = function(index, all, max) {
                var item_row = Math.floor(index / cols),
                    rows = Math.floor(all / cols),
                    item_col = index % cols,
                    last_row_items = (all % cols) || cols,
                    item_in_the_last_row = (index >= all - last_row_items),
                    items_in_current_row = item_in_the_last_row ? last_row_items : cols,
                    max_rows = Math.floor(max / cols),
                    empty_space_left_padding = ((cols - items_in_current_row) * (img_size + padding) - padding) / 2,
                    top_padding = rows < max_rows ? img_size / 3 : 0;

                var pos = {
                    top: item_row * (img_size + padding) + corner.top + top_padding,
                    left: padding + item_col * (img_size + padding) + corner.left + empty_space_left_padding
                };

                return pos;
            };

            if (active_only) {
                $('.menu-item.inactive').hide();
            } else {
                $('.menu-item.inactive').show();
            }

            $('.menu-item' + (active_only ? '.active' : '')).each(function(index) {
                var active_items = $('.menu-item.active').size();
                var all_items = $('.menu-item').size();
                var attrs = get_position(index, active_only ? active_items : all_items, all_items);
                attrs.opacity = 1.0;
                attrs.width = img_size - 40;
                attrs.height = img_size - 40;
                $(this).animate(attrs, no_animation ? 0 : 800);
            });
        },

        close_content: function(immediately) {
            var duration = this.small ? 0 : 500;
            var action = immediately ? 'offset' : 'animate';
            var closed_plugin = this.get_current();

            $('.content')[action]({
                top: -$('.content').height()
            }, {
                duration: duration
            }).addClass('content-closed');

            return closed_plugin;
        },

        toggle_expand: function() {
            $('.content').toggleClass('expanded');
        },

        show_tooltip: function(text) {
            $('#tooltip').css("visibility", "visible").html(text);
        },

        move_tooltip: function(x, y) {
            $('#tooltip').css("top", (y - 10) + "px").css("left", (x + 10) + "px");
        },

        hide_tooltip: function() {
            $('#tooltip').css("visibility", "hidden");
        },

        show_main: function() {
            this.close_content();
            $('.tool.inactive').fadeIn();
            this.only_active_visible = false;
            this.update_selector();
        },

        set_footer: function(content) {
            $('.footer').html(content);
        },

        prepare: function() {
            var context = {
                plugins: []
            };

            var plugins = core.modules.filter(function(module) {
                return module && module.is_plugin && module !== this;
            }, this);

            plugins.forEach(function(plugin) {
                plugin.view = plugin.template(plugin.context);
                context.plugins.push(plugin);
            });

            $('#loader').remove();
            this.init_layout(context);
        },

        switch_to: function(plugin) {

            if (plugin === this.current) {
                this.switch_to.lock = true;
                return;
            }

            this.logger.info('Switching to: ' + plugin.name);

            if (this.current) {
                this.current.deactivate();
            }
            this.current = plugin;

            this.data.parse();

            this.current.activate();

            this.switch_to_plugin(plugin.name);

            return this.current;
        },

        calculate_content: function() {
            var left = this.small ? 0 : ($('html').width() - $('.content').outerWidth()) / 2;
            var height = $(document).height();
            $('.content').height(height).offset({
                left: left
            });
            $('.plugin-content').height(height - $('.top-bar').height() - (this.small ? 10 : 50));

            /** to the bottom **/
            $('.to-the-bottom').height(function() {
                return height - $(this).offset().top - 60;
            });
        },

        open_content: function() {
            var duration = this.small ? 0 : 200;
            $('.content').removeClass('content-closed').animate({
                top: 0
            }, {
                duration: duration
            });
        },

        get_current: function() {
            return this.current;
        },

        init_layout: function(context) {

            this.calculate_basics();

            if (this.data.config.night_mode) {
                $('body').addClass('night-mode');
            }
            this.data.save_config.add(function() {
                $('body').removeClass('night-mode');
                if (this.data.config.night_mode) {
                    $('body').addClass('night-mode');
                }
            }.bind(this));

            // load background
            var max_backgrounds = 7;
            if (!this.small && this.data.config.show_background_image) {
                $('html').css('background-image', 'url(' + common.data.static_path + 'gfx/bg' + Math.floor(Math.random() * max_backgrounds) + '.jpg)');
            }

            var layout = Handlebars.compile(template);
            var body = layout(context);
            $('body').append(body);

            var inactive_plugins_count = 0,
                all_plugins_count = 0;

            context.plugins.forEach(function(plugin) {
                if (plugin.class !== "active") {
                    inactive_plugins_count++;
                }
                all_plugins_count++;
            });

            /** mouse over IE fix **/
            $('.menu-item').hover(function() {
                $(this).addClass('menu-item-hover');
            }, function() {
                $(this).removeClass('menu-item-hover');
            });
            $('.tool').hover(function() {
                $(this).addClass('tool-hover');
            }, function() {
                $(this).removeClass('tool-hover');
            });

            /** calc on each reize **/
            $(window).resize(function() {
                this.calculate_basics();
                this.calculate_content();
                if ($('.content').hasClass('content-closed')) {
                    this.close_content(true);
                } else {
                    this.open_content();
                }
                this.update_selector(true);
            }.bind(this));

            /** initialize **/
            this.calculate_content();
            this.close_content(true);

            this.switch_to_plugin = function(plugin) {
                var fade_time = this.small ? 0 : 200;
                $('.plugin-content.active').removeClass('active').fadeOut(fade_time);
                setTimeout(function() {
                    $('.plugin-content[plugin="' + plugin + '"]').fadeIn().addClass('active');
                }, fade_time);

                setTimeout(this.calculate_content, 500);

                $('.tool.active').removeClass('active');
                $('.tool[plugin="' + plugin + '"]').addClass('active');
            };

            /** info handlers **/
            this.info_opened = off.signal();
            $('.info-content').hide();

            var self = this;
            $('.info-icon').click(function() {
                var duration = self.small ? 0 : 200;
                var section = $(this).attr('section');
                var section_block = $('.info-content[section="' + section + '"]');
                if (section_block.css('display') === 'none') {
                    self.info_opened(section);
                }
                section_block.toggle({
                    duration: duration,
                    easing: 'linear'
                });
            });

            /** content close **/
            $('.close-content').click(function() {
                this.scopes.toolbar_close_content();
            }.bind(this));

            $('.expand').click(function() {
                this.toggle_expand();
                this.calculate_content();
            }.bind(this));

            $('#back').click(function() {
                if (!$('.content').hasClass('content-closed')) {
                    this.scopes.back_close_content();
                }
            }.bind(this));

            context.plugins.forEach(function(plugin) {

                var self = this;

                $('.tool[plugin="' + plugin.name + '"]').click(function() {
                    if (!$(this).hasClass('active')) {
                        self.switch_to_plugin($(this).attr('plugin'));
                        self.scopes.toolbar_switch_to(plugin);

                    }
                });

                $('.menu-item[plugin="' + plugin.name + '"]').click(function() {
                    self.open_content();
                    self.switch_to_plugin($(this).attr('plugin'));
                    self.scopes.main_switch_to(plugin);
                });

                $('a.switch[plugin="' + plugin.name + '"]').click(function() {
                    self.open_content();
                    self.switch_to_plugin($(this).attr('plugin'));
                    self.scopes.switcher_switch_to(plugin);
                });
            }, this);

            /** hide all plugins **/
            $('.plugin-contents > div').hide();

            /** init content **/
            $('.menu-item').offset({
                top: $(window).height() / 2,
                left: $(window).width() / 2
            }).css({
                'opacity': 0
            });
            $('.tool.inactive').hide();

            this.update_selector(true);
            $('.content').css('display', 'block');
            $('.menu').fadeIn();


            this.scopes = {
                toolbar_switch_to: off(this.switch_and_return),
                main_switch_to: off(this.switch_and_return),
                switcher_switch_to: off(this.switch_and_return),

                toolbar_close_content: off(this.close_content),
                back_close_content: off(this.close_content)
            };

            var footer = common.data.footer;
            this.set_footer(footer);
        }
    });

    return Layout.create();

});