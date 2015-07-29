

Textsel.Parser = {
	src: undefined,
	isFileParsed: null,
	areGlyphsReady: null,
	wordsArr: [],
	paragraphsArray: [],

	getFile: function() {
		Textsel.Parser.isFileParsed = $.Deferred();
		Textsel.Parser.areGlyphsReady = $.Deferred(),

		$.ajax({
			url: this.src,
			dataType: 'xml',
			success: function(data, type, xhr){
				console.log('file read');
				var dataJSON = $.xml2json(data);
				Textsel.Parser.isFileParsed.resolve(dataJSON)
			}
		});
	},
	init: function() {
		//console.log('initializing xml parser');
		Textsel.Parser.getFile();
	},
	getPageContent: function(data) {
		Textsel.Parser.isFileParsed.then(function(data) {
			var page = data['#document']['TET']['Document']['Pages']['Page'];
			var paragraphs = page['Content']['Para'];
			var pageParams = {width: parseFloat(page.$.width), height: parseFloat(page.$.height)};

			var parsedPage = Array.prototype.map.call(paragraphs, function(item){
				return Textsel.Parser.parseParagraph(item, pageParams);
			});

			parsedPage.pageParams = pageParams;
			//console.log(parsedPage);
			Textsel.Parser.areGlyphsReady.resolve(parsedPage);
		});
	},
	parseParagraph: function(par, pageParams) {
		var words = par.Word;
		var parsedPar;
		var i, len;

		if (Object.prototype.toString.call(words) === '[object Array]') {
			parsedPar = Array.prototype.map.call(words, Textsel.Parser.parseWord);
		} else {
			parsedPar = [].concat(Textsel.Parser.parseWord(words));
		}

		// calculate paragraph box
		parsedPar.space = {
			llx: parseFloat(parsedPar[0].space.llx),
			lly: pageParams.height - parseFloat(parsedPar[0].space.lly),
			urx: parseFloat(parsedPar[parsedPar.length-1].space.urx),
			ury: pageParams.height - parseFloat(parsedPar[parsedPar.length-1].space.ury)	
		}

		for (i=0, len=parsedPar.length; i<len; i++) {

			var a;
			if (parsedPar[i].space.llx) {
				a = Math.min(parsedPar.space.llx, parseFloat(parsedPar[i].space.llx));
				parsedPar.space.llx = a;
			}
			if (parsedPar[i].space.urx) {
				a = Math.max(parsedPar.space.urx, parseFloat(parsedPar[i].space.urx));
				parsedPar.space.urx = a;
			}
			if (parsedPar[i].space.ury) {
				a = Math.min(parsedPar.space.ury, pageParams.height - parseFloat(parsedPar[i].space.ury));
				parsedPar.space.ury = a; 
			}
			if (parsedPar[i].space.lly) {
				a = Math.max(parsedPar.space.lly, pageParams.height - parseFloat(parsedPar[i].space.lly));
				parsedPar.space.lly = a;
			}
		}

		console.log('by parser - par space: ',parsedPar.space);
		return parsedPar;
	},
	parseWord: function(word, index, wordsArr) {
		var text = word.Text;
		var glyphs = word.Box.Glyph;
		var wordsArr = [];

		//console.log(word);

		// on special markup signs there is no glyph
		if (Object.prototype.toString.call(glyphs) === '[object Array]' && glyphs.length) {
			var wordObj = {
				phrase: text,
				glyphs: [],
				space: word.Box.$
			}; 

			//	console.log(word);
			for (var i=0, len=glyphs.length; i < len; i++) {
				wordObj.glyphs.push(Textsel.Parser.parseGlyph(glyphs[i]));
			}				

		} else {
			var wordObj = {
				type: 'sign',
				phrase: text,
				glyphs: [word.Box.Glyph.$],
				space: word.Box.$
			}; 			
		}
		return wordObj;
	},
	parseGlyph: function(glyph) {
		var box = glyph.$;
		var sign = glyph._;
		var g = {
			sign: sign,
			width: box.width,
			height: box.size,
			x: box.x,
			y: box.y
		};
		return g;
	},
	getDeferredGlyphs: function(xmlFile) {
		this.src = xmlFile;
		if (this.src) {
			Textsel.Parser.init();
			Textsel.Parser.getPageContent();			
		} else {
			throw new Error ("no src file passed");
		}
	}
}