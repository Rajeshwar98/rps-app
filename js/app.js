// Rock Paper Scissors game logic
const OPTIONS = ['rock','paper','scissors'];
const beats = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const roundResultEl = document.getElementById('round-result');
const lastPlayEl = document.getElementById('last-play');
const bestOfSelect = document.getElementById('best-of');
const choices = Array.from(document.querySelectorAll('.choice'));
const resetBtn = document.getElementById('reset');
const autoPlayBtn = document.getElementById('auto-play');

let playerScore = 0;
let computerScore = 0;
let roundsToWin = parseInt(bestOfSelect.value) / 2 + 0.5; // e.g. best of 3 => 2
let autoPlaying = false;
let autoInterval = null;

function computerMove() {
  return OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
}

function updateScores() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

function evaluate(player, computer) {
  if (player === computer) return 'draw';
  return beats[player] === computer ? 'player' : 'computer';
}

function setRoundResult(text) {
  roundResultEl.textContent = text;
}

function play(playerChoice) {
  if (playerScore >= roundsToWin || computerScore >= roundsToWin) {
    setRoundResult('Game over. Reset to play again.');
    return;
  }
  const computerChoice = computerMove();
  const winner = evaluate(playerChoice, computerChoice);
  if (winner === 'player') {
    playerScore += 1;
    setRoundResult('You win this round!');
  } else if (winner === 'computer') {
    computerScore += 1;
    setRoundResult('Computer wins this round.');
  } else {
    setRoundResult("It's a draw.");
  }
  lastPlayEl.textContent = `You chose ${playerChoice.toUpperCase()} — Computer chose ${computerChoice.toUpperCase()}.`;
  updateScores();
  checkGameEnd();
}

function checkGameEnd() {
  if (playerScore >= roundsToWin || computerScore >= roundsToWin) {
    const final = playerScore > computerScore ? 'You won the game! 🎉' : 'Computer won the game. 🤖';
    setRoundResult(final + ' Click Reset to play again.');
    stopAutoPlay();
  }
}

choices.forEach(btn => {
  btn.addEventListener('click', () => {
    const move = btn.dataset.move;
    // toggle pressed attribute briefly for a tiny UI affordance
    choices.forEach(c=>c.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
    setTimeout(()=>btn.setAttribute('aria-pressed','false'), 350);
    play(move);
  });
});

resetBtn.addEventListener('click', () => {
  playerScore = 0; computerScore = 0;
  updateScores();
  setRoundResult('Game reset. Make your choice.');
  lastPlayEl.textContent = '';
  stopAutoPlay();
});

bestOfSelect.addEventListener('change', () => {
  const best = parseInt(bestOfSelect.value);
  roundsToWin = Math.floor(best / 2) + 1;
  resetBtn.click();
});

// Keyboard shortcuts: R, P, S
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') document.querySelector('[data-move="rock"]').click();
  if (e.key === 'p' || e.key === 'P') document.querySelector('[data-move="paper"]').click();
  if (e.key === 's' || e.key === 'S') document.querySelector('[data-move="scissors"]').click();
});

function startAutoPlay() {
  if (autoPlaying) return;
  autoPlaying = true;
  autoPlayBtn.textContent = 'Stop Auto Play ⏸️';
  autoInterval = setInterval(()=> {
    const move = OPTIONS[Math.floor(Math.random()*OPTIONS.length)];
    document.querySelector('[data-move="' + move + '"]').click();
  }, 900);
}

function stopAutoPlay() {
  autoPlaying = false;
  autoPlayBtn.textContent = 'Auto Play ⏯️';
  if (autoInterval) { clearInterval(autoInterval); autoInterval = null; }
}

autoPlayBtn.addEventListener('click', () => {
  if (autoPlaying) stopAutoPlay(); else startAutoPlay();
});

// initialize
updateScores();
setRoundResult('Ready — choose Rock, Paper, or Scissors.');
