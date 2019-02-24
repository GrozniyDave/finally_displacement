"use strict";
window.addEventListener("DOMContentLoaded", init);
//dom loaded function
function init() {
  console.log("DOM has Loaded");
}
//img sources
let catImg = new Image();
catImg.src = "cat.jpg";
let mapImg = new Image();
mapImg.src = "map.jpg";
//run drawing functions when images loaded
catImg.onload = drawCat;
mapImg.onload = drawMap;
//plain cat
let sourceCanvas = document.querySelector("#sourceCanvas");
let sourceContext = sourceCanvas.getContext("2d");
//cat's map
let mapCanvas = document.querySelector("#mapCanvas");
let mapContext = mapCanvas.getContext("2d");
//our output
let outputCanvas = document.querySelector("#outputCanvas");
let outputContext = outputCanvas.getContext("2d");
//canvas pixel arrays
let sourceImageData;
let mapImageData;
let outputImageData = outputContext.createImageData(
  outputCanvas.width,
  outputCanvas.height
);
let mouseX;
let mouseY;
let MAX_MOVEMENT = 10;
//draws cat and gets plain cat's pixel info
outputCanvas.addEventListener("mousemove", mouseMoved);
//draws the cat
function drawCat() {
  sourceContext.drawImage(catImg, 0, 0);
  sourceImageData = getImageData(sourceContext);
  console.log(sourceImageData);
}
//draws cat's map and gets map cat's pixel info
function drawMap() {
  mapContext.drawImage(mapImg, 0, 0);
  mapImageData = getImageData(mapContext);
  console.log(mapImageData);
}
//multi function to return image pixel array
function getImageData(el) {
  return el.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
}
//catches x and y of OUTPUT canvas and displays it over it
function mouseMoved(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  let coor = "Coordinates:(" + mouseX + "," + mouseY + ")";
  document.getElementById("coorDisplay").innerHTML = coor;
  //    fixCoordinates(x, y);
  render();
}
//gives us fixed coordinates between -1 to 1
function fixCoordinates(x, y) {
  let newX = (x / outputCanvas.width) * 2 - 1;
  let newY = (y / outputCanvas.height) * 2 - 1;
  return [newX, newY];
}
//The main function to copy/draw pixels dinamically
function copyPixels(mouseX, mouseY) {
  let [ratioX, ratioY] = fixCoordinates(mouseX, mouseY);
  let displacementX = ratioX * MAX_MOVEMENT;
  let displacementY = ratioY * MAX_MOVEMENT;
  //   console.log("disX is: " + displacementX, "disY is: " + displacementY);
  for (let y = 0; y < outputCanvas.height; y++) {
    for (let x = 0; x < outputCanvas.width; x++) {
      const pixelIndex = (x + y * outputCanvas.width) * 4;
      let greyvalue = mapImageData.data[pixelIndex] / 255;
      let offsetX = Math.round(x + displacementX * greyvalue);
      let offsetY = Math.round(y + displacementY * greyvalue);
      const originalPixelIndex = (offsetY * outputCanvas.width + offsetX) * 4;

      outputImageData.data[pixelIndex + 0] =
        sourceImageData.data[originalPixelIndex + 0];
      outputImageData.data[pixelIndex + 1] =
        sourceImageData.data[originalPixelIndex + 1];
      outputImageData.data[pixelIndex + 2] =
        sourceImageData.data[originalPixelIndex + 2];
      outputImageData.data[pixelIndex + 3] =
        sourceImageData.data[originalPixelIndex + 3];
    }
  }
}
//initiates drawing and copy data to canvas
function render() {
  copyPixels(mouseX, mouseY);
  outputContext.putImageData(outputImageData, 0, 0);
}
