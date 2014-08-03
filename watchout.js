//TODO add rules & styling

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 20,
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
    "height": gameOptions.height,
  })
  .style({
    "border" : "5px solid black",
    "display" : "block",
    "margin" : "auto"
  })
  .classed("gameBoard", true);

// Create player and enemies
var mario = new Mario(18, 34);
var shells = new Shells();

// Update score
var scoreTicker = function() {
  d3.select(".current span").text(gameStats.currentScore);
  d3.select(".high span").text(gameStats.highScore);

  if (gameStats.currentScore === 1000) {
    shells.moveRedShells();
  }

  if (gameStats.currentScore === 1500) {
    shells.moveBlueShells();
  }

  gameStats.currentScore += 10;
  gameStats.highScore = Math.max(gameStats.currentScore, gameStats.highScore);
}

var playGame = function() {
  shells.moveGreenShells();
  d3.timer(shells.detectCollisions);
  setInterval(scoreTicker, 100);
}

// Play!
setTimeout(playGame, 2000);


