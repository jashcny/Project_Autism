
// For use with scroller_template2.html and mfreeman_scroller.js.

var vis = d3.select("#vis");


var update = function(value) {
  var country = null;
  //var localdata = data;
  var show_vis = true;
  switch(value) {
    case 0:
      console.log("in case", value);
      show_vis = false;
      break;
    case 1:
      console.log("in case", value);
      //localdata = data;
      show_vis = true;
      break;
    case 2:
      console.log("in case", value);
    //  localdata = data;
      show_vis = true;

      break;
    case 3:
      console.log("in case", value);
      show_vis = false;
      //yScale = d3.scale.sqrt().range([margin.top, height - margin.bottom]);
    //  localdata = data;
      break;
    default:
      show_vis = false;
      //focus_country(country);
    //  draw_lines(localdata);
      break;
  }
  console.log("show viz", show_vis);

  /*
  if (oldScroll >= 550) {
    vis.style("display", "inline-block");
  }

  if (oldScroll >= 1152) {
    vis.style("display", "none");
  }

  */

  /*
  if (show_vis) {
    vis.style("display", "inline-block");
  } else {
    vis.style("display", "none");
  }
 */

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
