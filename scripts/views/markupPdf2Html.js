/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupPdf2Html = Textsel.Views.MarkupCommon.extend({

        template: JST['scripts/templates/markupPdf2Html.ejs'],

        hammerEvents: {
            'tap .txt-switcher': 'toggleTextSelecting',
        },

        initialize: function () {
        },

        render: function () {
            this.undelegateHammerEvents();
            this.$el.html(this.template());
            this.delegateHammerEvents();
            return this;
        },

        remove: function() {
            this.undelegateHammerEvents();
            this._super();
        }

    });

})();
