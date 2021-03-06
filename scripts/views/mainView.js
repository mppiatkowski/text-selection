/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MainView = Backbone.View.extend({

        template: JST['scripts/templates/mainView.ejs'],

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
