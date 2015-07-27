/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.Menu = Backbone.View.extend({

        template: JST['scripts/templates/menu.ejs'],

        hammerEvents: {
            'tap .btnRegular' : 'onTapBtnRegular',
            'tap .btnAbsolute' : 'onTapBtnAbsolute',
            'tap .btnIS' : 'onTapBtnIS',
            'tap .btnIS2' : 'onTapBtnIS2',
            'tap .btnIS3' : 'onTapBtnIS3',
            'tap .btnPdf2Html' : 'onTapBtnPdf2Html',
            'tap .btnPdf2Html2' : 'onTapBtnPdf2Html2',
        },

        activateRightBtn: function(className) {
            this.$el.find('li').removeClass('active');
            this.$el.find(className).closest('li').addClass('active');
        },

        onTapBtnRegular: function() {
            this.activateRightBtn('.btnRegular');
            Textsel.Router.navigate('regularMarkup', {
                trigger: true
            });
        },

        onTapBtnAbsolute: function() {
            this.activateRightBtn('.btnAbsolute');
            Textsel.Router.navigate('absoluteMarkup', {
                trigger: true
            });
        },

        onTapBtnIS: function() {
            this.activateRightBtn('.btnIS');
            Textsel.Router.navigate('ISMarkup', {
                trigger: true
            });
        },

        onTapBtnIS2: function() {
            this.activateRightBtn('.btnIS2');
            Textsel.Router.navigate('ISMarkup2', {
                trigger: true
            });
        },

        onTapBtnIS3: function() {
            this.activateRightBtn('.btnIS3');
            Textsel.Router.navigate('ISMarkup3', {
                trigger: true
            });
        },

        onTapBtnPdf2Html: function() {
            this.activateRightBtn('.btnPdf2Html');
            Textsel.Router.navigate('pdf2html', {
                trigger: true
            });
        },

        onTapBtnPdf2Html2: function() {
            this.activateRightBtn('.btnPdf2Html2');
            Textsel.Router.navigate('pdf2html2', {
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
