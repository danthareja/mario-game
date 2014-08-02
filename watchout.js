// start slingin' some d3 here.
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
}

var gameStats = {
  highScore: 0,
  currentScore: 0,
  collisions: 0
}

var gameBoard = d3.select("body").append("svg")
              .attr({
                "width" : gameOptions.width,
                "height": gameOptions.height
              })
              .classed("gameBoard", true);

var mario = new Mario(16, 32);
mario.x = gameOptions.width / 2;
mario.y = gameOptions.height / 2;

mario.d3SetUp();

var shellColors = ["red", "blue", "green"];
var shellData = []
for (var i = 0; i < gameOptions.nEnemies; i++) {
  shellData.push({
    x: Math.random() * gameOptions.width,
    y: Math.random() * gameOptions.height,
    r: mario.width / 2,
    color: shellColors[Math.floor(Math.random() * 3)]
  });
}

var shells = gameBoard.selectAll("circle")
              .data(shellData)
              .enter()
              .append("circle")
              .attr({
                "cx": function(d){return d.x;},
                "cy": function(d){return d.y;},
                "r": function(d){return d.r;},
                "fill": function(d){return d.color;}
              });

