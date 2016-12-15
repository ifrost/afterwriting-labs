define(function(require) {

    var Protoplast = require('p');

    var InfoViewPresenter = Protoplast.Object.extend({
        
        init: function() {
            this.view.on('download-clicked', this._downloadClicked, this);
        },
        
        _downloadClicked: function() {
            console.log('TODO: trigger tracking controller?');
        }
        
    });

    return InfoViewPresenter;
});