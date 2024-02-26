const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Circle (Player)
let circleX = canvas.width / 2;
const circleRadius = 10;

// Mouse Tracking
canvas.addEventListener("mousemove", (event) => {
  circleX = event.clientX - canvas.offsetLeft;
});

// Lasers
const lasers = [];

canvas.addEventListener("click", () => {
  lasers.push({
    x: circleX,
    y: canvas.height - circleRadius,
  });
});

// Bricks
const numBrickRows = 4;
const bricksPerRow = 8;
const brickWidth = 40;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];

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
          if (
            laser.x > brick.x &&
            laser.x < brick.x + brickWidth &&
            laser.y > brick.y &&
            laser.y < brick.y + brickHeight
          ) {
            brick.status = 0; // Mark brick as broken
            lasers.splice(laserIndex, 1); // Remove laser
            createParticles(brick.x, brick.y);
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

  requestAnimationFrame(gameLoop);
}

// Drawing Functions
function drawCircle() {
  ctx.beginPath();
  ctx.arc(circleX, canvas.height - circleRadius, circleRadius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function drawLasers() {
  lasers.forEach((laser, index) => {
    ctx.fillStyle = "red";
    ctx.fillRect(laser.x, laser.y, 2, 10);
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
        const brickX = bricks[row][col].x;
        const brickY = bricks[row][col].y;
        ctx.fillStyle = "green"; // Brick color
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
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

gameLoop(); // Start the game loop

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Call on load and when the window is resized
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);
