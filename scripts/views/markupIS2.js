/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupIS2 = Textsel.Views.MarkupCommon.extend({

        template: JST['scripts/templates/markupIS2.ejs'],

        hammerEvents: {
            'tap .txt-switcher': 'toggleTextSelecting',
        },

        initialize: function () {
            Textsel.Parser.getDeferredGlyphs('xml/3.xml');
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

        // boxes are positioned and each glyph has calculated dimensions and fits inside
        drawTextBoxes: function(data) {
            var cont = this.$el.find('.glyphs-container');
            var centX = cont.width();
            var centY = cont.height();
            var glyph;
            var word;
            var paragraphized;

            console.log(data);

            //paragraphs
            for (var p=0, len = data.length; p<len; p++) {

                paragraphized = $('<span>')
                    .addClass('paragraphized-box');

                //words
                for(var i=0, len = data[p].length; i<len; i++) {
                    var glyphsLen = data[p][i].glyphs.length;


                    var xLeft = parseFloat(data[p][i].space.llx);
                    var xRight = parseFloat(data[p][i].space.urx);
                    var yTop = centY - parseFloat(data[p][i].space.ury);
                    var yBottom = centY - parseFloat(data[p][i].space.lly);

                    var wordWidth = xRight- xLeft;
                    var wordHeight = yBottom - yTop;

                    word = $('<span>')
                        .attr('data-text', data[p][i].phrase)
                        .addClass('glyphs-box')
                        .css({
                            // x,y coordinates
                            top: yTop + 'px',
                            left: xLeft + 'px',
                            //width, length
                            width: wordWidth + 'px',
                            height: wordHeight + 'px'
                        });

                    // glyphs
                    for (var k=0; k < glyphsLen; k++ ) {
                        glyph = this.drawBox(cont, data[p][i].glyphs[k]);
                        word.append(glyph);

                        // split words with space if last glyph
                        if (k === glyphsLen -1) {
                            glyph = this.drawBox(cont, {width: 1, height: wordHeight, sign: '###---###'});
                            word.append(glyph);
                        }
                    }
                    paragraphized.append(word);
                }
                var cont = this.$el.find('.glyphs-container');
                cont.append(paragraphized);
            }


            // console.log(cont);
        },

        drawBox: function(cont, item) {
            // console.log(item);
  
            var el = $('<span>')
                        .addClass('glyph selectable')
                        .css({
                            width: item.width,
                            height: item.height,
                            fontSize: item.height + 'px',
                            lineHeight: item.height + 'px'
                        })
                        .attr('data-width', item.width)
                        .attr('data-height', item.height)
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
