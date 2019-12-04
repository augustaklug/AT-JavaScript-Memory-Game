setTimeout(hideCards, 3000);

function hideCards() {
  $(".back-face").css("visibility", "visible");
  $(".front-face").css("transform", "rotateY(180deg)");
}

const cards = document.querySelectorAll(".memory-card");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matched = 0;

let bestMinutes = JSON.parse(window.localStorage.getItem("minutes"));
let bestSeconds = JSON.parse(window.localStorage.getItem("seconds"));

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.front === secondCard.dataset.front;

  if (isMatch) {
    disableCards();
    matched++;
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

function checkMatches() {
  if (matched == 8) {
    timerStop();
    $("#timer").css("color", "lightgreen");
    if (window.localStorage.getItem("seconds") == null) {
      window.localStorage.setItem("minutes", minutes);
      window.localStorage.setItem("seconds", seconds);
      timerDisplay.innerHTML += " &#x1f3c6";
      $("#timer").css("color", "yellow");
      showBestTime();
    } else if (minutes <= bestMinutes) {
      if (seconds <= bestSeconds) {
        window.localStorage.setItem("minutes", minutes);
        window.localStorage.setItem("seconds", seconds);
        timerDisplay.innerHTML += " &#x1f3c6";
        $("#timer").css("color", "yellow");
        showBestTime();
      }
    }
  }
}

function showBestTime() {
  bestMinutes = JSON.parse(window.localStorage.getItem("minutes"));
  bestSeconds = JSON.parse(window.localStorage.getItem("seconds"));
  bestTime.innerHTML =
    (bestMinutes ? (bestMinutes > 9 ? bestMinutes : "0" + bestMinutes) : "00") +
    ":" +
    (bestSeconds > 9 ? bestSeconds : "0" + bestSeconds);
}

cards.forEach(card => card.addEventListener("click", timerStart));
cards.forEach(card => card.addEventListener("click", flipCard));
cards.forEach(card => card.addEventListener("click", checkMatches));

/*Display do melhor tempo*/
let bestTime = document.getElementById("bestTime");
bestTime.innerHTML =
  (bestMinutes ? (bestMinutes > 9 ? bestMinutes : "0" + bestMinutes) : "00") +
  ":" +
  (bestSeconds > 9 ? bestSeconds : "0" + bestSeconds);

/* Código do timer */
let timerDisplay = document.getElementById("timer");

let seconds = 0;

let minutes = 0;

let t;

let running = false;

function add() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }

  timerDisplay.innerHTML =
    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
    ":" +
    (seconds > 9 ? seconds : "0" + seconds);

  timer();
}
function timer() {
  t = setTimeout(add, 1000);
  running = true;
}

function timerStart() {
  if (!running) {
    timer();
  }
}
function timerStop() {
  clearTimeout(t);
  running = false;
}
