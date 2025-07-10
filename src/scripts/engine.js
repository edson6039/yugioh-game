// Estado global com elementos DOM
const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points")
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type")
  },
  fieldCards: {
    player: document.getElementById("player-cards"),
    computer: document.getElementById("computer-cards")
  },
  actions: {
    button: document.getElementById("next-duel")
  },
  playerSides: {
  player: "player-cards",
  playerBox: document.querySelector(".card-box.framed#player-cards"),
  computer: "computer-cards",
  computerBox: document.querySelector(".card-box.framed#computer-cards")
},
};

const pathImages = "./src/assets/icons/";
const cardData = [
  { id: 0, name: "Blue Eyes White Dragon", type: "Paper", img: `${pathImages}dragon.png`, WinOf: [1], LoseOf: [2] },
  { id: 1, name: "Dark Magician", type: "Rock", img: `${pathImages}magician.png`, WinOf: [2], LoseOf: [0] },
  { id: 2, name: "Exodia", type: "Scissors", img: `${pathImages}exodia.png`, WinOf: [0], LoseOf: [1] }
];

// Cria carta com evento só para o player
async function createCardImage(IdCard, side) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (side === "player") {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });

    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(IdCard);
    });
  }

  return cardImage;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "WIN";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "LOSE";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages(){
    let cards = state.playerSides.computerBox
    let imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());

    cards = state.playerSides.playerBox
    imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());
}

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function drawSelectedCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, side) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, side);
    state.fieldCards[side].appendChild(cardImage);
  }
}

async function setCardsField(cardId) {
  let computerCardId = await getRandomCardId();

  document.getElementById("player-field-card").src = cardData[cardId].img;

  document.getElementById("computer-field-card").src = cardData[computerCardId].img;

  await removeAllCardsImages();

  let duelResults = await checkDuelResults(cardId, computerCardId);
  await updateScore();
  await drawButton(duelResults);
}

async function resetDuel() {
  // Limpa preview lateral
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";

  // Esconde o botão
  state.actions.button.style.display = "none";

  // Limpa o campo do meio
  document.getElementById("player-field-card").src = "./src/assets/icons/empty-field.png";
  document.getElementById("computer-field-card").src = "./src/assets/icons/empty-field.png";

  // Desenha novas cartas nas mãos
  await removeAllCardsImages();
  init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

try{
    audio.play();
}
catch{

}
    
}

function init() {
  drawCards(5, "player");
  drawCards(5, "computer");

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
