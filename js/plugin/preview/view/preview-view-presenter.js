define(function(require) {

    var BaseSectionViewPresenter = require('theme/aw-bubble/presenter/base-section-view-presenter'),
        PreviewController = require('plugin/preview/controller/preview-controller');
    
    var PreviewViewPresenter = BaseSectionViewPresenter.extend({
        
        previewController: {
            inject: PreviewController
        },

        _scriptChanged: function() {
            // TODO: why timeout? (++++)
            setTimeout(function() {
                this.previewController.getPdf(function(result) {
                    this.view.pdf = result;
                }.bind(this));
            }.bind(this), 0);
        }

    });

    return PreviewViewPresenter;
});