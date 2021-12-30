const { parentPort, workerData } = require('worker_threads');
const path = require('path');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const logger = require('../../utils/logger');
const workerConstants = require('../../constants/worker.constants');

const { downloadInfo, job } = workerData;

if(!downloadInfo || !job){
    parentPort.postMessage({
        type: workerConstants.types.ERROR,
        message: `Error: There isn't download info or job data`
    });

    process.exit();
}

const startTime = Date.now();

const inputPath = path.resolve(downloadInfo.filePath);
const outputPath = path.resolve(path.dirname(downloadInfo.filePath), "outputs"); //  // , "outputs"

const command = ffmpeg(inputPath);

// job: outputs processes
job.outputs.forEach((output, index) => {
    if(!output.format) return;
    command
        .size(output.resolution) // '320x200'
        .videoBitrate('1024k')
        .format(output.format)
        .output(path.join(outputPath, `${output.id}.${output.format}`)) // ${output.resolution.replace('?','')}
        //.on('progress', (progress) => {
        //    console.log('progress::',output.id, output.resolution, progress.percent); 
        //});
        
});

command.on('progress', (progress) => {
    //console.log('progress::', progress);
    parentPort.postMessage({
        type: workerConstants.types.PROGRESS,
        percent: (progress.percent || 0)
    });    
});

command.on('end', () => {
    const endTime = Date.now();
    parentPort.postMessage({
        type: workerConstants.types.DONE,
        message: `Encoding finished after ${(endTime - startTime) / 1000}s`
    });
});

command.on('error', (err, stdout, stderr) => {
    parentPort.postMessage({
        type: workerConstants.types.ERROR,
        message: err.message
    });

    logger.error(`Error: ${err.message}`);
    logger.error(`ffmpeg output: ${stdout}`);
    logger.error(`ffmpeg stderr: ${stderr}`);
});

command.run();