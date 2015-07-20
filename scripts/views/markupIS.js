/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupIS = Textsel.Views.MarkupCommon.extend({

        template: JST['scripts/templates/markupIS.ejs'],

        hammerEvents: {
            'tap .txt-switcher': 'toggleTextSelecting',
        },

        initialize: function () {
            Textsel.Parser.getDeferredGlyphs();
        },

        onTap: function(e) {
            e.preventDefault();
            console.log('tapped', e.target);
        },

        onPressStartSelecting: function(e) {
            e.preventDefault();

            console.log('pressed', e);

            //this.$el.css('userSelect','text');
            /*
            $(document).on('selectionchange', function(e){
                var selObj = document.getSelection();
                // obj, html clone, txt
                console.log('sel chng', selObj, selObj.getRangeAt(0).cloneContents(), selObj.toString());

            })
            */

        },

        onPressStop: function(e) {
            console.log('pressUp');
        },

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

        drawTextBoxes: function(data) {
            var cont = this.$el.find('.glyphs-container');
            var centX = cont.width();
            var centY = cont.height();
            var glyph;
            var word;

            //console.log(data)
            for(var i=0, len = data.length; i<len; i++) {
                var glyphsLen = data[i].glyphs.length;

                var wordWidth = parseFloat(data[i].glyphs[0].x) + parseFloat(data[i].glyphs[glyphsLen-1].x) + parseFloat(data[i].glyphs[glyphsLen-1].width);
                var wordHeight = (centY - (parseFloat(data[i].glyphs[0].y) + parseFloat(data[i].glyphs[glyphsLen-1].y) + parseFloat(data[i].glyphs[glyphsLen-1].height)) );

                word = $('<span>')
                    .attr('data-text', data[i].phrase)
                    .addClass('glyphs-box')
                    .css({
                        // x,y coordinates
                        top: data[i].glyphs[0].x + 'px',
                        left: data[i].glyphs[0].y + 'px',
                        //width, length
                        width: wordWidth + 'px',
                        height: wordHeight + 'px'
                    });

                for (var k=0; k < glyphsLen; k++ ) {
                    glyph = this.drawBox(cont, centX, centY, data[i].glyphs[k]);
                    word.append(glyph);

                }
                var cont = this.$el.find('.glyphs-container');
                cont.append(word);
            }

            // console.log(cont);
        },

        drawBox: function(cont, centX, centY, item) {
            // console.log(item);
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

            return el;
        },

        remove: function() {
            this.undelegateHammerEvents();
            this.turnOffSelectionChange();
            this._super();
        }

    });

})();
