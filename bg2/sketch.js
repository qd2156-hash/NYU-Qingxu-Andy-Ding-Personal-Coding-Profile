let points = [];
let brushDensity = 15;
let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(138, 43, 226); // Violet
  background(bgColor);
  strokeWeight(1);
  noFill();
}

function draw() {
  background(bgColor, 20);

  if (points.length > 1) {
    beginShape();
    for (let i = 0; i < points.length; i++) {
      let p = points[i];
      stroke(0, 255, 255, 150 - i * 2);
      curveVertex(p.x, p.y);
    }
    endShape();
  }

  for (let p of points) {
    for (let j = 0; j < brushDensity; j++) {
      let offsetX = random(-5, 5);
      let offsetY = random(-5, 5);
      let alpha = random(30, 100);
      noStroke();
      fill(0, 255, 255, alpha);
      ellipse(p.x + offsetX, p.y + offsetY, random(1, 5));
    }
  }


  if (points.length > 100) {
    points.splice(0, 1);
  }
}

function mouseDragged() {
  points.push(createVector(mouseX, mouseY));
}

function mousePressed() {

  
  for (let i = 0; i < 50; i++) {
    let offsetX = random(-10, 10);
    let offsetY = random(-10, 10);
    noStroke();
    fill(0, 255, 255, random(100, 200));
    ellipse(mouseX + offsetX, mouseY + offsetY, random(3, 8));
  }
}
