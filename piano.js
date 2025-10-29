let osc;
let env;
let notes = [261.63, 293.66, 329.63, 392.0, 440.0, 493.88, 523.25];
let currentFreq;

function setup() {
  createCanvas(400, 400);
  osc = new p5.Oscillator('sine');
  env = new p5.Envelope();
  osc.amp(0);
  userStartAudio();
}

function draw() {
  background(220);
  for (let i = 0; i < notes.length; i++) {
    let x = i * (width / notes.length);
    let c = map(notes[i], 261, 523, 0, 255);
    fill(c, 100, 200);
    rect(x, 0, width / notes.length, height);

    if (mouseX > x && mouseX < x + width / notes.length) {
      currentFreq = notes[i];
      fill(255);
      rect(x, 0, width / notes.length, height);
    }
  }
}

function mousePressed() {
  osc.freq(currentFreq);
  osc.start();
  env.ramp(osc, 0, 1, 0);
}
