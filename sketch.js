/* ===
ml5 Eksempel
Webcam Billedklassifikation ved brug af en forudtrænet tilpasset model og p5.js
Dette eksempel bruger p5 preload funktion til at oprette klassifikatoren
=== */

// Klassifikator Variabel
let classifier;
// Model URL (kopier og indsæt din model URL her fra teachable machine)
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/RuXB9DAP7/'
const predictionThreshold = 0.75;
// Video
let video;
let flippedVideo;
// Til at gemme klassifikationen
let label = "";


// Indlæs modellen først
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  let canvas1 = createCanvas(1000, 500);
  canvas1.parent('canvasContainer')
 

  // Opret videoen
  video = createCapture(VIDEO);
  video.size(500, 500);
  video.hide();

  // Juster billedhastigheden for at indstille bevægelseshastigheden
  frameRate(10);
  
  flippedVideo = ml5.flipImage(video)
  // Start klassifikation
  classifyVideo();
  setupSnakeGame();
}

function draw() {
  background(0);
  // Tegn videoen
  image(flippedVideo, 500, 0, 500,500);
  
  // Tegn spillet
  drawSnakeGame();
}

// Få en forudsigelse for den aktuelle videoramme
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// Når vi får et resultat
function gotResult(error, results) {
  // Hvis der er en fejl
  if (error) {
    console.error(error);
    return;
  }
  // Resultaterne er i et array sorteret efter tillid.
  // console.log(results[0]);
  label = results[0].label;
  // Klassificer igen!
  const confidence = results[0].confidence;
  if(confidence > predictionThreshold){
    handleLabel(label);
  }
  classifyVideo();
}

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
