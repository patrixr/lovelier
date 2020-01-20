if (!process.env.DEBUG) {
  process.env.DEBUG = '*';
}

const debug = require('debug');

module.exports = function (name = 'game') {
  return {
    info: debug(`${name}:info`),
    error: debug(`${name}:error`),
    verbose: debug(`${name}:verbose`)
  };
};