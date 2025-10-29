let A = 20;
let gradientTightness=200;

function setup(){
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(0);
  
  
  for (let i = 0; i < width; i += A) {
    for (let n = 0; n < height; n += A) {
      let d = dist(i, n, mouseX, mouseY);
      
      
      let c = map(d, 0, gradientTightness, 0, 255);
      c = constrain(c, 0, 255);
      
      fill(c, 100, 255 - c);
      rect(i, n, A, A);
    }
  }
}


function mousePressed() {
  gradientTightness = random(50, 600);
  console.log("New gradient tightness:", gradientTightness);
}
