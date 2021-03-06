
// For use with scroller_template2.html and mfreeman_scroller.js.


var map = d3.select("#map");
var dot = d3.select("#dot")


var update = function(value) {
  var show_map = false;
  //var localdata = data;

  var show_dot = false;
  switch(value) {

    case 1:
      console.log("in case", value);
      //localdata = data;

      show_map = true;
      show_dot = false;
      break;
    case 2:
      console.log("in case", value);
    //  localdata = data;
      show_map = false;
      show_dot = true;
      break;

  
    default:
      show_map = false;
      show_dot = false;
      //focus_country(country);
    //  draw_lines(localdata);
      break;
  }


  if (show_map) {
    map.style("display", "inline-block");
  } else {
    map.style("display", "none");
  }

  if (show_dot) {
    dot.style("display", "inline-block");
  } else {
    dot.style("display", "none");
  }

  //draw_lines(localdata); // we can update the data if we want in the cases. Draw before focus!
//  focus_country(country); // this applies a highlight on a country.
};
// setup scroll functionality

var oldScroll = 0;

function display() {


//data = make_data(mydata); // assign to global; call func in line_chart_refactor.js

    //console.log("after makedata", data);

    var scroll = scroller()
      .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // Pass the update function to the scroll object
    scroll.update(update);

    // This code hides the vis when you get past it.
    // You need to check what scroll value is a good cutoff.


    $(window).scroll(function (event) {
      var scroll = $(window).scrollTop();
      console.log("scroll", scroll);

      /*
      if (scroll >= 1500 && scroll > oldScroll) {
          vis.style("display", "none");
       } else if (scroll >= 1500 && scroll < oldScroll) {
        vis.style("display", "inline-block"); // going backwards, turn it on.
       }
       */
      oldScroll = scroll;
    });


  }
