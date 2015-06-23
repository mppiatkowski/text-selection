/*global Textsel, Backbone*/

Textsel.Routers = Textsel.Routers || {};

(function () {
    'use strict';

    Textsel.Routers.MainRouter = Backbone.Router.extend({
    	routes: {
			'regularMarkup': 'showRegularMarkup',
			'absoluteMarkup': 'showAbsoluteMarkup',
			'overlappingMarkup': 'showOverlappingMarkup',
			'.*': 'default'
    	},
    	init: function() {

			this.ViewMain = new Textsel.Views.MainView({
				el: '#appWrapper'
			});
			this.ViewMain.render();
    	},
    	initRoutes: function() {
			this.on('route:default', function() {
				console.log('route default');

				this.ViewMain.render();
			});

			this.on('route:showRegularMarkup', function() {
				console.log('route regular');

				this.ViewMain.render();
    			this.ViewRegular = new Textsel.Views.MarkupRegular();
    			this.ViewMain.$el.html(this.ViewRegular.render().el);

			});

			this.on('route:showAbsoluteMarkup', function() {
				console.log('route absolute');

				this.ViewMain.render();
    			this.ViewAbsolute = new Textsel.Views.MarkupAbsolute();
    			this.ViewMain.$el.html(this.ViewAbsolute.render().el);
			});

			this.on('route:showOverlappingMarkup', function() {
				console.log('route overlapping');

				this.ViewMain.render();
    			this.ViewOverlapping = new Textsel.Views.MarkupOverlapping();
    			this.ViewMain.$el.html(this.ViewOverlapping.render().el);
			});
    	}
    });

})();
