const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const compressImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(1080) // Resize width (optional)
      .jpeg({ quality: 60 }) // Compress to 60% quality
      .toFile(outputPath);

    // Optional: Delete original after compressing
    fs.unlinkSync(inputPath);

    return outputPath;
  } catch (err) {
    throw new Error("Image compression failed: " + err.message);
  }
};

module.exports = compressImage;
