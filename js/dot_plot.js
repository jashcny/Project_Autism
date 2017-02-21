
function dot_plot(data) {

var fullwidth = 520,
    fullheight = 410;

// these are the margins around the graph. Axes labels go in margins.
var margin = {top:75, right: 25, bottom: 0, left: 110};

var width = fullwidth - margin.left - margin.right,
    height = fullheight - margin.top - margin.bottom;

var xScale = d3.scale.linear()
          .range([ 0, width]);

var yScale = d3.scale.ordinal()
          .rangeRoundBands([ margin.top, height], 0.2);

var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

var tooltipdot=d3.select("body")
                 .append("div")
                 .attr("class", "tooltipdot");

var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize([0]);

var svg = d3.select("#dot")
      .append("svg")
      .attr("viewBox", "0 0 " + fullwidth + " " + fullheight )
      .attr("preserveAspectRatio", "xMinYMin slice");


data.forEach(function(d, i){
      d.difference= (d.ASD_prevalence_in2010 - d.ASD_prevalence_in2000).toFixed(2);
      });

      var top10 = data.sort(function(a, b) {
      return b.difference - a.difference;
    }).slice(0, 10);

console.log(top10);


  xScale.domain([0, 110]);

  // js map: will make a new array out of all the d.State fields
  yScale.domain(top10.map(function(d) { return d.State; } ));


  var linesGrid = svg.selectAll("lines.grid")
    .data(top10)
    .enter()
    .append("line");

  linesGrid.attr("class", "grid")
    .attr("x1", margin.left)
    .attr("y1", function(d) {
      return yScale(d.State) + yScale.rangeBand()/2;
    })
    .attr("x2", function(d) {
      return margin.left + xScale(+d.ASD_prevalence_in2010);

    })
    .attr("y2", function(d) {
      return yScale(d.State) + yScale.rangeBand()/2;
    });

  // Make the dotted lines between the dots

  var linesBetween = svg.selectAll("lines.between")
    .data(top10)
    .enter()
    .append("line");

  linesBetween.attr("class", "between")
    .attr("x1", function(d) {
      return margin.left + xScale(+d.ASD_prevalence_in2000);
    })
    .attr("y1", function(d) {
      return yScale(d.State) + yScale.rangeBand()/2;
    })
    .attr("x2", function(d) {
      return margin.left + xScale(d.ASD_prevalence_in2010);
    })
    .attr("y2", function(d) {
      return yScale(d.State) + yScale.rangeBand()/2;
    })
    .attr("stroke-dasharray", "5,5")
    .attr("stroke-width", function(d, i) {
      if (i == 0) {
        return "1";
      } else {
        return "0.5";
      }
    });

    linesBetween.on("mouseover", mouseoverline)
                .on("mouseout", mouseoutline);

    function mouseoverline(d){
      d3.select(this)
      .transition(600)
      .style("stroke-width","2px")
      .style("stroke-dasharray", "5,0");
    tooltipdot.style("display", null)
              .style("top", (d3.event.pageY - 5) + "px" )
              .style("left", (d3.event.pageX + 5) + "px")
              .html("<p>"+d.difference+"</p>");
              }

    function mouseoutline(d){
      d3.select(this)
      .transition(500)
      .style("stroke-width","0.5")
      .style("stroke-dasharray", "5,5");
    tooltipdot.style("display", "none");
              }

  // Make the dots for 2000

  var dots2000 = svg.selectAll("circle.y2000")
      .data(top10)
      .enter()
      .append("circle");

  dots2000
    .attr("class", "y2000")
    .attr("cx", function(d) {
      return margin.left + xScale(+d.ASD_prevalence_in2000);
    })
    .attr("r", yScale.rangeBand()/2)
    .attr("cy", function(d) {
      return yScale(d.State) + yScale.rangeBand()/2;
    })
    .style("stroke", function(d){
      if (d.State === "Minnesota") {
        return "black";
      }
    })
    .style("fill", function(d){
      if (d.State === "Minnesota") {
        return "rgb(255,224,230)";
      }
    });

//<-----create mouse events for dots2000------------>
     dots2000.on("mouseover", mouseover2000)
             .on("mouseout", mouseout2000);

      function mouseover2000(d){
      tooltipdot.style("display", null)
                .style("top", (d3.event.pageY - 5) + "px" )
                .style("left", (d3.event.pageX + 5) + "px")
                .html("<p>"+d.ASD_prevalence_in2000+"</p>");
                }

      function mouseout2000(d){
      tooltipdot.style("display", "none");
                }

    //<-----End------------>

  // Make the dots for 2010

  var dots2010 = svg.selectAll("circle.y2010")
      .data(top10)
      .enter()
      .append("circle");

  dots2010
    .attr("class", "y2010")
    .attr("cx", function(d) {
      return margin.left + xScale(+d.ASD_prevalence_in2010);
    })
    .attr("r", yScale.rangeBand()/2)
    .attr("cy", function(d) {
      return yScale(d.State) + yScale.rangeBand()/2;
    })
    .style("stroke", function(d){
      if (d.State === "Minnesota") {
        return "black";
      }
    })
    .style("fill", function(d){
      if (d.State === "Minnesota") {
        return "rgb(140,53,89)";
      }
    });

    // add the axes

//<-----create mouse events for dots2010------------>
    dots2010.on("mouseover", mouseover2010)
            .on("mouseout", mouseout2010);

    function mouseover2010(d){
    tooltipdot.style("display", null)
              .style("top", (d3.event.pageY - 5) + "px" )
              .style("left", (d3.event.pageX + 5) + "px")
              .html("<p>"+d.ASD_prevalence_in2010+"</p>");
              }

    function mouseout2010(d){
    tooltipdot.style("display", "none");
              }

//<-----End------------>

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);

    svg.append("text")
    .attr("x",39)
    .attr("y",35)
    .attr("font-size","17px")
    .attr("font-weight","bold")
    .style("text-anchor", "left")
    .text("Top 10 states with the highest ASD prevalence increase rates");

    svg.append("text")
    .attr("x",130)
    .attr("y",67)
    .attr("font-size","1.5rem")
    .attr("font-weight","bold")
    .style("text-anchor", "left")
    .text("Year 2000");


    svg.append("text")
    .attr("x",290)
    .attr("y",67)
    .attr("font-size","1.5rem")
    .attr("font-weight","bold")
    .style("text-anchor", "left")
    .text("Year 2010");


    svg.append("circle")
    .attr("cx",115)
    .attr("cy",63)
    .style("fill","rgb(247,168,184)")
    .attr("r",6)

    svg.append("circle")
    .attr("cx",275)
    .attr("cy",63)
    .style("fill","rgb(209,125,149)")
    .attr("r",6)

    d3.select(window).on('resize', resize);

    function resize() {
    }


  // Style one of the Y labels bold:

  // a hack that works if you can unravel the selections - to style "The World" bold in the axis label, which is the 8th element:
  var allYAxisLabels = d3.selectAll("g.y.axis g.tick text")[0]; // un-nest array
  d3.select(allYAxisLabels[0]).style("font-weight", "bold");
    // You could also use tick formatting to get a % sign on each axis tick

}
