/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupRegular = Textsel.Views.MarkupCommon.extend({

        template: JST['scripts/templates/markupRegular.ejs'],

        hammerEvents: {
            'tap .txt-switcher': 'toggleTextSelecting',
        },

        render: function () {
            this._super();
            return this;
        },

        remove: function() {
            this.undelegateHammerEvents();
            this._super();
        }

    });

})();
