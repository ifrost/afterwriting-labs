/* global define, gapi, google */
define(function () {
	var client_id = '540351787353-3jf0j12ccl0tmv2nbkcdncu0tuegjkos.apps.googleusercontent.com',
		dev_key = 'AIzaSyAakDfF6BAzFrLZ-ZWCht2lpYx7i9ITZrY',
		scope = ['https://www.googleapis.com/auth/drive'],
		module = {};

	gapi.load('auth');
	gapi.load('picker');

	module.open = function (content_callback) {
		module.current_content_callback = content_callback;
		gapi.auth.init(function () {
			authorize(true, authorized.bind(this));
		});
	};

	function authorize(immediate, callback) {
		gapi.auth.authorize({
			client_id: client_id,
			scope: scope,
			immediate: immediate,
		}, callback);
	}

	function authorized(result) {
		if (result && !result.error) {
			module.oauth_token = result.access_token;
			new google.picker.PickerBuilder()
				.addView(google.picker.ViewId.DOCUMENTS)
				.setOAuthToken(module.oauth_token)
				.setDeveloperKey(dev_key)
				.setCallback(picker_ready)
				.build()
				.setVisible(true);
		} else {
			authorize(false, authorized);
		}
	}

	function picker_ready(data) {
		if (data.action == google.picker.Action.PICKED) {
			var doc = data[google.picker.Response.DOCUMENTS][0];
			gapi.client.load('drive', 'v2', load_file_info.bind(this, doc.id));
		}
	}

	function load_file_info(id) {
		gapi.client.drive.files.get({
			fileId: id
		}).execute(function (response) {

			if (!response.error) {
				download(response.exportLinks['text/plain'], function(content) {
					module.current_content_callback(content, response.alternateLink);
				});
			}
		});
	};

	function download(url, callback) {
		$.ajax({
			url: url,
			type: 'GET',
			beforeSend: function (xhr) {
				return xhr.setRequestHeader('Authorization', 'Bearer ' + module.oauth_token);
			},
			success: callback
		});
	};

	return module;

});