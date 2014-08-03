// TODO fix shell movement to not go past edges of screen

var Shells = function() {
  this.data = [];
  this.shellColors = ["red", "green", "green", "green"];
  this.prevCollision = false;

  this.greenShellPaths = [];
  this.redShellPaths = [];
  this.blueShellPaths = [];

  // Call initial methods
  this.addShells();
  this.addPaths();
  this.d3SetUp();
};

Shells.prototype.d3SetUp = function() {
  // Use data array to create svg containers for our shells

  // Set not visible shells off screen
  var randomOutOfBounds = function(widthOrHeight) {
    var arr = [Math.random() * gameOptions[widthOrHeight] + gameOptions[widthOrHeight], Math.random() * gameOptions[widthOrHeight] - gameOptions[widthOrHeight]]
    return arr[Math.floor(Math.random() * 2)]
  };

  var newShells = gameBoard.selectAll("svg")
    .data(this.data)
    .enter()
    .append("svg")
    .attr({
      "x": function(d){return d.cssClass === "green" ? d.x : randomOutOfBounds("width");},
      "y": function(d){return d.cssClass === "green" ? d.y : randomOutOfBounds("height");},
      "class": function(d){return d.cssClass;},
    });

  // Add our svg paths to each container given a specified class
  this.setPaths("red");
  this.setPaths("green");
  this.setPaths("blue");
};

Shells.prototype.addShells = function() {
  // Add red or green shells got all but one enemy in our d3 data array
  for (var i = 0; i < gameOptions.nEnemies - 1; i++) {
    this.data.push({
      x: Math.random() * gameOptions.width,
      y: Math.random() * gameOptions.height,
      cssClass: this.shellColors[Math.floor(Math.random() * this.shellColors.length)],
    });
  }

  // Add a single blue shell to our d3 data array
  this.data.push({
    x: Math.random() * gameOptions.width,
    y: Math.random() * gameOptions.height,
    cssClass: "blue"
  });
};

Shells.prototype.setPaths = function(className){
  // Variable creates our methods name. Note: class names must directly correlate to method names
  var pathSelector = className + "ShellPaths";

  // Adds path elements to proper svg
  d3.selectAll("svg." + className).selectAll("path")
  .data(this[pathSelector])
  .enter()
  .append("path")
  .attr({
    "d": function(d){return d.d;},
    "fill": function(d){return d.fill;},
    "opacity": function(d){return d.opacity}
  });
};


Shells.prototype.detectCollisions = function(){
  var collision = false;

  // Selects all shells and checks for collisions
  d3.selectAll(".green, .red, .blue").each(function(d){
    var element = d3.select(this);
    var shellXPos = parseFloat(element.attr("x"));
    var shellYPos = parseFloat(element.attr("y"));
    var shellWidth = 25;
    var shellHeight = 23;

    if (mario.x <  shellXPos + shellWidth &&
        mario.x + mario.width > shellXPos &&
        mario.y < shellYPos + shellHeight &&
        mario.y + mario.height > shellYPos) {
      collision = true;
    }
  });

  if(collision){
    if (gameStats.currentScore > gameStats.highScore){
      gameStats.highScore = gameStats.currentScore;
    }
    gameStats.currentScore = 0;

    if (this.prevCollision !== collision){
      gameBoard.insert("image", ":first-child");
      gameBoard.selectAll("image").attr({
        "xlink:href": "img/bowser.png",
        "width": gameOptions.width,
        "height": gameOptions.height,
        "opacity": 0.10
      });

      gameStats.collisions++;
      d3.select(".collisions").style("color", "orange");
      d3.select(".collisions span").text(gameStats.collisions);
    }
  } else {
    d3.select(".collisions").style("color", "black");
    gameBoard.selectAll("image").remove();
  }
  this.prevCollision = collision;
};

Shells.prototype.moveGreenShells = function(){
  // green functionality
  d3.selectAll(".green")
  .transition().duration(2000).ease("linear")
  .attr({
    "x": function(){return Math.random() * gameOptions.width;},
    "y": function(){return Math.random() * gameOptions.height;},
  })
  .each("end", Shells.prototype.moveGreenShells);
};

// red functionality
Shells.prototype.moveRedShells = function(){

  // Random out of bounds location helper function
  var randomOutOfBounds = function(widthOrHeight) {
    var arr = [Math.random() * gameOptions[widthOrHeight] + gameOptions[widthOrHeight], Math.random() * gameOptions[widthOrHeight] - gameOptions[widthOrHeight]]
    return arr[Math.floor(Math.random() * 2)]
  };

  // Stop moving if score < 1000
  if (gameStats.currentScore < 1000) {
    d3.selectAll("svg .red").transition().duration(500).ease("linear")
    .attr({
      "x": function(d){return randomOutOfBounds("width");},
      "y": function(d){return randomOutOfBounds("height");},
    });
    return true;
  } 

  d3.selectAll(".red")
  .transition().duration(1500)
  .attr({
    "x": function(){return Math.random() * gameOptions.width;},
    "y": function(){return Math.random() * gameOptions.height;}
  })
  .each("end", Shells.prototype.moveRedShells);  
};


// blue functionality - hunts mario @ 1500pts
Shells.prototype.moveBlueShells = function(){

  // Random out of bounds location helper function
  var randomOutOfBounds = function(widthOrHeight) {
    var arr = [Math.random() * gameOptions[widthOrHeight] + gameOptions[widthOrHeight], Math.random() * gameOptions[widthOrHeight] - gameOptions[widthOrHeight]]
    return arr[Math.floor(Math.random() * 2)]
  };

  // Stop moving if score < 1500
  if (gameStats.currentScore < 1500) {
    d3.selectAll("svg .blue").transition().duration(500).ease("linear")
    .attr({
      "x": function(d){return randomOutOfBounds("width");},
      "y": function(d){return randomOutOfBounds("height");},
    });
    return true;
  }

  d3.selectAll(".blue")
  .transition().duration(1000).ease("linear")
  .attr({
    "x": function(){return mario.x;},
    "y": function(){return mario.y;}
  })
  .each("end", Shells.prototype.moveBlueShells);
};

// Path properties for various shells' svg
Shells.prototype.addPaths = function() {
  this.greenShellPaths.push(
    { fill: "#2b9b39", opacity: "0.71", d: " M 10.28 0.00 L 14.75 0.00 L 15.17 0.39 C 13.58 1.19 11.40 1.84 9.89 0.51 L 10.28 0.00 Z" },
    { fill: "#1ada32", opacity: "1.00", d: " M 6.94 1.97 C 7.96 1.55 8.94 1.06 9.89 0.51 C 11.40 1.84 13.58 1.19 15.17 0.39 C 15.66 0.59 16.63 0.97 17.12 1.16 L 16.75 1.52 L 15.79 1.54 C 14.13 1.56 12.47 1.53 10.81 1.51 C 10.34 3.54 10.36 6.21 7.98 6.99 C 8.70 5.78 6.33 3.54 6.32 5.76 C 6.58 6.15 7.12 6.94 7.39 7.33 L 6.23 8.00 C 5.83 7.90 5.03 7.70 4.62 7.60 C 4.39 7.27 3.91 6.59 3.68 6.25 L 3.77 5.83 C 5.05 4.76 6.34 3.58 6.94 1.97 Z" },
    { fill: "#1f551f", opacity: "0.59", d: " M 17.12 1.16 C 19.22 1.61 20.45 3.46 21.09 5.38 C 20.06 4.88 19.04 4.36 18.04 3.81 C 17.72 3.24 17.07 2.09 16.75 1.52 L 17.12 1.16 Z" },
    { fill: "#1d2d20", opacity: "0.19", d: " M 4.55 2.70 C 5.15 2.52 6.34 2.15 6.94 1.97 C 6.34 3.58 5.05 4.76 3.77 5.83 C 3.96 5.04 4.36 3.48 4.55 2.70 Z" },
    { fill: "#0f8711", opacity: "1.00", d: " M 10.81 1.51 C 12.47 1.53 14.13 1.56 15.79 1.54 C 17.00 4.34 17.86 7.29 18.28 10.32 C 16.52 10.03 14.75 9.74 13.02 9.29 C 14.10 7.83 15.99 6.52 15.66 4.46 C 14.75 3.49 13.34 3.31 12.18 2.79 C 12.06 4.72 11.96 6.66 11.93 8.60 C 10.03 8.40 8.13 8.19 6.23 8.00 L 7.39 7.33 L 7.98 6.99 C 10.36 6.21 10.34 3.54 10.81 1.51 Z" },
    { fill: "#1a5018", opacity: "1.00", d: " M 15.79 1.54 L 16.75 1.52 C 17.07 2.09 17.72 3.24 18.04 3.81 C 19.14 5.80 19.59 8.25 21.10 9.95 C 21.70 9.73 22.91 9.27 23.51 9.05 C 23.03 10.19 22.57 11.34 22.11 12.49 C 19.50 12.25 16.90 11.90 14.35 11.30 C 11.57 10.38 8.95 9.06 6.23 8.00 C 8.13 8.19 10.03 8.40 11.93 8.60 C 12.20 8.77 12.75 9.12 13.02 9.29 C 14.75 9.74 16.52 10.03 18.28 10.32 C 17.86 7.29 17.00 4.34 15.79 1.54 Z" },
    { fill: "#12c727", opacity: "1.00", d: " M 12.18 2.79 C 13.34 3.31 14.75 3.49 15.66 4.46 C 15.99 6.52 14.10 7.83 13.02 9.29 C 12.75 9.12 12.20 8.77 11.93 8.60 C 11.96 6.66 12.06 4.72 12.18 2.79 Z" },
    { fill: "#099011", opacity: "1.00", d: " M 18.04 3.81 C 19.04 4.36 20.06 4.88 21.09 5.38 L 21.43 6.09 C 21.51 6.22 21.66 6.48 21.73 6.61 C 22.18 7.22 23.06 8.44 23.51 9.05 C 22.91 9.27 21.70 9.73 21.10 9.95 C 19.59 8.25 19.14 5.80 18.04 3.81 Z" },
    { fill: "#47e36a", opacity: "1.00", d: " M 6.32 5.76 C 6.33 3.54 8.70 5.78 7.98 6.99 L 7.39 7.33 C 7.12 6.94 6.58 6.15 6.32 5.76 Z" },
    { fill: "#ffffff", opacity: "1.00", d: " M 0.00 10.58 C 0.99 8.95 2.38 7.64 3.68 6.25 C 3.91 6.59 4.39 7.27 4.62 7.60 C 5.03 7.70 5.83 7.90 6.23 8.00 C 8.95 9.06 11.57 10.38 14.35 11.30 C 12.46 11.39 10.01 10.84 8.80 12.75 L 9.07 12.89 C 7.75 12.32 6.44 11.75 5.09 11.25 C 3.42 10.33 1.57 10.34 0.01 11.52 L 0.00 11.86 L 0.00 10.58 Z" },
    { fill: "#329a43", opacity: "0.78", d: " M 21.43 6.09 C 21.51 6.22 21.66 6.48 21.73 6.61 C 21.66 6.48 21.51 6.22 21.43 6.09 Z" },
    { fill: "#999791", opacity: "1.00", d: " M 23.51 9.05 C 24.01 9.72 24.51 10.40 25.00 11.08 L 25.00 12.94 C 23.86 13.97 22.71 14.99 21.64 16.09 C 19.59 15.92 17.54 15.80 15.50 15.61 C 13.28 14.88 11.17 13.90 9.07 12.89 L 8.80 12.75 C 10.01 10.84 12.46 11.39 14.35 11.30 C 16.90 11.90 19.50 12.25 22.11 12.49 C 22.57 11.34 23.03 10.19 23.51 9.05 Z" },
    { fill: "#c4bc8b", opacity: "0.96", d: " M 0.01 11.52 C 1.57 10.34 3.42 10.33 5.09 11.25 C 4.33 11.33 2.80 11.48 2.04 11.56 C 3.05 13.01 5.53 17.44 7.01 13.68 C 7.65 14.26 8.28 14.84 8.92 15.43 C 7.96 16.78 6.70 17.57 5.13 17.79 C 3.21 15.88 1.71 13.61 0.01 11.52 Z" },
    { fill: "#5e5437", opacity: "1.00", d: " M 2.04 11.56 C 2.80 11.48 4.33 11.33 5.09 11.25 C 6.44 11.75 7.75 12.32 9.07 12.89 C 11.17 13.90 13.28 14.88 15.50 15.61 C 14.37 16.38 13.31 17.39 11.94 17.71 C 10.93 17.09 10.01 16.33 9.06 15.62 C 8.21 16.66 7.36 17.71 6.51 18.76 C 6.04 18.45 5.58 18.13 5.13 17.79 C 6.70 17.57 7.96 16.78 8.92 15.43 C 8.28 14.84 7.65 14.26 7.01 13.68 C 5.53 17.44 3.05 13.01 2.04 11.56 Z" },
    { fill: "#d9c279", opacity: "1.00", d: " M 15.50 15.61 C 17.54 15.80 19.59 15.92 21.64 16.09 C 18.40 21.09 11.32 21.97 6.51 18.76 C 7.36 17.71 8.21 16.66 9.06 15.62 C 10.01 16.33 10.93 17.09 11.94 17.71 C 13.31 17.39 14.37 16.38 15.50 15.61 Z" }
  );
  this.redShellPaths.push(
    { fill: "#ec1407", opacity: "0.98", d: " M 7.62 1.97 C 10.27 -0.22 14.04 -0.10 16.84 1.74 C 16.23 3.57 16.09 5.47 16.90 7.26 C 18.12 6.78 19.33 6.29 20.55 5.81 C 20.89 6.57 21.22 7.33 21.54 8.08 C 20.59 8.21 18.68 8.47 17.73 8.60 C 15.16 7.31 14.54 4.65 14.39 2.03 C 12.14 1.99 9.88 1.93 7.62 1.97 Z" },
    { fill: "#b60b04", opacity: "1.00", d: " M 6.96 2.40 C 7.12 2.29 7.46 2.08 7.62 1.97 C 9.88 1.93 12.14 1.99 14.39 2.03 C 14.54 4.65 15.16 7.31 17.73 8.60 C 17.44 8.70 16.85 8.90 16.56 8.99 C 13.34 9.43 10.19 10.21 7.07 11.08 C 7.15 9.59 7.07 8.07 7.50 6.62 C 9.10 7.34 10.59 9.82 12.47 8.44 C 12.73 7.04 12.81 5.62 12.95 4.21 C 11.64 4.07 10.35 3.87 9.06 3.61 C 8.53 3.31 7.48 2.70 6.96 2.40 Z" },
    { fill: "#fa6b21", opacity: "0.98", d: " M 16.84 1.74 C 18.28 2.66 19.64 3.79 20.37 5.38 L 20.55 5.81 C 19.33 6.29 18.12 6.78 16.90 7.26 C 16.09 5.47 16.23 3.57 16.84 1.74 Z" },
    { fill: "#c91b06", opacity: "0.96", d: " M 2.50 8.38 C 3.71 6.19 5.13 4.11 6.96 2.40 C 6.90 5.59 5.26 8.36 3.70 11.03 C 3.39 10.54 2.78 9.56 2.47 9.07 L 2.50 8.38 Z" },
    { fill: "#741111", opacity: "1.00", d: " M 6.96 2.40 C 7.48 2.70 8.53 3.31 9.06 3.61 C 8.54 4.61 8.02 5.62 7.50 6.62 C 7.07 8.07 7.15 9.59 7.07 11.08 C 10.19 10.21 13.34 9.43 16.56 8.99 C 14.92 9.86 13.24 10.65 11.46 11.20 C 10.18 11.58 8.90 11.98 7.61 12.34 C 6.29 12.05 4.68 12.12 3.70 11.03 C 5.26 8.36 6.90 5.59 6.96 2.40 Z" },
    { fill: "#ec3d05", opacity: "1.00", d: " M 7.50 6.62 C 8.02 5.62 8.54 4.61 9.06 3.61 C 10.35 3.87 11.64 4.07 12.95 4.21 C 12.81 5.62 12.73 7.04 12.47 8.44 C 10.59 9.82 9.10 7.34 7.50 6.62 Z" },
    { fill: "#fefbf9", opacity: "1.00", d: " M 20.37 5.38 C 21.30 6.08 21.84 7.14 22.48 8.08 C 24.04 9.07 24.89 10.60 25.00 12.49 L 25.00 13.15 L 24.11 11.30 C 23.75 12.09 23.02 13.67 22.66 14.46 C 22.64 13.63 22.61 11.95 22.59 11.12 C 21.76 11.37 20.09 11.88 19.25 12.14 C 16.61 12.42 14.05 11.59 11.46 11.20 C 13.24 10.65 14.92 9.86 16.56 8.99 C 16.85 8.90 17.44 8.70 17.73 8.60 C 18.68 8.47 20.59 8.21 21.54 8.08 C 21.22 7.33 20.89 6.57 20.55 5.81 L 20.37 5.38 Z" },
    { fill: "#95928f", opacity: "1.00", d: " M 1.15 8.62 C 1.49 8.56 2.16 8.44 2.50 8.38 L 2.47 9.07 C 2.18 10.37 2.55 11.62 3.16 12.77 C 4.74 12.68 6.32 12.60 7.89 12.39 L 7.61 12.34 C 8.90 11.98 10.18 11.58 11.46 11.20 C 14.05 11.59 16.61 12.42 19.25 12.14 C 18.77 12.44 17.80 13.06 17.32 13.37 L 16.55 13.68 L 16.13 13.85 C 14.13 14.45 12.13 15.04 10.16 15.71 C 8.05 16.51 5.78 16.43 3.58 16.13 C 0.98 14.72 -0.51 12.38 0.92 9.45 L 1.15 8.62 Z" },
    { fill: "#3b3525", opacity: "0.95", d: " M 19.25 12.14 C 20.09 11.88 21.76 11.37 22.59 11.12 C 22.61 11.95 22.64 13.63 22.66 14.46 C 22.60 14.58 22.47 14.83 22.40 14.95 L 22.25 13.10 C 21.30 14.15 20.30 15.15 19.28 16.13 C 18.79 15.44 17.81 14.06 17.32 13.37 C 17.80 13.06 18.77 12.44 19.25 12.14 Z" },
    { fill: "#322e23", opacity: "1.00", d: " M 10.16 15.71 C 12.13 15.04 14.13 14.45 16.13 13.85 C 15.75 14.78 15.38 15.71 15.02 16.65 C 13.48 18.56 11.14 17.66 10.16 15.71 Z" },
    { fill: "#bba35f", opacity: "1.00", d: " M 16.13 13.85 L 16.55 13.68 C 17.03 15.49 18.16 16.97 19.42 18.31 C 19.02 18.59 18.22 19.15 17.81 19.43 C 16.89 18.50 15.95 17.57 15.02 16.65 C 15.38 15.71 15.75 14.78 16.13 13.85 Z" },
    { fill: "#f0e79d", opacity: "1.00", d: " M 16.55 13.68 L 17.32 13.37 C 17.81 14.06 18.79 15.44 19.28 16.13 C 20.30 15.15 21.30 14.15 22.25 13.10 L 22.40 14.95 C 21.65 16.26 20.59 17.37 19.42 18.31 C 18.16 16.97 17.03 15.49 16.55 13.68 Z" },
    { fill: "#d6c07a", opacity: "1.00", d: " M 3.58 16.13 C 5.78 16.43 8.05 16.51 10.16 15.71 C 11.14 17.66 13.48 18.56 15.02 16.65 C 15.95 17.57 16.89 18.50 17.81 19.43 C 13.12 21.95 6.26 21.16 3.58 16.13 Z" }
  );

  this.blueShellPaths.push(
    { fill: "#fffef2", opacity: "1.00", d: " M 12.22 0.00 L 12.43 0.00 C 13.12 1.04 13.62 2.16 13.94 3.36 C 14.52 3.81 15.11 4.24 15.71 4.68 C 13.91 4.14 12.04 4.17 10.19 4.40 C 10.97 2.98 11.58 1.48 12.22 0.00 Z" },
    { fill: "#fffef2", opacity: "1.00", d: " M 3.13 4.55 C 3.60 4.70 4.54 4.99 5.02 5.14 C 5.57 5.77 7.13 6.45 6.51 7.49 C 5.10 8.34 3.70 7.07 3.13 5.84 C 3.13 5.52 3.13 4.87 3.13 4.55 Z" },
    { fill: "#fffef2", opacity: "1.00", d: " M 18.29 6.23 C 18.75 6.26 19.69 6.31 20.16 6.34 L 20.12 7.19 C 19.66 6.95 18.75 6.47 18.29 6.23 Z" },
    { fill: "#fffef2", opacity: "1.00", d: " M 20.08 8.53 C 21.72 8.64 23.36 8.66 25.00 8.52 L 25.00 9.30 C 23.93 10.34 22.42 11.07 22.15 12.71 C 21.35 11.39 20.10 10.19 20.08 8.53 Z" },
    { fill: "#fffef2", opacity: "1.00", d: " M 9.19 9.11 C 9.38 9.46 9.77 10.17 9.96 10.52 C 10.45 11.52 10.91 12.54 11.36 13.56 C 14.60 14.79 17.93 15.99 21.46 15.83 C 21.67 15.46 22.09 14.71 22.30 14.34 C 23.13 14.39 23.95 14.46 24.77 14.54 C 24.92 16.02 24.56 17.33 23.69 18.45 C 20.07 18.44 16.45 18.62 12.83 18.45 C 12.38 18.28 11.49 17.95 11.04 17.78 C 9.90 17.28 8.77 16.77 7.65 16.24 C 8.54 18.82 6.61 20.49 4.78 21.83 C 3.03 20.30 1.99 18.19 1.04 16.12 L 0.00 16.76 L 0.00 13.96 C 0.66 13.42 1.98 12.34 2.64 11.80 L 2.93 11.77 C 5.64 11.57 8.18 12.62 10.69 13.45 C 10.58 11.83 9.81 10.79 8.39 10.34 C 8.59 10.03 8.99 9.42 9.19 9.11 M 0.95 15.42 C 1.59 16.02 2.35 16.89 3.35 16.57 C 3.19 18.17 3.71 19.50 4.91 20.56 C 5.48 19.62 6.61 17.74 7.18 16.80 C 5.46 15.25 3.09 15.37 0.95 15.42 Z" },
    { fill: "#a7956a", opacity: "1.00", d: " M 5.02 5.14 C 5.74 5.26 7.19 5.52 7.92 5.64 C 7.99 6.05 8.14 6.87 8.22 7.28 C 7.51 8.16 6.77 9.02 6.01 9.86 C 5.51 9.87 4.52 9.90 4.03 9.91 L 2.88 9.77 C 2.89 10.27 2.92 11.27 2.93 11.77 L 2.64 11.80 C 2.38 11.15 1.85 9.85 1.59 9.20 C 2.20 9.18 3.43 9.14 4.05 9.12 C 3.72 8.03 3.41 6.94 3.13 5.84 C 3.70 7.07 5.10 8.34 6.51 7.49 C 7.13 6.45 5.57 5.77 5.02 5.14 Z" },
    { fill: "#a7956a", opacity: "1.00", d: " M 7.65 16.24 C 8.77 16.77 9.90 17.28 11.04 17.78 C 10.59 17.84 9.71 17.96 9.26 18.02 C 9.38 18.37 9.60 19.06 9.72 19.41 C 8.74 20.05 8.07 20.93 7.72 22.05 C 9.95 22.60 14.87 24.77 14.64 20.72 C 14.50 19.57 13.90 18.82 12.83 18.45 C 16.45 18.62 20.07 18.44 23.69 18.45 C 21.14 19.70 20.35 22.83 17.73 23.94 C 16.51 24.57 15.15 24.82 13.80 25.00 L 12.24 25.00 C 9.44 24.92 6.81 23.73 4.78 21.83 C 6.61 20.49 8.54 18.82 7.65 16.24 Z" },
    { fill: "#243ff0", opacity: "1.00", d: " M 7.92 5.64 C 8.49 5.33 9.63 4.71 10.19 4.40 C 12.04 4.17 13.91 4.14 15.71 4.68 C 16.35 5.06 17.64 5.84 18.29 6.23 C 18.75 6.47 19.66 6.95 20.12 7.19 L 20.08 8.53 C 20.10 10.19 21.35 11.39 22.15 12.71 C 22.18 13.03 22.24 13.66 22.27 13.97 C 20.33 13.82 19.40 11.96 18.37 10.61 L 18.13 9.53 C 18.05 9.17 17.90 8.44 17.83 8.08 C 17.05 8.10 15.51 8.13 14.74 8.15 C 14.37 7.83 13.62 7.20 13.25 6.88 C 12.49 5.77 11.64 5.61 10.69 6.41 C 10.07 6.62 8.83 7.06 8.22 7.28 C 8.14 6.87 7.99 6.05 7.92 5.64 Z" },
    { fill: "#1b36e1", opacity: "1.00", d: " M 10.69 6.41 C 11.64 5.61 12.49 5.77 13.25 6.88 C 12.13 9.23 10.34 12.46 13.88 13.65 L 14.36 12.69 C 16.05 12.82 17.73 12.40 18.37 10.61 C 19.40 11.96 20.33 13.82 22.27 13.97 L 22.30 14.34 C 22.09 14.71 21.67 15.46 21.46 15.83 C 17.93 15.99 14.60 14.79 11.36 13.56 C 10.91 12.54 10.45 11.52 9.96 10.52 C 10.93 9.33 11.17 7.96 10.69 6.41 Z" },
    { fill: "#6e71ee", opacity: "1.00", d: " M 8.22 7.28 C 8.83 7.06 10.07 6.62 10.69 6.41 C 11.17 7.96 10.93 9.33 9.96 10.52 C 9.77 10.17 9.38 9.46 9.19 9.11 C 8.99 9.42 8.59 10.03 8.39 10.34 C 9.81 10.79 10.58 11.83 10.69 13.45 C 8.18 12.62 5.64 11.57 2.93 11.77 C 2.92 11.27 2.89 10.27 2.88 9.77 L 4.03 9.91 C 3.91 11.96 8.08 11.59 6.01 9.86 C 6.77 9.02 7.51 8.16 8.22 7.28 Z" },
    { fill: "#928ef2", opacity: "1.00", d: " M 13.25 6.88 C 13.62 7.20 14.37 7.83 14.74 8.15 C 13.81 9.22 13.58 10.36 14.05 11.60 L 14.36 12.69 L 13.88 13.65 C 10.34 12.46 12.13 9.23 13.25 6.88 Z" },
    { fill: "#e1ddd1", opacity: "1.00", d: " M 14.74 8.15 C 15.51 8.13 17.05 8.10 17.83 8.08 C 17.90 8.44 18.05 9.17 18.13 9.53 C 16.82 10.31 15.44 10.98 14.05 11.60 C 13.58 10.36 13.81 9.22 14.74 8.15 Z" },
    { fill: "#2734f6", opacity: "1.00", d: " M 4.03 9.91 C 4.52 9.90 5.51 9.87 6.01 9.86 C 8.08 11.59 3.91 11.96 4.03 9.91 Z" },
    { fill: "#999191", opacity: "1.00", d: " M 14.05 11.60 C 15.44 10.98 16.82 10.31 18.13 9.53 L 18.37 10.61 C 17.73 12.40 16.05 12.82 14.36 12.69 L 14.05 11.60 Z" },
    { fill: "#514b44", opacity: "1.00", d: " M 0.95 15.42 C 3.09 15.37 5.46 15.25 7.18 16.80 C 6.61 17.74 5.48 19.62 4.91 20.56 C 3.71 19.50 3.19 18.17 3.35 16.57 C 2.35 16.89 1.59 16.02 0.95 15.42 Z" },
    { fill: "#221a15", opacity: "1.00", d: " M 9.26 18.02 C 9.71 17.96 10.59 17.84 11.04 17.78 C 11.49 17.95 12.38 18.28 12.83 18.45 C 13.90 18.82 14.50 19.57 14.64 20.72 C 12.80 21.29 10.44 21.80 9.72 19.41 C 9.60 19.06 9.38 18.37 9.26 18.02 Z" },
    { fill: "#d8c383", opacity: "1.00", d: " M 7.72 22.05 C 8.07 20.93 8.74 20.05 9.72 19.41 C 10.44 21.80 12.80 21.29 14.64 20.72 C 14.87 24.77 9.95 22.60 7.72 22.05 Z" }
  );
};
