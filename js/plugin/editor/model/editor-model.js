define(function(require) {

    var Protoplast = require('p');

    var EditorModel = Protoplast.Model.extend({
        
        saveInProgress: false,
        
        pendingChanges: false,
        
        isSyncEnabled: false,
        
        isAutoSaveEnabled: false,
        
        lastContent: '',
        
        cursorPosition: null,
        
        scrollInfo: null,
        
        toggleSync: function() {
            this.lastContent = '';
            this.isSyncEnabled = !this.isSyncEnabled;
        }
        
    });

    return EditorModel;
});