/*global Textsel, Backbone*/

Textsel.Routers = Textsel.Routers || {};

(function () {
    'use strict';

    Textsel.Routers.MainRouter = Backbone.Router.extend({
    	routes: {
			'regularMarkup': 'showRegularMarkup',
			'absoluteMarkup': 'showAbsoluteMarkup',
			'ISMarkup': 'showISMarkup',
			'.*': 'showDefault'
    	},
    	init: function() {

			this.ViewMain = new Textsel.Views.MainView({
				el: '#appWrapper'
			});
			this.ViewMain.render();

			this.ViewMenu = new Textsel.Views.Menu();
			this.ViewMain.$el.append(this.ViewMenu.render().el);
    	},
    	initRoutes: function() {
    		this.on('route:showDefault', function() {
				this.ViewMenu.onTapBtnRegular();
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

			this.on('route:showISMarkup', function() {
				console.log('route IS');

				this.resetMainContainer();

    			this.ViewPage = new Textsel.Views.MarkupIS();
    			this.ViewMain.$el.append(this.ViewPage.render().el);
			});

    	},

		resetMainContainer: function() {
			if (this.ViewPage) {
				this.ViewPage.remove();
			}
		}
    });

})();
