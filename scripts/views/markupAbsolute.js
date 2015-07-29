/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';


    Textsel.Views.MarkupAbsolute = Textsel.Views.MarkupIS3.extend({

        template: JST['scripts/templates/markupAbsolute.ejs'],
        canvas: undefined,
        dataToDisplay: undefined,
        textSelReady: undefined,
        ctx: undefined,
        canvasRect: undefined,
        selectedItems: {
            start: {
                paragraph: undefined,
                word: undefined,
                glyph: undefined
            },
            end: {
                paragraph: undefined,
                word: undefined,
                glyph: undefined
            }
        },

        hammerEvents: {
            'tap .txt-switcher': 'toggleTextSelecting',
            'tap .markups-overlay': 'onTap',
            'panstart .markups-overlay': 'onPanStart',
            'pan .markups-overlay': 'onPan',
            'panend .markups-overlay': 'onPanEnd',
        },

        render: function () {
            var that = this;
            this.undelegateHammerEvents();
            this.$el.append(this.template());

            this.canvas = this.$el.find('.markups-overlay');

            Textsel.Parser.areGlyphsReady.then(function(data) {
                that.dataToDisplay = data;
                that.textSelReady = true;
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
            });
            this.canvas[0].width = width;
            this.canvas[0].height = height;

            this.prepareCanvas();
        },

        prepareCanvas: function() {
            this.ctx = this.canvas[0].getContext('2d');
        },

        turnOffSelectionChange: function() {
            this.canvas.css({
                'display': 'none'
            });
            this.ctx = undefined;
        },

        detectIfCollide: function(tapPos, dataArr) {
            var collidedLine = this.detectIfCollideLine(tapPos, dataArr);
            //console.log(collidedLine);
        },

        detectIfCollideLine: function(tapPos, dataArr) {
            var i, len, line, word;

            var cont = this.$el.find('.glyphs-container');
            var centX = cont.width();
            var centY = cont.height();

            var yTop, yBottom;

//            console.log('tap',tapPos);
            //console.log(dataArr);


            for (i=0, len=dataArr.length; i < len; i++) {
                line = dataArr[i];

//                if (i!==4) continue;
//console.log(line);
                var yTop = parseFloat(line.space.ury);
                var yBottom = parseFloat(line.space.lly);
                var xLeft = parseFloat(line.space.llx);
                var xRight = parseFloat(line.space.urx);

                console.log(i, tapPos.y + ' > ' + yTop + ' && '+tapPos.y+' < '+yBottom,  dataArr[i]);

                if ((tapPos.y > yTop && tapPos.y < yBottom) 
                        && (tapPos.x > xLeft && tapPos.x < xRight)) {
                    return i;
                }
            }
        },

        setSelectionStart: function(parIdx, wordIdx, glyphIdx) {
            //console.log('start',parIdx, wordIdx, glyphIdx);
            this.selectedItems.start.paragraph = parIdx;
            this.selectedItems.start.word = wordIdx;
            this.selectedItems.start.glyph = glyphIdx;
        },
        setSelectionEnd: function(parIdx, wordIdx, glyphIdx) {
            //console.log('end',parIdx, wordIdx, glyphIdx);
            this.selectedItems.end.paragraph = parIdx;
            this.selectedItems.end.word = wordIdx;
            this.selectedItems.end.glyph = glyphIdx;
        },
        onTap: function(e) {
            e.preventDefault();

            this.canvasRect = this.canvas[0].getBoundingClientRect();
            //console.log(this.canvasRect); 

            var posOnCanvas = {
                x: e.center.x - this.canvasRect.left,
                y: e.center.y - this.canvasRect.top,
            }

            this.canvas[0].width = this.canvas[0].width;
            this.canvas[0].height = this.canvas[0].height;

            var colidedParIdx;

            if (this.textSelReady) {

            // add hammer taps that iterate data
            // add method iterating data and checkoing if hit (AABB tests)
                colidedParIdx = this.detectIfCollideLine(posOnCanvas, this.dataToDisplay);

                if (colidedParIdx !== undefined) {
                    var lastPar = this.dataToDisplay[colidedParIdx];
                    var lastWord = lastPar[lastPar.length-1];
                    var lastWordIdx = lastPar.length-1;
                    var glyphs = lastWord.glyphs;
                    var lastGlyphIdx = glyphs.length-1;

            // return start - end of selecting (serialize)
            // save serialization
                    this.setSelectionStart(colidedParIdx,0,0);
                    this.setSelectionEnd(colidedParIdx, lastWordIdx, lastGlyphIdx);


            // pass items to display
                    this.drawSelectionRange(this.selectedItems.start, this.selectedItems.end);
                }
            }

//                    that.injectSelectedText(selObj.toString());

        },

        drawSelectionRange: function(selStart, selEnd) {
            console.log(selStart, selEnd);
            var pi, plast, wi, wlast, gi, glast;
            var par, word, glyph;

            var combinedText = '';

            // selecting right paragraphs
            for (pi=selStart.paragraph, plast=selEnd.paragraph; pi <= plast; pi++) {
                var par = this.dataToDisplay[pi];

                // selecting right words
                for (wi=selStart.word, wlast=selEnd.word; wi <= wlast; wi++) {
                    var word = par[wi];
                    //console.log('word: ', word);
                    combinedText += word.phrase;
                    if (wi !== wlast) {
                        combinedText += ' ';
                    }

                    this.drawSelectedItem(word);
                }
            }
            this.drawSelectionHandles(selStart, selEnd);

            //console.log('combinedText ', combinedText)
            this.injectSelectedText(combinedText);
        },

        drawSelectedItem: function(word){
            console.log(word);

            this.ctx.fillStyle = "#553328";
            this.ctx.fillRect(word.space.llx, word.space.ury, word.space.urx - word.space.llx, word.space.lly - word.space.ury);

        },

        drawSelectionHandles: function(selStart, selEnd){
            var xs = this.dataToDisplay[selStart.paragraph].space.llx;
            var ys = this.dataToDisplay[selStart.paragraph].space.ury;

            this.ctx.fillStyle = "#00A308";
            this.ctx.beginPath();
            this.ctx.arc(xs, ys, 5, 0, 2*Math.PI);
            this.ctx.closePath();
            this.ctx.fill();

            var xe = this.dataToDisplay[selEnd.paragraph].space.urx;
            var ye = this.dataToDisplay[selEnd.paragraph].space.lly;

            this.ctx.fillStyle = "#00A308";
            this.ctx.beginPath();
            this.ctx.arc(xe, ye, 5, 0, 2*Math.PI);
            this.ctx.closePath();
            this.ctx.fill();

        },

        onPanStart: function() {
            console.log('onPan start');
        },

        onPan: function() {
            console.log('onPan');
        },

        onPanEnd: function() {
            console.log('onPan end');
        },


    });

})();
