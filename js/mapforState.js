

    function mapforState(json, states) {
    var width = 960;
    var height = 500;

    // D3 Projection
    var projection = d3.geo.albersUsa()
                     .translate([width/2, height/2])    // translate to center of screen
                     .scale([1000]);          // scale things down so see entire US

    // Define path generator
    var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
               .projection(projection);  // tell path generator to use albersUsa projection


    // Define linear scale for output
    var stateColor = d3.scale.linear().range(["#D8FFFF","#00A2EA"]).interpolate(d3.interpolateLab);


    //Create SVG element and append map to the SVG
    var svg = d3.select("#map")
              .append("svg")
              .attr("width", width)
              .attr("height", height);


    var buttonYear = "ASD_prevalence_in2000";

    var tooltip = d3.select("body").append("div").attr("class", "mytooltip map");

    var statesdata;

  //  function ready(error, json, states,autism_by_race) {

      statesdata = states;

    stateColor.domain(d3.extent(states, function(s) {return +s[buttonYear];}));


      // Loop through each state data value in the .csv file
      states.forEach(function(state) {
          // Grab State Name
          var dataState = state.State; // name
          // Grab data value
          var dataValue2000 = +state.ASD_prevalence_in2000;// number
          var dataValue2010 = +state.ASD_prevalence_in2010;

          // Find the corresponding state inside the GeoJSON
          json.features.forEach(function(j) {
              var jsonState = j.properties.name;
              if (dataState == jsonState) { // assumes the names will match...
                  // Copy the data value into the JSON
                  j.properties.ASD_prevalence_in2000 = dataValue2000;
                  j.properties.ASD_prevalence_in2010 = dataValue2010;
              // Stop looking through the JSON

              }
          });
      }); // ends data merge

      var button = d3.selectAll(".button.total")
            .on("click", redraw);



      // Bind the data to the SVG and create one path per GeoJSON feature
      svg.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .classed("state", true)
          .attr("d", path)
          .style("fill", function(d) {
              // Get data value for visited
          var value = d.properties[buttonYear];
          return stateColor(value);
           })
           .on("mouseover", mouseover)
           .on("mousemove", mousemove)
           .on("mouseout", mouseout);


    function mouseover(d) {

      d3.select(this)
        .transition()
        .style("stroke", "white")
        .style("stroke-width", "2.5");

      d3.select(this).moveToFront();

      console.log(tooltip);

      tooltip
       .style("display", null) // this removes the display none setting from it
       .html("<p><strong>State: </strong>"+d.properties.name+"</br>"+"<strong>Number enrolled out of 10,000 children:  </strong>"+ (d.properties[buttonYear])+"</p>");
    } // end mouseover

    function mousemove(d) {
      tooltip
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");
      }


    function mouseout(d) {
      d3.select(this)
        .transition()
        .style("stroke", null)
        .style("stroke-width", null);

      tooltip.style("display", "none");  // this sets it to invisible!
    }


    var linear = stateColor;

    svg.append("g")
    .attr("class", "legendLinear")
    .attr("font-size","12px")
    .attr("font-family","Ubuntu")
    .attr("transform", "translate(560, 5)");


    var legendLinear = d3.legend.color()
    .shapeWidth(40)
    .orient("horizontal")
    .scale(linear);

    svg.select(".legendLinear")
    .call(legendLinear);


    function redraw() {

     buttonYear = d3.select(this).attr("id");
    var thiss = d3.select(this);
     console.log("button value", buttonYear);
     console.log("this",  thiss);

      if (buttonYear === "ASD_prevalence_in2000") {
          d3.select(this).classed("active", true);
          d3.select("#ASD_prevalence_in2010").classed("active", false);

      } else {
        d3.select(this).classed("active", true);
        d3.select("#ASD_prevalence_in2000").classed("active", false);
      }


     console.log("here", buttonYear);

     stateColor.domain(d3.extent(statesdata, function(s) {return +s[buttonYear];}));

     svg.select(".legendLinear")
     .remove();

     var linear = stateColor;

     svg.append("g")
     .attr("class", "legendLinear")
     .attr("font-size","12px")
     .attr("font-family","Ubuntu")
     .attr("transform", "translate(560, 5)");


     var legendLinear = d3.legend.color()
     .shapeWidth(40)
     .orient("horizontal")
     .scale(linear);

     svg.select(".legendLinear")
     .call(legendLinear);

  // we might want to redo the color scale and legend here, not sure.

    svg.selectAll("path.state")
        .transition()
        .style("fill", function(d,i) {
      // Get data value for visited
        var value = d.properties[buttonYear];
        return stateColor(value);
     });
   } // end redraw
 // };
}
