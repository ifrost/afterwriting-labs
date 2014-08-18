define(['jquery', 'templates'], function ($, templates) {

	var module = {};

	var close_content = function (immediately) {
		var action = immediately ? 'offset' : 'animate';
		$('.content')[action]({
			top: -$('.content').height()
		}, {
			duration: 500
		}).addClass('content-closed');
	}

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

		// load background
		var max_backgrounds = 7;
		$('html').css('background-image', 'url(gfx/bg' + Math.floor(Math.random() * max_backgrounds) + '.jpg)');
		
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
		$('.menu-item[plugin="open"').css('margin-left', '120px').css('margin-top', '120px');
		$('.menu-item[plugin="info"]').css('margin-top', '120px');

		/** content **/
		$('.content').removeClass('inactive');
		var calculate_content = function () {
			var left = ($(document).width() - $('.content').width()) / 2;
			var height = $(document).height();
			$('.content').height(height).offset({
				left: left
			});
			$('.plugin-content').height(height - $('.top-bar').height() - 50);

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
		
		module.dev = function() {
			$('.footer').append('<br /><span class="version">pre-release version</span>');
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

		/** content close **/
		$('.close-content').click(function () {
			close_content();
		});

		/** hide all plugins **/
		$('.plugin-contents > div').hide();

		/** init content **/
		$('.content').css('display', 'block');
		$('.menu').fadeIn();

	};

	return module;
});