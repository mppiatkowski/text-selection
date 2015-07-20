/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupCommon = Backbone.View.extend({

        template: JST['scripts/templates/markupRegular.ejs'],

        isTextSelectable: false,

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
            this.turnOffSelectionChange();
            this._super();
        },

        toggleTextSelecting: function(e) {
            e.preventDefault();

            this.isTextSelectable = !this.isTextSelectable;
            if (this.isTextSelectable) {
                console.log('text selectable ON');
                this.$el.find('.txt-switcher').addClass('active');
                this.$el.find('.glyphs-container').css('userSelect','text');
//                this.$el.find('.glyphs-container').find('*').css('userSelect','text');

                this.turnOnSelectionChange();

            } else {
                console.log('text selectable OFF');
                this.$el.find('.txt-switcher').removeClass('active');
                this.$el.find('.glyphs-container').css('userSelect','none');
//                this.$el.find('.glyphs-container').find('*').css('userSelect','none');

                this.turnOffSelectionChange();
            }
        },

        turnOnSelectionChange: function() {
            var that = this;

            $(document).on('selectionchange', function(e){
                var selObj = document.getSelection();

//                that.$el.find('.taken').css('background','none');

                // obj, html clone, txt
                console.log('sel chng', selObj, selObj.getRangeAt(0).cloneContents(), selObj.toString());
                /*
                var elements = selObj.getRangeAt(0).cloneContents()
                var range = window.getSelection().getRangeAt(0);
                var selectionContents = range.extractContents();
                var div = document.createElement("div");
                div.style.color = "yellow";
                div.appendChild(selectionContents);
                range.insertNode(div);
                */
            })
        },

        turnOffSelectionChange: function() {
            $(document).off('selectionchange');
        },

    });

})();
