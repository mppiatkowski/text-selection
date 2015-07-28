/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';


    Textsel.Views.MarkupAbsolute = Textsel.Views.MarkupIS3.extend({

        template: JST['scripts/templates/markupAbsolute.ejs'],
        canvas: undefined,

        hammerEvents: {
            'tap .txt-switcher': 'toggleTextSelecting',
            'tap .markups-overlay': 'tap',
            'panstart .markups-overlay': 'panStart',
            'pan .markups-overlay': 'pan',
            'panend .markups-overlay': 'panEnd',
        },

        render: function () {
            var that = this;
            this.undelegateHammerEvents();
            this.$el.append(this.template());

            this.canvas = this.$el.find('.markups-overlay');

            Textsel.Parser.areGlyphsReady.then(function(data) {
                that.drawTextBoxes(data);
            });

            this.delegateHammerEvents();
            return this;
        },

        turnOnSelectionChange: function() {
            var width = this.$el.outerWidth();
            var height = this.$el.outerHeight();

            this.canvas.css({
                'display': 'block',
                'width': width,
                'height': height
            });

            // add hammer taps that iterate data


            // add method iterating data and checkoing if hit (AABB tests with modulo)

            // return start - end of selecting (serialize)

            // save serialization

            // pass items to display


//                    that.injectSelectedText(selObj.toString());
        },

        turnOffSelectionChange: function() {
            this.canvas.css({
                'display': 'none'
            });
        },

        tap: function() {
            console.log('tap');
        },

        panStart: function() {
            console.log('pan start');
        },

        pan: function() {
            console.log('pan');
        },

        panEnd: function() {
            console.log('pan end');
        },


    });

})();
