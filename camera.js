let cam
let vScale=16;
let angle = 0;

function setup(){
  createCanvas(windowWidth, windowWidth*0.75);

  cam = createCapture(VIDEO,{flipped:true});
  cam.size(width/vScale, height/vScale);
  cam.hide();

  strokeWeight(1.5);
  rectMode(CENTER);
}

function draw(){
  background(0);
  cam.loadPixels();

  translate(vScale/2, vScale/2);

  for (let y=0; y<cam.height; y++) {
    for (let x=0; x<cam.width/2; x++) {

      let index=(x+y*cam.width)*4;
      let r=cam.pixels[index];
      let g=cam.pixels[index + 1];
      let b=cam.pixels[index + 2];

      let brightness=(r+g+b)/3;

      // 计算到中心的距离，用于径向缩放
      let centerX = cam.width / 2;
      let centerY = cam.height / 2;
      let distance = dist(x, y, centerX, centerY);
      let maxDist = dist(0, 0, centerX, centerY);
      let distFactor = map(distance, 0, maxDist, 1.2, 0.6);

      let s = map(brightness, 0, 255, 2, vScale) * distFactor;

      // 添加随机颜色变化
      let randomR = constrain(r + random(-50, 50), 0, 255);
      let randomG = constrain(g + random(-50, 50), 0, 255);
      let randomB = constrain(b + random(-50, 50), 0, 255);

      // 添加描边，使用互补色
      stroke(255-randomR, 255-randomG, 255-randomB, 120);
      fill(randomR, randomG, randomB);

      // 左半部分（原始）
      push();
      translate(x*vScale, y*vScale);
      rotate(angle + distance * 0.5);
      rect(0, 0, s, s);
      pop();

      // 右半部分（垂直镜像）
      push();
      translate(width-x*vScale, y*vScale);
      rotate(-angle - distance * 0.5);
      rect(0, 0, s, s);
      pop();
    }
  }

  angle += 0.3;
}
