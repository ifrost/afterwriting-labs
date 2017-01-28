define(function(require) {

    var Protoplast = require('p');

    var MonitorController = Protoplast.Object.extend({

        monitor: {
            inject: 'monitor'
        },
        
        downloadLinkClicked: {
            sub: 'info/download-link/clicked',
            value: function() {
                console.log('tracking')
                this.monitor.track('feature', 'download');
            }
        }
        
    });

    return MonitorController;
});