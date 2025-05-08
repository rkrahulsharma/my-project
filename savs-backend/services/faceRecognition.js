const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
const tf = require('@tensorflow/tfjs-node');
const path = require('path');

// Initialize face-api.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;
  
  const modelPath = path.join(__dirname, '../models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  
  modelsLoaded = true;
}

async function compareFaces(capturedImage, registeredImage) {
  await loadModels();
  
  // Process captured image
  const img1 = await canvas.loadImage(capturedImage);
  const detections1 = await faceapi.detectSingleFace(img1)
    .withFaceLandmarks()
    .withFaceDescriptor();
  
  // Process registered image
  const img2 = await canvas.loadImage(registeredImage);
  const detections2 = await faceapi.detectSingleFace(img2)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detections1 || !detections2) {
    return { verified: false, score: 0 };
  }

  // Calculate Euclidean distance between descriptors
  const distance = faceapi.euclideanDistance(
    detections1.descriptor,
    detections2.descriptor
  );

  // Threshold for verification (adjust as needed)
  const threshold = 0.6;
  const verified = distance < threshold;
  
  return {
    verified,
    score: 1 - distance // Convert to similarity score (0-1)
  };
}

module.exports = {
  compareFaces
};