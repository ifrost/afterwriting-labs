define(function(require) {

    var db = require('utils/dropbox'),
        gd = require('utils/googledrive'),
        data = require('modules/data');

    var module = {};

    module.save_current_script = function(callback) {
        if (data.data('db-path')) {
            var path = data.data('db-path'),
                blob = new Blob([data.script()], {
                    type: "text/plain;charset=utf-8"
                });
            db.save(path, blob, function() {
                callback(true);
            });
        }
        else if (data.data('gd-fileid')) {
            var fileid = data.data('gd-fileid'),
                blob = new Blob([data.script()], {
                    type: "text/plain;charset=utf-8"
                });
            gd.upload({
                blob: blob,
                callback: function() {
                    callback(true);
                },
                fileid: fileid
            });
        }
        else {
            callback(false);
        }
    };

    return module;
});