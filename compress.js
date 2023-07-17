const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const inputDir = './original/';
const outputDir = './compressed/';
fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error('Error reading input directory:', err);
      return;
    }
  
    const totalFiles = files.filter(file => file.endsWith('.mp4') || file.endsWith('.mov')).length;
    let processedFiles = 0;
  
    const start = new Date();
  
    const showLoader = setInterval(() => {
      process.stdout.write('\rProcessing: ' + '.'.repeat(processedFiles % 4) + '_'.repeat(4 - (processedFiles % 4)));
    }, 200);
  
    files.forEach(file => {
      if (file.endsWith('.mp4') || file.endsWith('.mov')) {
        const inputPath = inputDir + file;
        const outputPath = outputDir + 'compressed_' + file;
  
        ffmpeg(inputPath)
          .output(outputPath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .outputOptions('-crf 28')
          .on('end', () => {
            processedFiles++;
            if (processedFiles === totalFiles) {
              clearInterval(showLoader);
              process.stdout.write('\n');
              const end = new Date();
              const elapsed = (end - start) / 1000;
              console.log(`Compression finished in ${elapsed} seconds.`);
            }
          })
          .on('error', err => {
            console.error('Error compressing video:', err);
          })
          .run();
      }
    });
  });
