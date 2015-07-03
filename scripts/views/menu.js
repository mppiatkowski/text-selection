/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.Menu = Backbone.View.extend({

        template: JST['app/scripts/templates/menu.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        hammerEvents: {
            'tap .btnRegular' : 'onTapBtnRegular',
            'tap .btnAbsolute' : 'onTapBtnAbsolute',
            'tap .btnOverlap' : 'onTapBtnOverlap',
        },

        onTapBtnRegular: function() {
            console.log('tapped 1');
            Textsel.Router.navigate('regularMarkup', {
                trigger: true
            });
        },

        onTapBtnAbsolute: function() {
            console.log('tapped 2');
            Textsel.Router.navigate('absoluteMarkup', {
                trigger: true
            });
        },

        onTapBtnOverlap: function() {
            console.log('tapped 3');
            Textsel.Router.navigate('overlappingMarkup', {
                trigger: true
            });
        },

        initialize: function () {
        },

        render: function () {
            this.undelegateHammerEvents();

            this.$el.html(this.template());

            this.delegateHammerEvents();

            return this;
        }

    });

})();
