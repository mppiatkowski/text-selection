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
            'tap .txt-to-select' : 'onTapStartSelecting',
            'press .list-boxes__item' : 'onPressStartSelecting',
            'pressup .list-boxes__item': 'onPressStop',
        },

        initialize: function () {
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
            this.undelegateHammerEvents();
            this.$el.html(this.template());
            this.delegateHammerEvents();
            return this;
        },

        remove: function() {
            this.undelegateHammerEvents();
            this._super();
        }

    });

})();
