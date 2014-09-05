define(function (require) {

	var $ = require('jquery');

	var module = {};


	var parse = function (paragraph, dual) {
		var type = $(paragraph).attr('Type');
		var align = $(paragraph).attr('Alignment');
		var page_break = $(paragraph).attr('StartsNewPage');
		var text = $(paragraph).find('Text').map(function () {
			var text = $(this).html();
			return text;
		}).get().join('');
		text = $('<div/>').html(text).text();
		text = text.replace(/’/g, "'").replace(/”/g,'"').replace(/“/g,'"').replace(/‘/g,"'");

		if (page_break === 'Yes') {
			text += '\n====\n' + text;
		}
		
		if (type === 'Character' || type === 'Scene Heading' || type === 'Transition') {
			text = text.toUpperCase();
		}
		if (type === 'Character' && dual) {
			text += ' ^';
		}
		if (type === 'Transition') {
			text = '> ' + text;
		}
		if (align === 'Center') {
			text = '> ' + text.split('\n').join(' ') + ' <';
		}
		if (type === 'Scene Heading' && !(/^((?:\*{0,3}_?)?(?:(?:int|ext|est|i\/e)[. ]).+)|^(?:\.(?!\.+))(.+)/i.test(text))) {
			text = '.' + text;
		}
		if (type !== 'Parenthetical' && type !== 'Dialogue') {
			text = '\n' + text;
		}
		if (type !== 'Center') {
			text += '\n';
		}
		return text;
	};

	module.to_fountain = function (text) {
		var result = '';
		try {
			var doc = $.parseXML(text);
			var $fdx = $(doc);
			// title page
			var order = ['Title: ', 'Credit: ', 'Author: '];
			var processing = false;
			$fdx.find('FinalDraft TitlePage Content > Paragraph').each(function(){
				if (order.length === 0) {
					return;
				}
				var text = $(this).find('Text').html().trim();
				if (text === '') {
					processing = false;
				}
				else {
					if (!processing) {
						result += order.shift();
						processing = true;
					}
					result += text + '\n';
				}
			});
			
			// content
			$fdx.find('FinalDraft > Content > Paragraph').each(function () {
				var dual = $(this).find('DualDialogue');
				if (dual.size()) {
					var set_dual = false;
					dual.find('Paragraph').each(function () {
						result += parse(this, set_dual);
						set_dual = true;
					});
				} else {
					result += parse(this);
				}
			});
			
			
		} catch (error) {
			result = text;
		}
		return result;
	};

	return module;

});