// Define the margin, radius, and color scale. Colors are assigned lazily, so
// if you want deterministic behavior, define a domain for the color scale.

function piechart(data) {


var m = 15,
    r = 70;

var color = d3.scale.ordinal()
              // .range(["#FEEDCF","#FDC273","#FB7841"])
              .range(["rgb(235,194,195)","rgb(214,136,137)","rgb(194,83,85)"]);
             //.range(["rgb(255,224,230)","rgb(209,125,149)","rgb(174,86,117)"]);
            // .range(["#ECA0A6","#FA7072","#EC2634"]);

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
           .attr("font-size","10px")
           .attr("font-family",'Raleway')
           .text(function(d) { return d.key; });

var radius = 100,
    padding = 10;

var disorderType = ["Autistic disorder","ASD-NOS/PDD-NOS","Asperger disorder"];

var disorderType_reversed = disorderType.slice().reverse();

var legend = d3.select("#pie").append("svg")
               .attr("class", "pieLegend")
               .attr("width", radius *3)
               .attr("font-size","16px")
               .attr("height", radius )
               .selectAll("g")
               .data(disorderType_reversed)
               .enter().append("g")
               .attr("transform", function(d, i) { return "translate(40," + i * 30 + ")"; });

             legend.append("rect")
                   .attr("width", 18)
                   .attr("height", 18)
                   .style("fill", color);

             legend.append("text")
                   .attr("x", 24)
                   .attr("y", 9)
                   .attr("dy", ".35em")
                   .attr("font-size","14px")
                   .attr("font-family",'Raleway')
                   .text(function(d) { return d; });


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
           .style("stroke-width", "3px");

         tooltip2
           .style("display", null) // this removes the display none setting from it
           .html("<p>State: " + d.data.State +"<br>Disorder: " + d.data.subdisorder+"<br>Number of people: " + d.data.number
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
          .style("stroke-width", null);
        tooltip2.style("display", "none");
      }  // this sets it to invisible!
}
