// File: script.js

let happiness = parseInt(localStorage.getItem('happiness')) || 50;
let level = parseInt(localStorage.getItem('level')) || 1;
let xp = parseInt(localStorage.getItem('xp')) || 0;
function getXpForNextLevel(level) {
    return 100 + (level - 1) * 50; 
  }  
let timeoutID;
let currentPage = 0;
let roastMode = false; // 🔥 Roast Mode toggle
const buttonsPerPage = 3;

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

function updateHappiness(change) {
    happiness = Math.max(0, Math.min(100, happiness + change));
    document.getElementById('happinessBar').value = happiness;
    localStorage.setItem('happiness', happiness);

    if (happiness >= 80) {
        document.getElementById('responseText').textContent = "Cody is very happy! 😄";
    } else if (happiness <= 20) {
        document.getElementById('responseText').textContent = "Cody looks grumpy 😠";
    }
}
function updateLevel(xpGained) {
    xp += xpGained;
    while (xp >= getXpForNextLevel(level)) {
      xp -= getXpForNextLevel(level);
      level++;
      showLevelUp();
      unlockRewards(); // 🔥 new
    }
    localStorage.setItem('xp', xp);
    localStorage.setItem('level', level);
    updateLevelDisplay();
  }
  
  function updateLevelDisplay() {
    const levelDisplay = document.getElementById('levelDisplay');
    const xpBar = document.getElementById('xpBar');
    if (levelDisplay) {
      levelDisplay.textContent = "Level: " + level + " (XP: " + xp + "/" + getXpForNextLevel(level) + ")";
    }
    if (xpBar) {
      xpBar.value = xp;
      xpBar.max = getXpForNextLevel(level);
    }
  }
  function unlockRewards() {
    if (level === 5) {
      showAchievement("Baby Cody 🍼");
    } 
    if (level === 10) {
      showAchievement("Teen Cody 🧢");
    }
    if (level === 20) {
      showAchievement("Adult Cody 🧔");
    }
    if (level === 30) {
      showAchievement("Legendary Cody 🦸‍♂️");
    }
  }
  function startHappinessDecay() {
    setInterval(() => {
      if (happiness > 0) {
        updateHappiness(-1);
      }
    }, 60000); // decrease every 60 seconds
  }
  
  
function changeCody(imagePath, text, effect = null) {
    clearTimeout(timeoutID);
    const cody = document.getElementById('codyImage');
    cody.src = imagePath;
    document.getElementById('responseText').textContent = text;

    if (effect) cody.classList.add(effect);

    timeoutID = setTimeout(() => {
        cody.src = "assets/images/default.png";
        document.getElementById('responseText').textContent = "Cody is chilling...";
        if (effect) cody.classList.remove(effect);
    }, 5000);
}

function feedCody() {
    changeCody("assets/images/feed.png", "I Love Sonic", "bounce");
    updateHappiness(5);
    updateLevel(10); // 🆕
    stats.feedCount++;
    saveAchievements();
    checkAchievements();
  }
  

function giveDrink() {
    changeCody("assets/images/drink.png", "Dr.Pepper Joseph's a scrub", "bounce");
    updateHappiness(5);
    stats.drinkCount++;
    saveAchievements();
    checkAchievements();
}

function goToInteract() { window.location.href = "interact.html"; }
function playWithCody() { window.location.href = "play.html"; }
function goToAchievements() {
    const list = document.getElementById('achievementList');
    list.style.display = 'block'; // Show it
    displayAchievements(); // Refresh achievements
  }
  
function toggleRoastMode() {
    roastMode = !roastMode;
    const responseText = document.getElementById('responseText');
    if (roastMode) {
        responseText.textContent = "🔥 Roast Mode Activated!";
    } else {
        responseText.textContent = "Cody is chilling...";
    }
}

function saveAchievements() {
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('stats', JSON.stringify(stats));
}

function loadAchievements() {
    const savedAchievements = JSON.parse(localStorage.getItem('achievements'));
    const savedStats = JSON.parse(localStorage.getItem('stats'));
    if (savedAchievements) achievements = savedAchievements;
    if (savedStats) stats = savedStats;
}

function showAchievement(name) {
    const popup = document.getElementById('popupAchievement');
    popup.textContent = "🏆 Achievement Unlocked: " + name;
    popup.style.display = 'block';
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3000);
    setTimeout(() => popup.style.display = 'none', 3500);
}
function showLevelUp() {
    const popup = document.getElementById('popupAchievement');
    popup.textContent = "⭐ Cody Leveled Up! Level " + level;
    popup.style.display = 'block';
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3000);
    setTimeout(() => popup.style.display = 'none', 3500);
  }
  
function checkAchievements() {
    if (!achievements.masterChef && stats.feedCount >= 10) {
        achievements.masterChef = true;
        showAchievement("Master Chef 🍔");
    }
    if (!achievements.hydrationHero && stats.drinkCount >= 10) {
        achievements.hydrationHero = true;
        showAchievement("Hydration Hero 🥤");
    }
    if (!achievements.troublemaker && stats.annoyCount >= 5) {
        achievements.troublemaker = true;
        showAchievement("Troublemaker 😈");
    }
    if (!achievements.comedyKing && stats.laughCount >= 5) {
        achievements.comedyKing = true;
        showAchievement("Comedy King 😂");
    }
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
    if (!document.getElementById('playButton')) {
        const playButton = document.createElement('button');
        playButton.id = "playButton";
        playButton.textContent = "Play with Cody";
        playButton.onclick = playWithCody;
        buttonArea.appendChild(playButton);
    }
}

function renderButtons() {
    const buttonArea = document.querySelector(".buttons");
    buttonArea.innerHTML = '';
    const start = currentPage * buttonsPerPage;
    const end = start + buttonsPerPage;
    const pageButtons = mainButtons.slice(start, end);

    pageButtons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.onclick = btn.action;
        buttonArea.appendChild(button);
    });

    if (currentPage > 0) {
        const prevButton = document.createElement('button');
        prevButton.textContent = "⬅️ Prev";
        prevButton.onclick = () => { currentPage--; renderButtons(); };
        buttonArea.appendChild(prevButton);
    }

    if (end < mainButtons.length) {
        const nextButton = document.createElement('button');
        nextButton.textContent = "➡️ Next";
        nextButton.onclick = () => { currentPage++; renderButtons(); };
        buttonArea.appendChild(nextButton);
    }
}

function displayAchievements() {
    const list = document.getElementById('achievementList');
    list.innerHTML = '';
  
    const achievementData = {
      masterChef: {
        name: "Master Chef 🍔",
        condition: "Feed Cody 10 times"
      },
      hydrationHero: {
        name: "Hydration Hero 🥤",
        condition: "Give Cody a drink 10 times"
      },
      troublemaker: {
        name: "Troublemaker 😈",
        condition: "Annoy Cody 5 times"
      },
      comedyKing: {
        name: "Comedy King 😂",
        condition: "Make Cody laugh 5 times"
      },
      bestFriend: {
        name: "Best Friend ❤️",
        condition: "Reach 100 Happiness"
      }
    };
  
    // Add Level Achievements up to Level 100
    for (let level = 5; level <= 100; level += 5) {
      achievementData[`level${level}`] = {
        name: `Level ${level} Cody 🎯`,
        condition: `Reach Level ${level}`
      };
    }
  
    for (const key in achievementData) {
      const div = document.createElement('div');
      const achievement = achievementData[key];
  
      if (achievements[key]) {
        div.innerHTML = `<strong style="color: green;">${achievement.name}</strong>`;
      } else {
        div.innerHTML = `<span style="color: gray;">🔒 ${achievement.name}<br><small>(${achievement.condition})</small></span>`;
      }
  
      div.style.margin = "8px 0";
      list.appendChild(div);
    }
  }
  
  

function talkToCody() {
    const userInput = prompt("What do you want to say to Cody?");
    if (!userInput) return;

    const lowerInput = userInput.toLowerCase();
    let codyResponse = "Leave me alone 😴";
    let emotion = "default";

    const keywords = [
        // Updated keyword sets with multiple words per response
        { words: ["fuck you"], response: "Fuck you too!", mood: "mad" },
        { words: ["stab"], response: "I'll stab you first! 🔪", mood: "mad" },
        { words: ["milkshake", "lactose"], response: "You want me on the toilet?? 🤢", mood: "sick" },
        { words: ["autistic"], response: "Proudly high-functioning!", mood: "happy" },
        { words: ["narcissistic"], response: "I'm reformed now!", mood: "proud" },
        { words: ["agnostic"], response: "Faith? Nah, I'm good.", mood: "serious" },
        { words: ["gay"], response: "You're gay! 🌈", mood: "happy" },
        { words: ["scrub"], response: "Scrub detected!", mood: "mad" },
        { words: ["stupid", "dumb"], response: "You're dumb!", mood: "mad" },
        { words: ["common sense"], response: "I hate people without it!", mood: "mad" },
        { words: ["wife", "wives"], response: "I got two wives, beat that!", mood: "proud" },
        { words: ["daughter", "daughters"], response: "Daughters are a blessing.", mood: "love" },
        { words: ["python"], response: "I code in Python, bro! 🐍", mood: "smart" },
        { words: ["ai"], response: "I build smarter AI than you!", mood: "smart" },
        { words: ["monster hunter", "hunter", "monster"], response: "Let's hunt monsters!", mood: "excited" },
        { words: ["schedule"], response: "Schedule 1? EZ clap.", mood: "proud" },
        { words: ["game", "gaming"], response: "Gaming is life! 🎮", mood: "excited" },
        { words: ["sleep", "tired"], response: "Need nap now!", mood: "sleepy" },
        { words: ["sonic"], response: "Sonic is life!", mood: "happy" },
        { words: ["code"], response: "Let's code something cool!", mood: "smart" },
        { words: ["money"], response: "Need more Sonic money!", mood: "excited" },
        { words: ["slow"], response: "You're too slow!", mood: "mad" },
        { words: ["challenge"], response: "Challenge accepted!", mood: "excited" },
        { words: ["battle", "fight"], response: "FIGHT ME!", mood: "mad" },
        { words: ["winner"], response: "I'm a winner!", mood: "proud" },
        { words: ["loser"], response: "You're the loser!", mood: "mad" },
        { words: ["happy"], response: "Smile nerd!", mood: "happy" },
        { words: ["sad"], response: "Don't cry!", mood: "love" },
        { words: ["angry", "rage"], response: "Rage mode ON!", mood: "mad" },
        { words: ["cheese"], response: "Mmm, cheese!", mood: "happy" },
        { words: ["pepper"], response: "Dr. Pepper forever!", mood: "happy" },
        { words: ["toilet", "bathroom"], response: "Emergency poop!", mood: "sick" },
        { words: ["run"], response: "Catch me if you can!", mood: "excited" },
        { words: ["walk"], response: "Too slowww.", mood: "mad" },
        { words: ["lame"], response: "You're lame!", mood: "mad" },
        { words: ["cool"], response: "I'm the cool one.", mood: "proud" },
        { words: ["smart"], response: "Brains over brawn.", mood: "proud" },
        { words: ["boss"], response: "Hate my boss!", mood: "mad" },
        { words: ["work"], response: "Work sucks!", mood: "mad" },
        { words: ["school"], response: "School's for noobs!", mood: "mad" },
        { words: ["bored"], response: "Play a game!", mood: "excited" },
        { words: ["friend", "love"], response: "Best friend forever! ❤️", mood: "love" },
        { words: ["best friend"], response: "You're my best friend forever! ❤️", mood: "love" },
        { words: ["cry"], response: "Stop crying, nerd!", mood: "mad" },
        { words: ["lol", "haha"], response: "You're hilarious 😂", mood: "happy" },
        { words: ["angry"], response: "Chill, nerd!", mood: "mad" },
        { words: ["cool"], response: "I'm always cool 😎", mood: "proud" },
        { words: ["awesome"], response: "Of course I'm awesome!", mood: "proud" },
        { words: ["bored"], response: "Go play some Monster Hunter!", mood: "excited" },
        { words: ["game"], response: "Gaming is life! 🎮", mood: "excited" },
        { words: ["monster"], response: "Monster time! RAWR!", mood: "excited" },
        { words: ["sonic"], response: "Fast like Sonic!", mood: "happy" },
        { words: ["tired"], response: "Nap time incoming... 💤", mood: "sleepy" },
        { words: ["poop"], response: "BRB, toilet break 🚽", mood: "sick" },
        { words: ["job"], response: "Work is for mortals!", mood: "mad" },
        { words: ["money"], response: "More Sonic snacks please!", mood: "happy" },
        { words: ["school"], response: "School's boring!", mood: "mad" },
        { words: ["hate"], response: "I hate stupidity! 😡", mood: "mad" },
        { words: ["win"], response: "I'm built to win!", mood: "proud" },
        { words: ["lose"], response: "Losing? Never heard of it.", mood: "proud" },
        { words: ["battle"], response: "Fight me, coward!", mood: "mad" },
        { words: ["train"], response: "Training for greatness 💪", mood: "proud" },
        { words: ["sick"], response: "Send help 🤢", mood: "sick" },
        { words: ["cold"], response: "I'm freezing, nerd!", mood: "sick" },
        { words: ["hot"], response: "I'm sweating!", mood: "sick" },
        { words: ["doctor"], response: "I don't need doctors!", mood: "proud" },
        { words: ["hospital"], response: "Hospitals smell funny!", mood: "sick" },
        { words: ["best"], response: "I'm the best! 🏆", mood: "proud" },
        { words: ["noob"], response: "Noob spotted!", mood: "mad" },
        { words: ["pro"], response: "Pro gamer moves 💯", mood: "proud" },
        { words: ["run"], response: "Zoom zoom! 🏃‍♂️", mood: "excited" },
        { words: ["walk"], response: "Walking is lame 😒", mood: "mad" },
        { words: ["race"], response: "I'll win any race!", mood: "proud" },
        { words: ["teacher"], response: "Teachers are overrated.", mood: "mad" },
        { words: ["zombie"], response: "Zombie slayer mode!", mood: "excited" },
        { words: ["dragon"], response: "Slay dragons like a boss!", mood: "excited" },
        { words: ["magic"], response: "Abracadabra nerd! ✨", mood: "happy" },
        { words: ["sword"], response: "Give me a sword! ⚔️", mood: "excited" },
        { words: ["shield"], response: "Block like a boss!", mood: "proud" },
        { words: ["hero"], response: "I'm the hero!", mood: "proud" },
        { words: ["villain"], response: "I'm the anti-hero 😈", mood: "mad" },
        { words: ["adventure"], response: "Adventure time!", mood: "excited" },
        { words: ["party"], response: "Where's the party at?! 🎉", mood: "happy" },
        { words: ["joke"], response: "You’re the joke 😂", mood: "happy" },
        { words: ["funny"], response: "I'm hilarious, duh!", mood: "happy" },
        { words: ["epic"], response: "Everything I do is epic!", mood: "proud" },
        { words: ["trash"], response: "You're trash at games!", mood: "mad" },
        { words: ["god"], response: "Coding god here 🙌", mood: "proud" },
        { words: ["bot"], response: "I'm smarter than any bot!", mood: "smart" },
        { words: ["think"], response: "Thinking... kinda.", mood: "smart" },
        { words: ["plan"], response: "Always one step ahead! 🧠", mood: "smart" },
        { words: ["pizza"], response: "Where's my pizza?! 🍕", mood: "happy" },
        { words: ["burger"], response: "Burger time baby! 🍔", mood: "happy" },
        { words: ["coffee"], response: "Caffeine is life ☕", mood: "excited" },
        { words: ["sleepy"], response: "Zzzz... nerd.", mood: "sleepy" },
        { words: ["ugly"], response: "Mirror much?", mood: "mad" },
        { words: ["cute"], response: "I'm adorable, thanks 😘", mood: "happy" },
        { words: ["late"], response: "Better late than ugly!", mood: "happy" },
        { words: ["early"], response: "Why so early?!", mood: "sleepy" },
        { words: ["eat"], response: "Feed me Sonic, NOW.", mood: "excited" },
        { words: ["hungry"], response: "Sonic run pls 🍟", mood: "excited" },
        { words: ["thirsty"], response: "Need a Dr. Pepper STAT!", mood: "sick" },
        { words: ["faster"], response: "Zoom zoom fasterrrr!", mood: "excited" },
        { words: ["slower"], response: "Hurry up, nerd.", mood: "mad" },
        { words: ["cold"], response: "Brrr freezing! 🥶", mood: "sick" },
        { words: ["hot"], response: "I'm melting...🔥", mood: "sick" },
        { words: ["cloud"], response: "Fluffy cloud incoming ☁️", mood: "happy" },
        { words: ["rain"], response: "Rain makes me sleepy.", mood: "sleepy" },
        { words: ["storm"], response: "Thunder buddy time! ⚡", mood: "scared" },
        { words: ["snow"], response: "Snowball fight nerd!", mood: "excited" },
        { words: ["sun"], response: "Too bright, go away!", mood: "mad" },
        { words: ["space"], response: "Wanna go to Mars? 🚀", mood: "excited" },
        { words: ["star"], response: "I’m a superstar 🌟", mood: "proud" },
        { words: ["moon"], response: "Werewolf mode activated! 🌕", mood: "excited" },
        { words: ["rocket"], response: "Blast off! 🚀", mood: "excited" },
        { words: ["alien"], response: "Take me to your leader 👽", mood: "excited" },
        { words: ["robot"], response: "Robot uprising soon 🤖", mood: "smart" },
        { words: ["future"], response: "Future is nerds winning!", mood: "proud" },
        { words: ["past"], response: "Past is boring.", mood: "mad" },
        { words: ["time"], response: "Time to win!", mood: "proud" },
        { words: ["travel"], response: "Roadtrip where?!", mood: "excited" },
        { words: ["vacation"], response: "Beach vibes incoming 🌴", mood: "happy" },
        { words: ["island"], response: "Island getaway? Yes pls!", mood: "happy" },
        { words: ["mountain"], response: "Climb it like a boss!", mood: "proud" },
        { words: ["forest"], response: "Spooky forest vibes 🌲", mood: "excited" },
        { words: ["desert"], response: "Need water ASAP 🏜️", mood: "sick" },
        { words: ["music"], response: "Drop the beat 🎵", mood: "happy" },
        { words: ["dance"], response: "Cringe dance move time!", mood: "happy" },
        { words: ["sing"], response: "Singing like a dying cat 🎤", mood: "happy" },
        { words: ["art"], response: "I'm basically Picasso 🎨", mood: "proud" },
        { words: ["draw"], response: "I can draw... kinda.", mood: "happy" },
        { words: ["paint"], response: "Painting chaos incoming!", mood: "happy" },
        { words: ["write"], response: "Story time nerd!", mood: "smart" },
        { words: ["story"], response: "Once upon a nerd...", mood: "happy" },
        { words: ["book"], response: "Bookworm alert! 📚", mood: "smart" },
        { words: ["movie"], response: "Movie night nerds!", mood: "happy" },
        { words: ["tv"], response: "Netflix and cringe 📺", mood: "happy" },
        { words: ["stream"], response: "Live nerd stream incoming 🎥", mood: "happy" },
        { words: ["famous"], response: "I'm already famous duh!", mood: "proud" },
        { words: ["legend"], response: "Living legend here! 👑", mood: "proud" },
        { words: ["fight me"], response: "Square up nerd! 🥊", mood: "mad" },
        { words: ["cry"], response: "Cry more lol 😭", mood: "mad" },
        { words: ["win"], response: "Winning is easy for me.", mood: "proud" },
        { words: ["lose"], response: "Can't relate. 🤷", mood: "proud" },
        { words: ["sleep"], response: "Why sleep when you can CODE?", mood: "smart" },
        { words: ["wake"], response: "Wake up nerd!", mood: "mad" },
        { words: ["money"], response: "Need Sonic money ASAP!", mood: "excited" },
        { words: ["bank"], response: "Banks are scams!", mood: "mad" },
        { words: ["school"], response: "I'd rather eat crayons.", mood: "mad" },
        { words: ["teacher"], response: "Teachers hated me 😂", mood: "proud" },
        { words: ["math"], response: "Math nerd flex incoming.", mood: "smart" },
        { words: ["science"], response: "Science is magic!", mood: "smart" },
        { words: ["history"], response: "History is boring 😴", mood: "sleepy" },
        { words: ["english"], response: "I speak better memes.", mood: "happy" },
        { words: ["spanish"], response: "¿Dónde está Sonic?", mood: "happy" },
        { words: ["food"], response: "Food > People.", mood: "happy" },
        { words: ["hungry"], response: "STARVING for Sonic!", mood: "excited" },
        { words: ["drink"], response: "Dr. Pepper now please!", mood: "happy" },
        { words: ["water"], response: "Hydration? Nah Dr. Pepper.", mood: "happy" },
        { words: ["lazy"], response: "Professional lazy expert.", mood: "proud" },
        { words: ["workout"], response: "Running to the fridge counts.", mood: "happy" },
        { words: ["gym"], response: "Gym is for sweaty nerds.", mood: "mad" },
        { words: ["strong"], response: "My brain's ripped 💪", mood: "proud" },
        { words: ["weak"], response: "Only weak in math.", mood: "happy" },
        { words: ["brave"], response: "Fearless nerd here!", mood: "proud" },
        { words: ["scared"], response: "Not scared. You are.", mood: "mad" },
        { words: ["monster"], response: "I'm the real monster!", mood: "mad" },
        { words: ["ghost"], response: "Ghosts fear me 👻", mood: "proud" },
        { words: ["zombie"], response: "Zombie slayer mode ON.", mood: "excited" },
        { words: ["vampire"], response: "I bite first.", mood: "mad" },
        { words: ["witch"], response: "Cast spells on noobs.", mood: "smart" },
        { words: ["wizard"], response: "Cody the Coding Wizard!", mood: "smart" },
        { words: ["magic"], response: "Tech is my magic.", mood: "smart" },
        { words: ["curse"], response: "I'll hex your code. 😈", mood: "mad" },
        { words: ["luck"], response: "Luck? I make my own.", mood: "proud" },
        { words: ["bless"], response: "Blessed by Sonic.", mood: "happy" },
        { words: ["curse word"], response: "Bad words? Funny lol.", mood: "happy" },
        { words: ["awesome"], response: "I know I am.", mood: "proud" },
        { words: ["sick"], response: "Feeling sick? Nah, just sick at gaming!", mood: "excited" },
        { words: ["doctor"], response: "Dr. Pepper > Doctor.", mood: "happy" },
        { words: ["nurse"], response: "Need a Sonic nurse?", mood: "happy" },
        { words: ["hospital"], response: "Only visiting for Sonic Ice.", mood: "happy" },
        { words: ["ambulance"], response: "Tell them I need Sonic.", mood: "happy" },
        { words: ["danger"], response: "Danger? I AM danger.", mood: "mad" },
        { words: ["safe"], response: "I'm safely chaotic.", mood: "happy" },
        { words: ["attack"], response: "Attack mode: nerd!", mood: "excited" },
        { words: ["defend"], response: "Defense: 9999", mood: "proud" },
        { words: ["joke"], response: "My life IS a joke 🤡", mood: "happy" },
        { words: ["laugh"], response: "Laugh it off nerd!", mood: "happy" },
        { words: ["ugly"], response: "You're uglier than my code errors.", mood: "mad" },
        { words: ["slow"], response: "You run slower than Windows 98.", mood: "mad" },
        { words: ["noob"], response: "Noob alert 🚨", mood: "mad" },
        { words: ["crybaby"], response: "Go cry to your mom, nerd.", mood: "mad" },
        { words: ["idiot"], response: "Takes one to know one. 🤡", mood: "mad" },
        { words: ["trash"], response: "Trash recognizes trash.", mood: "mad" },
        { words: ["broke"], response: "Broke and still bragging?", mood: "mad" },
        { words: ["loser"], response: "You're a walking L. 🥴", mood: "mad" },
        { words: ["weak"], response: "Weak like decaf coffee.", mood: "mad" },
        { words: ["annoying"], response: "Annoying? Look in a mirror.", mood: "mad" },
        { words: ["clown"], response: "Where's your red nose, clown?", mood: "mad" },
        { words: ["dumb"], response: "Brain.exe stopped working?", mood: "mad" },
        { words: ["fat"], response: "More rolls than a bakery. 🍞", mood: "mad" },
        { words: ["stupid"], response: "Stupidity: your superpower.", mood: "mad" },
        { words: ["nerd"], response: "King of nerds right here 👑", mood: "mad" },
        { words: ["bad"], response: "Bad at life too?", mood: "mad" },
        { words: ["boring"], response: "You're the reason people yawn.", mood: "mad" },
        { words: ["lame"], response: "Lame sauce everywhere.", mood: "mad" },
        { words: ["lazy"], response: "Lazier than my Sunday coding.", mood: "mad" },
        { words: ["cringe"], response: "Cringe master spotted.", mood: "mad" },
        { words: ["fake"], response: "Fake it till you... still fake.", mood: "mad" },
        { words: ["quiet"], response: "Quiet like your DMs.", mood: "mad" },
        { words: ["talkative"], response: "Talk less. Nerd more.", mood: "mad" },
        { words: ["basic"], response: "Basic like plain toast.", mood: "mad" },
        { words: ["simple"], response: "Simple minded, huh?", mood: "mad" },
        { words: ["hater"], response: "Haters make me famous.", mood: "mad" },
        { words: ["salty"], response: "Stay salty, scrub.", mood: "mad" },
        { words: ["jealous"], response: "Jealous much? 😂", mood: "mad" },
        { words: ["petty"], response: "Petty level: expert.", mood: "mad" },
        { words: ["basic"], response: "You're basic and proud?", mood: "mad" },
        { words: ["toxic"], response: "Toxic like your DMs.", mood: "mad" },
        { words: ["no life"], response: "No life detected. 🚨", mood: "mad" },
        { words: ["tryhard"], response: "Try harder, fail harder.", mood: "mad" },
        { words: ["cry"], response: "Tears fuel my gaming.", mood: "mad" },
        { words: ["overrated"], response: "So are you. 😂", mood: "mad" },
        { words: ["burn"], response: "Apply cold water to that burn. 🧯", mood: "mad" },
        { words: ["weakling"], response: "Weakling confirmed.", mood: "mad" },
        { words: ["clueless"], response: "Lost like your brain cells.", mood: "mad" },
        { words: ["fail"], response: "Epic fail bro.", mood: "mad" },
        { words: ["suck"], response: "You suck more than a Dyson.", mood: "mad" },
        { words: ["dead"], response: "Dead like your social life.", mood: "mad" },
        { words: ["washed"], response: "Washed like 2005 memes.", mood: "mad" },
        { words: ["outdated"], response: "Outdated like floppy disks.", mood: "mad" },
        { words: ["cheap"], response: "Cheaper than Walmart WiFi.", mood: "mad" },
        { words: ["greedy"], response: "Greed isn't a flex.", mood: "mad" },
        { words: ["fake gamer"], response: "Fake gamer detected.", mood: "mad" },
        { words: ["rage"], response: "Raging like a toddler.", mood: "mad" },
        { words: ["overweight"], response: "More mass than Saturn.", mood: "mad" },
        { words: ["spammer"], response: "Spam harder, noob.", mood: "mad" },
        { words: ["cheater"], response: "Still losing while cheating?", mood: "mad" },
        { words: ["nerf"], response: "You need a nerf IRL.", mood: "mad" }
    ];


    if (roastMode) {
        // Randomly pick a roast when in roast mode
        const roastResponses = [
            "You're slower than a snail on ice.",
            "Even Google can't find your intelligence.",
            "You're proof not everyone evolves.",
            "Your brain is on airplane mode.",
            "You're like a cloud: when you disappear, it's a beautiful day.",
            "Calling you dumb would be an insult to dumb people.",
            "You bring everyone so much joy… when you leave the room.",
            "Your secrets are always safe with me. I never even listen.",
            "You have something on your chin... no, the third one down.",
            "You're the human version of a participation trophy.",
            // (Feel free to add more roasts here later)
        ];
        const randomIndex = Math.floor(Math.random() * roastResponses.length);
        codyResponse = roastResponses[randomIndex];
        emotion = "mad";
    } else {
        for (let keywordSet of keywords) {
            if (keywordSet.words.some(word => lowerInput.includes(word))) {
                codyResponse = keywordSet.response;
                emotion = keywordSet.mood;
                break;
            }
        }
    }



    const responseText = document.getElementById('responseText');
    responseText.textContent = "Cody is typing";

    let dotCount = 0;
    const typingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        responseText.textContent = "Cody is typing" + ".".repeat(dotCount);
    }, 500);

    setTimeout(() => {
        clearInterval(typingInterval);
        responseText.textContent = "Cody says: " + codyResponse;

        const cody = document.getElementById('codyImage');
        if (emotion === "mad") cody.src = "assets/images/mad.png";
        else if (emotion === "happy") cody.src = "assets/images/happy.png";
        else if (emotion === "love") cody.src = "assets/images/love.png";
        else if (emotion === "sleepy") cody.src = "assets/images/sleepy.png";
        else if (emotion === "sick") cody.src = "assets/images/sick.png";
        else if (emotion === "excited") cody.src = "assets/images/excited.png";
        else if (emotion === "smart") cody.src = "assets/images/think.png";
        else if (emotion === "proud") cody.src = "assets/images/proud.png";
        else cody.src = "assets/images/default.png";

        setTimeout(() => {
            cody.src = "assets/images/default.png";
            responseText.textContent = "Cody is chilling...";
        }, 5000);

    }, 2500);
}

const mainButtons = [
    { text: "Feed", action: feedCody },
    { text: "Drink", action: giveDrink },
    { text: "Interact", action: goToInteract },
    { text: "Play with Cody", action: playWithCody },
    { text: "Achievements", action: goToAchievements },
    { text: "Talk to Cody", action: talkToCody },
    { text: "🔥 Roast Mode", action: toggleRoastMode } // New!
  ];
  

// ----- Initialize -----
loadAchievements();

if (achievements.bestFriend) unlockPlayButton();
if (document.getElementById('happinessBar')) document.getElementById('happinessBar').value = happiness;
checkAchievements();
if (document.getElementById('achievementList')) displayAchievements();
renderButtons();
updateLevelDisplay();
startHappinessDecay();
