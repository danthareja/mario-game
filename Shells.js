var Shells = function() {
  this.data = [];
  this.colors = ["red", "blue", "green"];
  this.paths;

  this.addShells();

}

Shells.prototype.addShells = function() {
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    this.data.push({
      x: Math.random() * gameOptions.width,
      y: Math.random() * gameOptions.height,
      r: mario.width / 2,
      color: this.colors[Math.floor(Math.random() * 3)]
    });
  }
};

Shells.prototype.d3SetUp = function() {
  gameBoard.selectAll("circle")
    .data(this.data)
    .enter()
    .append("circle")
    .attr({
      "cx": function(d){return d.x;},
      "cy": function(d){return d.y;},
      "r": function(d){return d.r;},
      "fill": function(d){return d.color;}
    });
}
Shells.prototype.moveShells = function(){
  d3.selectAll("circle")
  .transition()
  .duration(2000)
  .attr({
    "cx": function(d){return Math.random() * gameOptions.width;},
    "cy": function(d){return Math.random() * gameOptions.height;}
  })

}
