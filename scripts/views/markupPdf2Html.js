/*global Textsel, Backbone, JST*/

Textsel.Views = Textsel.Views || {};

(function () {
    'use strict';

    Textsel.Views.MarkupPdf2Html = Textsel.Views.MarkupCommon.extend({

        template: JST['scripts/templates/markupPdf2Html.ejs'],

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


            var f1 = [['t1_1',184],['t3_1',1554],['t4_1',1855],['t6_1',730],['t7_1',2640],['t8_1',2637],['t9_1',2638],['ta_1',775],['tb_1',2639],['tc_1',1795],['td_1',795],['te_1',1816],['tf_1',2640],['tg_1',2640],['th_1',868],['tk_1',2448],['tm_1',1655],['tn_1',1604],['to_1',2227],['tq_1',774],['tr_1',1765],['ts_1',2443],['tt_1',926],['tu_1',1187],['tv_1',1255],['tw_1',2469],['tx_1',1103],['ty_1',1255],['tz_1',2569],['t10_1',955],['t12_1',2363],['t13_1',609],['t15_1',337],['t16_1',665],['t17_1',416],['t18_1',1154],['t19_1',939],['t1b_1',2553],['t1c_1',1713],['t1e_1',2393],['t1f_1',767],['t1g_1',2636],['t1h_1',1270],['t1i_1',1199],['t1j_1',823]];
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
    var isIE = false;
    
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
