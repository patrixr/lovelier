const logger      = require('./logger')('love');
const { spawn }   = require('child_process');

module.exports = function (folder, opts = {}) {
  let child = null;

  const stop = () => {
    if (child) {
      child.kill();
      child = null;
    }
  };

  const start = () => {
    stop();
    // $ open -n -j -a love --args <FOLDER>
    child = spawn('open', ['-n', '-j', '-a', 'love', '--args', folder ]);
    child.stderr.on('data', (data) => { logger.error(data.toString()); });
    child.stdout.on('data',  (data) => { logger.verbose(data.toString()); });
  };

  const restart = start;

  return { start, stop, restart };
};
