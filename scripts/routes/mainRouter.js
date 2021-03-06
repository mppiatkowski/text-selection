/*global Textsel, Backbone*/

Textsel.Routers = Textsel.Routers || {};

(function () {
    'use strict';

    Textsel.Routers.MainRouter = Backbone.Router.extend({
    	routes: {
			'regularMarkup': 'showRegularMarkup',
			'ISMarkup': 'showISMarkup',
			'ISMarkup2': 'showISMarkup2',
			'ISMarkup3': 'showISMarkup3',
			'pdf2html': 'showPdf2Html',
			'pdf2html2': 'showPdf2Html2',
			'absoluteMarkup': 'showAbsoluteMarkup',
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
    			
				this.ViewTextPreviewer = new Textsel.Views.TextPreviewer();
				this.ViewMain.$el.append(this.ViewTextPreviewer.render().el);

    			this.ViewPage = new Textsel.Views.MarkupRegular();
    			this.ViewMain.$el.append(this.ViewPage.render().el);

			});

			this.on('route:showAbsoluteMarkup', function() {
				console.log('route absolute');

				this.resetMainContainer();

				this.ViewTextPreviewer = new Textsel.Views.TextPreviewer();
				this.ViewMain.$el.append(this.ViewTextPreviewer.render().el);
    			
    			this.ViewPage = new Textsel.Views.MarkupAbsolute();
    			this.ViewMain.$el.append(this.ViewPage.render().el);
			});

			this.on('route:showISMarkup', function() {
				console.log('route IS');

				this.resetMainContainer();

				this.ViewTextPreviewer = new Textsel.Views.TextPreviewer();
				this.ViewMain.$el.append(this.ViewTextPreviewer.render().el);

    			this.ViewPage = new Textsel.Views.MarkupIS();
    			this.ViewMain.$el.append(this.ViewPage.render().el);
			});

			this.on('route:showISMarkup2', function() {
				console.log('route IS 2');

				this.resetMainContainer();

				this.ViewTextPreviewer = new Textsel.Views.TextPreviewer();
				this.ViewMain.$el.append(this.ViewTextPreviewer.render().el);

    			this.ViewPage = new Textsel.Views.MarkupIS2();
    			this.ViewMain.$el.append(this.ViewPage.render().el);
			});

			this.on('route:showISMarkup3', function() {
				console.log('route IS 3');

				this.resetMainContainer();

				this.ViewTextPreviewer = new Textsel.Views.TextPreviewer();
				this.ViewMain.$el.append(this.ViewTextPreviewer.render().el);

    			this.ViewPage = new Textsel.Views.MarkupIS3();
    			this.ViewMain.$el.append(this.ViewPage.render().el);
			});

			this.on('route:showPdf2Html', function() {
				console.log('route pdf2html');
				this.resetMainContainer();

				this.ViewTextPreviewer = new Textsel.Views.TextPreviewer();
				this.ViewMain.$el.append(this.ViewTextPreviewer.render().el);

    			this.ViewPage = new Textsel.Views.MarkupPdf2Html();
    			this.ViewMain.$el.append(this.ViewPage.render().el);

			});

			this.on('route:showPdf2Html2', function() {
				console.log('route pdf2html 2');
				this.resetMainContainer();

				this.ViewTextPreviewer = new Textsel.Views.TextPreviewer();
				this.ViewMain.$el.append(this.ViewTextPreviewer.render().el);

    			this.ViewPage = new Textsel.Views.MarkupPdf2Html2();
    			this.ViewMain.$el.append(this.ViewPage.render().el);

			});

    	},

		resetMainContainer: function() {
			if (this.ViewPage) {
				this.ViewPage.remove();
				this.ViewTextPreviewer.remove();
			}
		}
    });

})();
