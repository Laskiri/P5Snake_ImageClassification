let gridWidth = 30;
let gridHeight = 30;
let gameStarted = false;
let startingSegments = 10;
let xStart = 0;
let yStart = 15;
let startDirection = 'right';
let direction = startDirection;
let segments = [];
let score = 0;
let highScore;
let fruit;

// Opsætning af slangespillet
function setupSnakeGame() {
  highScore = getItem('high score');
}

// Tegn slangespillet
function drawSnakeGame() {
  scale(500 / gridWidth, height / gridHeight);
  noStroke();
  fill(255, 0, 0);
  textSize(2);
  textAlign(CENTER);
  text(label, gridWidth / 2, gridHeight - 1);
  text(`Score: ${score}`, gridWidth / 2, 2);

  if (!gameStarted) {
    showStartScreen();
  } else {
    translate(0.5, 0.5);
    showFruit();
    showSegments();
    updateSegments();
    checkForCollision();
    checkForFruit();
  }
}

// Håndterer etiketten fra klassifikatoren
function handleLabel(label) {
  switch (label) {
    case 'LEFT':
      if (direction !== 'right') direction = 'left';
      break;
    case 'RIGHT':
      if (direction !== 'left') direction = 'right';
      break;
    case 'UP':
      if (direction !== 'down') direction = 'up';
      break;
    case 'DOWN':
      if (direction !== 'up') direction = 'down';
      break;
  }
}

// Vis startskærmen
function showStartScreen() {
  noStroke();
  fill(32);
  rect(2, gridHeight / 2 - 5, gridWidth - 4, 10, 2);
  fill(255);
  text('Klik for at spille.\nBrug piltaster eller hånden\n til at bevæge dig.', gridWidth / 2, gridHeight / 2 - 2);
  noLoop();
}

// Håndterer museklik for at starte spillet
function mousePressed() {
  if (!gameStarted) startGame();
}

// Start spillet
function startGame() {
  updateFruitCoordinates();
  segments = [];
  for (let x = xStart; x < xStart + startingSegments; x++) {
    let segmentPosition = createVector(x, yStart);
    segments.unshift(segmentPosition);
  }
  direction = startDirection;
  score = 0;
  gameStarted = true;
  loop();
}

// Vis frugten
function showFruit() {
  stroke(255, 64, 32);
  point(fruit.x, fruit.y);
}

// Vis slangens segmenter
function showSegments() {
  noFill();
  stroke(96, 255, 64);
  beginShape();
  for (let segment of segments) {
    vertex(segment.x, segment.y);
  }
  endShape();
}

// Opdater slangens segmenter
function updateSegments() {
  segments.pop();
  let head = segments[0].copy();
  segments.unshift(head);
  switch (direction) {
    case 'right':
      head.x++;
      break;
    case 'up':
      head.y--;
      break;
    case 'left':
      head.x--;
      break;
    case 'down':
      head.y++;
      break;
  }
}

// Tjek for kollisioner
function checkForCollision() {
  let head = segments[0];
  if (head.x >= gridWidth || head.x < 0 || head.y >= gridHeight || head.y < 0 || selfColliding()) {
    gameOver();
  }
}

// Håndterer spillets afslutning
function gameOver() {
  noStroke();
  fill(32);
  rect(2, gridHeight / 2 - 8, gridWidth - 4, 12, 2);
  fill(255);
  highScore = max(score, highScore);
  storeItem('high score', highScore);
  text(`Game over!\nDin score: ${score}\nHigh score: ${highScore}\nKlik for at spille igen.`, gridWidth / 2, gridHeight / 2 -5);
  gameStarted = false;
  noLoop();
}

// Tjekker om slangen kolliderer med sig selv
function selfColliding() {
  let head = segments[0];
  let segmentsAfterHead = segments.slice(1);
  for (let segment of segmentsAfterHead) {
    if (segment.equals(head)) return true;
  }
  return false;
}

// Tjekker om slangens hoved er på frugten, og i såfald inkrementer score og spawner ny frugt
function checkForFruit() {
  let head = segments[0];
  if (head.equals(fruit)) {
    score++;
    let tail = segments[segments.length - 1];
    let newSegment = tail.copy();
    segments.push(newSegment);
    updateFruitCoordinates();
  }
}

// Laver en frugt med tilfældige koordinater, inde i spilleområdet
function updateFruitCoordinates() {
  let x = floor(random(gridWidth - 1));
  let y = floor(random(gridHeight - 1));
  fruit = createVector(x, y);
}

// Håndterer tastetryk for at ændre retning
function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      if (direction !== 'right') direction = 'left';
      break;
    case RIGHT_ARROW:
      if (direction !== 'left') direction = 'right';
      break;
    case UP_ARROW:
      if (direction !== 'down') direction = 'up';
      break;
    case DOWN_ARROW:
      if (direction !== 'up') direction = 'down';
      break;
  }
}