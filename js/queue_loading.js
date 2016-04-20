queue()
  .defer(d3.json, "data/us-states.json")
  .defer(d3.csv, "data/PrevalenceofAutismandIDforAges3to21.csv")
  .defer(d3.csv,"data/cost.csv")
  .defer(d3.csv, "data/autism_by_race.csv", reformat)
  .await(ready);

function ready(error, json, states, money,race) {
  console.log(race);
  if (error) { console.log(error); }

  mapforState(json, states);
  stackedbar(money);
  smallMultipleBar(race);
  display();

}


d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function reformat(d) {
  d.values = [{ race: "White", value: +d["White"]},
              { race: "Black", value: +d["Black"]},
              { race: "Hispanic", value: +d["Hispanic"]},
              { race: "API", value: +d["API"]}];
  return d;
}
