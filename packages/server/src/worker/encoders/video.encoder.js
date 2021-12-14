const { parentPort, workerData } = require('worker_threads');
const workerConstants = require('../../constants/worker.constants');

let progress = 0;

const timeoutTimer = setInterval(() => {
    let x = 0;

    for(let y = 0; y < 999; y++){
        for(let j = 0; j < 999; j++){
            x += j + y;
        }
    }

    parentPort.postMessage({
        type: workerConstants.types.PROGRESS,
        progress
    });

    progress += 10;
    
    if(progress > 100){
        clearInterval(timeoutTimer);
        parentPort.postMessage({
            type: workerConstants.types.DONE,
            result: x
        });
    }
}, 1000);