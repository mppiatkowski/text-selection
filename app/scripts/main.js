/*global Textsel, $*/


window.Textsel = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        console.log('Hello from Backbone!');

        Textsel.Router = new Textsel.Routers.MainRouter();
        Textsel.Router.init();
        Textsel.Router.initRoutes();
        Backbone.history.start();



    }
};



$(document).ready(function () {
    'use strict';
    Textsel.init();
});
