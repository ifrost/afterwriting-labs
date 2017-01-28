define(function(require) {

    var Protoplast = require('p');

    var InfoViewPresenter = Protoplast.Object.extend({

        pub: {
            inject: 'pub'
        },

        init: function() {
            this.view.on('download-clicked', this._downloadClicked, this);
        },
        
        _downloadClicked: function() {
            this.pub('info/download-link/clicked');
        }
        
    });

    return InfoViewPresenter;
});