define(['plugins/open'], function (open) {

	var module = {};

	var track_event = function(category, event, label) {
		ga('send', category, event, label);
	};
	
	var track_handler = function(category, event, label) {
		return function() {
			track_event(category, event, label);
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