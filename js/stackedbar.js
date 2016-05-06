

function stackedbar(data) {
var settings = {};
var currentMode = "bycount";

var fullwidth = 600, fullheight = 530;

var margin = {top: 20, right: 150, bottom: 100, left: 40},
    width = fullwidth - margin.left - margin.right,
    height = fullheight - margin.top - margin.bottom;

var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], .6);

var yScale = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .innerTickSize([0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(11)
    .tickFormat(d3.format(".2s")); // for the stacked totals version

var stack = d3.layout
    .stack(); // default view is "zero" for the count display.

var svg = d3.select("#vis").append("svg")
    .attr("width", fullwidth)
    .attr("height", fullheight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div").attr("class", "tooltip5");


  data.sort(function(a, b) {return d3.ascending(a.Subgroups,b.Subgroups);});
  // how would we sort by largest total bar?  what would we have to calculate?

  var services = ["School","Time","Alternative"];

  color.domain(services);

  xScale.domain(data.map(function(d) { return d.Subgroups; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .attr("dy", "1em")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 1)
      .attr("dx",'-1em')
      .attr("dy", "0.6em")
      .style("text-anchor", "end")
      .text("Dollar");

  svg.append("text")
      .attr("class", "xlabel")
      .attr("transform", "translate(" + (margin.left + width / 2) + " ," +
               (height + margin.bottom) + ")")
      .style("text-anchor", "middle")
      .attr("dy", "-25")
      .attr("dx","-68")
      .attr("font-family","Ubuntu")
      .attr("font-size","17px")
      .text("Year");


  transitionCount(); // this will use the by-count stack, and make the data, and draw.

  drawLegend();

  d3.selectAll("input").on("change", handleFormClick);

  // All the functions for stuff above!

  function handleFormClick() {
    if (this.value === "bypercent") {
      currentMode = "bypercent";
      transitionPercent();
    } else {
      currentMode = "bycount";
      transitionCount();
    }
  }


  function makeData(services , data) {
    return services .map(function(service) {
        return data.map(function(d) {
          return {x: d.Subgroups, y: +d[service], service: service};
        })
      });
  }


  function transitionPercent() {

    yAxis.tickFormat(d3.format("%"));
    stack.offset("expand");  // use this to get it to be relative/normalized!
    var stacked = stack(makeData(services , data));
    // call function to do the bars, which is same across both formats.
    transitionRects(stacked);
  }

  function transitionCount() {

    yAxis.tickFormat(d3.format(".2s")); // for the stacked totals version
    stack.offset("zero");
    var stacked = stack(makeData(services , data));
    transitionRects(stacked);
    }

  function transitionRects(stacked) {

    // this domain is using the last of the stacked arrays, which is the last illness, and getting the max height.
    yScale.domain([0, d3.max(stacked[stacked.length-1], function(d) { return d.y0 + d.y; })]);


     var service = svg.selectAll("g.service")
      .data(stacked);

    service.enter().append("g")
      .attr("class", "service")
      .style("fill", function(d, i) { return color(d[0].service); });

  // then data for each, plus mouseovers - a nested selection/enter here
   service.selectAll("rect")
      .data(function(d) {
        console.log("array for a rectangle", d);
        return d; })  // this just gets the array for bar segment.
    .enter().append("rect")
      .attr("width", xScale.rangeBand())
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

    // the thing that needs to transition is the rectangles themselves, not the g parent.
    service.selectAll("rect")
      .transition()
      .duration(1000)
      .attr("x", function(d) {
        return xScale(d.x); })
      .attr("y", function(d) {
        return yScale(d.y0 + d.y); }) //
      .attr("height", function(d) {
        return yScale(d.y0) - yScale(d.y0 + d.y); });  // height is base - tallness

    service.exit().remove(); // there's actually nothing removed here - we just transition.

    svg.selectAll(".y.axis").transition().duration(1000).call(yAxis);
  }

  // Building a legend by hand, based on http://bl.ocks.org/mbostock/3886208
  function drawLegend() {

    // reverse to get the same order as the bar color layers
    var services_reversed = services.slice().reverse();

    var legend = svg.selectAll(".legend")
        .data(services_reversed) // make sure your labels are in the right order -- if not, use .reverse() here.
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {return color(d)});

    legend.append("text")
        .attr("x", width + 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d, i) { return services_reversed[i].replace(/_/g, " "); });
  }

  function mouseover(d) {
  // this will highlight both a dot and its line.

  var number;

  d3.select(this)
    .transition()
    .style("stroke", "white");

  if (currentMode == "bypercent") {
    number = d3.format(".1%")(d.y);
  } else {
    number = d3.format(",")(d.y);
  }

  tooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p>Service: " + d.service.replace(/_/g, " ") +
          "<br>Money: "+ "$"+" "+ number +
          "<br>Subgroups: " + d.x + " </p>");
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
