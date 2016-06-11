define(function (require) {

    var off = require('off');

    var module = {};

    var local_sync_timer = null;

    module.local_file = off.property();

    module.sync = function (interval, handler) {
        local_sync_timer = setInterval(function(){
            var fileReader = new FileReader();
            fileReader.onload = function () {
                handler(this.result);
            };
            fileReader.readAsText(module.local_file());
        }, interval);
    };

    module.unsync = function () {
        clearInterval(local_sync_timer);
        local_sync_timer = null;
    };

    module.sync_available = function() {
        return module.local_file() !== null;
    };

    return module;
});