/* global define, document, window, setTimeout */
define(['jquery', 'templates', 'modules/data', 'handlebars', 'utils/pluginmanager', 'utils/common', 'templates'], function ($, temlates, data, Handlebars, pm, common, templates) {

	var module = {only_active_visible: true};

	// set up handlebars
	Handlebars.registerHelper('static_path', function () {
		return common.data.static_path;
	});

	var calculate_basics = function () {
		module.small = $('html').width() < 800;
	};

	var update_selector = function (no_animation) {
		no_animation = no_animation || module.small;
		var active_only = module.only_active_visible;
		var cols = 3;
		var img_size = module.small ? 70 : 100;
		var padding = module.small ? 5 : 15;
		var corner = {};
		corner.top = module.small ? 120 : 150;
		var icons_with_padding = cols * (img_size + padding) + padding;
		corner.left = ($('html').width() - icons_with_padding) / 2;

		var get_position = function (index, all, max) {
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

		$('.menu-item' + (active_only ? '.active' : '')).each(function (index) {
			var active_items = $('.menu-item.active').size();
			var all_items = $('.menu-item').size();
			var attrs = get_position(index, active_only ? active_items : all_items, all_items);
			attrs.opacity = 1.0;
			attrs.width = img_size - 40;
			attrs.height = img_size - 40;
			$(this).animate(attrs, no_animation ? 0 : 800);
		});

	};

	module.close_content = function (immediately) {
		var duration = module.small ? 0 : 500;
		var action = immediately ? 'offset' : 'animate';
		$('.content')[action]({
			top: -$('.content').height()
		}, {
			duration: duration
		}).addClass('content-closed');
	};

	module.show_tooltip = function (text) {
		$('#tooltip').css("visibility", "visible").html(text);
	};

	module.move_tooltip = function (x, y) {
		$('#tooltip').css("top", (y - 10) + "px").css("left", (x + 10) + "px");
	};

	module.hide_tooltip = function () {
		$('#tooltip').css("visibility", "hidden");
	};

	module.show_main = function () {
		module.close_content();
		$('.tool.inactive').fadeIn();
		module.only_active_visible = false;
		update_selector();
	};

	module.set_footer = function (content) {
		$('.footer').html(content);
	};

	module.init_layout = function (context) {

		calculate_basics();

		// load background
		var max_backgrounds = 7;
		if (!module.small && data.config.show_background_image) {
			$('html').css('background-image', 'url(' + common.data.static_path + 'gfx/bg' + Math.floor(Math.random() * max_backgrounds) + '.jpg)');
		}
		
		var layout = templates['templates/layout.hbs'];
		var body = layout(context);
		$('body').append(body);


		var inactive_plugins_count = 0,
			all_plugins_count = 0;

		context.plugins.forEach(function (plugin) {
			if (plugin.class !== "active") {
				inactive_plugins_count++;
			}
			all_plugins_count++;
		});

		/** mouse over IE fix **/
		$('.menu-item').hover(function () {
			$(this).addClass('menu-item-hover');
		}, function () {
			$(this).removeClass('menu-item-hover');
		});
		$('.tool').hover(function () {
			$(this).addClass('tool-hover');
		}, function () {
			$(this).removeClass('tool-hover');
		});


		var calculate_content = function () {
			var left = module.small ? 0 : ($('html').width() - $('.content').outerWidth()) / 2;
			var height = $(document).height();
			$('.content').height(height).offset({
				left: left
			});
			$('.plugin-content').height(height - $('.top-bar').height() - (module.small ? 10 : 50));

			/** to the bottom **/
			$('.to-the-bottom').height(function () {
				return height - $(this).offset().top - 60;
			});

		};

		module.open_content = function () {
			var duration = module.small ? 0 : 200;
			$('.content').removeClass('content-closed').animate({
				top: 0
			}, {
				duration: duration
			});
		};

		/** calc on each reize **/
		$(window).resize(function () {
			calculate_basics();
			calculate_content();
			if ($('.content').hasClass('content-closed')) {
				module.close_content(true);
			} else {
				module.open_content();
			}
			update_selector(true);
		});

		/** initialize **/
		calculate_content();
		module.close_content(true);

		module.switch_to_plugin = function (plugin) {
			var fade_time = module.small ? 0 : 200;
			$('.plugin-content.active').removeClass('active').fadeOut(fade_time);
			setTimeout(function () {
				$('.plugin-content[plugin="' + plugin + '"]').fadeIn().addClass('active');
			}, fade_time);

			setTimeout(calculate_content, 500);

			$('.tool.active').removeClass('active');
			$('.tool[plugin="' + plugin + '"]').addClass('active');
		};

		/** open content handlers **/
		$('.menu-item, a.switch').click(function () {
			module.open_content();
			module.switch_to_plugin($(this).attr('plugin'));
		});

		/** tool handlers **/
		$('.tool').click(function () {
			if (!$(this).hasClass('active')) {
				module.switch_to_plugin($(this).attr('plugin'));
			}
		});

		/** info handlers **/
		$('.info-content').hide();
		$('.info-icon').click(function () {
			var duration = module.small ? 0 : 200;
			var section = $(this).attr('section');
			$('.info-content[section="' + section + '"]').toggle({
				duration: duration,
				easing: 'linear'
			});
		});

		/** content close **/
		$('.close-content').click(function () {
			module.close_content();
		});

		context.plugins.forEach(function (plugin) {
			$('.tool[plugin="' + plugin.name + '"], .menu-item[plugin="' + plugin.name + '"], a.switch[plugin="' + plugin.name + '"]').click(function () {
				pm.switch_to(plugin);
			});
		});

		pm.switch_to.add(function (plugin) {
			module.switch_to_plugin(plugin.name);
		});


		/** hide all plugins **/
		$('.plugin-contents > div').hide();

		/** init content **/
		$('.menu-item').offset({
			top: $(window).height() / 2,
			left: $(window).width() / 2
		});
		$('.menu-item').css({
			'opacity': 0
		});
		$('.tool.inactive').hide();

		update_selector(true);
		$('.content').css('display', 'block');
		$('.menu').fadeIn();

		var footer = common.data.footer;
		module.set_footer(footer);
	};

	return module;
});