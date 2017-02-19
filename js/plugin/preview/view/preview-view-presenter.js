define(function(require) {

    var BaseSectionViewPresenter = require('theme/aw-bubble/presenter/base-section-view-presenter'),
        PreviewController = require('plugin/preview/controller/preview-controller');
    
    var PreviewViewPresenter = BaseSectionViewPresenter.extend({
        
        previewController: {
            inject: PreviewController
        },

        _scriptChanged: function() {
            this.previewController.getPdf(function(result) {
                this.view.pdf = result;
            }.bind(this));
        }

    });

    return PreviewViewPresenter;
});