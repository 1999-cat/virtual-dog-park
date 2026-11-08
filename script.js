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
