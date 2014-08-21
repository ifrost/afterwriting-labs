define(['plugins/open'], function (open) {

	var module = {};

	var track_event = function(category, action, label) {
		ga('send', 'event', category, action, label);
	};
	
	var track_handler = function(category, action, label) {
		return function() {			
			track_event(category, action, label);
		};
	};

	module.init = function () {

		open.open_sample.add(function (result, args) {
			track_event(open.name, 'open-sample', args[0]);
		});

		open.create_new.add(track_handler(open.name, 'create-new'));
	};

	return module;
});