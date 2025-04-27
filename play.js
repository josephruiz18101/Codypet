// File: play.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load Cody sprite sheet
const codySprite = new Image();
codySprite.src = 'assets/images/codysprite.png'; // <- Your uploaded sprite path
// Load jump sound
const jumpSound = new Audio('assets/sounds/jump.mp3');
jumpSound.volume = 0.5;
// Load crash sound
const crashSound = new Audio('assets/sounds/crash.mp3');
crashSound.volume = 0.5;

// Cody object
let cody = {
    x: 30,
    y: 210, // move Cody up a little (40px higher)
    width: 64,
    height: 96, // same frame height
    frameX: 0,
    frameY: 0,
    vy: 0,
    jumping: false,
    frameCount: 0
  };
  

let obstacles = [];
let frames = 0;
let score = 0;
let gameOver = false;

// Gravity
const gravity = 1;

// Controls
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !cody.jumping) {
      cody.vy = -15;
      cody.jumping = true;
      jumpSound.currentTime = 0; // <<<<< Reset sound to start
      jumpSound.play(); // << Play jump sound!
    }
  });
  

// Create obstacles
function createObstacle() {
  obstacles.push({ x: 300, y: 260, width: 20, height: 40 });
}

// Draw everything

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    ctx.drawImage(
      codySprite,
      cody.frameX * 66, // source x
      0,                // source y
      60,               // source width
      105,               // source height (grab full Cody body)
      cody.x,            // destination x
      cody.y,            // destination y
      70,                // draw width
      96                 // draw height
    );
  
    // Draw obstacles
    ctx.fillStyle = 'red';
    obstacles.forEach(obs => {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
  }
  
  
  

// Update positions
function update() {
  cody.vy += gravity;
  cody.y += cody.vy;

  // Floor collision
  const groundLevel = 191; // adjust for Cody body

if (cody.y >= groundLevel) {
  cody.y = groundLevel;
  cody.vy = 0;
  cody.jumping = false;
}


  // Animate Cody (cycle frames)
  cody.frameCount++;
  if (cody.frameCount % 10 === 0) {
    cody.frameX = (cody.frameX + 1) % 4; // 4 frames for running
  }

  // Move obstacles
  obstacles.forEach(obs => {
    obs.x -= 5;
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // Collision detection
    const codyHitbox = {
        x: cody.x + 10,
        y: cody.y + 10,
        width: 50, // update this
        height: 80 // update this
      };
      
      obstacles.forEach(obs => {
        if (
          codyHitbox.x < obs.x + obs.width &&
          codyHitbox.x + codyHitbox.width > obs.x &&
          codyHitbox.y < obs.y + obs.height &&
          codyHitbox.y + codyHitbox.height > obs.y
        ) {
          endGame();
        }
      });
      

  // Every 90 frames (~1.5s) create new obstacle
  if (frames % 90 === 0) {
    createObstacle();
  }

  // Update score
  if (!gameOver) {
    frames++;
    if (frames % 60 === 0) {
      score++;
    }
  }
}

// Game Loop
function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// End Game
function endGame() {
  gameOver = true;
  crashSound.play(); // <<<<< Play crash sound!
  document.getElementById('gameMessage').textContent = `Game Over! Score: ${score}`;

  if (score >= 10) {
    let happiness = parseInt(localStorage.getItem('happiness')) || 50;
    happiness = Math.min(100, happiness + 10);
    localStorage.setItem('happiness', happiness);

    document.getElementById('gameMessage').textContent += " 🎉 +10 Happiness!";
  }
}

// Go back to Cody Pet
function goHome() {
  window.location.href = "index.html";
}

// Start game after sprite loads
codySprite.onload = function() {
  gameLoop();
};
