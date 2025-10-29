let step = 0;

function showBrush() {
  const content = document.getElementById("content");
  if (step === 0) {
    content.innerHTML = `
      <p>The first one is this calligraphy brush.
      The first one is this calligraphy brush. I started learning Chinese calligraphy when I was three years old, and this brush has been with me for fifteen years. It witnessed my very first calligraphy class, the very first character I wrote, and even my very first little piece of work. I practiced at least one hour every day, whether at school or at home, and over time, calligraphy simply became part of my life. By the time I graduated from elementary school, I even held my own calligraphy exhibition and invited the principal to visit. Calligraphy not only connects me with traditional Chinese culture, but also taught me persistence and focus.</p>
      <img src="a4.jpg" width="300" />
      <button onclick="showRacket()">Continue</button>
    `;
    step++;

    // Initialize bg2 sketch as background
    initBrushBackground();
  }
}

function showRacket() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <p>The second object is my tennis racket. I enjoy many sports, like horseback riding, swimming, and golf, but tennis has always been my favorite. Whenever I feel a lot of pressure from studying, playing a match with my friends helps me release my stress and bring my energy back. On the court, every run and every swing makes me feel free and powerful.</p>
    <img src="a6.jpg" width="300" />
    <button onclick="showMic()">Continue</button>
  `;

  // Remove bg2 background if exists
  if (brushSketch) {
    brushSketch.remove();
    brushSketch = null;
  }

  // Initialize bg3 sketch as background
  initGradientBackground();
}

function showMic() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <p>The last object is this microphone. I started learning hosting and broadcasting when I was five, and the microphone has been with me throughout that journey. I really enjoy the feeling of holding an event together, and I love using my voice to connect with the audience and the stage. Even when unexpected things happen, I can use my hosting skills to keep the program smooth. This experience has taught me to stay calm and confident when facing challenges.</p>
    <img src="a5.jpg" width="300" />
    <p>Thanks for learning more about me!</p>
  `;

  // Remove bg3 background if exists
  if (gradientSketch) {
    gradientSketch.remove();
    gradientSketch = null;
  }
}

// bg2 sketch code
let points = [];
let brushDensity = 15;
let bgColor;
let brushSketch;
let gradientSketch;

function initBrushBackground() {
  brushSketch = new p5(function(p) {
    p.setup = function() {
      let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent(document.body);
      canvas.style('position', 'fixed');
      canvas.style('top', '0');
      canvas.style('left', '0');
      canvas.style('z-index', '-1');
      canvas.style('width', '100vw');
      canvas.style('height', '100vh');

      bgColor = p.color(138, 43, 226); // Violet
      p.background(bgColor);
      p.strokeWeight(1);
      p.noFill();
    };

    p.draw = function() {
      p.background(bgColor, 20);

      if (points.length > 1) {
        p.beginShape();
        for (let i = 0; i < points.length; i++) {
          let pt = points[i];
          p.stroke(0, 255, 255, 150 - i * 2);
          p.curveVertex(pt.x, pt.y);
        }
        p.endShape();
      }

      for (let pt of points) {
        for (let j = 0; j < brushDensity; j++) {
          let offsetX = p.random(-5, 5);
          let offsetY = p.random(-5, 5);
          let alpha = p.random(30, 100);
          p.noStroke();
          p.fill(0, 255, 255, alpha);
          p.ellipse(pt.x + offsetX, pt.y + offsetY, p.random(1, 5));
        }
      }

      if (points.length > 100) {
        points.splice(0, 1);
      }
    };

    p.mouseDragged = function() {
      points.push(p.createVector(p.mouseX, p.mouseY));
    };

    p.mousePressed = function() {
      for (let i = 0; i < 50; i++) {
        let offsetX = p.random(-10, 10);
        let offsetY = p.random(-10, 10);
        p.noStroke();
        p.fill(0, 255, 255, p.random(100, 200));
        p.ellipse(p.mouseX + offsetX, p.mouseY + offsetY, p.random(3, 8));
      }
    };

    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  });
}

// bg3 sketch code
function initGradientBackground() {
  let A = 20;
  let gradientTightness = 200;

  gradientSketch = new p5(function(p) {
    p.setup = function() {
      let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent(document.body);
      canvas.style('position', 'fixed');
      canvas.style('top', '0');
      canvas.style('left', '0');
      canvas.style('z-index', '-1');
      canvas.style('width', '100vw');
      canvas.style('height', '100vh');

      p.noStroke();
    };

    p.draw = function() {
      p.background(0);

      for (let i = 0; i < p.width; i += A) {
        for (let n = 0; n < p.height; n += A) {
          let d = p.dist(i, n, p.mouseX, p.mouseY);

          let c = p.map(d, 0, gradientTightness, 0, 255);
          c = p.constrain(c, 0, 255);

          p.fill(c, 100, 255 - c);
          p.rect(i, n, A, A);
        }
      }
    };

    p.mousePressed = function() {
      gradientTightness = p.random(50, 600);
    };

    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  });
}
