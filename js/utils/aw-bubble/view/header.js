define(function(require) {

    var Protoplast = require('p');

    var Header = Protoplast.Component.extend({

        html: '<div>' +
        '<h2><span data-prop="elemTitle"></span>&nbsp;<span data-prop="elemInfoIcon" class="info-icon"/></h2>' +
        '<p data-prop="elemDescription" class="info-content" style="display: none"></p>' +
        '</div>',

        elemTitle: null,

        elemDescription: null,

        elemInfoIcon: null,

        title: '',
        
        description: '',
        
        descriptionVisible: false,
        
        $create: function() {
            this.$root = $(this.root);
            this.$description = $(this.elemDescription);

            this.elemInfoIcon.onclick = function() {
                this.descriptionVisible = !this.descriptionVisible;
            }.bind(this)
        },

        init: function() {
            Protoplast.utils.bind(this, 'title', this.updateTitle.bind(this));
            Protoplast.utils.bind(this, 'description', this.updateDescription.bind(this));
            Protoplast.utils.bind(this, 'descriptionVisible', this.toggleDescription.bind(this));
        },

        updateTitle: function() {
            this.elemTitle.innerHTML = this.title;
        },

        updateDescription: function() {

            if (!this.description) {
                this.elemDescription.style.display = 'none';
                this.elemInfoIcon.style.display = 'none';
            }
            else {
                this.elemDescription.style.display = this.descriptionVisible ? 'block' : 'none';
                this.elemInfoIcon.style.display = 'inline';
            }

            this.elemDescription.innerHTML = this.description;
        },
        
        toggleDescription: function() {
            if (this.descriptionVisible) {
                this.$description.show({
                    duration: 200,
                    easing: 'linear'
                });
            }
            else {
                this.$description.hide({
                    duration: 200,
                    easing: 'linear'
                });
            }
        }

    });

    return Header;
});