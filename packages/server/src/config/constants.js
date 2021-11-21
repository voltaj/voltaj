const constants = {
    job: {
        status: {
            WAITING: 'waiting',
            DOWNLOADING: 'downloading',
            IN_PROGRESS: 'in_progress',
            UPLOADING: 'uploading',
            ERROR: 'error',
            COMPLATED: 'complated',
        }
    }
};

module.exports = Object.freeze(constants);