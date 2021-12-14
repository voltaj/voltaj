const pino = require('pino');
const pretty = require('pino-pretty');

const stream = pretty();
const logger = pino({}, stream)

module.exports = logger;