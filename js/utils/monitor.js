define(['plugins/open'], function (open) {

	var module = {};

	var track = function (category, event) {
		console.log('Tracking event ' + category + ':' + event);
	};

	module.init = function () {

		open.open_sample.add(function (result, args) {
			track(open.name, args[0]);
		});

		open.create_new.add(function () {
			track(open.name, 'create_new');
		});
	};

	return module;
});