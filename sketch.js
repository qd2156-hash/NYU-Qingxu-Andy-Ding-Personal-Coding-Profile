let photos = [];
let photoUrls = [
  "a0.png",
  "a1.png",
  "a2.png",
  "a3.png",
  
];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("floatingPhotos");
  canvas.style("position", "absolute");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "-1");

  for (let i = 0; i < photoUrls.length; i++) {
    photos[i] = {
      img: loadImage(photoUrls[i]),
      x: random(width),
      y: random(height),
      nX: random(1000),
      nY: random(2000),
      size: 150
    };
  }
}

function draw() {
  clear();

  for (let i = 0; i < photos.length; i++) {
    let p = photos[i];
    image(p.img, p.x, p.y, p.size, p.size);

    p.x += map(noise(p.nX), 0, 1, -1, 1);
    p.y += map(noise(p.nY), 0, 1, -1, 1);
    p.nX += 0.01;
    p.nY += 0.01;

    if (p.x < -p.size) p.x = width;
    if (p.x > width) p.x = -p.size;
    if (p.y < -p.size) p.y = height;
    if (p.y > height) p.y = -p.size;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
