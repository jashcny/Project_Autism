// Define the margin, radius, and color scale. Colors are assigned lazily, so
// if you want deterministic behavior, define a domain for the color scale.

function piechart(data) {


var m = 15,
    r = 80;

var color = d3.scale.ordinal()
            .range(["#ECA0A6","#FA7072","#EC2634"]);


// Define a pie layout: the pie angle encodes the number of flights. Since our
// data is stored in CSV, the numbers are strings which we coerce to numbers.
var pie = d3.layout.pie()
    .value(function(d) { return +d.number; })
    .sort(function(a, b) { return b.number - a.number; });

// Define an arc generator. Note the radius is specified here, not the layout.
var arc = d3.svg.arc()
    .innerRadius(r / 2)
    .outerRadius(r);

var tooltip2 = d3.select("body").append("div").attr("class", "tooltip2");

  // Nest the data by states. Our data has the numbers per
  // state and disorder, but we want to group numbers by states.
  var disorders = d3.nest()
      .key(function(d) { return d.State; })
      .entries(data);

  console.log(disorders);

  // Insert an svg element (with margin) for each airport in our dataset. A
  // child g element translates the origin to the pie center.
  var svg = d3.select("#pie").selectAll("div")
      .data(disorders)
    .enter().append("div")
      .style("display", "inline-block")
      .style("width", (r + m) * 2 + "px")
      .style("height", (r + m) * 2 + "px")
    .append("svg")
      .attr("width", (r + m) * 2)
      .attr("height", (r + m) * 2)
    .append("g")
      .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

  // Add a label for the state. The `key` comes from the nest operator.
  svg.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("font-size","12px")
      .text(function(d) { return d.key; });

  // Pass the nested per-state values to the pie layout. The layout computes
  // the angles for each arc. Another g element will hold the arc and its label.
  var g = svg.selectAll("g")
      .data(function(d) { return pie(d.values); })
      .enter().append("g");


  // Add a colored arc path, with a mouseover showing the number.
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.subdisorder); })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);


  function mouseover(d) {
      d3.select(this)
        .style("stroke", "white")
        .style("stroke-width", "2px");

      tooltip2
        .style("display", null) // this removes the display none setting from it
        .html("<p>State: " + d.data.State +
              "<br>Disorder: " + d.data.subdisorder+
              "<br>Number of people: " + d.data.number
      );
      }

  function mousemove(d) {
      tooltip2
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");

      }

  function mouseout(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", null);

        tooltip2.style("display", "none");
      }  // this sets it to invisible!
}
