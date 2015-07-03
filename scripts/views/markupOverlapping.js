/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupOverlapping = Backbone.View.extend({

        template: JST['scripts/templates/markupOverlapping.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        isTextSelectable: false,

        hammerEvents: {
            'tap .txt-switcher': 'toggleTextSelecting',
            'tap .glyphs-container' : 'onTapStartSelecting',
            'press .glyphs-container' : 'onPressStartSelecting',
            'pressup .glyphs-container': 'onPressStop',
        },

        initialize: function () {
            Textsel.Parser.getDeferredGlyphs();
        },

        toggleTextSelecting: function(e) {
            e.preventDefault();

            this.isTextSelectable = !this.isTextSelectable;
            if (this.isTextSelectable) {
                console.log('text selectable ON');
                this.$el.find('.txt-switcher').addClass('active');
                this.$el.find('.glyphs-container').css('userSelect','text');
                this.$el.find('.glyphs-container').children().css('userSelect','text');
            } else {
                console.log('text selectable OFF');
                this.$el.find('.txt-switcher').removeClass('active');
                this.$el.find('.glyphs-container').css('userSelect','none');
                this.$el.find('.glyphs-container').children().css('userSelect','none');
            }
        },

        onTapStartSelecting: function(e) {
            e.preventDefault();
            console.log('tapped', e.target);
        },

        onPressStartSelecting: function(e) {
            e.preventDefault();

            console.log('pressed', e);

            //this.$el.css('userSelect','text');

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
            var centX = cont.width();
            var centY = cont.height();

var glyph;
var word;
//console.log(data)
            for(var i=0, len = data.length; i<len; i++) {
                var glyphsLen = data[i].glyphs.length;

                word = $('<span>')
                    .attr('data-text', data[i].phrase)
                    .addClass('glyphs-box');


  console.log(data[i])
              word.css({
                    // x,y coordinates
                    top: data[i].glyphs[0].x + 'px',
                    left: data[i].glyphs[0].y + 'px',
                    //width, length
                    width: data[i].glyphs[0].x + data[i].glyphs[glyphsLen-1].x + data[i].glyphs[glyphsLen-1].width,
                    height: (centY - (data[i].glyphs[0].y + data[i].glyphs[glyphsLen-1].y + data[i].glyphs[glyphsLen-1].height))
                })

                for (var k=0; k < glyphsLen; k++ ) {
                    glyph = this.drawBox(cont, centX, centY, data[i].glyphs[k]);

                    var cont = this.$el.find('.glyphs-container');
                    word.append(glyph);

                }
                var cont = this.$el.find('.glyphs-container');
                cont.append(word);
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

            return el;
//            console.log(el);
//            var cont = this.$el.find('.glyphs-container');
  //          cont.append(el);
        },

        remove: function() {
            this.undelegateHammerEvents();
            this._super();
        }

    });

})();
