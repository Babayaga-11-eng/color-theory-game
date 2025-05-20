const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const paletteEl = document.getElementById("palette");
const levelInfoEl = document.getElementById("levelInfo");
const explanationEl = document.getElementById("explanation");
const scoreEl = document.getElementById("score");

const resultScreen = document.getElementById("resultScreen");
const resultMessage = document.getElementById("resultMessage");
const nextBtn = document.getElementById("nextBtn");
const gameScreen = document.getElementById("gameScreen");

const levels = [
  {
    name: "Monochromatic",
    explanation: "Different shades and tints of a single hue.",
    colors: ["#3498db", "#5dade2", "#85c1e9"]
  },
  {
    name: "Analogous",
    explanation: "Colors next to each other on the color wheel.",
    colors: ["#FF6F61", "#FF8C42", "#FFD166"]
  },
  {
    name: "Complementary",
    explanation: "Colors opposite each other on the color wheel.",
    colors: ["#FF5733", "#33C1FF"]
  },
  {
    name: "Split-Complementary",
    explanation: "A base color and two adjacent to its complement.",
    colors: ["#FF6347", "#6A5ACD", "#3CB371"]
  },
  {
    name: "Triadic",
    explanation: "Three colors evenly spaced around the color wheel.",
    colors: ["#E63946", "#2A9D8F", "#F4A261"]
  },
  {
    name: "Tetradic",
    explanation: "Two complementary color pairs (rectangle scheme).",
    colors: ["#FF6347", "#4682B4", "#32CD32", "#FFD700"]
  }
];

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill(null);
let currentPlayer = 1;
let selectedColor = null;
let level = 0;
let score = 0;

function startLevel() {
  board = Array(9).fill(null);
  boardEl.innerHTML = "";
  selectedColor = null;
  statusEl.textContent = `Player ${currentPlayer}'s Turn – Select a Color`;
  createPalette(levels[level].colors);
  drawBoard();

  levelInfoEl.textContent = `Level ${level + 1}: ${levels[level].name}`;
  explanationEl.textContent = levels[level].explanation;

  gameScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");
}

function createPalette(colors) {
  paletteEl.innerHTML = "";
  colors.forEach(color => {
    const btn = document.createElement("div");
    btn.className = "color-btn";
    btn.style.backgroundColor = color;
    btn.dataset.color = color;

    btn.addEventListener("click", () => {
      document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedColor = color;
    });

    paletteEl.appendChild(btn);
  });
}

function drawBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", makeMove);
    boardEl.appendChild(cell);
  }
}

function makeMove(e) {
  const index = +e.target.dataset.index;
  if (board[index] || !selectedColor) return;

  board[index] = selectedColor;
  e.target.style.backgroundColor = selectedColor;

  if (checkWin()) {
    score += 10;
    scoreEl.textContent = "Score: " + score;
    showResult(`🎉 Player ${currentPlayer} Wins!`);
  } else if (board.every(c => c)) {
    showResult("🤝 It's a Draw!");
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    selectedColor = null;
    statusEl.textContent = `Player ${currentPlayer}'s Turn – Select a Color`;
    document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
  }
}

function checkWin() {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    const values = [board[a], board[b], board[c]];

    // Classic win: All 3 same
    if (values.every(color => color && color === values[0])) return true;

    // Educational win: match palette order
    const palette = levels[level].colors;
    const paletteIndexMap = palette.reduce((map, color, i) => {
      map[color] = i;
      return map;
    }, {});

    const indices = values.map(color => paletteIndexMap[color]);

    if (indices.every(i => i !== undefined)) {
      const [i1, i2, i3] = indices;
      if ((i2 === i1 + 1 && i3 === i2 + 1) || (i2 === i1 - 1 && i3 === i2 - 1)) {
        return true;
      }
    }

    return false;
  });
}

function showResult(msg) {
  resultMessage.textContent = msg;
  resultScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
}

function nextLevel() {
  level++;
  if (level >= levels.length) {
    alert("🎉 All levels completed! Restarting...");
    level = 0;
    score = 0;
  }
  currentPlayer = 1;
  scoreEl.textContent = "Score: " + score;
  startLevel();
}

restartBtn.addEventListener("click", startLevel);
nextBtn.addEventListener("click", nextLevel);

startLevel();
