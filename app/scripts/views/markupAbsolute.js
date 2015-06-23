/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupAbsolute = Backbone.View.extend({

        template: JST['app/scripts/templates/markupAbsolute.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        },

        remove: function() {
            this._super();
        }

    });

})();
