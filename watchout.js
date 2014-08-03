//TODO add rules & styling

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 25,
  padding: 20,
  redShellScore: 1000,
  blueShellScore: 2000
}

var gameStats = {
  highScore: 0,
  currentScore: 0,
  collisions: 0
}

var gameBoard = d3.select(".container").append("svg")
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

  // Once game hits proper score, activate red shells
  if (gameStats.currentScore === gameOptions.redShellScore) {
    shells.initializeRedShells();
    setTimeout(shells.moveRedShells.bind(shells), 2000);
  }

  // Once game hits proper score, activate red shells
  if (gameStats.currentScore === gameOptions.blueShellScore) {
    shells.initializeBlueShells();
    setTimeout(shells.moveBlueShells.bind(shells), 2000);
  }

  // Increment score
  gameStats.currentScore += 10;
  gameStats.highScore = Math.max(gameStats.currentScore, gameStats.highScore);
}

var playGame = function() {
  shells.moveGreenShells();
  d3.timer(shells.detectCollisions);
  setInterval(scoreTicker, 100);
}

// Play!
shells.initializeGreenShells();
setTimeout(playGame, 2000);


