/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupPdf2Html2 = Textsel.Views.MarkupCommon.extend({

        template: JST['scripts/templates/markupPdf2Html2.ejs'],

        hammerEvents: {
            'tap .txt-switcher': 'toggleTextSelecting',
        },

        initialize: function () {
        },

        render: function () {
            var that = this;
            this.undelegateHammerEvents();
            this.$el.html(this.template());
            this.delegateHammerEvents();


            var f1 = [['t1_1',636],['t2_1',466],['t3_1',440],['t4_1',1256],['t7_1',592],['t8_1',552],['td_1',552],['te_1',641],['th_1',252],['tp_1',261],['tt_1',252],['tx_1',252],['t11_1',269],['t15_1',252],['t19_1',257],['t1d_1',257],['t1s_1',640],['t1v_1',252],['t22_1',789],['t23_1',323],['t26_1',1064],['t28_1',531],['t2a_1',531],['t2b_1',76],['t2c_1',1250],['t2d_1',83],['t2e_1',911],['t2f_1',73],['t2g_1',736],['t2h_1',69],['t2i_1',1003],['t2j_1',74],['t2k_1',711],['t2l_1',69],['t2m_1',1476],['t2n_1',79],['t2o_1',1630],['t2p_1',89],['t2q_1',669]];
            setTimeout(function() {that.adjustWordSpacing(f1);},500);
            
            return this;
        },

        remove: function() {
            this.undelegateHammerEvents();
            this._super();
        },

adjustWordSpacing: function(widths) {
    var i, allLinesDone = false;
    var isDone = [];
    var currentSpacing = [];
    var elements = [];
    
    // Initialise arrays
    for (i = 0; i < widths.length; i++) {
        elements[i] = document.getElementById(widths[i][0]);
        elements[i].style.wordSpacing = '0px';//Required if rerunning
    }
    for (i = 0; i < widths.length; i++) {
        if (isIE) widths[i][1] = widths[i][1] * 4;
        currentSpacing[i] = Math.floor((widths[i][1] - elements[i].offsetWidth) / elements[i].innerHTML.match(/\s.|&nbsp;./g).length);//min
        if (isIE) currentSpacing[i] = Math.floor(currentSpacing[i] / 4);
        isDone[i] = false;
    }
    
    while (!allLinesDone) {
        // Add each adjustment to the render queue without forcing a render
        for (i = 0; i < widths.length; i++) {
            if (!isDone[i]) {
                elements[i].style.wordSpacing = currentSpacing[i] + 'px';
            }            
        }
        
        allLinesDone = true;
        // If elements still need to be wider, add 1 to the word spacing
        for (i = 0; i < widths.length; i++) {
            if (!isDone[i] && currentSpacing[i] < 160) {
                if (elements[i].offsetWidth >= widths[i][1]) {
                    isDone[i] = true;
                } else {
                    currentSpacing[i]++;
                    allLinesDone = false;
                }
            }
        }
    }
    
    for (i = 0; i < widths.length; i++) {
        elements[i].style.wordSpacing = (currentSpacing[i] - 1) + 'px';
    }
}

    });

})();
