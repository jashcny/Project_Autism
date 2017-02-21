function scatterchart(data) {

var fullWidth = 600;
var fullHeight =520;

var margin = {top:50, left:100, right:60, bottom: 70};  //Top, right, bottom, left

// what do you need to do to make the width and height for the chart?
var height = fullHeight - margin.top - margin.bottom // minus what?
var width = fullWidth -margin.left - margin.right// minus what?

// fix this to a nice value.

// fill in the margin values here.
var xScale = d3.scale.linear()
          .range([0, width]);

// top to bottom:
var yScale = d3.scale.linear()
          .range([ height,0 ]);


var dotRadius = 5;

var tooltips=d3.select("#tooltips").style("display", "none");

var tooltipScatter = d3.select("#tooltipScatter").style("display", "none");

//  Custom tick count if you want it.
// Create your axes here.
var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5)
;
         // fix this to a good number of ticks for your scale later.



var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);


var svg = d3.select("#scatterPlotchart")
      .append("svg")
      .attr("viewBox", "0 0 "+ fullWidth +" " + fullHeight)
      .attr("preserveAspectRatio","xMinYMin slice")
      .attr("class","scatterPlot")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // look at the data file and pick 2 columns to contrast with each other.

  xScale.domain([
    d3.min(data, function(d) {
      return +d.Female;
      // pick a data value to plot on x axis
    })-1,
    d3.max(data, function(d){
      return +d.Female;
    })+1
  ]);

  yScale.domain([
    d3.min(data, function(d) {
      return +d.Male;
      // pick a data value to plot for y axis

    })-1,
    d3.max(data,function(d){
      return +d.Male;
    })+1
  ]);

  var tooltip = d3.select("#tool3")
.attr("class", "tool3")
.style("opacity", 0);

  var circles = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .classed("dots",true);
  // fill in the rest of the data, enter, append here.

  // add a class to the circles - ".dots".

  // Circles in SVG have cx, cy, and r attributes. x location, y location, radius.

  circles.attr("cx", function(d) {
    return xScale(+d.Female);
      // return the value to use for your x scale here
    })
    .attr("cy", function(d) {
      return yScale(+d.Male);
      // return the value to use for your y scale here
    })
    .attr("r",dotRadius)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);	// add a fill rule with a special case for one of the countries


  function make_x_axis() {
            return d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(5)
        }


  function make_y_axis() {
          return d3.svg.axis()
              .scale(yScale)
              .orient("left")
              .ticks(5)
          }
  // fix these translates so they use your margin and height width as needed
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
      // fill in the area of your xaxis function here ).

  svg.append("g")
  .attr("class", "grid")
  .attr("transform", "translate(0," + height + ")")
  .call(make_x_axis()
      .tickSize(-height, 0, 0)
      .tickFormat("")
  )

  svg.append("g")
    .attr("class", "y axis")
    //.attr("transform", "translate(" + (padding[3]) + ",0)")
    .call( yAxis);
   // fill in the area of your yaxis function here).

  svg.append("g")
  .attr("class", "grid")
  .call(make_y_axis()
  .tickSize(-width, 0, 0)
  .tickFormat(""))

  svg.append("text")
  .attr("class", "xlabel")
  .attr("transform", "translate(" + (margin.left + width / 2) + " ," +(height + margin.bottom) + ")")
  .style("text-anchor", "middle")
  .attr("dy", "-20")
  .attr("dx","-85")
  .text("Female");

  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 20 - margin.left) // you may need to adjust this
  .attr("x", 20 - (height / 2)) // you may need to adjust
  .attr("dy", "1.3em")
  .attr("font-size","15px")
  .style("text-anchor", "middle")
  .text("Male");

  d3.select(window).on("resize",resize);
  function resize() {
  }



 function mouseover(d) {
   d3.select(this).transition().duration(100).attr("r", 8);
    tooltipScatter
      .style("display", null) // this removes the display none setting from it
      tooltipScatter.select(".area").text(d.State);
      tooltipScatter.select(".vall.FemaleNo").text(d.Female);
      tooltipScatter.select(".vall.MaleNo").text(d.Male);
      tooltipScatter.select(".vall.RatioNo").text(d.male_to_female_prevalence_ratio);
    }

 function mousemove(d) {

    tooltipScatter
      .style("top", (d3.event.pageY - 10) + "px" )
      .style("left", (d3.event.pageX + 10) + "px");

    }

 function mouseout(d) {
   d3.select(this).transition().duration(100).attr("r", 5);
      tooltipScatter.style("display", "none");
    }  // this sets it to invisible!

}
