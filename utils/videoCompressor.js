const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vcodec libx264',
        '-crf 28' // Compression rate factor (lower = better quality, higher compression)
      ])
      .save(outputPath)
      .on('end', () => {
        // Optional: Delete original after compressing
        fs.unlinkSync(inputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject('Video compression failed: ' + err.message);
      });
  });
};

module.exports = compressVideo;
