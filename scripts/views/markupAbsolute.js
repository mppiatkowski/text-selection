/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupAbsolute = Textsel.Views.MarkupCommon.extend({

        template: JST['scripts/templates/markupAbsolute.ejs'],

        hammerEvents: {
            'tap .txt-switcher': 'toggleTextSelecting',
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
        },
    });

})();
