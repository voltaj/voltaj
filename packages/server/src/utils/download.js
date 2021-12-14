const request = require('request');
const progress = require('request-progress');
const fs = require("fs");
const path = require("path");

const download = async (url, dest, events = {}) => {
    const { 
        onProgress, 
        onResponse, 
        onError, 
        onEnd 
    } = events;

    // Create directory
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)){
        await fs.mkdirSync(destDir, { recursive: true });
    }

    const options = { 
        throttle: 1000, 
        //delay: 0 // 1000
    };

    progress(request(encodeURI(url)), options)
        .on('progress', onProgress)
        .on('response', onResponse)
        .on('error', onError)
        .on('end', onEnd)
        .pipe(fs.createWriteStream(dest));
};

module.exports = download;
