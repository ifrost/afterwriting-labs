/* global define, Dropbox, FileReader */
define(function (require) {

	var $ = require('jquery');

	var module = {};

	var client = new Dropbox.Client({
		key: 'inioj0mo28wjwcw',
		secret: 'in148e9jozcdgmg',
		sandbox: false
	});

	var auth_method = function (method) {
		return function () {
			var method_args = arguments;
			client.authenticate(function (error) {
				if (error) {
					$.prompt('Dropbox error');
				} else {
					method.apply(null, method_args);
				}
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

	var list = function (callback) {
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
			var folders = {
				'/': root
			};
			var files = [];
			items.forEach(function (item) {
				var data = item_to_data(item);
				if (data.isFolder) {
					folders[data.path] = data;
				}
				files.push(data);
			});

			files.sort(function(a,b){
				if (a.isFolder && !b.isFolder) {
					return -1;
				}
				else if (!a.isFolder && b.isFolder) {
					return 1;
				}
				else {
					return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
				}
			});
			files.forEach(function (file) {
				folders[file.folder || '/'].content.push(file);
			});

			callback(root);

		});
	};
	module.list = auth_method(list);
	
	var load_file = function(path, callback) {
		client.readFile(path, {blob: true}, function(error, blob){
			if (error) {
				$.prompt('Cannot open the file');
			}
			else {
				var fileReader = new FileReader();
				fileReader.onload = function() {
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


	return module;

});