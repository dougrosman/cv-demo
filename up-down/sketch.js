// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/ER0Ng7utU/";

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let myResults = [];

let position;
let fillColor;

let totalMovement = 0;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  createCanvas(320, 260);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();

  position = createVector(width / 2, height / 2);
  console.log(position);
  fillColor = color(255, 0, 0);
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  fill(fillColor);
  ellipse(position.x, position.y, 50, 50);

  // Draw the label
  //fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);

  label = results[0].label;

  // if up, then move ball up, else if down, move ball down. else (neutral), ball stays in place

  const speed = 4;
  if (label == "up" && position.y > 0) {
    //position.y = position.y - 1;
    position.y -= speed;
    fillColor = color(0, 0, 255);
    totalMovement++;
  } else if (label == "down" && position.y < height) {
    position.y += speed;
    fillColor = color(255, 0, 255);
    totalMovement++;
  } else {
    fillColor = color(0, 255, 0);
  }

  console.log(totalMovement);

  // if a certain amount of movement has happened, trigger some event
  if(totalMovement > 100) {
    fillColor = color(255, 255, 0);
  }
  // console.log(results)
  // Classifiy again!
  classifyVideo();
}
