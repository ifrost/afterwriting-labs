/* global define, document */
define(function (require) {

	var $ = require('jquery'),
		templates = require('templates'),
		data = require('utils/data'),
		Handlebars = require('handlebars'),
		pm = require('utils/pluginmanager'),
		common = require('utils/common');
	
	var module = {};
	
	// set up handlebars
	Handlebars.registerHelper('static_path', function () {
		return common.data.static_path;
	});

	var close_content = function (immediately) {
		var action = immediately ? 'offset' : 'animate';
		$('.content')[action]({
			top: -$('.content').height()
		}, {
			duration: 500
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
		module.show_options();
	};


	/** menu open = show other options **/
	var show_options = function () {
		$('.menu-item[plugin="open"], .menu-item[plugin="info"]').animate({
			'margin-left': '10px',
			'margin-top': '10px'
		}, {
			duration: 800,
			complete: function () {
				$('.menu-item.inactive').fadeIn();
				$('.tool.inactive').fadeIn();
			}
		});
	};

	module.show_options = show_options;
	module.close_content = close_content;

	module.init_layout = function (context) {

		module.small = $('html').width() < 800;

		// load background
		var max_backgrounds = 7;
		if (!module.small && data.config.show_background_image) {
			$('html').css('background-image', 'url(' + common.data.static_path + 'gfx/bg' + Math.floor(Math.random() * max_backgrounds) + '.jpg)');
		} else {
			$('html').css('background-color', '#111111');
		}

		var layout = templates['templates/layout.hbs'];
		var body = layout(context);
		$('body').append(body);

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


		/** hide inactive elements **/
		$('.menu-item.inactive').hide();
		$('.tool.inactive').hide();
		/** align open **/
		if (!module.small) {
			$('.menu-item[plugin="open"]').css('margin-left', '120px').css('margin-top', '120px');
			$('.menu-item[plugin="info"]').css('margin-top', '120px');
		} else {
			$('.menu-item[plugin="open"]').css('margin-left', '60px').css('margin-top', '20px');
			$('.menu-item[plugin="info"]').css('margin-left', '40px').css('margin-top', '20px');

		}
		/** content **/
		$('.content').removeClass('inactive');
		var calculate_content = function () {
			var left = module.small ? 0 : ($(document).width() - $('.content').width()) / 2;
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
			$('.content').removeClass('content-closed').animate({
				top: 0
			}, {
				duration: 500
			});
		}

		/** calc on each reize **/
		$(window).resize(function () {
			calculate_content();
			if ($('.content').hasClass('content-closed')) {
				close_content(true);
			} else {
				module.open_content();
			}

		});

		module.dev = function () {
			$('.footer').append('<br /><span class="version">development version</span>');
		};

		/** initialize **/
		calculate_content();
		close_content(true);

		module.switch_to_plugin = function (plugin) {

			$('.plugin-content.active').removeClass('active').fadeOut(200);
			setTimeout(function () {
				$('.plugin-content[plugin="' + plugin + '"]').fadeIn().addClass('active');
			}, 200);

			setTimeout(calculate_content, 500);


			$('.tool.active').removeClass('active');
			$('.tool[plugin="' + plugin + '"]').addClass('active');
		}

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
		$('.info-icon').click(function(){
			var section = $(this).attr('section');
			$('.info-content[section="' + section + '"]').toggle({duration: 200, easing: 'linear'});
		});
		
		/** content close **/
		$('.close-content').click(function () {
			close_content();
		});
		
		context.plugins.forEach(function (plugin) {
			$('.tool[plugin="' + plugin.name + '"], .menu-item[plugin="' + plugin.name + '"], a.switch[plugin="' + plugin.name + '"]').click(function () {
				pm.switch_to(plugin);
			});
		});

		pm.switch_to.add(function(plugin){
			module.switch_to_plugin(plugin.name);
		});


		/** hide all plugins **/
		$('.plugin-contents > div').hide();

		/** init content **/
		$('.content').css('display', 'block');
		$('.menu').fadeIn();

	};

	return module;
});