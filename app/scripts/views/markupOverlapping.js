/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupOverlapping = Backbone.View.extend({

        template: JST['app/scripts/templates/markupOverlapping.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        hammerEvents: {
//            'tap .txt-to-select' : 'onTapStartSelecting',
//            'press .selectable' : 'onPressStartSelecting',
  //          'pressup .selectable': 'onPressStop',
        },

        initialize: function () {
            Textsel.Parser.getDeferredGlyphs();
        },

        onTapStartSelecting: function(e) {
            e.preventDefault();
            console.log('tapped', e.target);
        },

        onPressStartSelecting: function(e) {
            e.preventDefault();

            console.log('pressed', e);

            //this.$el.css('userSelect','text');
            $(e.target).css('userSelect','text');
            $(e.target).children().css('userSelect','text');


            $(document).on('selectionchange', function(e){
                var selObj = document.getSelection();
                // obj, html clone, txt
                console.log('sel chng', selObj, selObj.getRangeAt(0).cloneContents(), selObj.toString());

            })

        },

        onPressStop: function(e) {
            console.log('pressUp');
            console.log('sel text', window.getSelection());
        },

        render: function () {
            var that = this;
            this.undelegateHammerEvents();
            this.$el.html(this.template());

            Textsel.Parser.areGlyphsReady.then(function(data) {
//                console.log(data);
                that.drawTextBoxes(data);
            });


            this.delegateHammerEvents();
            return this;
        },

        drawTextBoxes: function(data) {
            var cont = this.$el.find('.glyphs-container');
            var centerX = cont.width();
            var centerY = cont.height();

            for(var i=0, len = data.length; i<len; i++) {
                this.drawBox(cont, centerX, centerY, data[i]);
            }

//            console.log(cont);
        },

        drawBox: function(cont, centX, centY, item) {
//            console.log(item);
            var newX = item.x +'px';
            var newY = (centY - item.y) +'px';
  
            var el = $('<span>')
                        .addClass('glyph selectable')
                        .css({
                            width: item.width,
                            height: item.height,
                            top: newY,
                            left: newX,
                            fontSize: item.height + 'px',
                            lineHeight: item.height + 'px'
                        })
                        .attr('data-width', item.width)
                        .attr('data-height', item.height)
                        .attr('data-x', newX)
                        .attr('data-y', newY)
                        .text(item.sign);

//            console.log(el);
            var cont = this.$el.find('.glyphs-container');
            cont.append(el);
        },

        remove: function() {
            this.undelegateHammerEvents();
            this._super();
        }

    });

})();
