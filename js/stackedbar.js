

function stackedbar(data) {

var stack = d3.layout.stack();
var currentMode = "grouped";

var fullwidth = 1300, fullheight = 520;

var margin = {top: 10, right: 100, bottom: 100, left: 60},
    width = fullwidth - margin.left - margin.right,
    height = fullheight - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .4);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.linear()
        // .range(["#FFF5E7","#FDD59F","#FDBD87","#FB9163","#EF6D56","#D74137","#9D2024"]);
        .range(["rgb(235,194,195)","rgb(214,136,137)","rgb(194,83,85)","rgb(174,36,40)"])

var tooltip = d3.select("body").append("div").attr("class", "tooltip5");

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .tickPadding(6)
    .orient("bottom");

var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(10)
        .outerTickSize([0])
        .innerTickSize([0])
        .orient("left");

var svg = d3.select("#vis1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var layerCount; // "layers"

  // get them from the columns instead this time -- all columns except the Program one
  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Program"; });

  layerCount = ageNames.length;

  color.domain(d3.range(ageNames.length));

  var dataToStack = ageNames.map(function(age) {
    return data.map(function(d) {
      return {x: d.Program, y: +d[age], age: age};
    })
  });

  var layers = stack(dataToStack);

  var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });
  var yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

  x.domain(data.map(function(d) {return d.Program;}));
  y.domain([0, yGroupMax]);

  var layer = svg.selectAll(".layer")
      .data(layers)
      .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

  var rect = layer.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);


  rect.transition()
      .delay(function(d, i) { return i * 100; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .attr("dy", "1em")
        .attr("dx", "1em")
        .attr("transform", "rotate(-15)")
        .style("text-anchor", "end");  // rotating the labels on the countries a bit

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".5em")
      .style("text-anchor", "end");

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 1)
        .attr("dx",'-1em')
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .text("Dollar");

  d3.selectAll("input").on("change", change);

  var timeout = setTimeout(function() {
  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
}, 2000);

  transitionGrouped();

  drawLegend(ageNames);

  function change() {
    clearTimeout(timeout);
    if (this.value === "grouped") {
      currentMode = "grouped";
      transitionGrouped();
    }
    else {
      currentMode = "stacked";
      transitionStacked();
    }
  }

  function transitionGrouped() {
    y.domain([0, yGroupMax]);

    rect.transition()
        .duration(1000)
        .delay(function(d, i) { return i * 100; })
        .attr("x", function(d, i, j) {  // j is index of parent data item - so, the layer #.
          return x(d.x) + x.rangeBand() / layerCount * j; })
        .attr("width", x.rangeBand() / layerCount)
        .transition()
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });

  svg.selectAll(".y.axis").transition().duration(3000).call(yAxis);
  }

  function transitionStacked() {
    y.domain([0, yStackMax]);

    rect.transition()
        .duration(1000)
        .delay(function(d, i) { return i * 100; })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .transition()
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand());

  svg.selectAll(".y.axis").transition().duration(2000).call(yAxis);
  }


  // Building a legend by hand, based on http://bl.ocks.org/mbostock/3886208
  function drawLegend(agees) {

    var adjustX = 100;

    var legend = svg.selectAll(".legend")
        .data(agees) // make sure your labels are in the right order -- if not, use .reverse() here.
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width-adjustX)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {return color(i)});

    legend.append("text")
        .attr("x", width-adjustX + 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-family", 'Raleway')
        .text(function(d, i) { return agees[i]});
  }

  function mouseover(d) {
// this will highlight both a dot and its line.

var number = d3.format(",")(d.y);;

d3.select(this)
  .transition()
  .style("stroke", "white");

tooltip
  .style("display", null) // this removes the display none setting from it
  .html("<p>Service: " + d.age+
        "<br>Money: "+ "$"+" "+ number);
} // end mouseover

function mousemove(d) {
  tooltip
    .style("top", (d3.event.pageY - 10) + "px" )
    .style("left", (d3.event.pageX + 10) + "px");
  }

function mouseout(d) {
  d3.select(this)
    .transition()
    .style("stroke", "none");
  tooltip.style("display", "none");  // this sets it to invisible!
}
}
