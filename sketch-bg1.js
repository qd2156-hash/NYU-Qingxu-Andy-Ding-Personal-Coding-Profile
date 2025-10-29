//////////////////////////////////////////////////
// Dual canvas system: Brush effects + NYU text curves
// Brush layer uses global mode, text layer uses instance mode

let palette = ["#2c695a", "#4ad6af", "#7facc6", "#4e93cc", "#f6684f", "#ffd300"]

// ===== BRUSH CANVAS (WEBGL, bottom layer - GLOBAL MODE) =====
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.id('brushCanvas');
    canvas.class('canvas-layer');
    angleMode(DEGREES);
    background("#fffceb");

    // Scale brushes to adapt to canvas size
    brush.scaleBrushes(1.5);

    // Activate the flowfield
    brush.field("seabed");

    // Initialize text canvas after brush canvas is ready
    setTimeout(() => {
        new p5(textSketch);
    }, 100);
}

function draw() {
    frameRate(10);
    translate(-width/2, -height/2);

    // Draw random flowLines
    let available_brushes = brush.box();

    brush.set(random(available_brushes), random(palette), 1);
    brush.flowLine(random(width), random(height), random(300,800), random(0,360));

    brush.set(random(available_brushes), random(palette), 1);
    brush.flowLine(random(width), random(height), random(300,800), random(0,360));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// ===== TEXT CANVAS (2D, top layer - INSTANCE MODE) =====
let textSketch = function(p) {
    let textSize_nyu = 18;
    let nyuLines = [];
    let maxLines = 40;
    let purpleColor = "#8B5FBF"; // Fixed purple color for all NYU text

    p.setup = function() {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.id('textCanvas');
        canvas.class('canvas-layer');
        p.angleMode(p.DEGREES);
        p.clear(); // Transparent background

        p.textFont('Arial');
        p.textStyle(p.BOLD);
        p.textSize(textSize_nyu);
        p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = function() {
        // Keep canvas transparent to see brush layer below
        p.clear();

        // Add new curved lines
        if (p.frameCount % 3 == 0 && nyuLines.length < maxLines) {
            nyuLines.push(createCurvedNYULine(p, textSize_nyu, purpleColor));
        }

        // Update and draw all lines
        for (let i = nyuLines.length - 1; i >= 0; i--) {
            let line = nyuLines[i];
            line.update();
            line.display(p);

            // Remove faded out lines
            if (line.alpha <= 0) {
                nyuLines.splice(i, 1);
            }
        }
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

// ===== HELPER FUNCTIONS =====
function createCurvedNYULine(p, textSize_nyu, color) {
    return {
        points: generateCurvePoints(p),
        color: color,
        alpha: 0,
        maxAlpha: p.random(150, 255),
        age: 0,
        lifespan: p.random(180, 300),
        textPositions: [],

        init: function() {
            let totalLength = 0;
            for (let i = 0; i < this.points.length - 1; i++) {
                totalLength += p.dist(
                    this.points[i].x, this.points[i].y,
                    this.points[i + 1].x, this.points[i + 1].y
                );
            }

            let spacing = textSize_nyu * 1.5;
            let numTexts = p.int(totalLength / spacing);

            for (let i = 0; i <= numTexts; i++) {
                let targetDist = i * spacing;
                let pos = this.getPointAtDistance(targetDist);
                if (pos) {
                    this.textPositions.push({
                        x: pos.x,
                        y: pos.y,
                        angle: pos.angle,
                        offset: p.random(-3, 3),
                        phase: p.random(p.TWO_PI)
                    });
                }
            }
        },

        getPointAtDistance: function(targetDist) {
            let currentDist = 0;
            for (let i = 0; i < this.points.length - 1; i++) {
                let p1 = this.points[i];
                let p2 = this.points[i + 1];
                let segmentLength = p.dist(p1.x, p1.y, p2.x, p2.y);

                if (currentDist + segmentLength >= targetDist) {
                    let t = (targetDist - currentDist) / segmentLength;
                    let x = p.lerp(p1.x, p2.x, t);
                    let y = p.lerp(p1.y, p2.y, t);
                    let angle = p.atan2(p2.y - p1.y, p2.x - p1.x);
                    return { x: x, y: y, angle: angle };
                }
                currentDist += segmentLength;
            }
            return null;
        },

        update: function() {
            this.age++;

            if (this.age < 30) {
                this.alpha = p.map(this.age, 0, 30, 0, this.maxAlpha);
            } else if (this.age > this.lifespan - 60) {
                this.alpha = p.map(this.age, this.lifespan - 60, this.lifespan, this.maxAlpha, 0);
            } else {
                this.alpha = this.maxAlpha;
            }

            if (this.age == 1) {
                this.init();
            }
        },

        display: function(p) {
            if (this.textPositions.length == 0) return;

            for (let i = 0; i < this.textPositions.length; i++) {
                let pos = this.textPositions[i];

                let wave = p.sin(this.age * 3 + pos.phase) * 2;
                let scaleEffect = 1 + p.sin(this.age * 2 + pos.phase) * 0.1;

                p.push();
                p.translate(pos.x, pos.y + wave);
                p.rotate(pos.angle + pos.offset * 0.1);
                p.scale(scaleEffect);

                let c = p.color(this.color);
                p.fill(p.red(c), p.green(c), p.blue(c), this.alpha);
                p.stroke(p.red(c), p.green(c), p.blue(c), this.alpha * 0.5);
                p.strokeWeight(0.5);

                p.text("NYU", 0, 0);
                p.pop();
            }
        }
    };
}

function generateCurvePoints(p) {
    let points = [];

    let startX = p.random(p.width * 0.1, p.width * 0.9);
    let startY = p.random(p.height * 0.1, p.height * 0.9);

    let numControlPoints = p.int(p.random(3, 6));
    let controlPoints = [{x: startX, y: startY}];

    for (let i = 1; i < numControlPoints; i++) {
        let prevPoint = controlPoints[i - 1];
        let angle = p.random(360);
        let distance = p.random(100, 300);

        controlPoints.push({
            x: prevPoint.x + p.cos(angle) * distance,
            y: prevPoint.y + p.sin(angle) * distance
        });
    }

    for (let i = 0; i < controlPoints.length - 1; i++) {
        let p0 = controlPoints[p.max(0, i - 1)];
        let p1 = controlPoints[i];
        let p2 = controlPoints[i + 1];
        let p3 = controlPoints[p.min(controlPoints.length - 1, i + 2)];

        for (let t = 0; t <= 1; t += 0.05) {
            let x = catmullRomInterpolate(p0.x, p1.x, p2.x, p3.x, t);
            let y = catmullRomInterpolate(p0.y, p1.y, p2.y, p3.y, t);
            points.push({x: x, y: y});
        }
    }

    return points;
}

// Renamed to avoid conflict with p5.js built-in curvePoint
function catmullRomInterpolate(p0, p1, p2, p3, t) {
    let v0 = (p2 - p0) * 0.5;
    let v1 = (p3 - p1) * 0.5;
    let t2 = t * t;
    let t3 = t * t2;
    return (2 * p1 - 2 * p2 + v0 + v1) * t3 +
           (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
           v0 * t + p1;
}
