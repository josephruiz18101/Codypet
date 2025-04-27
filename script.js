// File: script.js

let happiness = parseInt(localStorage.getItem('happiness')) || 50;
let timeoutID;

function updateHappiness(change) {
    happiness = Math.max(0, Math.min(100, happiness + change));
    document.getElementById('happinessBar').value = happiness;
    localStorage.setItem('happiness', happiness); // <<<<< SAVE it back

    // Mood check based on happiness level
    if (happiness >= 80) {
        document.getElementById('responseText').textContent = "Cody is very happy! 😄";
    } else if (happiness <= 20) {
        document.getElementById('responseText').textContent = "Cody looks grumpy 😠";
    }
}

function changeCody(imagePath, text, effect = null) {
    clearTimeout(timeoutID);
    const cody = document.getElementById('codyImage');

    cody.src = imagePath;
    document.getElementById('responseText').textContent = text;

    if (effect) {
        cody.classList.add(effect);
    }

    timeoutID = setTimeout(() => {
        cody.src = "assets/images/default.png";
        document.getElementById('responseText').textContent = "Cody is chilling...";
        if (effect) {
            cody.classList.remove(effect);
        }
    }, 5000);
}

function feedCody() {
    changeCody("assets/images/feed.png", "I Love Sonic", "bounce");
    updateHappiness(5);
    stats.feedCount++;
    saveAchievements();   // <<<<< Add this line
    checkAchievements();
}

function giveDrink() {
    changeCody("assets/images/drink.png", "Dr.Pepper Joseph's a scrub", "bounce");
    updateHappiness(5);
    stats.drinkCount++;
    saveAchievements();   // <<<<< Add this line
    checkAchievements();
}


function goToInteract() {
    window.location.href = "interact.html";
}

function playWithCody() {
    window.location.href = "play.html"; // Mini-game page
}
// Achievements tracking
let achievements = {
    masterChef: false,
    hydrationHero: false,
    troublemaker: false,
    comedyKing: false,
    bestFriend: false
};

let stats = {
    feedCount: 0,
    drinkCount: 0,
    annoyCount: 0,
    laughCount: 0
};

// Save to LocalStorage
function saveAchievements() {
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('stats', JSON.stringify(stats));
}

// Load from LocalStorage
function loadAchievements() {
    const savedAchievements = JSON.parse(localStorage.getItem('achievements'));
    const savedStats = JSON.parse(localStorage.getItem('stats'));

    if (savedAchievements) achievements = savedAchievements;
    if (savedStats) stats = savedStats;
}

// Show Achievement Unlock
function showAchievement(name) {
    alert("🏆 Achievement Unlocked: " + name);
}

// Check Achievement Unlocks
function checkAchievements() {
    if (!achievements.masterChef && stats.feedCount >= 10) {
        achievements.masterChef = true;
        showAchievement("Master Chef");
    }
    if (!achievements.hydrationHero && stats.drinkCount >= 10) {
        achievements.hydrationHero = true;
        showAchievement("Hydration Hero");
    }
    if (!achievements.troublemaker && stats.annoyCount >= 5) {
        achievements.troublemaker = true;
        showAchievement("Troublemaker");
    }
    if (!achievements.comedyKing && stats.laughCount >= 5) {
        achievements.comedyKing = true;
        showAchievement("Comedy King");
    }

    // ⭐️ Fix Best Friend Check ⭐️
    const currentHappiness = parseInt(localStorage.getItem('happiness')) || 50;
    if (!achievements.bestFriend && currentHappiness >= 100) {
        achievements.bestFriend = true;
        showAchievement("Best Friend ❤️");
        unlockPlayButton();
    }

    saveAchievements();
}

function unlockPlayButton() {
    const buttonArea = document.querySelector(".buttons");
    const playButton = document.createElement('button');
    playButton.textContent = "Play with Cody";
    playButton.onclick = playWithCody;
    buttonArea.appendChild(playButton);
  }
  // Initialize
loadAchievements();
document.getElementById('happinessBar').value = happiness;
checkAchievements();
