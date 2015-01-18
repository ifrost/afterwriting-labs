/* global define, gapi, google, $, FileReader, btoa */
define(function () {
	var client_id = '540351787353-3jf0j12ccl0tmv2nbkcdncu0tuegjkos.apps.googleusercontent.com',
		dev_key = 'AIzaSyAakDfF6BAzFrLZ-ZWCht2lpYx7i9ITZrY',
		scope = ['https://www.googleapis.com/auth/drive'],
		module = {};

	gapi.load('auth');
	gapi.load('picker');

	module.open = function (content_callback) {
		gapi.auth.init(function () {
			authorize(true, open_picker.bind(this, content_callback));
		});
	};

	module.save = function (options) {
		gapi.auth.init(function () {
			authorize(true, save_file.bind(this, options));
		});
	};

	module.sync = function (fileid, timeout, sync_callback) {
		module.sync_timeout = setInterval(function () {
			load_file_info(fileid, function (content) {
				sync_callback(content);
			});
		}, timeout);
	};

	module.unsync = function () {
		clearInterval(module.sync_timeout)
	};

	function save_file(blob, filename, callback, fileid, result) {
		if (result && !result.error) {
			upload(blob, filename, callback, fileid);
		} else {
			authorize(false, save_file.bind(this, blob, filename, callback, fileid));
		}
	}

	function open_picker(content_callback, result) {
		if (result && !result.error) {
			module.oauth_token = result.access_token;
			new google.picker.PickerBuilder()
				.addView(google.picker.ViewId.DOCUMENTS)
				.setOAuthToken(module.oauth_token)
				.setDeveloperKey(dev_key)
				.setCallback(picker_ready.bind(this, content_callback))
				.build()
				.setVisible(true);
		} else {
			authorize(false, open_picker);
		}
	}

	function authorize(immediate, callback) {
		gapi.auth.authorize({
			client_id: client_id,
			scope: scope,
			immediate: immediate,
		}, callback);
	}

	function picker_ready(content_callback, data) {
		if (data.action == google.picker.Action.PICKED) {
			var doc = data[google.picker.Response.DOCUMENTS][0];
			gapi.client.load('drive', 'v2', load_file_info.bind(this, doc.id, content_callback));
		}
	}

	function load_file_info(id, content_callback) {
		gapi.client.drive.files.get({
			fileId: id
		}).execute(function (response) {
			if (!response.error) {
				var url = response.exportLinks && response.exportLinks['text/plain'] ? response.exportLinks['text/plain'] : response.downloadUrl;
				download(url, function (content) {
					content = content.replace(/\r\n\r\n/g, '\r\n');
					content_callback(content, response.alternateLink, response.id);
				});
			} else {
				$.prompt('Could not open the file!');
			}
		});
	}

	function download(url, callback) {
		$.ajax({
			url: url,
			type: 'GET',
			beforeSend: function (xhr) {
				return xhr.setRequestHeader('Authorization', 'Bearer ' + module.oauth_token);
			},
			success: callback
		});
	}

	function upload(options) {
		var blob = options.blob,
			filename = options.filename,
			callback = options.callback,
			parents = options.parents,
			fileid = options.fileid,
			isUpdate = fileid !== null;

		var boundary = '-------314159265358979323846';
		var delimiter = "\r\n--" + boundary + "\r\n";
		var close_delim = "\r\n--" + boundary + "--";
		var reader = new FileReader();
		reader.readAsBinaryString(blob);
		reader.onload = function () {
			var contentType = blob.type || 'application/octet-stream';
			var metadata = {
				'mimeType': contentType
			};

			if (!isUpdate) {
				metadata.title = filename;
				metadata.parents = parents || []
			}

			var base64Data = btoa(reader.result);
			var multipartRequestBody =
				delimiter +
				'Content-Type: application/json\r\n\r\n' +
				JSON.stringify(metadata) +
				delimiter +
				'Content-Type: ' + contentType + '\r\n' +
				'Content-Transfer-Encoding: base64\r\n' +
				'\r\n' +
				base64Data +
				close_delim;

			var path = '/upload/drive/v2/files/';
			if (isUpdate) {
				path += fileid;
			}
			var request = gapi.client.request({
				'path': path,
				'method': isUpdate ? 'PUT' : 'POST',
				'params': {
					'uploadType': 'multipart'
				},
				'headers': {
					'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
				},
				'body': multipartRequestBody
			});

			request.execute(callback);
		};
	}

	var list = function (callback) {
		var request = gapi.client.request({
			path: '/drive/v2/files/',
			method: 'GET'
		});
		request.execute(callback);
	};

	module.list = function (callback, folders_only) {
		list(function (data) {
			if (data.error) {
				authorize(true, module.list.bind(null, callback, folders_only));
			} else {
				var items = data.items.filter(function (item) {return !item.explicitlyTrashed}),
					map_items = {}, root = {
						title: 'Google Drive (root)',
						id: 'root',
						isRoot: true,
						isFolder: true,
						children: []
					};
				if (folders_only) {
					items = items.filter(function (i) {
						return i.mimeType === "application/vnd.google-apps.folder";
					});
				}
				items.forEach(function (f) {
					map_items[f.id] = f;
					f.children = [];
				});
				items.forEach(function (i) {
					i.isFolder = i.mimeType === "application/vnd.google-apps.folder";
					i.parents.forEach(function (p) {
						var parent = map_items[p.id] || root;
						parent.children.push(i);
					});
				});
				callback(root);
			}
		});
	};

	module.convert_to_jstree = function (item) {
		var children = item.children.map(module.convert_to_jstree);
		var result = {
			text: item.title,
			id: item.id,
			data: item,
			type: item.isFolder ? 'default' : 'file',
			state: {
				opened: item.isRoot
			}
		};
		if (children.length) {
			result.children = children;
		}
		return result;
	};

	return module;

});