'use strict';

const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

let grid = [];
let score = 0;
let gameStarted = false;

function createEmptyGrid() {
  grid = Array(4)
    .fill(null)
    .map(() => Array(4).fill(0));
}

function addRandomTile() {
  const emptyCells = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    grid[randomCell.x][randomCell.y] = Math.random() > 0.1 ? 2 : 4;
  }
}

function updateGameField() {
  const cells = gameField.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = grid[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell field-cell--${value}`;
  });
}

function checkWinCondition() {
  for (const row of grid) {
    if (row.includes(2048)) {
      showWinMessage();

      return true;
    }
  }

  return false;
}

function showWinMessage() {
  winMessage.classList.remove('hidden');
  document.removeEventListener('keydown', handleKeyPress);
}

function hideStartMessage() {
  if (!startMessage.classList.contains('hidden')) {
    startMessage.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  hideStartMessage();
  startGame();
});

function checkLoseCondition() {
  if (hasEmptyCells() || hasAdjacentEqualTiles()) {
    return false;
  }
  showLoseMessage();

  return true;
}

function hasEmptyCells() {
  return grid.some((row) => row.includes(0));
}

function hasAdjacentEqualTiles() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (
        (i < 3 && grid[i][j] === grid[i + 1][j]) ||
        (j < 3 && grid[i][j] === grid[i][j + 1])
      ) {
        return true;
      }
    }
  }

  return false;
}

function showLoseMessage() {
  loseMessage.classList.remove('hidden');
  document.removeEventListener('keydown', handleKeyPress);
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    const filteredRow = grid[i].filter((value) => value !== 0);
    const newRow = [];

    for (let j = 0; j < filteredRow.length; j++) {
      if (filteredRow[j] === filteredRow[j + 1]) {
        newRow.push(filteredRow[j] * 2);
        score += filteredRow[j] * 2;
        j++;
      } else {
        newRow.push(filteredRow[j]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    grid[i] = newRow;
  }
}

function moveRight() {
  grid.forEach((row) => row.reverse());
  moveLeft();
  grid.forEach((row) => row.reverse());
}

function moveUp() {
  grid = transpose(grid);
  moveLeft();
  grid = transpose(grid);
}

function moveDown() {
  grid = transpose(grid);
  moveRight();
  grid = transpose(grid);
}

function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function handleKeyPress(ev) {
  switch (ev.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
  }
  addRandomTile();
  updateGameField();
  scoreElement.textContent = score;

  if (checkWinCondition() || checkLoseCondition()) {
    return 0;
  }
}

function startGame() {
  score = 0;
  createEmptyGrid();
  addRandomTile();
  addRandomTile();
  updateGameField();
  document.addEventListener('keydown', handleKeyPress);

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
}

function restartGame() {
  score = 0;
  scoreElement.textContent = score;
  createEmptyGrid();
  addRandomTile();
  addRandomTile();
  updateGameField();
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
}

startButton.addEventListener('click', () => {
  if (gameStarted) {
    restartGame();
  } else {
    startGame();
    gameStarted = true;
  }
});
