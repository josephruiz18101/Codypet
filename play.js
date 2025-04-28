// File: play.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let imagesLoaded = 0;
let gameStarted = false;

// Load assets
const codySprite = new Image();
codySprite.src = 'assets/images/codysprite.png';
codySprite.onload = imageLoaded;

const milkshakeImg = new Image();
milkshakeImg.src = 'assets/images/milkshake.png';
milkshakeImg.onload = imageLoaded;

const cloudsImg = new Image();
cloudsImg.src = 'assets/images/clouds.png';
cloudsImg.onload = imageLoaded;

const sonicDrinkImg = new Image();
sonicDrinkImg.src = 'assets/images/sonicdrink.png';
sonicDrinkImg.onload = imageLoaded;

const burgerImg = new Image();
burgerImg.src = 'assets/images/burger.png';
burgerImg.onload = imageLoaded;

// Load sounds
const jumpSound = new Audio('assets/sounds/jump.mp3');
jumpSound.volume = 0.5;
const crashSound = new Audio('assets/sounds/crash.mp3');
crashSound.volume = 0.5;
// Load background music
const bgMusic = new Audio('assets/sounds/music.mp3');
bgMusic.volume = 0.5;
bgMusic.loop = true;

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 5) {
    gameLoop();
  }
}
let achievements = {
  speedDemon: false,
  jumpMaster: false,
  obstacleDodger: false,
  unstoppable: false
};

// Variables
let jumpCount = 0;
let obstaclesDodged = 0;
let drinks = [];
let drinksCollected = 0;
let extraLives = 0;
let skyX = 0;
const skySpeed = 0.5;
let backgroundX = 0;
const backgroundSpeed = 2;
let frames = 0;
let score = 0;
let gameOver = false;
const gravity = 1;

let cody = {
  x: 30,
  y: 210,
  width: 64,
  height: 96,
  frameX: 0,
  frameY: 0,
  vy: 0,
  jumping: false,
  frameCount: 0
};

let obstacles = [];

// Controls

// Helper function to handle jump
function tryJump() {
  if (!gameStarted) {
    gameStarted = true;
    if (bgMusic.paused) {
      bgMusic.play(); // Play music only once at start
    }
  } else if (!cody.jumping && !gameOver) {
    cody.vy = -15;
    cody.jumping = true;
    jumpSound.currentTime = 0;
    jumpSound.play();
    jumpCount++;
  }
}

// Spacebar for desktop
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    tryJump();
  }
});

// Touch for mobile
document.addEventListener('touchstart', function(e) {
  tryJump();
});


// Create functions
function createObstacle() {
  obstacles.push({ x: 300, y: 237, width: 20, height: 50 });
}
function createDrink() {
  const type = Math.random() < 0.5 ? 'drink' : 'burger'; // 50% chance
  drinks.push({ x: 300, y: Math.random() * 50 + 100, width: 30, height: 30, type: type });
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw sky
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(cloudsImg, skyX, 0, 600, 200);
  ctx.drawImage(cloudsImg, skyX + 600, 0, 600, 200);

  skyX -= skySpeed;
  if (skyX <= -600) skyX = 0;

  // Draw ground
  ctx.fillStyle = '#228B22';
  ctx.fillRect(backgroundX, 270, 600, 50);
  ctx.fillRect(backgroundX + 600, 270, 600, 50);

  backgroundX -= backgroundSpeed;
  if (backgroundX <= -600) backgroundX = 0;


 // Draw drinks
drinks.forEach(drink => {
  if (drink.type === 'drink') {
    ctx.drawImage(sonicDrinkImg, drink.x, drink.y, drink.width, drink.height);
  } else {
    ctx.drawImage(burgerImg, drink.x - 5, drink.y - 5, drink.width + 10, drink.height + 10);
  }
});

  

  // Draw Cody
  ctx.drawImage(
    codySprite,
    cody.frameX * 66,
    0,
    60,
    105,
    cody.x,
    cody.y,
    70,
    96
  );

  // Draw obstacles
  obstacles.forEach(obs => {
    ctx.drawImage(milkshakeImg, obs.x, obs.y, obs.width, obs.height);
  });
  if (!gameStarted) {
    ctx.fillStyle = "black";
    ctx.font = "20px Courier New";
    ctx.fillText("Press SPACE to Start", 50, 150);
  }
}

// Update everything
function update() {
  if (!gameStarted) return; // <<< Do nothing if game not started
  cody.vy += gravity;
  cody.y += cody.vy;

  const groundLevel = 191;
  if (cody.y >= groundLevel) {
    cody.y = groundLevel;
    cody.vy = 0;
    cody.jumping = false;
  }

  // Animate Cody
  cody.frameCount++;
  if (cody.frameCount % 10 === 0) {
    cody.frameX = (cody.frameX + 1) % 4;
  }

  // Move obstacles
  obstacles.forEach(obs => { obs.x -= 5; });

  obstacles.forEach((obs, index) => {
    if (obs.x + obs.width < 0) {
      obstaclesDodged++;
      obstacles.splice(index, 1);
    }
  });

  // Move drinks
  drinks.forEach(drink => { drink.x -= 3; });

  // Check drink collection
  drinks.forEach((drink, index) => {
    if (
      cody.x < drink.x + drink.width &&
      cody.x + cody.width > drink.x &&
      cody.y < drink.y + drink.height &&
      cody.y + cody.height > drink.y
    ) {
      drinksCollected++;
      drinks.splice(index, 1);

      if (drinksCollected >= 100) {
        extraLives++;
        drinksCollected = 0;
        console.log("🎉 Extra Life Earned! Total Extra Lives: " + extraLives);
      }
    }
  });

  // Remove offscreen drinks
  drinks = drinks.filter(drink => drink.x + drink.width > 0);

  // Spawn drinks and obstacles
  if (frames % 90 === 0) createObstacle();
  if (frames % 120 === 0) createDrink();

  if (!gameOver) {
    frames++;
    if (frames % 60 === 0) score++;
  }

  // Collision detection
  const codyHitbox = {
    x: cody.x + 10,
    y: cody.y + 10,
    width: 50,
    height: 80
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
}
function checkAchievements() {
  if (!achievements.speedDemon && score >= 20) {
    achievements.speedDemon = true;
    alert("🏆 Achievement Unlocked: Speed Demon!");
  }

  if (!achievements.jumpMaster && jumpCount >= 50) {
    achievements.jumpMaster = true;
    alert("🏆 Achievement Unlocked: Jump Master!");
  }

  if (!achievements.obstacleDodger && obstaclesDodged >= 10) {
    achievements.obstacleDodger = true;
    alert("🏆 Achievement Unlocked: Obstacle Dodger!");
  }

  if (!achievements.unstoppable && score >= 30) {
    achievements.unstoppable = true;
    alert("🏆 Achievement Unlocked: Unstoppable!");
  }

  saveAchievements();
}
function saveAchievements() {
  localStorage.setItem('codyAchievements', JSON.stringify(achievements));
}

function loadAchievements() {
  const saved = JSON.parse(localStorage.getItem('codyAchievements'));
  if (saved) achievements = saved;
}

// Game loop
function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  gameOver = true;
  crashSound.play();
  bgMusic.pause();
  document.getElementById('gameMessage').textContent = `Game Over! Score: ${score}`;
  
  // Show Restart button
  document.getElementById('restartButton').style.display = 'inline-block';

  checkAchievements();

  if (score >= 10) {
    let happiness = parseInt(localStorage.getItem('happiness')) || 50;
    happiness = Math.min(100, happiness + 10);
    localStorage.setItem('happiness', happiness);

    document.getElementById('gameMessage').textContent += " 🎉 +10 Happiness!";
  }
}

loadAchievements();
function restartGame() {
  window.location.reload();
}

function goHome()
 {
  window.location.href = "index.html";
}