// File: interact.js
let timeoutID;
let currentPage = 0;
const buttonsPerPage = 3;

// Buttons and their actions
const allButtons = [
  { label: "Annoy Cody", action: () => changeCody("annoyed.png", "F*ck you 😂", "shake") },
  { label: "Confuse Cody", action: () => changeCody("confused.png", "Bro, you serious?", "shake") },
  { label: "Be Cringe", action: () => changeCody("cringe.png", "You're so cringe.", "bounce") },
  { label: "Make Cry", action: () => changeCody("cry.png", "I'm not crying, you are 😭", "shake") },
  { label: "Dead Inside", action: () => changeCody("deadinside.png", "I've given up.", "shake") },
  { label: "Feed Cody", action: () => changeCody("feed.png", "Yummy!", "bounce") },
  { label: "Give Drink", action: () => changeCody("drink.png", "Refreshing...", "bounce") },
  { label: "Embarrass Cody", action: () => changeCody("embarrassed.png", "Stop embarrassing me.", "bounce") },
  { label: "Make Happy", action: () => changeCody("happy.png", "Feeling good!", "bounce") },
  { label: "Make Hot", action: () => changeCody("hot.png", "It's so hot 🔥", "shake") },
  { label: "Make Laugh", action: () => changeCody("laugh.png", "LOL 😂", "bounce") },
  { label: "Show Love", action: () => changeCody("love.png", "I love you too 🥰", "bounce") },
  { label: "Make Mad", action: () => changeCody("mad.png", "You're testing me.", "shake") },
  { label: "Nosebleed", action: () => changeCody("nosebleed.png", "😳 Nosebleed!", "bounce") },
  { label: "Make Proud", action: () => changeCody("proud.png", "I'm the GOAT 🐐", "bounce") },
  { label: "Make Sad", action: () => changeCody("sad.png", "I'm sad now...", "shake") },
  { label: "Scare Cody", action: () => changeCody("scared.png", "AHHHH!", "shake") },
  { label: "Serious Mode", action: () => changeCody("seriousmode.png", "watashi wa shindeiru!", "shake") },
  { label: "Make Sleepy", action: () => changeCody("sleepy.png", "I'm sleepy...", "bounce") },
  { label: "Make Sweat", action: () => changeCody("sweat.png", "I'm nervous 😓", "shake") },
  { label: "Make Think", action: () => changeCody("think.png", "Hmm...", "bounce") },
  { label: "Victory Cody", action: () => changeCody("victory.png", "Victory Royale 🏆", "bounce") },
  { label: "Say Weird Thing", action: () => changeCody("weird.png", "What did you just say? 💀", "shake") },
  { label: "Wink at Cody", action: () => changeCody("wink.png", "😉", "bounce") },
  { label: "Back to Home", action: () => goHome() }
];

function renderButtons() {
    const buttonsContainer = document.getElementById('buttonsContainer');
    buttonsContainer.innerHTML = '';
  
    const start = currentPage * buttonsPerPage;
    const end = start + buttonsPerPage;
    const buttonsToShow = allButtons.slice(start, end);
  
    buttonsToShow.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.label;
      button.onclick = btn.action;
      buttonsContainer.appendChild(button);
    });
  
    // Update page number
    document.getElementById('pageIndicator').textContent = `Page ${currentPage + 1}/${Math.ceil(allButtons.length / buttonsPerPage)}`;
  }
  

function nextPage() {
  if ((currentPage + 1) * buttonsPerPage < allButtons.length) {
    currentPage++;
    renderButtons();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderButtons();
  }
}

function changeCody(imagePath, text, effect = null) {
  clearTimeout(timeoutID);
  const cody = document.getElementById('codyImage');

  cody.src = "assets/images/" + imagePath;
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

function goHome() {
  window.location.href = "index.html";
}
function randomIdleAnimation() {
    const idleActions = [
      { image: "laugh.png", text: "Hehe 😂", effect: "bounce" },
      { image: "sleepy.png", text: "Getting sleepy...", effect: "bounce" },
      { image: "think.png", text: "Thinking...", effect: "bounce" },
      { image: "happy.png", text: "Feeling good 😎", effect: "bounce" },
    ];
  
    const random = idleActions[Math.floor(Math.random() * idleActions.length)];
    changeCody(random.image, random.text, random.effect);
  
    // After short time, back to default
    timeoutID = setTimeout(() => {
      document.getElementById('codyImage').src = "assets/images/default.png";
      document.getElementById('responseText').textContent = "Cody is chilling...";
      document.getElementById('codyImage').classList.remove("bounce", "shake");
    }, 3000);
  }
  
  // Every 15-25 seconds randomly trigger idle animation
  setInterval(() => {
    if (Math.random() < 0.3) {  // 30% chance
      randomIdleAnimation();
    }
  }, 20000);
  function randomRareEvent() {
    const rareEvents = [
      { image: "mad.png", text: "I'm mad for no reason! 🤬", effect: "shake" },
      { image: "weird.png", text: "Feeling weird today... 💀", effect: "shake" },
      { image: "nosebleed.png", text: "Too much excitement 😳", effect: "bounce" }
    ];
  
    const random = rareEvents[Math.floor(Math.random() * rareEvents.length)];
    changeCody(random.image, random.text, random.effect);
  
    timeoutID = setTimeout(() => {
      document.getElementById('codyImage').src = "assets/images/default.png";
      document.getElementById('responseText').textContent = "Cody is chilling...";
      document.getElementById('codyImage').classList.remove("bounce", "shake");
    }, 3000);
  }
  
  // Every 1 minute, 10% chance rare event
  setInterval(() => {
    if (Math.random() < 0.1) {  // 10% chance
      randomRareEvent();
    }
  }, 60000);
  
// Initialize
renderButtons();
