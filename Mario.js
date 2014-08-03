var Mario = function(width, height){
  this.marioData = [{width: width, height: height, cssClass: "mario"}];
  this.height = height;
  this.width = width;
  this.x = gameOptions.width / 2;
  this.y = gameOptions.height / 2;
  this.paths = [
    { fill: "#887000", d: "M3 4L10 4L14 8L14 10L11 11L11 12L12 12L12 13L13 13L13 14L14 14L14 15L15 15L15 17L16 17L16 20L0 20L0 17L1 17L1 15L2 15L2 14L3 14L3 13L4 13L4 11L3 11L3 10L1 10L1 7L2 7L2 5L3 5M2 28L6 28L6 32L0 32L0 30L2 30M10 28L14 28L14 30L17 30L16 32L10 32"},
    { fill: "#d82800", d: "M6 0L11 0L11 3L14 3L14 4L3 4L3 2L4 2L4 1L6 1M4 11L5 11L5 12L4 12M5 12L6 12L6 18L10 18L10 12L11 12L11 16L12 16L12 23L13 23L13 24L14 24L14 25L15 25L15 28L10 28L10 26L9 26L9 25L7 25L7 26L6 26L6 28L1 28L1 25L2 25L2 24L3 24L3 23L4 23L4 16L5 16"},
    { fill: "#fc9838", d: "M10 1L11 1L11 3L9 3L9 2L10 2M3 5L5 5L5 8L7 8L7 6L6 6L6 4L8 4L8 6L10 6L10 5L9 5L9 4L12 4L12 5L14 5L14 6L15 6L15 8L11 8L11 7L10 7L10 8L8 8L8 9L9 9L9 10L13 10L13 11L10 11L10 12L5 12L5 10L4 10L4 9L3 9M5 19L6 19L6 20L5 20M10 19L11 19L11 20L10 20M0 20L4 20L4 23L3 23L3 24L1 24L1 22L0 22M12 20L16 20L16 22L15 22L15 24L13 24L13 23L12 23"}
  ];

  this.d3SetUp();
};

Mario.prototype.d3SetUp = function(){
  var that = this;
  var dragListener = d3.behavior.drag()
    .origin(function(){
      return {x: d3.event.x - 16, y: d3.event.y - 86};
    })
    .on("drag", function(){
      that.transform(d3.event.x, d3.event.y);
    });

 var mario = gameBoard.selectAll("svg")
  .data(this.marioData)
  .enter()
  .append("svg")
  .attr({
    "class": this.marioData[0].cssClass,
  });

  d3.selectAll(".mario").selectAll("path")
  .data(this.paths)
  .enter()
  .append("path")
  .attr({
      "d": function(d){return d.d;},
      "fill": function(d){return d.fill;},
      "transform": "translate(" + this.x + "," + this.y + ")"
  })
  .call(dragListener);
};

// Move mario
Mario.prototype.transform = function(x, y) {
  // Check if inputs are in bounds
  x = (x < 8) ? 8 : x;
  x = (x > gameOptions.width + 8) ? gameOptions.width - 16 : x;
  y = (y < 8) ? 8 : y;
  y = (y > gameOptions.height - 32) ? gameOptions.height - 32 : y;

  // Move mario
  d3.selectAll(".mario path")
  .attr({
    "transform": "translate(" + x + "," + y + ")"
  });

  // update mario's x and y parameters
  this.x = x;
  this.y = y;
};

