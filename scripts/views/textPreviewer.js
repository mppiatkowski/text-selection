/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.TextPreviewer = Backbone.View.extend({

        template: JST['scripts/templates/textPreviewer.ejs'],
        className: "previewer-box",
        //tagName: "textarea",

        render: function () {
            this.$el.html(this.template());

            this.listenTo(Textsel.Bus, 'text:changed', this.redrawText);

            return this;
        },

        remove: function() {
            this._super();
        },

        redrawText: function(options) {
            if (options) {
                this.$el.html(options.text);
            } else {
                this.$el.html('');
            }
        }

    });

})();
