

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

			var parsedPage = Array.prototype.map.call(paragraphs, Textsel.Parser.parseParagraph);

			//console.log(parsedPage);
			Textsel.Parser.areGlyphsReady.resolve(parsedPage);
		});
	},
	parseParagraph: function(par) {
		var words = par.Word;
		var parsedPar;
		//console.log(par);

		if (Object.prototype.toString.call(words) === '[object Array]') {
			parsedPar = Array.prototype.map.call(words, Textsel.Parser.parseWord);
		} else {
			parsedPar = [].concat(Textsel.Parser.parseWord(words));
		}
		//console.log(parsedPar);
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