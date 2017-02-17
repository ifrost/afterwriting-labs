define(function(require) {

    var BaseSectionViewPresenter = require('theme/aw-bubble/presenter/base-section-view-presenter'),
        PreviewController = require('plugin/preview/controller/preview-controller');
    
    var PreviewViewPresenter = BaseSectionViewPresenter.extend({
        
        previewController: {
            inject: PreviewController
        },

        activate: function() {
            BaseSectionViewPresenter.activate.call(this);
            // TODO: preview should be refreshed when script in model changes (and viewer is active) (+)
            // Could be in BaseScriptObserverPresenter/Mixin
            // $create: this.bin dings = Protoplast.utils.bind(this, 'script.content', this.refresh);
            // on activate: this.bindings.start()
            // on deactivate: this.bindings.stop()
            
            // TODO: refresh when editor is synced and stop when it's not visible (+++++)
            this.refresh();
        },

        deactivate: function() {
            BaseSectionViewPresenter.deactivate.call(this);
        },

        refresh: function() {
            // TODO: why timeout? (+++)
            setTimeout(function() {
                this.previewController.getPdf(function(result) {
                    this.view.pdf = result;
                }.bind(this));
            }.bind(this), 0);
        }

    });

    return PreviewViewPresenter;
});