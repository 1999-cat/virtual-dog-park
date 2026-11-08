/* ===========================================================
   Virtual Dog Park - script.js
   Plain JavaScript, no frameworks. A first-year student should
   be able to read and explain every line below.
   =========================================================== */

// 1. Find the button, the result text, and all breed cards on the page.
const randomBtn = document.getElementById("randomBtn");
const resultText = document.getElementById("pickerResult");
const breedCards = document.querySelectorAll(".breed-card");

// 2. The three breeds shown in our Dog Encyclopedia.
const breedNames = ["Beagle", "Golden Retriever", "Poodle"];

// 3. When the button is clicked, pick one breed at random.
randomBtn.addEventListener("click", function () {
  // Math.random() gives a number from 0 up to 1 (not including 1).
  // Multiplying by the array length and rounding down gives a valid index.
  const randomIndex = Math.floor(Math.random() * breedNames.length);
  const chosenBreed = breedNames[randomIndex];

  // Show the result to the reader.
  resultText.textContent = "Your breed is: " + chosenBreed + "!";

  // Highlight the chosen card and remove the highlight from the others.
  breedCards.forEach(function (card) {
    if (card.dataset.breed === chosenBreed) {
      card.classList.add("highlight");
    } else {
      card.classList.remove("highlight");
    }
  });
});

/* ===========================================================
   My Virtual Dog section
   =========================================================== */

// Grab the elements we need from the page.
const adoptForm = document.getElementById("adoptForm");
const dogNameInput = document.getElementById("dogName");
const formMessage = document.getElementById("formMessage");
const dogCard = document.getElementById("dogCard");
const dogCardName = document.getElementById("dogCardName");
const dogBreed = document.getElementById("dogBreed");
const dogDay = document.getElementById("dogDay");
const dogStage = document.getElementById("dogStage");
const dogHappiness = document.getElementById("dogHappiness");
const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const nextDayBtn = document.getElementById("nextDayBtn");
const startOverBtn = document.getElementById("startOverBtn");
const dogImage = document.getElementById("dogImage");
const growthFill = document.getElementById("growthFill");

// The longest name we allow.
const MAX_NAME_LENGTH = 20;

// The key we use to save the dog in the browser's localStorage.
// localStorage is a small storage space built into every browser. The data
// lives on the visitor's own computer (inside this website's storage), not on
// a server. Only this page can read it.
const STORAGE_KEY = "virtualDogParkPetV1";

// Which SVG picture belongs to which breed.
const breedImage = {
  "Beagle": "assets/beagle.svg",
  "Golden Retriever": "assets/golden-retriever.svg",
  "Poodle": "assets/poodle.svg"
};

// How big the dog picture is at each growth stage (in pixels).
const stageSize = {
  "Puppy": 90,
  "Young Dog": 130,
  "Adult Dog": 170
};

// How full the growth bar is at each stage (as a percentage).
const stageGrowth = {
  "Puppy": 34,
  "Young Dog": 67,
  "Adult Dog": 100
};

// This object holds the dog we are looking after.
// It stays empty until a dog is adopted.
let myDog = null;

// Find which breed radio button is currently selected.
function getSelectedBreed() {
  const chosen = document.querySelector('input[name="breed"]:checked');
  return chosen ? chosen.value : "";
}

// Put the dog's details on the page.
// We use textContent so the name is shown as plain text, never as HTML.
// This keeps the page safe even if the name contains odd characters.
function renderDog() {
  dogCardName.textContent = myDog.name;
  dogBreed.textContent = myDog.breed;
  dogDay.textContent = myDog.day;
  dogStage.textContent = myDog.stage;
  dogHappiness.textContent = myDog.happiness;

  // Show a picture of the breed, and make it bigger as the dog grows up.
  dogImage.src = breedImage[myDog.breed] || "";
  dogImage.alt = "Illustration of a " + myDog.breed;
  dogImage.width = stageSize[myDog.stage] || 120;

  // Fill the growth bar to match the stage (the stage is also written as text).
  growthFill.style.width = (stageGrowth[myDog.stage] || 0) + "%";
}

// Save the dog to the browser's localStorage.
// We store only the four facts the brief asks for: name, breed, day, happiness.
// (The growth stage is worked out from the day, so we do not need to store it.)
function saveDog() {
  const data = {
    name: myDog.name,
    breed: myDog.breed,
    day: myDog.day,
    happiness: myDog.happiness
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Read the saved dog back when the page loads.
// If there is saved data, show the dog again so a refresh does not lose it.
function loadDog() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return; // nothing saved yet
  try {
    const data = JSON.parse(saved);
    myDog = {
      name: data.name,
      breed: data.breed,
      day: data.day,
      happiness: data.happiness,
      stage: stageForDay(data.day)
    };
    dogCard.hidden = false; // show the card again
    renderDog();
  } catch (e) {
    // If the saved text is broken, just ignore it.
  }
}

// Work out the growth stage from the current day number.
// Day 1 = Puppy, Days 2-3 = Young Dog, Day 4 and up = Adult Dog.
function stageForDay(day) {
  if (day <= 1) return "Puppy";
  if (day <= 3) return "Young Dog";
  return "Adult Dog";
}

// Raise happiness by the given amount, but never above 100.
function increaseHappiness(amount) {
  myDog.happiness = myDog.happiness + amount;
  if (myDog.happiness > 100) {
    myDog.happiness = 100;
  }
  renderDog();
  saveDog(); // keep the new happiness saved
}

// When the Adopt form is submitted, check the name then create the dog.
adoptForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const name = dogNameInput.value.trim(); // drop spaces at start and end

  // Rule 1: the name must not be empty after trimming.
  if (name === "") {
    formMessage.textContent = "Please enter a name for your dog.";
    return;
  }
  // Rule 2: the name must be 20 characters or fewer.
  if (name.length > MAX_NAME_LENGTH) {
    formMessage.textContent = "That name is too long. Please use 20 characters or fewer.";
    return;
  }

  // The name is valid, so create the new dog.
  myDog = {
    name: name,
    breed: getSelectedBreed(),
    day: 1,
    stage: stageForDay(1), // a new dog always starts as a Puppy
    happiness: 50,
  };

  formMessage.textContent = "";   // clear any old message
  dogCard.hidden = false;         // show the dog card
  renderDog();                    // fill in the details
  saveDog();                      // save the new dog right away
});

// Feed and Play each raise happiness by 10 (capped at 100).
feedBtn.addEventListener("click", function () { increaseHappiness(10); });
playBtn.addEventListener("click", function () { increaseHappiness(10); });

// Next Day: move forward one day. The dog grows up and gets a little
// less happy, because a new day means it is hungry and bored again.
// Happiness can never drop below 0.
function nextDay() {
  myDog.day = myDog.day + 1;
  myDog.stage = stageForDay(myDog.day);
  myDog.happiness = myDog.happiness - 5;
  if (myDog.happiness < 0) {
    myDog.happiness = 0;
  }
  renderDog();
  saveDog(); // save the new day and happiness
}

// Start Over: ask the visitor to confirm, then delete the saved dog and
// show the adoption form again. If they cancel, the dog is kept.
function startOver() {
  const sure = window.confirm(
    "Start over? This will delete your dog and all saved progress."
  );
  if (!sure) return; // visitor cancelled, so keep the dog

  localStorage.removeItem(STORAGE_KEY); // delete the saved data
  myDog = null;
  dogNameInput.value = "";        // clear the old name
  formMessage.textContent = "";   // clear any message
  dogCard.hidden = true;          // hide the dog card
}

nextDayBtn.addEventListener("click", nextDay);
startOverBtn.addEventListener("click", startOver);

// When the page first opens, try to bring back a saved dog.
loadDog();
