

Textsel.Parser = {
	src: 'xml/3.xml',
	isFileParsed: null,
	areGlyphsReady: null,
	wordsArr: [],

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
		console.log('initializing xml parser');
		Textsel.Parser.getFile();
	},
	getPageContent: function(data) {
		Textsel.Parser.isFileParsed.then(function(data) {
			var page = data['#document']['TET']['Document']['Pages']['Page'];
			var paragraphs = page['Content']['Para'];

			for (var i=0, len=paragraphs.length; i < len; i++) {
				Textsel.Parser.parseParagraph(paragraphs[i]);
			}

			Textsel.Parser.areGlyphsReady.resolve(Textsel.Parser.wordsArr);
		});
	},
	parseParagraph: function(par) {
		var words = par.Word;
		//console.log(par);

		for (var i=0, len=words.length; i < len; i++) {
			Textsel.Parser.parseWord(words[i]);
		}
	},
	parseWord: function(word) {
		//console.log(word);
		var text = word.Text;
		var glyphs = word.Box.Glyph;

		// on special markup signs there is no glyp
		if (glyphs.length) {
			var wordObj = {
				phrase: text,
				glyphs: []
			}; 

//	console.log(word);		
			for (var i=0, len=glyphs.length; i < len; i++) {
				wordObj.glyphs.push(Textsel.Parser.parseGlyph(glyphs[i]));
			}

			Textsel.Parser.wordsArr.push(wordObj);
			
		}

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
	getDeferredGlyphs: function() {
		Textsel.Parser.init();
		Textsel.Parser.getPageContent();
	}
}