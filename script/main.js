const cards = document.querySelectorAll(".memory-card");
const resultSceen = document.querySelector(".result");

let hasFlippedCard = false;
let countGame = 0;
let lockBoard = false;
let idItemOUt;
let firstCard = {
  id: null,
  el: null,
};
let secondCard = {
  id: null,
  el: null,
};

function handleFliperCard(index) {
  return function () {
    if (lockBoard) return;
    if (!!firstCard.el && this === firstCard.el) return;
    if (this.classList.add("selected")) return;

    this.classList.add("flip-card");
    const setFirstCard =
      !hasFlippedCard || firstCard.id === null || firstCard.id === index;
    const setSecondCard =
      hasFlippedCard || secondCard.id === null || secondCard.id === index;

    if (setFirstCard) {
      hasFlippedCard = true;
      firstCard = { id: index, el: this };
      return;
    }

    if (setSecondCard) {
      hasFlippedCard = false;
      secondCard = { id: index, el: this };
      _handleCheckMatcher({ firstEl: firstCard.el, secondEl: secondCard.el });
      return;
    }
  };
}

function _handleCheckMatcher({ firstEl, secondEl }) {
  const { name: firstName } = firstEl.dataset;
  const { name: secondName } = secondEl.dataset;

  const isMatch = firstName === secondName;

  isMatch ? disableCards() : removeFlipCard();
}

function disableCards() {
  firstCard.el.removeEventListener("click", handleFliperCard());
  secondCard.el.removeEventListener("click", handleFliperCard());
  secondCard.el.style.pointerEvents = "none";
  firstCard.el.style.pointerEvents = "none";
  firstCard.el.classList.add("selected");
  secondCard.el.classList.add("selected");
  countGame++;
  const checkWin = [...cards].every((item) =>
    item.classList.contains("selected")
  );
  _fineshedTheGame(checkWin);

  idItemOUt && clearTimeout(idItemOUt);
}

function removeFlipCard() {
  lockBoard = true;
  idItemOUt = setTimeout(() => {
    firstCard.el.classList.remove("flip-card");
    secondCard.el.classList.remove("flip-card");
    firstCard.el.classList.remove("selected");
    secondCard.el.classList.remove("selected");
    lockBoard = false;
    countGame++;
  }, 1200);
}

function _fineshedTheGame(value) {
  if (value) return setTimeout(() => _resultViewGameFineshed(), 600);
}

function _resultViewGameFineshed() {
  window.scrollTo(0, 1);
  resultSceen.style.visibility = "visible";
  resultSceen.style.opacity = 1;

  resultSceen.style.width = "100%";
  resultSceen.style.height = "calc(100vh - 15px / 3)";

  const text = document.createElement("p");
  const button = document.createElement("button");
  button.classList.add("btn-reset");
  button.setAttribute("type", "button");
  button.textContent = "Jogar outra vez";
  text.textContent = `Voce ganhou com ${countGame} jogadas..`;

  resultSceen.appendChild(text);
  resultSceen.appendChild(button);

  button.addEventListener("click", resetTheGame);
}

function resetViewResult() {
  resultSceen.style.visibility = "hidden";
  resultSceen.style.opacity = 0;
  resultSceen.style.width = 0;
  resultSceen.style.height = 0;
  resultSceen.innerHTML = "";
}

function resetTheGame() {
  hasFlippedCard = false;
  lockBoard = false;
  idItemOUt = null;
  countGame = 0;

  firstCard = {
    id: null,
    el: null,
  };

  secondCard = {
    id: null,
    el: null,
  };

  [...cards].forEach((item) => {
    item.classList.remove("flip-card");
    item.classList.remove("flip-card");
    item.classList.remove("selected");
    item.classList.remove("selected");
    item.style.pointerEvents = "all";
    item.style.pointerEvents = "all";
  });

  resetViewResult();
  shufller();
}
(function shufller() {
  [...cards].forEach(({ style }) => {
    const randomFlex = Math.floor(Math.random() * [...cards].length);
    style.order = randomFlex;
  });
})();

cards.forEach((card, index) =>
  card.addEventListener("click", handleFliperCard(index), false)
);
