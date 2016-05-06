var data;
var images = [
				{title: 'ASD', url:'ASD.png', width: 95, height: 59},
				{title: 'Non_ASD', url:'Non_ASD.png', width: 95, height: 51},
				];
var categories;


$(document).ready(function(){
	createTable();
	data = generateData();
	draw(data);
	$('#refresh-btn').click(function() {
		data = generateData();
		redraw(data);
	});
});

function createTable() {
	for (var i=0; i < images.length; i++) {
		$('#data').append('<tr class="'+ images[i].title +'"><td>'+ images[i].title +'</td><td class="value"></td></tr>');
	}
}


function generateData() {

	var debugString = '';
	var data = [];
	for (var i=0; i < images.length; i++) {
		var value = (Math.random() * 10).toFixed(1);
		debugString += value + ' | ';
		data.push({	naam: 'Naam'+i,
					value: value ,
					imageInfo: images[i]});

		/* Update the data table */
		$('#data .' + images[i].title + ' .value').html(value);
	}

	return data;
}

function createSymbols(symbols) {
	var images = symbols.enter()
						 .append('img');

	images.classed('isotype', true)
		.attr('src', function(d) {
				return 'images/' + d.imageInfo.url;
			})
		.style('height', function(d) {
			  return d.imageInfo.height + 'px';
		  })
		.style('z-index', function(d,i) { return i})
		.style('left', 0);

	images.transition()
		.delay(function(d, i) { return i * 100 + 1000})
		.duration(1000)
		.style('left', function(d, i) { return i * 100 + 'px'})


	sizeSymbol(images);

}

function sizeSymbol(images) {
	images.style('clip', function(d) {
							  var width = Math.round(d.percentage * d.imageInfo.width) ;
							  return 'rect(0px, '+width+'px, '+d.imageInfo.height+'px, 0px)';
						})
}

function draw(data) {
	/* Create category containers */
	categories = d3.select('body')
		.selectAll('div.category')
		.data(data)
		.enter()
		.append('div')
		.classed('category', true)
		.style('margin-top', function (d) { return (95 - d.imageInfo.height)/2 + 'px'} )
		.style('height', function(d) { return d.imageInfo.height + 'px'});


	var symbols = categories.selectAll('img.isotype')
		.data(function(d) {
				return getSymbolsArray(d);
			});

	createSymbols(symbols);

}


function redraw(data) {
	categories.data(data)

	var symbols = categories.selectAll('img.isotype')
				.data(function(d) {
							return getSymbolsArray(d);
						})

	symbols.exit()
		.style('z-index', function(d,i) { return -i})
		.transition()
		.delay(function(d, i) { return  (d.nmbSymbols - i - 1) * 100})
		.duration(1000)
		.style('left', function(d, i) {
				return -(10 - i) * d.imageInfo.width + 'px'
			})
		.style('opacity', 0.2)
		.each('end', function() {
			d3.select(this).remove()
		});

	createSymbols(symbols);

	sizeSymbol(symbols);
}

function getSymbolsArray(d) {
	var valuePerSymbol = 1;
	var nmbSymbols = Math.ceil(d.value/valuePerSymbol);
	var symbolsArray = [];
	var remainder = (d.value - valuePerSymbol * (nmbSymbols - 1) ) / valuePerSymbol;
	for (var i=0; i < nmbSymbols; i++) {
		var percentage = i < (nmbSymbols - 1) ? 1 : remainder;
		symbolsArray.push({percentage: percentage, nmbSymbols: nmbSymbols, imageInfo:d.imageInfo});
	}
	return symbolsArray;
}
