/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';


    Textsel.Views.MarkupAbsolute = Textsel.Views.MarkupIS3.extend({

        template: JST['scripts/templates/markupAbsolute.ejs'],

        render: function () {
            var that = this;
            this.undelegateHammerEvents();
            this.$el.html(this.template());

            Textsel.Parser.areGlyphsReady.then(function(data) {
                that.drawTextBoxes(data);
            });


            this.delegateHammerEvents();
            return this;
        },
    });

})();
