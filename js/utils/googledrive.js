/* global define, gapi, google */
define(function () {
	var clientId = '540351787353-3jf0j12ccl0tmv2nbkcdncu0tuegjkos.apps.googleusercontent.com',
		devKey = 'AIzaSyAakDfF6BAzFrLZ-ZWCht2lpYx7i9ITZrY',
		scope = ['https://www.googleapis.com/auth/drive'],
		module = {};

	gapi.load('auth');
	gapi.load('picker');

	var handleAuth = function (result) {
		if (result && !result.error) {
			console.log(result);
			console.log(google.picker.ViewId.DOCUMENTS);
			new google.picker.PickerBuilder()
				.addView(google.picker.ViewId.DOCUMENTS)
				.setOAuthToken(result.access_token)
				.setDeveloperKey(devKey)
				.setCallback(pickerCallback)
				.build()
				.setVisible(true);
		} else {
			authorize(false, handleAuth);
		}
	};

	var pickerCallback = function (data) {
		console.log(data);
	};

	var authorize = function (immediate, callback) {
		gapi.auth.authorize({
			client_id: clientId,
			scope: scope,
			immediate: immediate,
		}, callback);
	};

	module.open = function () {
		gapi.auth.init(function () {
			authorize(true, handleAuth);
		});
	};

	return module;

});