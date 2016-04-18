
 function smallMultipleBar(data) {
   console.log(data);

   var margin = {top: 60, right: 10, bottom: 50, left: 40},
       width = 320 - margin.left - margin.right,
       height = 300 - margin.top - margin.bottom;

   var x = d3.scale.ordinal()
       .rangeRoundBands([0, width], .45);

   var y = d3.scale.linear()
       .range([height, 0]);

   var xAxis = d3.svg.axis()
       .scale(x)
       .orient("bottom");

   var yAxis = d3.svg.axis()
       .scale(y)
       .ticks(4)
       .orient("left");


  //  function ready(error, json, states,autism_by_race) {


     x.domain(["White","Black","Hispanic","API"]);
     y.domain([0, d3.max(data, function(d) { return d3.max(d.values, function(j){
       return j.value;})})]);



       d3.select("#smallMultipleBar1").datum(data).each(drawCharts);


     function drawCharts(myData) {

       var div = d3.select(this).selectAll(".chart").data(myData);

       div.enter()
         .append("div")
         .attr("class", "chart");

       var svg = div
         .append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);

     svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
       .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 5)
         .attr("dy", ".45em")
         .attr("font-size",10)
         .style("text-anchor", "end")
         .text("Percent");

     var caption = svg.append("text")
         .attr("class", "caption")
         .attr("text-anchor", "middle")
         .style("pointer-events", "none")
         .attr("dx",160)
         .attr("font-size",17)
         .attr("dy", -8)
         .style("text-anchor", "end")
         .attr("font-weight","bold")
         .text(function(d) { return d.State;});

     svg.selectAll(".bar")
         .data(function(d) {return d.values;})
       .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return x(d.race); })
         .attr("width", x.rangeBand())
         .attr("y", function(d) { return y(d.value); })
         .style("fill", function(d){
           if (d.race === "White") {
             return "rgba(17,179,240,0.8)";
           } else if (d.race === "Black") {
             return "rgba(233, 42, 58,0.6)";
           } else if (d.race === "Hispanic") {
             return "rgba(64,187,126,0.8)";
           } else {
             return "rgba(255,204,1,0.8)";
             }
         })
         .attr("height", function(d) { return height - y(d.value); });

     svg.selectAll("text.bar")
     .data(function(d) {return d.values;})
     .enter().append("text")
     .attr("class", "bar")
     .attr("x", function(d) { return x(d.race); })
     .attr("y", function(d) { return y(d.value); })
     .attr("dy", "-10px")
     .attr("dx","8.5px")
     .attr("font-weight","bold")
     .text(function(d) {return d.value;});


       } // end of drawchart

       setupIsotope();

       d3.select("#button-wrap2").selectAll("div").on("click", function() {
         var id;
         id = d3.select(this).attr("id");
         d3.select("#button-wrap2").selectAll("div").classed("active", false);
         d3.select("#" + id).classed("active", true);
         return $("#smallMultipleBar1").isotope({
           sortBy: id
         });
       });

   // }


   function mouseover() {
     d3.selectAll("height").classed("hidden", true);
     return mousemove.call(this);
   };


   function setupIsotope() {
     console.log("called setup");
     $("#smallMultipleBar1").isotope({
       itemSelector: '.chart',
       layoutMode: 'fitRows',
       sortAscending: {
         State: true,
         white: false,
         black:false,
         hispanic:false,
         api:false,
         total:false
       },
       getSortData: {
        white: function(e) {
         var d;
         d = d3.select(e).datum();
         console.log("white fired", d);
         return +d.values.filter(function(d) { return d.race === "White";})[0].value;
       },
         black: function(e) {
         var d;
         d = d3.select(e).datum();
         return +d.values.filter(function(d) { return d.race === "Black";})[0].value;
       },
         hispanic: function(e) {
         var d;
         d = d3.select(e).datum();
         return +d.values.filter(function(d) { return d.race === "Hispanic";})[0].value;
       },
         api: function(e) {
         var d;
         d = d3.select(e).datum();
         return +d.values.filter(function(d) { return d.race === "API";})[0].value;
       },
         State: function(e) {
           var d;
           d = d3.select(e).datum();
           return d.State;
         },
         total: function(e) {
           var d;
           d = d3.select(e).datum();
           return d.Total;
         }
       }
       });
       return $("#vis").isotope({
         sortBy: 'total'
       });
   } // end setup isotope
   // end button setup
}
