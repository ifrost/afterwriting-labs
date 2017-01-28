define(function(require) {

    var Protoplast = require('p');

    var IoModel = Protoplast.Model.extend({

        fileName: null,
        
        fountainFileName: null,
        
        pdfFileName: null,
        
        dbPath: null,
        
        dbPdfPath: null,
        
        gdLink: null,
        
        gdFileId: null,
        
        gdPdfId: null,
        
        gdParents: null,
        
        gdPdfParents: null,
        
        /**
         * @type {LastUsedInfo}
         */
        lastUsedInfo: {
            get: function() {
                return this._lastUsedInfo
            },
            /**
             * @param {LastUsedInfo} lastUsedInfo
             */
            set: function(lastUsedInfo) {
                this._lastUsedInfo = lastUsedInfo;
                this.lastUsedInfoLoaded = !!lastUsedInfo;
            }
        },

        /**
         * @type {Boolean}
         */
        lastUsedInfoLoaded: false,

        isDropboxAvailable: {
            get: function () {
                return window.location.protocol !== 'file:';
            }
        },

        isGoogleDriveAvailable: {
            get: function () {
                return window.gapi && window.location.protocol !== 'file:';
            }
        }
    });

    return IoModel;
});