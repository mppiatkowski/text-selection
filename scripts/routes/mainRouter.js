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

				this.resetMainContainer();
			});
			
			this.on('route:showRegularMarkup', function() {
				console.log('route regular');

				this.resetMainContainer();
    			
    			this.ViewPage = new Textsel.Views.MarkupRegular();
    			this.ViewMain.$el.append(this.ViewPage.render().el);

			});

			this.on('route:showAbsoluteMarkup', function() {
				console.log('route absolute');

				this.resetMainContainer();
    			
    			this.ViewPage = new Textsel.Views.MarkupAbsolute();
    			this.ViewMain.$el.append(this.ViewPage.render().el);
			});

			this.on('route:showOverlappingMarkup', function() {
				console.log('route overlapping');

				this.resetMainContainer();

    			this.ViewPage = new Textsel.Views.MarkupOverlapping();
    			this.ViewMain.$el.append(this.ViewPage.render().el);
			});

    	},

		resetMainContainer: function() {
			if (this.ViewPage) {
				this.ViewPage.remove();
			}

			this.ViewMain.$el.empty();
			this.ViewMain.render();

			this.ViewMenu = new Textsel.Views.Menu();
			this.ViewMain.$el.append(this.ViewMenu.render().el);
		}
    });

})();
