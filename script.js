const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Image Loading
const circleImage = new Image();
circleImage.src = "circle.png";

const backgroundImage = new Image();
backgroundImage.src = "background.jpg";

const brickImage = new Image();
brickImage.src = "brick.jpg";

// Circle (Player)
let circleX = canvas.width / 2;
const circleRadius = 30;

// Mouse Tracking
canvas.addEventListener("mousemove", (event) => {
  circleX = event.clientX - canvas.offsetLeft;
});

// Lasers
const lasers = [];
const laserWidth = 5; // Increased width
const laserHeight = 15; // Increased height

canvas.addEventListener("click", () => {
  lasers.push({
    x: circleX,
    y: canvas.height - circleRadius,
  });
});

// Scorekeeping
let score = 0;

// Bricks
const numBrickRows = 4;
const bricksPerRow = 8;
const brickWidth = 40;
const brickHeight = 20;
const brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
const bricks = [];

function calculateBrickOffsets() {
  brickOffsetLeft = (canvas.width - (bricksPerRow * brickWidth + (bricksPerRow - 1) * brickPadding)) / 2;
  brickOffsetTop = 30; // You can adjust the top offset as desired
}

// Calculate offsets before creating bricks (Do this once)
calculateBrickOffsets();

for (let row = 0; row < numBrickRows; row++) {
  bricks[row] = [];
  for (let col = 0; col < bricksPerRow; col++) {
    bricks[row][col] = {
      x: col * (brickWidth + brickPadding) + brickOffsetLeft,
      y: row * (brickHeight + brickPadding) + brickOffsetTop,
      status: 1, // 1 = brick exists
    };
  }
}

// Collision Detection and Updates
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Draw the background

  // Temporary placeholders instead of images
  drawCircle();
  drawLasers();
  drawBricks();

  // Update lasers (includes collision)
  lasers.forEach((laser, laserIndex) => {
    laser.y -= 5;

    // Brick Collision
    for (let row = 0; row < numBrickRows; row++) {
      for (let col = 0; col < bricksPerRow; col++) {
        const brick = bricks[row][col];
        if (brick.status === 1) {
          const brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = row * (brickHeight + brickPadding) + brickOffsetTop;

          // Adjust collision check by the offset
          if (
            laser.x > brickX - brickOffsetLeft &&
            laser.x < brickX - brickOffsetLeft + brickWidth &&
            laser.y > brickY - brickOffsetTop &&
            laser.y < brickY - brickOffsetTop + brickHeight
          ) {
            brick.status = 0; // Mark brick as broken
            lasers.splice(laserIndex, 1); // Remove laser
            createParticles(brick.x, brick.y);
            score += 10; // Increment score when a brick is destroyed
          }
        }
      }
    }
  });

  // Update and draw particles
  particles.forEach((particle, index) => {
    particle.x += particle.velocity.x;
    particle.y += particle.velocity.y;
    particle.radius = Math.max(0.1, particle.radius - 0.1);

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();
    ctx.closePath();

    // Remove faded particles
    if (particle.radius <= 0) {
      particles.splice(index, 1);
    }
  });

  // Draw the Score
  ctx.font = "24px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 20, 40);

  requestAnimationFrame(gameLoop);
}

// Drawing Functions
// Drawing Functions
function drawCircle() {
  ctx.drawImage(circleImage, circleX - circleImage.width / 2, canvas.height - circleImage.height);
}

function drawLasers() {
  lasers.forEach((laser, index) => {
    ctx.fillStyle = "red";
    ctx.fillRect(laser.x, laser.y, laserWidth, laserHeight); // Use the new width and height
    laser.y -= 5; // Laser moves up

    // Remove lasers off-screen
    if (laser.y < 0) {
      lasers.splice(index, 1);
    }
  });
}

function drawBricks() {
  for (let row = 0; row < numBrickRows; row++) {
    for (let col = 0; col < bricksPerRow; col++) {
      if (bricks[row][col].status === 1) {
        const brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = row * (brickHeight + brickPadding) + brickOffsetTop;

        // Adjusted positioning
        const relativeX = brickX / canvas.width;
        const relativeY = brickY / canvas.height;
        ctx.drawImage(brickImage, relativeX * canvas.width, relativeY * canvas.height, brickWidth, brickHeight);
      }
    }
  }
}

// Simple Particle System
const particles = [];

function createParticles(x, y) {
  const numParticles = 5;
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: x,
      y: y,
      radius: Math.random() * 3 + 2, // Varying size
      color: "yellow",
      velocity: {
        x: (Math.random() - 0.5) * 3, // Random horizontal direction
        y: -Math.random() * 3, // Particles move upward
      },
    });
  }
}

// Ensure images are loaded before starting the game loop
circleImage.onload =
  backgroundImage.onload =
  brickImage.onload =
    function () {
      gameLoop();
    };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  calculateBrickOffsets(); // Recalculate when the canvas resizes
}

// Call on load and when the window is resized
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);
