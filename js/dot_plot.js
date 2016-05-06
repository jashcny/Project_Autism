
function dot_plot(data) {

var fullwidth = 400,
    fullheight = 300;

// these are the margins around the graph. Axes labels go in margins.
var margin = {top: 20, right: 25, bottom: 20, left: 90};

var width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var widthScale = d3.scale.linear()
          .range([ 0, width]);

var heightScale = d3.scale.ordinal()
          .rangeRoundBands([ margin.top, height], 0.2);

var xAxis = d3.svg.axis()
        .scale(widthScale)
        .orient("bottom");

var yAxis = d3.svg.axis()
        .scale(heightScale)
        .orient("left")
        .innerTickSize([0]);

var svg = d3.select("#dot")
      .append("svg")
      .attr("width", fullwidth)
      .attr("height", fullheight);



  data.sort(function(a, b) {
    return d3.descending(+a.ASD_prevalence_in2010, +b.ASD_prevalence_in2010);
  });

  var top10 = data.sort(function(a, b) {
  return b.ASD_prevalence_in2010 - a.ASD_prevalence_in2010;
}).slice(0, 10); // cut off the top 20!



  // in this case, i know it's out of 100 because it's percents.
  widthScale.domain([0, 110]);

  // js map: will make a new array out of all the d.name fields
  heightScale.domain(top10.map(function(d) { return d.State; } ));

  // Make the faint lines from y labels to highest dot

  var linesGrid = svg.selectAll("lines.grid")
    .data(top10)
    .enter()
    .append("line");

  linesGrid.attr("class", "grid")
    .attr("x1", margin.left)
    .attr("y1", function(d) {
      return heightScale(d.State) + heightScale.rangeBand()/2;
    })
    .attr("x2", function(d) {
      return margin.left + widthScale(+d.ASD_prevalence_in2010);

    })
    .attr("y2", function(d) {
      return heightScale(d.State) + heightScale.rangeBand()/2;
    });

  // Make the dotted lines between the dots

  var linesBetween = svg.selectAll("lines.between")
    .data(top10)
    .enter()
    .append("line");

  linesBetween.attr("class", "between")
    .attr("x1", function(d) {
      return margin.left + widthScale(+d.ASD_prevalence_in2000);
    })
    .attr("y1", function(d) {
      return heightScale(d.State) + heightScale.rangeBand()/2;
    })
    .attr("x2", function(d) {
      return margin.left + widthScale(d.ASD_prevalence_in2010);
    })
    .attr("y2", function(d) {
      return heightScale(d.State) + heightScale.rangeBand()/2;
    })
    .attr("stroke-dasharray", "5,5")
    .attr("stroke-width", function(d, i) {
      if (i == 0) {
        return "1";
      } else {
        return "0.5";
      }
    });


  // Make the dots for 1990

  var dots2000 = svg.selectAll("circle.y2000")
      .data(top10)
      .enter()
      .append("circle");

  dots2000
    .attr("class", "y2000")
    .attr("cx", function(d) {
      return margin.left + widthScale(+d.ASD_prevalence_in2000);
    })
    .attr("r", heightScale.rangeBand()/2)
    .attr("cy", function(d) {
      return heightScale(d.State) + heightScale.rangeBand()/2;
    })
    .style("stroke", function(d){
      if (d.State === "Minnesota") {
        return "black";
      }
    })
    .style("fill", function(d){
      if (d.State === "Minnesota") {
        return "darkorange";
      }
    })
    .append("title")
    .text(function(d) {
      return d.State + " in 2000: " + d.ASD_prevalence_in2000 + "%";
    });

  // Make the dots for 2010

  var dots2010 = svg.selectAll("circle.y2010")
      .data(top10)
      .enter()
      .append("circle");

  dots2010
    .attr("class", "y2010")
    .attr("cx", function(d) {
      return margin.left + widthScale(+d.ASD_prevalence_in2010);
    })
    .attr("r", heightScale.rangeBand()/2)
    .attr("cy", function(d) {
      return heightScale(d.State) + heightScale.rangeBand()/2;
    })
    .style("stroke", function(d){
      if (d.State === "Minnesota") {
        return "black";
      }
    })
    .style("fill", function(d){
      if (d.State === "Minnesota") {
        return "#476BB2";
      }
    })
    .append("title")
    .text(function(d) {
      return d.State + " in 2010: " + d.ASD_prevalence_in2010 + "%";
    });

    // add the axes

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);


  // Style one of the Y labels bold:

  // a hack that works if you can unravel the selections - to style "The World" bold in the axis label, which is the 8th element:
  var allYAxisLabels = d3.selectAll("g.y.axis g.tick text")[0]; // un-nest array
  d3.select(allYAxisLabels[7]).style("font-weight", "bold");
    // You could also use tick formatting to get a % sign on each axis tick

}
