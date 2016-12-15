define(function(require) {

    var Protoplast = require('p');

    var InfoViewPresenter = Protoplast.Object.extend({

        monitor: {
            inject: 'monitor'
        },

        init: function() {
            this.view.on('download-clicked', this._downloadClicked, this);
        },
        
        _downloadClicked: function() {
            this.monitor.track('feature', 'download');
        }
        
    });

    return InfoViewPresenter;
});