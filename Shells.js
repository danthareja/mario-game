var Shells = function() {
  this.data = [];
  this.shellColors = ["red", "green", "green"];
  this.greenShellPaths = [];
  this.redShellPaths = [];
  this.blueShellPaths = [];
  this.addShells();
  this.addPaths();
  this.d3SetUp();
};

Shells.prototype.addShells = function() {
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    this.data.push({
      x: Math.random() * gameOptions.width,
      y: Math.random() * gameOptions.height,
      cssClass: this.shellColors[Math.floor(Math.random() * this.shellColors.length)]
    });
  }
  this.data[gameOptions.nEnemies - 1] = {
    x: Math.random() * gameOptions.width,
    y: Math.random() * gameOptions.height,
    cssClass: "blue"
  };
};

Shells.prototype.d3SetUp = function() {
  var newShells = gameBoard.selectAll("svg")
    .data(this.data)
    .enter()
    .append("svg")
    .attr({
      "x": function(d){return d.x;},
      "y": function(d){return d.y;},
      "class": function(d){return d.cssClass;}
    });
  for( var i = 0; i < this.shellColors.length; i++ ){
    this.setPaths(this.shellColors[i]);
  }
  this.setPaths("blue");
};

Shells.prototype.setPaths = function(className){
  var pathSelector = className + "ShellPaths";
  d3.selectAll("svg." + className).selectAll("path")
  .data(this[pathSelector])
  .enter()
  .append("path")
  .attr({
    "d": function(d){return d.d;},
    "fill": function(d){return d.fill;},
  });
};

var prevCollision = false;
Shells.prototype.detectCollisions = function(){

  var collision = false;
  d3.selectAll(".green, .red, .blue").each(function(d){
    var element = d3.select(this);
    var xDiff = (mario.x + 8) - (parseFloat(element.attr("x")) + 12.5);
    var yDiff = (mario.y + 16) - (parseFloat(element.attr("y")) + 12.5);
    var distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

    if (distance < 45) {
      collision = true;
    }
  });

  if(collision){
    if (gameStats.currentScore > gameStats.highScore){
      gameStats.highScore = gameStats.currentScore;
    }
    gameStats.currentScore = 0;

    if (prevCollision !== collision){
        gameStats.collisions++;
      }
    }

  prevCollision = collision;
};

Shells.prototype.moveGreenShells = function(){
  // green functionality
  d3.selectAll(".green")
  .transition()
  .duration(2000)
  .ease("linear")
  .attr({
    "x": function(){return Math.random() * gameOptions.width;},
    "y": function(){return Math.random() * gameOptions.height;}
  });
}

Shells.prototype.moveRedShells = function(){
  // red functionality
  d3.selectAll(".red")
  .transition()
  .duration(1000)
  .ease("linear")
  .attr({
    "x": function(){return Math.random() * gameOptions.width;},
    "y": function(){return Math.random() * gameOptions.height;}
  });
}

Shells.prototype.moveBlueShells = function(){
  // blue functionality
  d3.selectAll(".blue")
  .transition()
  .duration(500)
  .ease("linear")
  .attr({
    "x": function(){return mario.x;},
    "y": function(){return mario.y;}
  });
};

// also figure out how to set classes for multiple shells
Shells.prototype.addPaths = function() {
  this.greenShellPaths.push(
    { fill:"#75e583", d: " M 10.28 0.00 L 14.82 0.00 L 15.09 0.59 C 13.53 1.43 11.63 1.46 10.06 0.62 L 10.28 0.00 Z" },
    { fill:"#11a016", d: " M 8.99 1.38 C 9.26 1.19 9.79 0.81 10.06 0.62 C 11.63 1.46 13.53 1.43 15.09 0.59 C 15.60 0.90 16.62 1.52 17.13 1.83 C 14.05 1.69 10.27 0.92 10.71 4.83 C 14.61 0.22 19.14 5.48 18.04 10.08 C 15.24 9.96 12.61 8.58 9.78 8.90 C 8.45 8.59 7.14 8.26 5.81 7.98 C 9.11 7.12 11.41 4.65 8.99 1.38 Z" },
    { fill:"#26d63d", d: " M 5.81 7.98 C -0.06 8.78 6.58 2.42 8.99 1.38 C 11.41 4.65 9.11 7.12 5.81 7.98 Z" },
    { fill:"#116211", d: " M 10.71 4.83 C 10.27 0.92 14.05 1.69 17.13 1.83 C 19.65 3.77 21.53 6.40 23.38 8.95 C 22.08 14.72 15.09 11.51 11.29 10.06 C 10.91 9.77 10.15 9.19 9.78 8.90 C 12.61 8.58 15.24 9.96 18.04 10.08 C 19.14 5.48 14.61 0.22 10.71 4.83 Z" },
    { fill:"#9f9995", d: " M 23.38 8.95 C 23.93 9.71 24.47 10.48 25.00 11.26 L 25.00 12.76 C 23.68 13.85 22.35 14.93 21.06 16.05 C 18.79 16.30 16.52 16.52 14.24 16.71 C 13.24 14.76 11.09 14.25 9.15 13.69 C 8.72 13.44 7.84 12.92 7.40 12.67 L 6.85 11.77 C 8.33 11.20 9.82 10.65 11.29 10.06 C 15.09 11.51 22.08 14.72 23.38 8.95 Z" },
    { fill:"#a09781", d: " M 3.63 14.43 C -0.06 12.38 -0.15 9.14 6.04 11.71 C 3.86 11.51 2.59 12.19 3.63 14.43 Z" },
    { fill:"#262217", d: " M 3.63 14.43 C 2.59 12.19 3.86 11.51 6.04 11.71 L 6.85 11.77 L 7.40 12.67 C 6.76 13.74 5.98 14.68 5.04 15.51 C 4.69 15.24 3.98 14.70 3.63 14.43 Z" },
    { fill:"#d3bd77", d: " M 7.40 12.67 C 7.84 12.92 8.72 13.44 9.15 13.69 C 9.40 16.74 11.48 17.49 14.24 16.71 C 16.52 16.52 18.79 16.30 21.06 16.05 C 18.01 21.60 6.26 22.27 5.04 15.51 C 5.98 14.68 6.76 13.74 7.40 12.67 Z" },
    { fill:"#1d1a12", d: " M 9.15 13.69 C 11.09 14.25 13.24 14.76 14.24 16.71 C 11.48 17.49 9.40 16.74 9.15 13.69 Z" }
  );
  this.redShellPaths.push(
    { fill:"#d31a08", d:" M 7.45 2.53 C 7.75 1.01 14.29 -0.13 16.77 1.91 C 15.26 4.80 16.62 8.11 20.13 6.25 C 24.75 7.88 17.18 8.59 15.20 9.58 C 13.11 9.88 8.94 10.48 6.86 10.78 C 6.46 8.08 9.77 4.55 7.45 2.53 Z" },
    { fill:"#ff7428", d:" M 16.77 1.91 C 18.51 2.69 20.37 4.11 20.13 6.25 C 16.62 8.11 15.26 4.80 16.77 1.91 Z" },
    { fill:"#d92911", d:" M 2.57 9.45 C 3.24 6.59 4.84 3.98 7.45 2.53 C 5.73 4.67 6.31 10.55 2.57 9.45 Z" },
    { fill:"#73110f", d:" M 7.45 2.53 C 9.77 4.55 6.46 8.08 6.86 10.78 C 8.94 10.48 13.11 9.88 15.20 9.58 C 14.19 10.42 13.07 11.01 11.82 11.36 C 8.34 11.49 4.39 13.13 1.61 10.37 C 1.85 10.14 2.33 9.68 2.57 9.45 C 6.31 10.55 5.73 4.67 7.45 2.53 Z" },
    { fill:"#99968e", d:" M 4.18 15.77 C 1.36 15.68 -0.30 10.36 1.61 10.37 C 4.39 13.13 8.34 11.49 11.82 11.36 C 14.34 11.57 16.86 11.82 19.38 12.10 C 18.98 12.52 18.17 13.38 17.76 13.80 C 17.45 14.07 16.82 14.61 16.51 14.88 C 14.33 13.99 11.77 14.73 10.64 16.85 C 8.49 16.47 6.33 16.11 4.18 15.77 Z" },
    { fill:"#aca287", d:" M 20.39 11.47 C 18.91 10.35 23.27 11.25 24.08 11.06 C 24.32 13.05 22.44 13.98 21.10 14.99 C 21.28 13.70 22.14 12.04 20.39 11.47 Z" },
    { fill:"#252216", d:" M 19.38 12.10 L 20.39 11.47 C 22.14 12.04 21.28 13.70 21.10 14.99 C 20.46 15.20 19.17 15.61 18.53 15.82 C 18.34 15.32 17.95 14.31 17.76 13.80 C 18.17 13.38 18.98 12.52 19.38 12.10 Z" },
    { fill:"#2c281d", d:" M 10.64 16.85 C 11.77 14.73 14.33 13.99 16.51 14.88 C 15.02 16.81 13.05 18.75 10.64 16.85 Z" },
    { fill:"#d4bd77", d:" M 16.51 14.88 C 16.82 14.61 17.45 14.07 17.76 13.80 C 17.95 14.31 18.34 15.32 18.53 15.82 C 22.01 21.84 5.14 22.06 4.18 15.77 C 6.33 16.11 8.49 16.47 10.64 16.85 C 13.05 18.75 15.02 16.81 16.51 14.88" }
  );

  this.blueShellPaths.push(
    { fill:"#374be0", d: " M 8.09 6.17 C 7.66 3.39 14.15 4.78 14.70 4.27 C 19.22 5.84 20.97 10.10 23.01 14.00 C 22.29 17.74 17.52 15.44 14.86 15.02 C 14.05 13.64 14.83 12.78 16.08 12.14 C 17.83 11.39 18.26 9.76 18.04 7.99 C 15.32 7.38 13.17 8.70 11.80 10.97 C 9.33 11.40 11.05 8.81 10.90 7.47 C 9.99 7.36 9.08 7.28 8.16 7.17 L 8.09 6.17 Z" },
    { fill:"#cdc5aa", d: " M 4.04 9.22 C 3.16 6.70 6.27 6.11 8.09 6.17 L 8.16 7.17 C 7.03 8.41 5.94 10.36 4.04 9.22 Z" },
    { fill:"#7276e9", d: " M 8.16 7.17 C 9.08 7.28 9.99 7.36 10.90 7.47 C 11.05 8.81 9.33 11.40 11.80 10.97 C 13.24 11.31 14.65 11.76 16.08 12.14 C 14.83 12.78 14.05 13.64 14.86 15.02 C 12.38 14.40 10.18 12.98 7.66 12.47 C 2.35 15.61 2.16 10.83 4.04 9.22 C 5.94 10.36 7.03 8.41 8.16 7.17 Z" },
    { fill:"#c9c3c3", d: " M 11.80 10.97 C 13.17 8.70 15.32 7.38 18.04 7.99 C 18.26 9.76 17.83 11.39 16.08 12.14 C 14.65 11.76 13.24 11.31 11.80 10.97 Z" },
    { fill:"#594f40", d: " M 2.13 15.13 C 3.84 15.34 5.51 15.77 7.20 16.09 C 6.60 17.49 6.20 19.06 5.14 20.19 C 4.36 19.49 3.60 18.77 2.85 18.03 C 1.78 17.21 0.83 16.26 2.13 15.13 Z" },
    { fill:"#decd99", d: " M 7.20 16.09 C 8.62 16.28 9.86 17.05 11.09 17.72 C 7.52 17.30 10.27 20.05 11.12 21.56 C 10.18 21.62 7.94 23.87 8.06 21.96 C 8.51 18.76 6.18 21.10 4.79 21.87 C 3.14 21.24 3.01 19.56 2.85 18.03 C 3.60 18.77 4.36 19.49 5.14 20.19 C 6.20 19.06 6.60 17.49 7.20 16.09 Z" },
    { fill:"#b7b0aa", d: " M 11.86 18.12 C 16.00 18.03 20.13 17.67 24.25 17.35 C 23.65 18.69 22.32 19.39 21.22 20.26 C 18.92 19.75 16.58 19.36 14.21 19.33 C 13.63 19.02 12.45 18.42 11.86 18.12 Z" },
    { fill:"#1f170f", d: " M 11.12 21.56 C 10.27 20.05 7.52 17.30 11.09 17.72 L 11.86 18.12 C 12.45 18.42 13.63 19.02 14.21 19.33 C 13.78 20.74 12.33 21.05 11.12 21.56 Z" },
    { fill:"#b69f6e", d: " M 14.21 19.33 C 16.58 19.36 18.92 19.75 21.22 20.26 C 19.54 21.99 17.75 23.62 15.77 25.00 L 10.34 25.00 C 8.43 24.07 6.53 23.10 4.79 21.87 C 6.18 21.10 8.51 18.76 8.06 21.96 C 7.94 23.87 10.18 21.62 11.12 21.56 C 12.33 21.05 13.78 20.74 14.1 19.33 Z" }
  );


};
