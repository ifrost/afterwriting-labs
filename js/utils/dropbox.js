/* global define, window, FileReader */
define(function (require) {

	var $ = require('jquery'),
		Dropbox = require('dropbox'),
		key = 'p5kky1t8t9c5pqy',
		redirect_uri = 'https://ifrost.github.io/afterwriting-labs/token.html';

	if (window.location.href.indexOf('dev=true') != -1) {
		redirect_uri = 'http://localhost:8000/local/token.html';
	}

	var module = {}, client;

	var client_authenticate = function (callback) {
		client = new Dropbox.Client({
			key: key,
			token: $.cookie('dbt'),
			uid: $.cookie('dbu'),
			sandbox: false
		});
		if (client.isAuthenticated()) {
			callback();
		} else {
			var state = Dropbox.Util.Oauth.randomAuthStateParam();
			var popup = window.open('https://www.dropbox.com/1/oauth2/authorize?response_type=token&redirect_uri=' + redirect_uri + '&client_id=' + key + '&state=' + state, '_blank', 'width=500, height=500');
			window.addEventListener('message', function (e) {
				if (e.origin !== 'http://afterwriting.com' && e.origin !== 'http://localhost:8000') {
					return;
				}
				
				if (/error=/.test(e.data)) {
					return;
				}
				
				var token = /access_token=([^\&]*)/.exec(e.data)[1],
					uid = /uid=([^\&]*)/.exec(e.data)[1],
					state_r = /state=([^\&]*)/.exec(e.data)[1];

				if (state !== state_r) {
					return;
				}

				$.cookie('dbt', token);
				$.cookie('dbu', uid);
				
				client = new Dropbox.Client({
					key: key,
					sandbox: false,
					token: token,
					uid: uid
				});

				popup.close();
				callback();
			});
		}
	};

	var auth_method = function (method) {
		return function () {
			var method_args = arguments;
			client_authenticate(function () {
				method.apply(null, method_args);
			});
		};
	};


	var item_to_data = function (item) {
		return {
			isFolder: item.stat.isFolder,
			content: [],
			folder: item.path.substring(0, item.stat.path.length - item.stat.name.length - 1),
			name: item.stat.name,
			path: item.path,
			entry: item
		};
	};

	var list = function (callback, options) {
		options = options || {};
		
		if (options.before) {
			options.before();
		}

		client.pullChanges(function (error, result) {
			var items = result.changes.filter(function (file) {
				return !file.wasRemoved;
			});
			var root = {
				'isRoot': true,
				'isFolder': true,
				'path': '/',
				'name': 'Dropbox',
				'content': []
			};
			//root.entry = root;
			var folders = {
				'/': root
			};
			var files = [];

			items = items.filter(function (i) {
				return !options.pdfOnly || i.stat.isFolder || i.stat.mimeType === "application/pdf";
			});

			items.forEach(function (item) {
				var data = item_to_data(item);
				if (data.isFolder) {
					folders[data.path] = data;
				}
				files.push(data);
			});

			files.sort(function (a, b) {
				if (a.isFolder && !b.isFolder) {
					return -1;
				} else if (!a.isFolder && b.isFolder) {
					return 1;
				} else {
					return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
				}
			});
			files.forEach(function (file) {
				folders[file.folder || '/'].content.push(file);
			});

			if (options.after) {
				options.after();
			}
			callback(root);

		});
	};
	module.list = auth_method(list);

	var load_file = function (path, callback) {
		client.readFile(path, {
			blob: true
		}, function (error, blob) {
			if (error) {
				$.prompt('Cannot open the file');
				callback(undefined);
			} else {
				var fileReader = new FileReader();
				fileReader.onload = function () {
					callback(this.result);
				};
				fileReader.readAsText(blob);
			}
		});
	};
	module.load_file = auth_method(load_file);

	module.sync = function (path, timeout, sync_callback) {
		module.sync_timeout = setInterval(function () {
			module.load_file(path, function (content) {
				sync_callback(content);
			});
		}, timeout);
	};

	module.unsync = function () {
		clearInterval(module.sync_timeout)
	};

	module.convert_to_jstree = function (item) {
		var children = item.content.map(module.convert_to_jstree);
		var result = {
			text: item.name,
			id: item.path,
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

	var save = function (path, data, callback) {
		client.writeFile(path, data, {}, callback);
	};
	module.save = auth_method(save);

	return module;

});