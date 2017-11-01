define(function(require) {

    var $ = require('jquery'),
        fn = require('utils/fn'),
        Dropbox = require('dropbox'),
        key = 'p5kky1t8t9c5pqy',
        redirect_uri = 'https://afterwriting.com/token.html';

    if (window.location.href.indexOf('dev=true') !== -1) {
        redirect_uri = 'http://localhost:8000/local/token.html';
    }

    var module = {}, client, is_lazy = false;

    module.init = function() {
        this.initialised = true;
    };

    module.is_available = function() {
        return this.initialised && window.location.protocol !== 'file:';
    };

    var client_authenticate = function(callback) {
        if (module.token) {
            callback();
        } else {
            client = new Dropbox({
                clientId: key
            });
    
            // var state = Dropbox.Util.Oauth.randomAuthStateParam();
            var url = client.getAuthenticationUrl(redirect_uri);
            var popup = window.open(url, '_blank', 'width=500, height=500');
            $(window).on('message.dropboxclient', function(e) {
                e = e.originalEvent;
                e.target.removeEventListener(e.type, arguments.callee);
                if (e.origin !== 'https://ifrost.github.io' && e.origin !== 'https://afterwriting.com' && e.origin !== 'http://localhost:8000') {
                    return;
                }

                if (/error=/.test(e.data)) {
                    return;
                }

                if (
                    (e.data.indexOf('access_token') === -1) ||
                    (e.data.indexOf('uid') === -1)
                ) {
                    return;
                }

                var token = /access_token=([^\&]*)/.exec(e.data)[1],
                    uid = /uid=([^\&]*)/.exec(e.data)[1];
                
                $.cookie('dbt', token);
                $.cookie('dbu', uid);

                client = new Dropbox({
                    accessToken: token
                });
                
                module.token = token;

                popup.close();
                callback();
            });
        }
    };

    var auth_method = function(method) {
        return function() {
            var method_args = arguments;
            client_authenticate(function() {
                method.apply(null, method_args);
            });
        };
    };


    var item_to_data = function(item) {
        if (is_lazy) {
            return {
                isFolder: item['.tag'] === 'folder',
                content: [],
                folder: item.path_display.substring(0, item.path_display.length - item.name.length - 1),
                name: item.name,
                path: item.path_display,
                entry: item
            };
        }
        else {
            return {
                isFolder: item['.tag'] === 'folder',
                content: [],
                folder: item.path_display.substring(0, item.path_display.length - item.name.length - 1),
                name: item.name,
                path: item.path_display,
                entry: item
            };
        }
    };

    var list = function(callback, options) {
        options = options || {};
        options.folder = options.folder || '/';

        if (options.lazy) {
            is_lazy = true;
            callback(function(node, callback) {
                lazy_list(options, node, callback);
            });
            return;
        }
        else if (options.hasOwnProperty('lazy')) {
            is_lazy = false;
        }

        if (options.before) {
            options.before();
        }

        var pull_callback = function(error, result) {
            result = is_lazy ? result : result.changes;
            var items = result.filter(function(file) {
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

            items = items.filter(function(i) {
                i = is_lazy ? i : i.stat;
                return !options.pdfOnly || i.isFolder || i.mimeType === "application/pdf";
            });

            items.forEach(function(item) {
                var data = item_to_data(item);
                if (data.isFolder) {
                    folders[data.path] = data;
                }
                files.push(data);
            });

            files.sort(function(a, b) {
                if (a.isFolder && !b.isFolder) {
                    return -1;
                } else if (!a.isFolder && b.isFolder) {
                    return 1;
                } else {
                    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
                }
            });
            files.forEach(function(file) {
                if (is_lazy) {
                    root.content.push(file);
                }
                else {
                    var folder = folders[file.folder || '/'];
                    if (folder) {
                        folder.content.push(file);
                    }
                }
            });

            if (options.after) {
                options.after();
            }
            callback(root);

        };

        var conflate_caller = function(conflate_callback, error, result) {
            if (is_lazy) {
                client.metadata(options.folder, {readDir: true}, conflate_callback);
            }
            else {
                client.filesListFolder({
                    path: '',
                    recursive: true
                }).then(conflate_callback);//result ? result.cursorTag : null, conflate_callback);
            }
        };

        var conflate_tester = function(error, result) {
            return !error && result.shouldPullAgain;
        };

        var conflate_final = function(results) {
            var last_error = results[results.length - 1][0],
                final_result;

            if (is_lazy) {
                final_result = [];
                results.forEach(function(args) {
                    final_result = final_result.concat(args[2]);
                });
            }
            else {
                final_result = {
                    changes: []
                };
                results.forEach(function(args) {
                    final_result.changes = final_result.changes.concat(args[0].entries);
                });
            }
            pull_callback(last_error, final_result);
        };

        fn.conflate(conflate_caller, conflate_tester, conflate_final);
    };
    module.list = auth_method(list);

    var lazy_list = function(options, node, callback) {
        var folder = node.id === '#' ? '/' : node.id;
        var options = {
            folder: folder,
            pdfOnly: options.pdfOnly,
            writeOnly: options.writeOnly
        };

        module.list(function(item) {
            var loaded_node = module.convert_to_jstree(item);
            callback.call(this, node.id === '#' ? loaded_node : loaded_node.children);
        }, options);
    };

    var load_file = function(path, callback) {
        client.filesDownload({
            path: path
        }).then(function(data) {
            var fileReader = new FileReader();
            fileReader.onload = function() {
                callback(this.result);
            };
            fileReader.readAsText(data.fileBlob);
        }, function() {
            $.prompt('Cannot open the file');
            callback(undefined);
        });
    };
    module.load_file = auth_method(load_file);

    module.sync = function(path, timeout, sync_callback) {
        module.sync_timeout = setInterval(function() {
            module.load_file(path, function(content) {
                sync_callback(content);
            });
        }, timeout);
    };

    module.unsync = function() {
        clearInterval(module.sync_timeout);
    };

    module.convert_to_jstree = function(item) {
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
        else if (is_lazy) {
            result.children = item.isFolder;
        }
        return result;
    };

    var save = function(path, data, callback) {
        client.writeFile(path, data, {}, callback);
    };
    module.save = auth_method(save);

    module.destroy = function() {
        $(window).off('message.dropboxclient');
    };

    return module;

});